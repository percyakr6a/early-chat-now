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
          <div className="mt-8 flex flex-col items-start gap-8">
            <div>
              <p className="label-mono text-navy/40">Instagram</p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono mt-2 inline-block break-all border-b border-navy/20 pb-2 text-2xl text-navy transition-colors hover:border-lime md:text-3xl"
              >
                {INSTAGRAM_ADDRESS}
              </a>
            </div>
            <div>
              <p className="label-mono text-navy/40">X (Twitter)</p>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono mt-2 inline-block break-all border-b border-navy/20 pb-2 text-2xl text-navy transition-colors hover:border-lime md:text-3xl"
              >
                {X_ADDRESS}
              </a>
            </div>
            <div>
              <p className="label-mono text-navy/40">Email</p>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="label-mono mt-2 inline-block break-all border-b border-navy/20 pb-2 text-2xl text-navy transition-colors hover:border-lime md:text-3xl"
              >
                {EMAIL_ADDRESS}
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
