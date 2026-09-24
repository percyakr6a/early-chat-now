import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { PageHero, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";

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
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(`https://www.${INSTAGRAM_ADDRESS}/`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

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
            Copy the address below and paste it into Safari to visit our profile.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="label-mono break-all border-b border-navy/20 pb-2 text-navy">
              {INSTAGRAM_ADDRESS}
            </span>
            <Button type="button" onClick={copyAddress} className="bg-navy text-primary-foreground hover:bg-navy/90">
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy address"}
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}