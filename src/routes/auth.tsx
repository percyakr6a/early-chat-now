import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — SRF CMC Student Research Forum" },
      {
        name: "description",
        content:
          "Sign in or create your SRF CMC account to register for workshops, journal club sessions and the BLS project.",
      },
      { property: "og:title", content: "Sign in — SRF CMC" },
      {
        property: "og:description",
        content: "Create an account with your name and batch to hold a slot in the next SRF CMC session.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectTo = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/projects";

  useEffect(() => {
    if (!loading && user) navigate({ to: redirectTo, replace: true });
  }, [loading, user, navigate, redirectTo]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, batch_year: batchYear },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          toast.success("Account created. Check your email to confirm it.");
          return;
        }
        toast.success("Welcome to the forum.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      navigate({ to: redirectTo, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-xl px-5 py-20 md:px-10">
        <p className="label-mono text-navy/60">SRF / CMC / 2026</p>
        <h1 className="mt-6 text-5xl leading-[0.95] text-navy md:text-6xl">
          {mode === "signup" ? "Join the forum." : "Welcome back."}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-navy/70">
          {mode === "signup"
            ? "Give us your name and batch so we know who is in the room, then hold your slot in one click."
            : "Sign in to register for a session, or to see what you have already signed up for."}
        </p>

        {checkEmail ? (
          <div className="mt-10 rounded-3xl border border-navy/15 bg-card p-8">
            <p className="label-mono text-navy/60">Almost there</p>
            <h2 className="mt-4 text-2xl text-navy">Check your email.</h2>
            <p className="mt-3 text-base leading-relaxed text-navy/70">
              We sent a confirmation link to <span className="font-semibold text-navy">{email}</span>. Click it, then
              come back and sign in.
            </p>
            <button
              onClick={() => {
                setCheckEmail(false);
                setMode("signin");
              }}
              className="mt-6 text-sm font-semibold text-navy underline underline-offset-4"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={onSubmit} className="mt-10 grid gap-5 rounded-3xl border border-navy/15 bg-card p-8">
              {mode === "signup" ? (
                <>
                  <Field label="Full name">
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      placeholder="Musadiq Kalhoro"
                    />
                  </Field>
                  <Field label="Batch / year">
                    <input
                      required
                      value={batchYear}
                      onChange={(e) => setBatchYear(e.target.value)}
                      className={inputClass}
                      placeholder="3rd year MBBS, Batch 2023"
                    />
                  </Field>
                </>
              ) : null}
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Password">
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="At least 6 characters"
                />
              </Field>
              <button
                type="submit"
                disabled={busy}
                className="mt-2 rounded-xl bg-navy px-6 py-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-navy/70">
              {mode === "signup" ? "Already have an account?" : "First time here?"}{" "}
              <button
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="font-semibold text-navy underline underline-offset-4"
              >
                {mode === "signup" ? "Sign in instead" : "Create one"}
              </button>
            </p>
          </>
        )}
      </section>
    </PageShell>
  );
}

const inputClass =
  "w-full rounded-xl border border-navy/20 bg-background px-4 py-3 text-base text-navy outline-none transition-colors focus:border-navy";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="label-mono text-navy/60">{label}</span>
      {children}
    </label>
  );
}
