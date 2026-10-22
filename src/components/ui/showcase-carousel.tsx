"use client";

// Auto-playing screenshot carousel inside a device frame. Plays only while on screen,
// pauses on hover, and the progress bars underneath double as controls.

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { BrowserFrame, PhoneFrame, Shot } from "../Frames";
import type { ShotRef } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  slides: ShotRef[];
  frame: "browser" | "phone";
  url?: string;
  interval?: number;
  className?: string;
};

export default function ShowcaseCarousel({ slides, frame, url, interval = 3200, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && slides.length > 1;

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearTimeout(id);
  }, [playing, index, interval, slides.length]);

  const current = slides[index];
  // Every slide stays mounted (so lazy images load together as the card nears the screen);
  // only the active one is visible
  const stage = (
    <div className="relative">
      <div className="invisible">
        <Shot shotRef={slides[0]} alt="" sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>
      {slides.map((s, i) => (
        <div
          key={s.name}
          className={cn(
            "absolute inset-0 transition-[opacity,scale] duration-[900ms] ease-out-expo",
            i === index ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Shot shotRef={s} alt={s.caption ?? "Project screen"} sizes="(min-width: 1024px) 55vw, 100vw" className="h-full object-cover object-top" />
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={className} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {frame === "phone" ? <PhoneFrame>{stage}</PhoneFrame> : <BrowserFrame url={url}>{stage}</BrowserFrame>}

      {slides.length > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setIndex(i)}
                className="group relative h-6 flex-1"
                aria-label={`Show ${s.caption ?? `screen ${i + 1}`}`}
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-fg/10 transition-colors group-hover:bg-fg/20">
                  <span
                    key={i === index ? `on-${index}-${playing}` : "off"}
                    className={cn("block h-full origin-left rounded-full bg-fg", i < index ? "scale-x-100" : "scale-x-0")}
                    style={
                      i === index
                        ? { animation: playing ? `showcase-fill ${interval}ms linear forwards` : "none", transform: playing ? undefined : "scaleX(1)" }
                        : undefined
                    }
                  />
                </span>
              </button>
            ))}
          </div>
          <span className="w-44 truncate text-right font-mono text-[11px] text-muted">{current.caption}</span>
        </div>
      )}
    </div>
  );
}
