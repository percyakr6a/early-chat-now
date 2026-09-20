import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PageShell, SectionLabel } from "@/components/site/PageShell";
import { SessionList } from "@/components/site/SessionList";
import { getSessions } from "@/lib/srf.functions";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Upcoming SRF CMC sessions" },
      {
        name: "description",
        content:
          "Upcoming SRF CMC workshops and open sessions, including THE BLS PROJECT on 7 October at CMC Larkana. Register for a slot online.",
      },
      { property: "og:title", content: "Upcoming Projects — SRF CMC" },
      {
        property: "og:description",
        content: "Workshops, short-term projects and open sessions for students who would rather learn by trying.",
      },
    ],
  }),
  loader: () => getSessions(),
  component: Projects,
});

function Projects() {
  const sessions = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero eyebrow="The calendar / live">
        Upcoming <span className="text-navy/40">Projects.</span>
      </PageHero>

      <section className="px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="max-w-2xl text-xl leading-relaxed text-navy">
            Workshops, short-term projects, and open sessions for students who would rather learn by
            trying.
          </p>

          <div className="mt-16">
            <SectionLabel>Upcoming / open sessions</SectionLabel>
            <h2 className="mt-6 max-w-3xl text-4xl leading-[0.95] text-navy md:text-6xl">
              Choose a door <span className="text-navy/40">into the work.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-navy/70">
              Every session has a clear invitation. Pick the one that makes you want to ask a follow-up
              question.
            </p>
          </div>

          <div className="mt-14">
            <SessionList sessions={sessions} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
