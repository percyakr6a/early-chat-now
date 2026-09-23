import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

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
