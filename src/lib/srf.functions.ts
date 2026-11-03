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


export const getSessionBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<SessionRow | null> => {
    const supabase = publicClient();
    const { data: s } = await supabase
      .from("sessions")
      .select("id, slug, kicker, date_label, title, description, note, meta, capacity, registration_open")
      .eq("slug", slug)
      .maybeSingle();
    if (!s) return null;
    const { data: counts } = await supabase.rpc("session_seat_counts");
    const taken = (counts ?? []).find((c: { session_id: string }) => c.session_id === s.id);
    return { ...s, taken: taken ? Number(taken.taken) : 0 };
  });

export const getCoreMembers = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("core_members")
    .select("id, name, role_title, initials, sort_order")
    .order("sort_order");
  return data ?? [];
});


// ---- "Check your spot" lookup ----
// Reads the public participants Google Sheet for CPR Workshop no. 1 (one tab
// per session) so the sheet remains the single source of truth.

const SPOT_SHEET_ID = "1eG00zgfEwo3H28gAL1yVxn1454AiS8i8omGHYh50nH0";
const SPOT_SHEET_GIDS = [0, 921439454, 45477592, 1279792590];
const SPOT_VENUE = "Seminar Hall, Surgery 2 Ward, CMC Hospital";
const SPOT_WORKSHOP = "CPR Workshop no. 1";

export type SpotResult =
  | {
      found: true;
      name: string;
      batchRoll: string;
      workshop: string;
      sessionNo: number;
      sessionDate: string;
      time: string;
      venue: string;
    }
  | { found: false };

function spotKey(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? String(Number(digits)) : value.trim().toLowerCase();
}

function batchRollKey(value: string): { batch: string; roll: string } | null {
  const numbers = value.match(/\d+/g);
  if (!numbers || numbers.length < 2) return null;
  return { batch: String(Number(numbers[0])), roll: String(Number(numbers[1])) };
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

type SpotTab = {
  day: number;
  dateLabel: string;
  people: { batchRoll: string; name: string }[];
};

function parseSpotTab(rows: string[][]): SpotTab | null {
  const header = rows[0]?.[1] ?? "";
  const dateLabel = header.split(";")[1]?.trim() ?? "";
  const dayMatch = dateLabel.match(/(\d{1,2})/);
  if (!dateLabel || !dayMatch) return null;
  const people = rows
    .slice(2)
    .map((row) => ({ batchRoll: (row[1] ?? "").trim(), name: (row[2] ?? "").trim() }))
    .filter((person) => person.batchRoll && person.name);
  if (!people.length) return null;
  return { day: Number(dayMatch[1]), dateLabel, people };
}

type SessionTab = SpotTab & { sessionNo: number };

const SPOT_CACHE_TTL_MS = 5 * 60 * 1000;
let spotCache: { at: number; tabs: SessionTab[] } | null = null;

// Fetches and parses every participants tab; session numbers come from each
// tab's date (never the tab's "Session N" label, which can be misnumbered).
// Cached briefly so page loads don't hit Google on every request.
async function loadSpotTabs(): Promise<SessionTab[]> {
  if (spotCache && Date.now() - spotCache.at < SPOT_CACHE_TTL_MS) return spotCache.tabs;
  try {
    const responses = await Promise.all(
      SPOT_SHEET_GIDS.map((gid) =>
        fetch(`https://docs.google.com/spreadsheets/d/${SPOT_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`, {
          headers: { Accept: "text/csv" },
          signal: AbortSignal.timeout(8000),
        })
          .then((response) => (response.ok ? response.text() : ""))
          .catch(() => ""),
      ),
    );
    const tabs = responses
      .map((text) => (text ? parseSpotTab(parseCsvRows(text)) : null))
      .filter((tab): tab is SpotTab => tab !== null)
      .sort((a, b) => a.day - b.day)
      .map((tab, index) => ({ ...tab, sessionNo: index + 1 }));
    if (tabs.length) spotCache = { at: Date.now(), tabs };
    return tabs;
  } catch {
    return spotCache?.tabs ?? [];
  }
}

function batchGroup(batchRoll: string): string {
  const match = batchRoll.trim().match(/^([A-Za-z]*)\s*(\d+)\s*(?:-\s*\d*)?$/);
  if (!match) return "Other";
  const prefix = match[1].trim().toUpperCase();
  if (prefix === "DPT") return "DPT";
  if (prefix === "PHARM") return "Pharmacy";
  return `Batch ${Number(match[2])}`;
}

export type WorkshopOneSummary = {
  total: number;
  sessions: { sessionNo: number; dateLabel: string; listed: number }[];
  batches: { label: string; count: number }[];
};

// Summary of the participants sheet for the CPR page: everyone listed per
// session plus a batch-wise breakdown for the project-impact band.
export const getWorkshopOneSummary = createServerFn({ method: "GET" }).handler(
  async (): Promise<WorkshopOneSummary | null> => {
    const tabs = await loadSpotTabs();
    if (!tabs.length) return null;
    const sessions = tabs.map((tab) => ({
      sessionNo: tab.sessionNo,
      dateLabel: tab.dateLabel.replace(/^0(?=\d)/, ""),
      listed: tab.people.length,
    }));
    const counts = new Map<string, number>();
    for (const tab of tabs) {
      for (const person of tab.people) {
        const label = batchGroup(person.batchRoll);
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
    }
    const batches = [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => {
        const na = Number(a.label.replace("Batch ", ""));
        const nb = Number(b.label.replace("Batch ", ""));
        if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
        if (Number.isFinite(na)) return -1;
        if (Number.isFinite(nb)) return 1;
        return a.label.localeCompare(b.label);
      });
    return { total: sessions.reduce((sum, s) => sum + s.listed, 0), sessions, batches };
  },
);

    for (const tab of tabs) {
      for (const person of tab.people) {
        const key = batchRollKey(person.batchRoll);
        if (key && key.batch === batch && key.roll === roll) {
          return {
            found: true,
            name: person.name,
            batchRoll: person.batchRoll.replace(/\s*-\s*/g, " - ").trim(),
            workshop: SPOT_WORKSHOP,
            sessionNo: tab.sessionNo,
            sessionDate: tab.dateLabel,
            time: "TBA",
            venue: SPOT_VENUE,
          };
        }
      }
    }
    return { found: false };
  });
