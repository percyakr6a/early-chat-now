import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PageShell, SectionLabel } from "@/components/site/PageShell";

const STEPS = [
  {
    n: "01",
    title: "Attend Workshops",
    body: "Start with a clinical curiosity, a lived observation, or a problem worth understanding.",
  },
  {
    n: "02",
    title: "Make Research Studies",
    body: "Build a reading list, a protocol, a survey, or a first imperfect draft with other students.",
  },
  {
    n: "03",
    title: "Publish",
    body: "Present the work, invite critique, and make your first publication with us.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SRF CMC Student Research Forum" },
      {
        name: "description",
        content:
          "SRF CMC is a low-barrier, student-led research community for MBBS students at Chandka Medical College: workshops, papers, data analysis and practical skills.",
      },
      { property: "og:title", content: "Who are we? — SRF CMC" },
      {
        property: "og:description",
        content: "A student-led, research-oriented forum built on one belief: learning research should be accessible to all.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHero eyebrow="The forum / context">
        Who are <span className="text-navy/40">we?</span>
      </PageHero>

      <section className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="max-w-3xl text-xl leading-relaxed text-navy">
            A student-led, research-oriented forum at Chandka MC built around one simple belief:
            learning research should be accessible to all.
          </p>
          <div className="mt-16 text-5xl leading-[0.9] text-navy/15 md:text-8xl">
            <p>STUDENT</p>
            <p>
              LED<span className="text-lime">*</span>
            </p>
            <p>RESEARCH</p>
            <p>ORIENTED</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2">
          <div>
            <SectionLabel>A little more precisely</SectionLabel>
            <h2 className="mt-6 text-3xl leading-[1.05] text-navy md:text-4xl">
              We make research feel less like a distant room where you need to fake data or create
              gpt-generated posters.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-navy/70">
            <p>
              SRF CMC is a low-barrier community for MBBS students across batches. We gather around
              workshops, papers, data analysis, clinical questionaires, and occasionally practical
              skills rarely focused on here at CMC.
            </p>
            <p>
              Our sessions are deliberately small and finite for better collabration. You can drop in
              for a workshop, stay for a project, or simply leave with a better way to read the next
              paper on your desk.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10">
        <div className="mx-auto max-w-[1400px] divide-y divide-navy/10 border-y border-navy/10">
          {STEPS.map((step) => (
            <div key={step.n} className="grid gap-6 py-10 md:grid-cols-[6rem_18rem_1fr] md:items-baseline">
              <span className="label-mono text-navy/40">{step.n}</span>
              <h3 className="text-2xl text-navy md:text-3xl">{step.title}</h3>
              <p className="text-lg leading-relaxed text-navy/70">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy px-5 py-24 text-primary-foreground md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-mono text-lime">Our operating note</p>
          <h2 className="mt-8 max-w-3xl text-4xl leading-[0.95] md:text-7xl">
            No endless core <span className="text-cyan">meetings.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-primary-foreground/80">
            No compulsions. No meetings that could have been an email.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Each initiative has a clear shape, a start, and a place for you to contribute.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
