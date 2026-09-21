import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { amIAdmin } from "@/lib/srf.functions";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Members" },
  { to: "/projects", label: "Projects" },
  { to: "/journal", label: "Journal" },
] as const;

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

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
          {user ? (
            <>
              <Link
                to="/my-sessions"
                activeProps={{ className: "bg-navy/10 text-navy" }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
              >
                My sessions
              </Link>
              <button
                onClick={signOut}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
              >
                Sign out
              </button>
            </>
          ) : null}
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
          {user ? (
            <>
              <Link
                to="/my-sessions"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-semibold text-navy"
              >
                My sessions
              </Link>
              <button
                onClick={signOut}
                className="rounded-lg px-3 py-2 text-left text-base font-semibold text-navy"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-semibold text-navy"
            >
              Sign in
            </Link>
          )}
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
