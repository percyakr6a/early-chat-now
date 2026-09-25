import { createFileRoute } from "@tanstack/react-router";

import { PageHero, PageShell } from "@/components/site/PageShell";

const INSTAGRAM_URL = "https://www.instagram.com/srfcmc/";
const INSTAGRAM_ADDRESS = "instagram.com/srfcmc";
const X_URL = "https://x.com/srfcmc";
const X_ADDRESS = "x.com/srfcmc";
const EMAIL_ADDRESS = "convener.srfcmc@gmail.com";

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
      <PageHero eyebrow="CONTACT / SOCIALS">
        Let&apos;s talk <span className="text-navy/40">research.</span>
      </PageHero>

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-mono text-navy/60">Reach us</p>
          <div className="mt-8 flex flex-col items-start gap-12">
            <div>
              <p className="text-4xl leading-[0.95] text-navy md:text-6xl">
                Instagram
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono mt-4 inline-block text-navy/60 underline-offset-4 transition-colors hover:text-navy hover:underline"
              >
                {INSTAGRAM_ADDRESS} ↗
              </a>
            </div>
            <div>
              <p className="text-4xl leading-[0.95] text-navy md:text-6xl">
                X (Twitter)
              </p>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono mt-4 inline-block text-navy/60 underline-offset-4 transition-colors hover:text-navy hover:underline"
              >
                {X_ADDRESS} ↗
              </a>
            </div>
            <div>
              <p className="text-4xl leading-[0.95] text-navy md:text-6xl">
                Email
              </p>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="label-mono mt-4 inline-block text-navy/60 underline-offset-4 transition-colors hover:text-navy hover:underline"
              >
                {EMAIL_ADDRESS} ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
