import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import { PROJECT_LINKS } from "@/lib/project-links";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Team" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-primary-foreground">
            <span className="text-lg font-black lowercase leading-none">srf</span>
          </span>
          <span className="label-mono max-w-[9rem] font-semibold leading-[1.25] text-navy">
            Student Research
            <br />
            Forum / CMC
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-navy/10 text-navy" }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <Link
              to="/projects"
              activeProps={{ className: "bg-navy/10 text-navy" }}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
            >
              Projects <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full w-72 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-navy/15 bg-card shadow-[0_18px_40px_-28px_var(--navy)]">
                {PROJECT_LINKS.map((p) => (
                  <Link
                    key={p.slug}
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="block px-5 py-3 text-sm font-semibold text-navy/70 transition-colors hover:bg-navy/5 hover:text-navy"
                  >
                    {p.label}
                  </Link>
                ))}
                <Link
                  to="/projects"
                  className="block border-t border-navy/10 px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
                >
                  All projects →
                </Link>
              </div>
            </div>
          </div>

          <Link
            to="/projects"
            className="ml-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-navy shadow-[0_4px_0_0_var(--navy)] transition-transform hover:-translate-y-0.5"
          >
            Join a session
          </Link>
        </nav>

        <button
          className="rounded-lg border border-border p-2 text-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-semibold text-navy"
            >
              {item.label}
            </Link>
          ))}

          <button
            className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-navy"
            onClick={() => setProjectsOpen((v) => !v)}
            aria-expanded={projectsOpen}
          >
            Projects
            <ChevronDown className={`size-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`} />
          </button>
          {projectsOpen ? (
            <div className="ml-3 flex flex-col gap-1 border-l border-navy/15 pl-3">
              {PROJECT_LINKS.map((p) => (
                <Link
                  key={p.slug}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-navy/70"
                >
                  {p.label}
                </Link>
              ))}
              <Link
                to="/projects"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-navy"
              >
                All projects →
              </Link>
            </div>
          ) : null}

          <Link
            to="/projects"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-xl bg-lime px-5 py-3 text-center text-sm font-bold text-navy"
          >
            Join a session
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
