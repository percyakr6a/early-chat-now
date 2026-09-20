import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PageShell, SectionLabel } from "@/components/site/PageShell";
import { getJournalPosts } from "@/lib/srf.functions";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Notes in progress from SRF CMC" },
      {
        name: "description",
        content:
          "Research notes, field reports and useful ways of thinking from the SRF CMC community at Chandka Medical College.",
      },
      { property: "og:title", content: "Read closer — The SRF CMC journal" },
      {
        property: "og:description",
        content: "Small dispatches for big questions: student research notes while the ideas are still alive.",
      },
    ],
  }),
  loader: () => getJournalPosts(),
  component: Journal,
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Journal() {
  const posts = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero eyebrow="The journal / notes in progress">
        Read <span className="text-navy/40">closer.</span>
      </PageHero>

      <section className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="max-w-2xl text-xl leading-relaxed text-navy">
            Research notes, field reports, and useful ways of thinking from the SRF CMC community.
          </p>

          <div className="mt-16">
            <SectionLabel>Latest from the desk</SectionLabel>
            <h2 className="mt-6 max-w-3xl text-4xl leading-[0.95] text-navy md:text-6xl">
              Small dispatches <span className="text-navy/40">for big questions.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-navy/70">
              No polished conclusions required. Just ideas worth sharing while they are still alive.
            </p>
          </div>

          <div className="mt-14 divide-y divide-navy/10 border-y border-navy/10">
            {posts.map((post) => (
              <article key={post.id} className="grid gap-6 py-10 md:grid-cols-[14rem_1fr]">
                <span className="label-mono text-navy/50">{post.kicker}</span>
                <div>
                  <h3 className="max-w-3xl text-2xl leading-[1.1] text-navy md:text-4xl">
                    {post.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy/70">{post.excerpt}</p>
                  <p className="label-mono mt-6 text-navy/50">
                    {post.author} / {formatDate(post.published_on)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-5 py-24 text-primary-foreground md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-mono text-lime">Have a note?</p>
          <h2 className="mt-8 max-w-3xl text-4xl leading-[0.95] md:text-6xl">
            Send us the <span className="text-cyan">unfinished version.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-primary-foreground/80">
            We are always looking for student voices, useful resources, and questions that deserve a
            bigger room.
          </p>
          <a
            href="mailto:srf.cmc@forum.edu"
            className="mt-10 inline-flex rounded-xl bg-lime px-6 py-4 text-sm font-bold text-navy transition-transform hover:-translate-y-0.5"
          >
            Write to the editorial desk
          </a>
        </div>
      </section>
    </PageShell>
  );
}
