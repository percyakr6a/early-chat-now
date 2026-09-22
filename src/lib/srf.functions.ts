import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type SessionRow = {
  id: string;
  slug: string;
  kicker: string;
  date_label: string;
  title: string;
  description: string;
  note: string | null;
  meta: string;
  capacity: number | null;
  registration_open: boolean;
  taken: number;
};

export const getSessions = createServerFn({ method: "GET" }).handler(async (): Promise<SessionRow[]> => {
  const supabase = publicClient();
  const [{ data: sessions }, { data: counts }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, slug, kicker, date_label, title, description, note, meta, capacity, registration_open, sort_order")
      .order("sort_order"),
    supabase.rpc("session_seat_counts"),
  ]);
  const taken = new Map<string, number>(
    (counts ?? []).map((c: { session_id: string; taken: number }) => [c.session_id, Number(c.taken)]),
  );
  return (sessions ?? []).map((s) => ({
    id: s.id,
    slug: s.slug,
    kicker: s.kicker,
    date_label: s.date_label,
    title: s.title,
    description: s.description,
    note: s.note,
    meta: s.meta,
    capacity: s.capacity,
    registration_open: s.registration_open,
    taken: taken.get(s.id) ?? 0,
  }));
});


export const getCoreMembers = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("core_members")
    .select("id, name, role_title, initials, sort_order")
    .order("sort_order");
  return data ?? [];
});

export const getMyRegistrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("session_registrations")
      .select("id, created_at, session_id, sessions(title, date_label, meta, kicker)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const registerForSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sessionId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, capacity, registration_open, title")
      .eq("id", data.sessionId)
      .maybeSingle();
    if (sessionError) throw new Error(sessionError.message);
    if (!session) throw new Error("That session no longer exists.");
    if (!session.registration_open) throw new Error("Registration for this session is closed.");

    const { data: counts, error: countError } = await supabase.rpc("session_seat_counts");
    if (countError) throw new Error(countError.message);
    const taken = Number(
      (counts ?? []).find((c: { session_id: string; taken: number }) => c.session_id === session.id)?.taken ?? 0,
    );
    if (session.capacity !== null && taken >= session.capacity) {
      throw new Error("All slots for this session are taken.");
    }

    const { error } = await supabase
      .from("session_registrations")
      .insert({ session_id: session.id, user_id: userId });
    if (error && !error.message.includes("duplicate key")) throw new Error(error.message);

    return { ok: true, title: session.title };
  });

export const cancelRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sessionId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("session_registrations")
      .delete()
      .eq("session_id", data.sessionId)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type AdminRegistration = {
  id: string;
  created_at: string;
  session_title: string;
  full_name: string;
  batch_year: string;
  email: string;
};

export const getAllRegistrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminRegistration[]> => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("session_registrations")
      .select("id, created_at, user_id, sessions(title)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const { data: profileRows } = userIds.length
      ? await supabaseAdmin.from("profiles").select("id, full_name, batch_year, email").in("id", userIds)
      : { data: [] as { id: string; full_name: string | null; batch_year: string | null; email: string | null }[] };
    const profileMap = new Map((profileRows ?? []).map((p) => [p.id, p]));

    return rows.map((row) => {
      const session = row.sessions as { title: string } | null;
      const profile = profileMap.get(row.user_id);
      return {
        id: row.id,
        created_at: row.created_at,
        session_title: session?.title ?? "—",
        full_name: profile?.full_name || "—",
        batch_year: profile?.batch_year || "—",
        email: profile?.email ?? "—",
      };
    });
  });

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return Boolean(data);
  });
