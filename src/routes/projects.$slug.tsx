import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, ChevronDown, HeartPulse } from "lucide-react";
import { useState } from "react";

import cprWorkshop from "@/assets/cpr-workshop-poster.jpg";
import researchDiscourse from "@/assets/research-discourse-poster.jpg";
import { Button } from "@/components/ui/button";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { getSessionBySlug } from "@/lib/srf.functions";
import { formUrlFor } from "@/lib/project-links";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const session = await getSessionBySlug({ data: params.slug });
    if (!session) throw notFound();
    return session;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — SRF CMC` : "Project — SRF CMC" },
      {
        name: "description",
        content: loaderData?.description ?? "A project by the Student Research Forum, CMC Larkana.",
      },
      { property: "og:title", content: loaderData ? `${loaderData.title} — SRF CMC` : "Project — SRF CMC" },
      {
        property: "og:description",
        content: loaderData?.description ?? "A project by the Student Research Forum, CMC Larkana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
});

function ProjectDetail() {
  const session = Route.useLoaderData();
  if (session.slug === "bls-project") return <CPRProject session={session} />;
  if (session.slug === "research-discourse") return <ResearchDiscourse session={session} />;

  return (
    <PageShell><div className="mx-auto max-w-[1100px] px-5 py-14 md:px-10 md:py-20">
      <Link
        to="/projects"
        className="label-mono inline-flex items-center gap-2 text-navy/60 transition-colors hover:text-navy"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="label-mono rounded-full bg-lime px-3 py-1 text-navy">{session.kicker}</span>
        {session.registration_open ? (
          <span className="label-mono inline-flex items-center gap-2 rounded-full border border-navy/20 px-3 py-1 text-navy/70">
            <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
            Registrations ongoing
          </span>
        ) : (
          <span className="label-mono inline-flex items-center gap-2 rounded-full border border-navy/20 px-3 py-1 text-navy/70">
            <span className="size-2 rounded-full bg-amber-400" aria-hidden="true" />
            Curriculum finalising
          </span>
        )}
      </div>

      <h1 className="mt-6 max-w-3xl text-5xl leading-[0.98] text-navy md:text-7xl">{session.title}</h1>
      <p className="label-mono mt-6 text-navy/60">{session.date_label}</p>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy/75">{session.description}</p>
      {session.note ? <p className="mt-4 max-w-2xl text-base font-semibold text-navy/60">{session.note}</p> : null}

      <div className="mt-10 flex flex-wrap items-center gap-5 rounded-3xl border border-navy/15 bg-card p-6 md:p-8">
        <span className="label-mono text-navy/60">{session.meta}</span>
        <a
          href={formUrlFor(session.slug)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-4 text-sm font-bold text-navy shadow-[0_4px_0_0_var(--navy)] transition-transform hover:-translate-y-0.5"
        >
          Register via Google Form <ArrowUpRight className="size-4" />
        </a>
        <p className="label-mono w-full text-navy/60">
          {session.registration_open ? "Registrations are open" : "Registration starts by 1 Oct"}
        </p>
      </div>
    </div></PageShell>
  );
}

function CPRProject({ session }: { session: ReturnType<typeof Route.useLoaderData> }) {
  const [showCountInfo, setShowCountInfo] = useState(false);

  return (
    <PageShell>
      <section className="relative isolate flex min-h-[530px] items-end overflow-hidden bg-background px-5 pb-16 pt-24 text-navy md:min-h-[620px] md:px-10 md:pb-20">
        <img src={cprWorkshop} alt="Illustrative image of medical students practising CPR on a training manikin" width={1600} height={1008} className="absolute inset-0 -z-20 size-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-background/80 md:bg-background/35" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1400px]">
          <Link to="/projects" className="label-mono inline-flex items-center gap-2 text-navy/85 transition-colors hover:text-navy">
            <ArrowLeft className="size-4" /> All projects
          </Link>
          <p className="label-mono mt-12 text-navy/70">SRF CMC / HANDS-ON TRAINING</p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] md:text-8xl">The CPR Project.</h1>
          <p className="label-mono mt-5 text-navy/70">A hands-on training programme by the Directorate of Professional Health Education, SMBBMU</p>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-navy md:text-xl">Designed to introduce Basic-Life-Saving cardio-pulmonary resuscitation at Chandka with the objective of having it accessibly learned by everyone on-campus.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button asChild variant="secondary" className="h-auto rounded-md px-6 py-4 font-bold">
              <a href={formUrlFor(session.slug)} target="_blank" rel="noopener noreferrer">Register via Google Form <ArrowUpRight /></a>
            </Button>
            <span className="label-mono text-navy/85">{session.date_label}</span>
          </div>
          <p className="label-mono mt-8 text-navy/70">Illustrative image</p>
        </div>
      </section>

      <section className="border-b border-border bg-lime px-5 py-8 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Button
            type="button"
            variant="ghost"
            aria-expanded={showCountInfo}
            aria-controls="trained-count-info"
            onClick={() => setShowCountInfo((current) => !current)}
            className="h-auto w-full justify-between whitespace-normal rounded-md p-0 text-left text-navy hover:bg-transparent hover:text-navy md:w-auto md:gap-12"
          >
            <span className="flex items-center gap-5">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-navy/40 md:size-20"><HeartPulse className="size-8 md:size-10" strokeWidth={1.5} /></span>
              <span className="flex flex-col items-start gap-1">
                <span className="label-mono">Project impact</span>
                <span className="text-2xl font-bold md:text-3xl">Students trained so far <span className="font-bold"> 75</span></span>
              </span>
            </span>
            <ChevronDown className={`ml-4 size-5 shrink-0 transition-transform ${showCountInfo ? "rotate-180" : ""}`} />
          </Button>
          {showCountInfo && <p id="trained-count-info" className="mt-5 max-w-xl text-sm leading-relaxed text-navy/80">A verified training total has not been published yet. We’ll update this after attendance is confirmed.</p>}
        </div>
      </section>

      <section className="border-b border-border px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>QUICK FACTS</SectionLabel>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Eligibility", value: "Open to all SMBBMU students" },
              { label: "Format", value: "Small-group hands-on, 25 per session" },
              { label: "Fee", value: "Free of cost" },
              { label: "Venue", value: "To be announced" },
            ].map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-navy/15 bg-card p-6">
                <p className="label-mono text-navy/60">{fact.label}</p>
                <p className="mt-3 text-xl font-bold leading-snug text-navy">{fact.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base font-semibold text-navy/80">An e-certificate will be provided by the Directorate of Professional Health Education, SMBBMU.</p>
        </div>
      </section>


      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>THE SESSION LOG</SectionLabel>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="border-t-2 border-navy pt-6">
              <p className="label-mono text-navy/60">01 / NEXT UP</p>
              <h2 className="mt-5 text-3xl text-navy md:text-5xl">Upcoming dates.</h2>
              <div className="mt-8 flex items-start gap-4 border-t border-border pt-7">
                <CalendarDays className="mt-1 size-6 shrink-0 text-navy" strokeWidth={1.5} />
                <div className="w-full max-w-md">
                  <p className="label-mono text-navy/60">{session.date_label}</p>
                  <h3 className="mt-3 text-2xl text-navy">CPR Workshop no. 1</h3>
                  <div className="mt-6 space-y-6">
                    {CPR_SESSIONS.map((s) => {
                      const full = s.filled >= s.capacity;
                      const pct = Math.round((s.filled / s.capacity) * 100);
                      return (
                        <div key={s.no}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <p className="label-mono text-navy/60">Session no. {s.no}</p>
                            <p className="text-sm font-bold text-navy">{full ? "Full" : `${s.capacity - s.filled} spots left`}</p>
                          </div>
                          <div
                            className="mt-2 h-3 overflow-hidden rounded-full bg-navy/10"
                            role="img"
                            aria-label={`Session no. ${s.no}: ${s.filled} of ${s.capacity} seats filled`}
                          >
                            <div className={`h-full rounded-full ${full ? "bg-navy" : "bg-lime"}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="label-mono mt-1.5 text-navy/60">{s.filled} / {s.capacity} seats filled</p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="label-mono mt-5 text-navy/60">{session.meta}</p>
                  {session.registration_open && <Button asChild variant="secondary" className="mt-7 h-auto rounded-md px-5 py-3 font-bold"><a href={formUrlFor(session.slug)} target="_blank" rel="noopener noreferrer">Register <ArrowUpRight /></a></Button>}
                </div>
              </div>
            </div>
            <div className="border-t-2 border-navy pt-6">
              <p className="label-mono text-navy/60">02 / THE ARCHIVES</p>
              <h2 className="mt-5 text-3xl text-navy md:text-5xl">Previous sessions.</h2>
              <div className="mt-8 border-t border-border pt-7">
                <p className="text-lg text-navy/70">No previous sessions listed yet.</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/60">Past workshops will appear here once session details are available.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ResearchDiscourse({ session }: { session: ReturnType<typeof Route.useLoaderData> }) {
  const [showCountInfo, setShowCountInfo] = useState(false);

  return (
    <PageShell>
      <section className="relative isolate flex min-h-[530px] items-end overflow-hidden bg-background px-5 pb-16 pt-24 text-navy md:min-h-[620px] md:px-10 md:pb-20">
        <img src={researchDiscourse} alt="Illustrative image of an open medical journal, research papers and a stethoscope on a desk" width={1600} height={1008} className="absolute inset-0 -z-20 size-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-background/80 md:bg-background/35" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1400px]">
          <Link to="/projects" className="label-mono inline-flex items-center gap-2 text-navy/85 transition-colors hover:text-navy">
            <ArrowLeft className="size-4" /> All projects
          </Link>
          <p className="label-mono mt-12 text-navy/70">SRF CMC / JOURNAL CLUB</p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] md:text-8xl">Research Discourse.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-navy md:text-xl">{session.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <span className="label-mono inline-flex items-center gap-2 rounded-full border border-navy/20 bg-background/60 px-3 py-1 text-navy/70">
              <span className="size-2 rounded-full bg-amber-400" aria-hidden="true" />
              Curriculum finalising
            </span>
            <span className="label-mono text-navy/85">{session.date_label}</span>
          </div>
          <p className="label-mono mt-8 text-navy/70">Illustrative image</p>
        </div>
      </section>

      <section className="border-b border-border bg-lime px-5 py-8 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Button
            type="button"
            variant="ghost"
            aria-expanded={showCountInfo}
            aria-controls="registered-count-info"
            onClick={() => setShowCountInfo((current) => !current)}
            className="h-auto w-full justify-between whitespace-normal rounded-md p-0 text-left text-navy hover:bg-transparent hover:text-navy md:w-auto md:gap-12"
          >
            <span className="flex items-center gap-5">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-navy/40 md:size-20"><BookOpen className="size-8 md:size-10" strokeWidth={1.5} /></span>
              <span className="flex flex-col items-start gap-1">
                <span className="label-mono">Project impact</span>
                <span className="text-2xl font-bold md:text-3xl">Students registered so far <span className="font-bold">—</span></span>
              </span>
            </span>
            <ChevronDown className={`ml-4 size-5 shrink-0 transition-transform ${showCountInfo ? "rotate-180" : ""}`} />
          </Button>
          {showCountInfo && <p id="registered-count-info" className="mt-5 max-w-xl text-sm leading-relaxed text-navy/80">A verified registration total has not been published yet. We’ll update this once forms close.</p>}
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>THE SESSION LOG</SectionLabel>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="border-t-2 border-navy pt-6">
              <p className="label-mono text-navy/60">01 / NEXT UP</p>
              <h2 className="mt-5 text-3xl text-navy md:text-5xl">Upcoming dates.</h2>
              <div className="mt-8 flex items-start gap-4 border-t border-border pt-7">
                <CalendarDays className="mt-1 size-6 shrink-0 text-navy" strokeWidth={1.5} />
                <div>
                  <p className="label-mono text-navy/60">{session.date_label}</p>
                  <h3 className="mt-3 text-2xl text-navy">Journal Club — Session no. 1</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-navy/70">Discuss the study we created out of this BLS workshop.</p>
                  <p className="label-mono mt-5 text-navy/60">{session.meta}</p>
                  {session.registration_open && <Button asChild variant="secondary" className="mt-7 h-auto rounded-md px-5 py-3 font-bold"><a href={formUrlFor(session.slug)} target="_blank" rel="noopener noreferrer">Register <ArrowUpRight /></a></Button>}
                </div>
              </div>
            </div>
            <div className="border-t-2 border-navy pt-6">
              <p className="label-mono text-navy/60">02 / THE ARCHIVES</p>
              <h2 className="mt-5 text-3xl text-navy md:text-5xl">Previous sessions.</h2>
              <div className="mt-8 border-t border-border pt-7">
                <p className="text-lg text-navy/70">No previous sessions listed yet.</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/60">Past journal club meetings will appear here once session details are available.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ProjectNotFound() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-24 md:px-10">
      <p className="label-mono text-navy/60">404 / NOT FOUND</p>
      <h1 className="mt-4 text-4xl text-navy md:text-6xl">This project doesn't exist (yet).</h1>
      <Link
        to="/projects"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-4 text-sm font-bold text-navy"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>
    </div>
  );
}
