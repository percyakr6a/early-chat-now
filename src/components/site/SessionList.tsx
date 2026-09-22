import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import {
  cancelRegistration,
  getMyRegistrations,
  registerForSession,
  type SessionRow,
} from "@/lib/srf.functions";

export function SessionList({ sessions }: { sessions: SessionRow[] }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchMine = useServerFn(getMyRegistrations);
  const register = useServerFn(registerForSession);
  const cancel = useServerFn(cancelRegistration);

  const mine = useQuery({
    queryKey: ["my-registrations"],
    queryFn: () => fetchMine(),
    enabled: Boolean(user),
  });

  const registeredIds = new Set((mine.data ?? []).map((r) => r.session_id));

  const registerMutation = useMutation({
    mutationFn: (sessionId: string) => register({ data: { sessionId } }),
    onSuccess: (result) => {
      toast.success(`You're registered for ${result.title}.`);
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const cancelMutation = useMutation({
    mutationFn: (sessionId: string) => cancel({ data: { sessionId } }),
    onSuccess: () => {
      toast.success("Registration cancelled.");
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sessions.map((session) => {
        const registered = registeredIds.has(session.id);
        const left = session.capacity === null ? null : Math.max(session.capacity - session.taken, 0);
        const full = left === 0;
        const busy = registerMutation.isPending || cancelMutation.isPending;

        return (
          <article
            key={session.id}
            className="flex flex-col justify-between rounded-3xl border border-navy/15 bg-card p-8 transition-shadow hover:shadow-[0_18px_40px_-28px_var(--navy)]"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="label-mono rounded-full bg-lime px-3 py-1 text-navy">{session.kicker}</span>
                <span className="label-mono text-navy/60">{session.date_label}</span>
              </div>
              <h3 className="mt-8 text-3xl leading-[1.02] text-navy md:text-4xl">{session.title}</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-navy/70">{session.description}</p>
              {session.note ? (
                <p className="mt-4 text-sm font-semibold text-navy/60">{session.note}</p>
              ) : null}
              {left !== null ? (
                <p className="label-mono mt-4 text-navy/60">
                  {full ? "No slots left" : `${left} of ${session.capacity} slots left`}
                </p>
              ) : null}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
              <span className="label-mono text-navy/60">{session.meta}</span>

              {!user ? (
                <Link
                  to="/auth"
                  search={{ redirect: "/projects" }}
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Sign in to register <ArrowRight className="size-4" />
                </Link>
              ) : registered ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-navy">
                    <Check className="size-4" /> You're registered
                  </span>
                  <button
                    disabled={busy}
                    onClick={() => cancelMutation.mutate(session.id)}
                    className="text-sm font-semibold text-navy/60 underline underline-offset-4 hover:text-navy disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  disabled={busy || full || !session.registration_open}
                  onClick={() => registerMutation.mutate(session.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {full ? "Full" : "Register"} <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
