"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Check, Loader2, Mic } from "lucide-react";

const stages = ["Scope of works", "Estimate", "Materials", "Schedule", "Trade briefs"];
type Status = "queued" | "running" | "review" | "approved";

/** Illustrated Praxis UI: the agent pipeline ticks through its stages. */
export default function PraxisVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (stages.length * 2 + 3)), 900);
    return () => clearInterval(id);
  }, [inView]);

  const status = (i: number): Status => {
    const at = step / 2;
    if (i < Math.floor(at)) return "approved";
    if (i === Math.floor(at)) return step % 2 === 0 ? "running" : "review";
    return "queued";
  };

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-line-strong bg-[#fbfaf7] text-[#1c1b18] shadow-[var(--shadow)]">
      <div className="flex items-center justify-between border-b border-black/5 px-5 py-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#d97706]">Job #214</p>
          <p className="text-sm font-semibold">3-bed weatherboard · full repaint</p>
        </div>
        <span className="rounded-full bg-[#d97706]/10 px-3 py-1 text-[11px] font-semibold text-[#b45309]">Budget $15,000</span>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-5">
        <div className="space-y-3 sm:col-span-2">
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md"
                style={{ background: `linear-gradient(135deg, hsl(${30 + i * 18} 30% ${78 - i * 3}%), hsl(${20 + i * 12} 25% ${62 - i * 2}%))` }}
              />
            ))}
          </div>
          <div className="rounded-lg border border-black/5 bg-white p-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d97706] text-white">
                <Mic size={12} />
              </span>
              Voice brief · 0:42
            </div>
            <div className="mt-3 flex h-7 items-center gap-[3px]">
              {Array.from({ length: 34 }, (_, i) => (
                <span
                  key={i}
                  className="w-full rounded-full bg-[#d97706]/60"
                  style={{ height: `${Math.round(20 + Math.abs(Math.sin(i * 1.7) * 80))}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <ol className="space-y-2 sm:col-span-3">
          {stages.map((s, i) => {
            const st = status(i);
            return (
              <li key={s} className="flex items-center justify-between rounded-lg border border-black/5 bg-white px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2.5">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
                      st === "approved" ? "bg-emerald-500 text-white" : st === "queued" ? "bg-black/5 text-black/40" : "bg-[#d97706] text-white"
                    }`}
                  >
                    {st === "approved" ? <Check size={12} /> : st === "running" ? <Loader2 size={12} className="animate-spin" /> : i + 1}
                  </span>
                  {s}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors duration-300 ${
                    st === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : st === "review"
                        ? "bg-amber-50 text-amber-700"
                        : st === "running"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-black/5 text-black/40"
                  }`}
                >
                  {st === "review" ? "Awaiting approval" : st}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
