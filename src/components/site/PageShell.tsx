import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-background px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <p className="label-mono text-navy/60">{eyebrow}</p>
        <h1 className="mt-8 max-w-4xl text-5xl leading-[0.9] text-navy md:text-8xl">{children}</h1>
      </div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="label-mono flex items-center gap-3 text-navy/60">
      <span className="h-px w-8 bg-navy/40" />
      {children}
    </p>
  );
}
