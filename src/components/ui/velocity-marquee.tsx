"use client";

// A row that drifts on its own, speeds up and leans with scroll velocity, turns around
// when the page scrolls up, and slows to a crawl under the pointer.

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Pixels per second at rest */
  speed?: number;
  reverse?: boolean;
  /** Gap between items; the same value is used as trailing padding so the loop is seamless */
  gap?: string;
  className?: string;
};

export default function VelocityMarquee({ children, speed = 40, reverse = false, gap = "gap-10 pr-10", className }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const velocity = useRef(0);
  const direction = useRef(1);
  const hover = useRef(false);

  useLenis((lenis) => {
    velocity.current = lenis.velocity;
    if (lenis.direction) direction.current = lenis.direction;
  });

  useGSAP(
    () => {
      const el = track.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const setX = gsap.quickSetter(el, "x", "px");
      const setSkew = gsap.quickSetter(el, "skewX", "deg");
      let width = (el.firstElementChild as HTMLElement).offsetWidth;
      let x = 0;
      let boost = 0;
      let skew = 0;
      let pace = 1;

      const tick = (_t: number, dt: number) => {
        const v = velocity.current;
        velocity.current *= 0.9;
        boost += (Math.min(Math.abs(v) / 6, 8) - boost) * 0.08;
        skew += (gsap.utils.clamp(-6, 6, -v * 0.25) - skew) * 0.1;
        pace += ((hover.current ? 0.15 : 1) - pace) * 0.06;
        const sign = (reverse ? -1 : 1) * direction.current;
        x = gsap.utils.wrap(-width, 0, x - sign * speed * (1 + boost) * pace * (dt / 1000));
        setX(x);
        setSkew(skew * (reverse ? -1 : 1));
      };

      // Only run while the row is on screen
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)));
      io.observe(el);
      const ro = new ResizeObserver(() => (width = (el.firstElementChild as HTMLElement).offsetWidth));
      ro.observe(el);
      return () => {
        io.disconnect();
        ro.disconnect();
        gsap.ticker.remove(tick);
      };
    },
    { scope: root, dependencies: [speed, reverse] },
  );

  return (
    <div
      ref={root}
      className={cn("overflow-hidden", className)}
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
    >
      <div ref={track} className="flex w-max will-change-transform">
        <div className={cn("flex shrink-0 items-center", gap)}>{children}</div>
        <div className={cn("flex shrink-0 items-center", gap)} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
