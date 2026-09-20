import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { SessionList } from "@/components/site/SessionList";
import { Ticker } from "@/components/site/Ticker";
import { getSessions } from "@/lib/srf.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SRF CMC — Student Research Forum, Chandka Medical College" },
      {
        name: "description",
        content:
          "A student-led research forum at Chandka Medical College for the curious and the collaborative. Workshops, studies and a journal desk, open to all MBBS batches.",
      },
      { property: "og:title", content: "SRF CMC — your home-grown research forum" },
      {
        property: "og:description",
        content: "Student-led, research-oriented, politics-free. Open to all MBBS batches at CMC Larkana.",
      },
    ],
  }),
  loader: () => getSessions(),
  component: Home,
});

function Home() {
  const sessions = Route.useLoaderData();

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-navy px-5 py-24 text-primary-foreground md:px-10 md:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-32 size-[38rem] rounded-full border-[3rem] border-primary-foreground/5" />
          <div className="absolute inset-y-0 left-[18%] w-px rotate-12 bg-primary-foreground/10" />
          <div className="absolute inset-y-0 left-[62%] w-px rotate-12 bg-primary-foreground/10" />
        </div>

        <div className="relative mx-auto max-w-[1400px]">
          <p className="label-mono flex items-center gap-3 text-lime">
            <span className="h-px w-8 bg-lime" /> SRF / CMC / 2026
          </p>
          <h1 className="mt-10 max-w-5xl text-[3.25rem] leading-[0.86] md:text-[7.5rem]">
            your <span className="text-cyan">home-grown</span> research forum.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
            A student-led research forum for the curious, the collaborative, and anyone who has ever
            asked: “How can I do research at CMC?”
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 rounded-xl bg-lime px-6 py-4 text-sm font-bold text-navy transition-transform hover:-translate-y-0.5"
            >
              See what's happening <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-xl border border-primary-foreground/30 px-6 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Meet the forum
            </Link>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2">
          <h2 className="text-5xl leading-[0.92] text-navy md:text-7xl">
            Not a lecture.
            <br />
            Not a club.
            <br />A working
            <br />
            space.
          </h2>
          <div className="border-l-4 border-lime pl-8">
            <p className="text-xl leading-relaxed text-navy">
              <strong>SRF CMC is an inclusive place where we turn curiosity into a practice.</strong>{" "}
              We run short, focused learning sessions and make room for the work that follows: finding a
              question, reading the literature, building a protocol, and sharing what we published.
            </p>
            <p className="mt-8 text-lg leading-relaxed text-navy/70">
              No gatekeeping. No politics. An open to all platform for those willing to do real research.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>On the desk now</SectionLabel>
          <h2 className="mt-6 max-w-3xl text-4xl leading-[0.95] text-navy md:text-6xl">
            One good question <span className="text-navy/40">at a time.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-navy/70">
            Upcoming sessions, working groups, and experiments from the SRF CMC calendar.
          </p>
          <div className="mt-14">
            <SessionList sessions={sessions} />
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>The invitation</SectionLabel>
          <h2 className="mt-6 max-w-4xl text-4xl leading-[0.95] text-navy md:text-6xl">
            Bring the question <span className="text-navy/40">you keep returning to.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy/70">
            You don't need a publication. You don't need to know the answer. You just need a reason to
            look closer.
          </p>
          <Link
            to="/projects"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-navy px-6 py-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Find your next session <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
