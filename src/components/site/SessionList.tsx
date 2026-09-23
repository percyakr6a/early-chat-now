import { ArrowUpRight } from "lucide-react";

import type { SessionRow } from "@/lib/srf.functions";

const GOOGLE_FORM_URL = "https://forms.gle/";

export function SessionList({ sessions }: { sessions: SessionRow[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sessions.map((session) => (
        <article
          key={session.id}
          className="flex flex-col justify-between rounded-3xl border border-navy/15 bg-card p-8 transition-shadow hover:shadow-[0_18px_40px_-28px_var(--navy)]"
        >
          <div className="flex flex-1 flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span className="label-mono rounded-full bg-lime px-3 py-1 text-navy">{session.kicker}</span>
              <span className="label-mono inline-flex items-center gap-2 rounded-full border border-navy/20 px-3 py-1 text-navy/70">
                <span className="size-2 rounded-full bg-amber-400" aria-hidden="true" />
                Curriculum finalising
              </span>
            </div>

            <span className="label-mono mt-6 block text-navy/60">{session.date_label}</span>
            <h3 className="mt-3 text-3xl leading-[1.02] text-navy md:text-4xl">{session.title}</h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-navy/70">{session.description}</p>
            {session.note ? <p className="mt-4 text-sm font-semibold text-navy/60">{session.note}</p> : null}
          </div>

          <div className="mt-10 border-t border-navy/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="label-mono text-navy/60">{session.meta}</span>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-navy transition-transform hover:-translate-y-0.5"
              >
                Fill via Google Form <ArrowUpRight className="size-4" />
              </a>
            </div>
            <p className="label-mono mt-4 text-navy/60">Registration starts by 1 Oct</p>
          </div>
        </article>
      ))}
    </div>
  );
}
