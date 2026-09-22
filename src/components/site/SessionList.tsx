import type { SessionRow } from "@/lib/srf.functions";

export function SessionList({ sessions }: { sessions: SessionRow[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sessions.map((session) => (
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
            {session.note ? <p className="mt-4 text-sm font-semibold text-navy/60">{session.note}</p> : null}
            {session.capacity !== null ? (
              <p className="label-mono mt-4 text-navy/60">{session.capacity} slots per session</p>
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
            <span className="label-mono text-navy/60">{session.meta}</span>
            <span className="label-mono text-navy/60">Registration form shared before the session</span>
          </div>
        </article>
      ))}
    </div>
  );
}
