import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PageShell } from "@/components/site/PageShell";

const INSTAGRAM_URL = "https://www.instagram.com/srfcmc/";
const INSTAGRAM_ADDRESS = "instagram.com/srfcmc";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SRF CMC — Student Research Forum" },
      {
        name: "description",
        content: "Contact the Student Research Forum at Chandka Medical College on Instagram.",
      },
      { property: "og:title", content: "Contact SRF CMC" },
      {
        property: "og:description",
        content: "Find the Student Research Forum at Chandka Medical College on Instagram.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <PageHero eyebrow="Contact / Instagram">
        Let&apos;s talk <span className="text-navy/40">research.</span>
      </PageHero>

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-mono text-navy/60">Our Instagram</p>
          <p className="mt-5 text-3xl font-semibold text-navy md:text-5xl">@srfcmc</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy/70">
            Tap the address below to open our profile.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono mt-10 inline-block break-all border-b border-navy/20 pb-2 text-navy transition-colors hover:border-lime hover:text-navy"
          >
            {INSTAGRAM_ADDRESS}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
