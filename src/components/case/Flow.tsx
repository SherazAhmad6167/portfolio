"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Flow as FlowType } from "@/content/projects";

/** Steps that light up one by one, joined by a line that draws itself. */
export default function Flow({ flow }: { flow: FlowType }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 75%", once: true } });
      tl.fromTo(".flow-line", { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.6, ease: "power2.inOut" })
        .from(".flow-step", { autoAlpha: 0, y: 24, duration: 0.7, ease: "expo.out", stagger: 0.22 }, 0.1)
        .from(".flow-dot", { scale: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.22 }, 0.15);
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <h3 className="label mb-8">{flow.title}</h3>
      <div className="relative">
        {/* Connector: vertical on mobile, horizontal on desktop */}
        <div className="flow-line absolute bottom-4 left-[11px] top-4 w-px origin-top bg-gradient-to-b from-accent to-accent/20 md:hidden" aria-hidden />
        <div
          className="flow-line absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-gradient-to-r from-accent to-accent/20 md:block"
          aria-hidden
        />
        {/* A pulse of "data" that keeps travelling along the line */}
        <span aria-hidden className="absolute top-[8px] hidden h-[7px] w-10 animate-[flow-run_3.2s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,transparent,#a78bfa,#7dd3fc)] md:block" />
        <ol
          className="grid gap-8 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:gap-6"
          style={{ ["--cols" as string]: flow.steps.length }}
        >
          {flow.steps.map((s, i) => (
            <li key={s.title} className="flow-step relative pl-10 md:pl-0 md:pt-10">
              <span
                className="flow-dot absolute left-0 top-0 z-10 grid h-[23px] w-[23px] place-items-center rounded-full border border-accent bg-bg font-mono text-[10px] text-accent"
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="text-lg font-semibold leading-tight tracking-tight">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
