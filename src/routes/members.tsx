import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PageShell, SectionLabel } from "@/components/site/PageShell";
import { getCoreMembers } from "@/lib/srf.functions";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members — The SRF CMC Core Team" },
      {
        name: "description",
        content:
          "Meet the SRF CMC core: the convener and the organising, media and research cores behind the forum's sessions and research output.",
      },
      { property: "og:title", content: "Meet the Core — SRF CMC" },
      {
        property: "og:description",
        content: "A rotating group of students behind the sessions' organisation, media, and research output.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getCoreMembers(),
  component: Members,
});

const VOLUNTEERS = [
  {
    team: "FOR ORGANSIING",
    people: ["Habiba Akram (Y2 MBBS)", "Abdul Rafiu (Y2 MBBS)"],
  },
  {
    team: "FOR MEDIA",
    people: ["Arpun Kukreja (Y2 MBBS)", "Fatima Rafique (Y1 MBBS)"],
  },
  {
    team: "FOR RESEARCH",
    people: ["Iqra Panhwar (Y2 MBBS)", "Jawad Sheikh (Y1 MBBS)"],
  },
];

function Members() {
  const members = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero eyebrow="The people / behind the questions">
        Meet the <span className="text-navy/40">Core.</span>
      </PageHero>

      <section className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div>
            <SectionLabel>Core Team 2026</SectionLabel>
            <p className="mt-6 max-w-2xl text-lg text-navy/70">
              Each core has a head, co-head, and associate working together to keep the forum moving.
            </p>
          </div>

          <div className="mt-14 divide-y divide-navy/10 border-y border-navy/10">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="grid items-center gap-6 py-8 md:grid-cols-[4rem_5rem_1fr_auto]"
              >
                <span className="label-mono text-navy/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-primary-foreground">
                  {member.initials}
                </span>
                <h3 className="text-2xl text-navy md:text-3xl">{member.name}</h3>
                <span className="label-mono text-navy/60">{member.role_title}</span>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <SectionLabel>Volunteers 2026</SectionLabel>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {VOLUNTEERS.map((group) => (
                <div
                  key={group.team}
                  className="rounded-2xl border border-navy/10 p-6"
                >
                  <span className="label-mono text-navy/40">{group.team}</span>
                  <ul className="mt-4 space-y-2">
                    {group.people.map((person) => (
                      <li key={person} className="text-lg text-navy">
                        {person}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="bg-navy px-5 py-24 text-primary-foreground md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2">
          <h2 className="text-5xl leading-[0.9] md:text-7xl">
            The title
            <br />
            is less
            <br />
            important
            <br />
            <span className="text-cyan">than the work.</span>
          </h2>
          <p className="self-end text-lg leading-relaxed text-primary-foreground/80">
            The core team is here to make it easier for more people to participate. Ask us about a
            project, bring a paper to the journal desk, or show up to the next session.{" "}
            <strong className="text-lime">The forum grows by being used.</strong>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
