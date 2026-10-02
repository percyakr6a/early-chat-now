import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

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
    ],
  }),
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
});

function ProjectDetail() {
  const session = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-10 md:py-20">
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
    </div>
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
