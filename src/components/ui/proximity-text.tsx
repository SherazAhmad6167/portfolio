"use client";

// Letters get heavier as the cursor gets close, using the variable weight axis of Geist.

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Line = { text: string; className?: string };

type Props = {
  lines: Line[];
  className?: string;
  radius?: number;
  from?: number;
  to?: number;
};

export default function ProximityText({ lines, className, radius = 180, from = 460, to = 860 }: Props) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>(".px-char"));
    let rects: DOMRect[] = [];
    let stale = true;
    let mx = -9999;
    let my = -9999;
    let raf = 0;

    const paint = () => {
      raf = 0;
      if (stale) {
        rects = chars.map((c) => c.getBoundingClientRect());
        stale = false;
      }
      chars.forEach((c, i) => {
        const r = rects[i];
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / radius);
        c.style.fontVariationSettings = `'wght' ${Math.round(from + (to - from) * k * k)}`;
      });
    };
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const invalidate = () => {
      stale = true;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [radius, from, to]);

  return (
    <span ref={root} className={cn("block", className)}>
      {lines.map((line, li) => (
        <span key={li} className={cn("px-line block overflow-clip pb-[0.1em] -mb-[0.1em]", line.className)}>
          {line.text.split(" ").map((word, wi, words) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, ci) => (
                <span
                  key={ci}
                  className="px-char inline-block transition-[font-variation-settings] duration-300 ease-out"
                  style={{ fontVariationSettings: `'wght' ${from}` }}
                >
                  {ch}
                </span>
              ))}
              {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
