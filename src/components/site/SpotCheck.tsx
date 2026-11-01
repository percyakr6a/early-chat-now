import { useServerFn } from "@tanstack/react-start";
import { Search, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { findMySpot, type SpotResult } from "@/lib/srf.functions";

export function SpotCheck() {
  const findSpot = useServerFn(findMySpot);
  const [open, setOpen] = useState(false);
  const [batch, setBatch] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SpotResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!batch.trim() || !rollNo.trim()) {
      setError("Please enter both your batch and roll no.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      setResult(await findSpot({ data: { batch: batch.trim(), rollNo: rollNo.trim() } }));
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setBatch("");
    setRollNo("");
  }

  return (
    <div id="spot-check" className="mt-7 scroll-mt-24">
      {!open ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(true)}
          className="h-auto rounded-md px-5 py-3 font-bold"
        >
          <Search className="size-4" /> Check your spot
        </Button>
      ) : (
        <div className="rounded-2xl border border-navy/15 bg-card p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="label-mono text-navy/60">CHECK YOUR SPOT / CPR WORKSHOP NO. 1</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close spot check"
              className="text-navy/50 transition-colors hover:text-navy"
            >
              <X className="size-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3">
            <label className="w-28">
              <span className="label-mono block text-navy/60">BATCH</span>
              <input
                value={batch}
                onChange={(event) => setBatch(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                placeholder="51"
                className="mt-1 w-full rounded-lg border border-navy/20 bg-background px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-navy"
              />
            </label>
            <label className="w-28">
              <span className="label-mono block text-navy/60">ROLL NO.</span>
              <input
                value={rollNo}
                onChange={(event) => setRollNo(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                placeholder="131"
                className="mt-1 w-full rounded-lg border border-navy/20 bg-background px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-navy"
              />
            </label>
            <Button
              type="submit"
              disabled={pending}
              variant="secondary"
              className="h-auto rounded-md px-5 py-2.5 font-bold"
            >
              {pending ? "Checking…" : "Check"}
            </Button>
            {result || error ? (
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                className="h-auto px-3 py-2.5 text-navy/60 hover:text-navy"
              >
                Clear
              </Button>
            ) : null}
          </form>
          {error ? <p className="mt-4 text-sm font-semibold text-navy">{error}</p> : null}
          {result ? (
            result.found ? (
              <div className="mt-4 rounded-xl border border-navy/15 bg-background p-5">
                <p className="label-mono text-navy/60">YOU'RE ON THE LIST</p>
                <p className="mt-2 text-2xl font-bold text-navy">{result.name}</p>
                <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {[
                    ["BATCH & ROLL NO.", result.batchRoll],
                    ["CPR WORKSHOP", result.workshop],
                    ["SESSION", `Session no. ${result.sessionNo}`],
                    ["DATE", result.sessionDate],
                    ["TIME", result.time],
                    ["VENUE", result.venue],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="label-mono text-xs text-navy/60">{label}</dt>
                      <dd className="text-sm font-semibold text-navy">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-navy/15 bg-background p-5">
                <p className="label-mono text-navy/60">NOT ON THE LIST</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">
                  No spot found for that batch & roll no. in CPR Workshop no. 1. Double-check both
                  numbers, or contact the team if you think this is a mistake.
                </p>
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
