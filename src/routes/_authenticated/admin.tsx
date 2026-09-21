import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";

import { PageShell } from "@/components/site/PageShell";
import { amIAdmin, getAllRegistrations, type AdminRegistration } from "@/lib/srf.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Registrations — SRF CMC admin" },
      { name: "description", content: "Everyone registered for SRF CMC sessions, with CSV export." },
      { property: "og:title", content: "Registrations — SRF CMC admin" },
      { property: "og:description", content: "Private registration list for the SRF CMC convener." },
    ],
  }),
  component: AdminPage,
});

function toCsv(rows: AdminRegistration[]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ["Session", "Name", "Batch / year", "Email", "Registered at"];
  const lines = rows.map((r) =>
    [r.session_title, r.full_name, r.batch_year, r.email, new Date(r.created_at).toISOString()]
      .map(escape)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

function AdminPage() {
  const checkAdmin = useServerFn(amIAdmin);
  const fetchAll = useServerFn(getAllRegistrations);

  const admin = useQuery({ queryKey: ["am-i-admin"], queryFn: () => checkAdmin() });
  const list = useQuery({
    queryKey: ["all-registrations"],
    queryFn: () => fetchAll(),
    enabled: admin.data === true,
  });

  function download() {
    const blob = new Blob([toCsv(list.data ?? [])], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `srf-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (admin.isLoading) {
    return (
      <PageShell>
        <section className="mx-auto w-full max-w-[1100px] px-5 py-20 md:px-10">
          <p className="label-mono text-navy/60">Loading…</p>
        </section>
      </PageShell>
    );
  }

  if (!admin.data) {
    return (
      <PageShell>
        <section className="mx-auto w-full max-w-[1100px] px-5 py-20 md:px-10">
          <p className="label-mono text-navy/60">SRF / CMC / 2026</p>
          <h1 className="mt-6 text-5xl leading-[0.95] text-navy md:text-6xl">Not your page.</h1>
          <p className="mt-5 max-w-xl text-lg text-navy/70">
            This registration list is only visible to the convener.
          </p>
        </section>
      </PageShell>
    );
  }

  const rows = list.data ?? [];

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-mono text-navy/60">SRF / CMC / 2026</p>
            <h1 className="mt-6 text-5xl leading-[0.95] text-navy md:text-7xl">Who's coming.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy/70">
              Every registration across all sessions, newest first.
            </p>
          </div>
          <button
            onClick={download}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-navy shadow-[0_4px_0_0_var(--navy)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Download className="size-4" /> Download CSV
          </button>
        </div>

        <div className="mt-12 overflow-x-auto rounded-3xl border border-navy/15 bg-card">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-navy/10">
                {["Session", "Name", "Batch / year", "Email", "Registered"].map((h) => (
                  <th key={h} className="label-mono px-6 py-4 text-navy/60">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-navy/60">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-navy/60">
                    Nobody has registered yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-navy/5 last:border-0">
                    <td className="px-6 py-4 font-semibold text-navy">{r.session_title}</td>
                    <td className="px-6 py-4 text-navy/80">{r.full_name}</td>
                    <td className="px-6 py-4 text-navy/80">{r.batch_year}</td>
                    <td className="px-6 py-4 text-navy/80">{r.email}</td>
                    <td className="px-6 py-4 text-navy/60">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
