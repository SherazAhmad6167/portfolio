"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

/** Counts up numbers like "6,000+" when they come into view; other values show as they are. */
export default function ImpactValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? Number(match[1].replace(/,/g, "")) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!suffix && !target) return;
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(0, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, target, suffix]);

  return <span ref={ref}>{match ? `${n.toLocaleString("en-US")}${suffix}` : value}</span>;
}
