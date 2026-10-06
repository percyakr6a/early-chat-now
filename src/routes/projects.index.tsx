import { createFileRoute } from "@tanstack/react-router";

import { ProjectsOverview, Route as ProjectsRoute } from "./projects";

export const Route = createFileRoute("/projects/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Projects — Upcoming SRF CMC sessions" },
      { name: "description", content: "Explore upcoming SRF CMC workshops and research sessions, including The CPR Project." },
      { property: "og:title", content: "Upcoming Projects — SRF CMC" },
      { property: "og:description", content: "Workshops, short-term projects and open sessions for students who would rather learn by trying." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsIndex,
});

function ProjectsIndex() {
  const sessions = ProjectsRoute.useLoaderData();
  return <ProjectsOverview sessions={sessions} />;
}