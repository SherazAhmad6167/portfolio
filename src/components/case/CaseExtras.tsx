"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Thin iridescent bar under the nav that fills as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-[linear-gradient(90deg,#7dd3fc,#a78bfa,#f472b6,#fbbf24)]"
      style={{ scaleX }}
    />
  );
}

/** Sticky list of the page's sections; the one in view is highlighted. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const lenis = useLenis();

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <p className="label mb-4">On this page</p>
      <ol className="relative space-y-1 border-l border-line">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(it.id);
                  if (el) lenis ? lenis.scrollTo(el, { offset: -90, duration: 1.2 }) : el.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "relative -ml-px flex items-baseline gap-3 border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  on ? "border-fg text-fg" : "border-transparent text-muted hover:text-fg",
                )}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Cover that grows from inset to full width as it scrolls into place. */
export function CoverZoom({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ref.current,
        { scale: 0.86, borderRadius: 56 },
        {
          scale: 1,
          borderRadius: 32,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 95%", end: "top 25%", scrub: true },
        },
      );
      gsap.to(".cover-float", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("origin-top overflow-hidden", className)}>
      {children}
    </div>
  );
}

/** Large paragraph whose words brighten as it scrolls through view. */
export function LitText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".lit-word",
        { opacity: 0.15 },
        { opacity: 1, ease: "none", stagger: 0.05, scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 50%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="lit-word">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
