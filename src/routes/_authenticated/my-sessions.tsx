import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/site/PageShell";
import { cancelRegistration, getMyRegistrations } from "@/lib/srf.functions";

export const Route = createFileRoute("/_authenticated/my-sessions")({
  head: () => ({
    meta: [
      { title: "My sessions — SRF CMC" },
      {
        name: "description",
        content: "Everything you have signed up for at the Student Research Forum, CMC — and a way to cancel.",
      },
      { property: "og:title", content: "My sessions — SRF CMC" },
      { property: "og:description", content: "Your SRF CMC registrations in one place." },
    ],
  }),
  component: MySessions,
});

function MySessions() {
  const fetchMine = useServerFn(getMyRegistrations);
  const cancel = useServerFn(cancelRegistration);
  const queryClient = useQueryClient();

  const mine = useQuery({ queryKey: ["my-registrations"], queryFn: () => fetchMine() });

  const cancelMutation = useMutation({
    mutationFn: (sessionId: string) => cancel({ data: { sessionId } }),
    onSuccess: () => {
      toast.success("Registration cancelled.");
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rows = mine.data ?? [];

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-[1100px] px-5 py-20 md:px-10">
        <p className="label-mono text-navy/60">SRF / CMC / 2026</p>
        <h1 className="mt-6 text-5xl leading-[0.95] text-navy md:text-7xl">My sessions.</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy/70">
          What you have signed up for. If you cannot make it, cancel so someone else can take the slot.
        </p>

        <div className="mt-12 grid gap-5">
          {mine.isLoading ? (
            <p className="label-mono text-navy/60">Loading…</p>
          ) : rows.length === 0 ? (
            <div className="rounded-3xl border border-navy/15 bg-card p-10">
              <h2 className="text-2xl text-navy">Nothing yet.</h2>
              <p className="mt-3 text-base text-navy/70">You have not registered for a session so far.</p>
              <Link
                to="/projects"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-navy"
              >
                See upcoming sessions <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            rows.map((row) => {
              const session = row.sessions as
                | { title: string; date_label: string; meta: string; kicker: string }
                | null;
              return (
                <article
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-navy/15 bg-card p-8"
                >
                  <div>
                    <span className="label-mono rounded-full bg-lime px-3 py-1 text-navy">
                      {session?.kicker ?? "Session"}
                    </span>
                    <h2 className="mt-5 text-3xl leading-tight text-navy">{session?.title ?? "Session"}</h2>
                    <p className="label-mono mt-3 text-navy/60">
                      {session?.date_label} · {session?.meta}
                    </p>
                  </div>
                  <button
                    disabled={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate(row.session_id)}
                    className="rounded-xl border border-navy/20 px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy/5 disabled:opacity-50"
                  >
                    Cancel registration
                  </button>
                </article>
              );
            })
          )}
        </div>
      </section>
    </PageShell>
  );
}
