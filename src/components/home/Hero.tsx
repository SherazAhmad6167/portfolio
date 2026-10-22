"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight, Sparkles, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { useScrollTo } from "@/lib/useScrollTo";
import ClientGlobe, { type GlobeMarker } from "@/components/ui/client-globe";
import ProximityText from "@/components/ui/proximity-text";
import Magnetic from "../Magnetic";
import LocalTime from "../LocalTime";
import { places } from "@/content/site";
import Avatar from "../Avatar";
import AskAI from "./AskAI";
import { site } from "@/content/site";

const markers: GlobeMarker[] = places;
const view = { lat: 15, lng: 72 };

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const [asking, setAsking] = useState(false);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([".hero-in", ".hero-h1"], { autoAlpha: 1 });
        return;
      }
      gsap.set(".hero-in", { autoAlpha: 0, y: 24 });
      gsap.set(".px-char", { yPercent: 115 });
      gsap.set(".hero-h1", { autoAlpha: 1 });
      gsap.set(".hero-globe", { autoAlpha: 0, scale: 0.9 });

      const off = onIntroDone(() => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(".hero-globe", { autoAlpha: 1, scale: 1, duration: 1.6 }, 0)
          .to(".px-char", { yPercent: 0, duration: 1.1, stagger: 0.022 }, 0.1)
          .to(".hero-in", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5);
      });

      // Ease the globe back and the headline up as the page scrolls on
      gsap.to(".hero-globe-wrap", {
        yPercent: 14,
        scale: 0.9,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope },
  );

  return (
    <section ref={scope} id="top" className="relative overflow-hidden" aria-label="Introduction">
      {/* Backdrop: faint grid that fades out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_45%,#000,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page relative grid min-h-[100svh] items-center gap-6 pb-24 pt-20 lg:grid-cols-12 lg:gap-0 lg:pb-16 lg:pt-16">
        {/* Globe: top on phones, right on desktop */}
        <div className="hero-globe-wrap relative order-1 -mx-4 lg:order-2 lg:col-span-6 lg:-mr-12 lg:ml-0">
          <ClientGlobe markers={markers} view={view} className="hero-globe mx-auto aspect-square w-full max-w-[560px] lg:max-w-[760px]" />
        </div>

        <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
          <p data-reveal className="hero-in mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-4 text-[13px] text-muted backdrop-blur">
            <span className="relative">
              <Avatar size={28} />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </span>
            </span>
            <span className="text-fg">{site.name}</span>
            <span aria-hidden>·</span>
            {site.role}
            <span className="-ml-1.5 hidden sm:inline"> at {site.company}</span>
          </p>

          <h1 data-reveal className="hero-h1 display text-[clamp(2.9rem,5.6vw,6.2rem)] leading-[0.95] tracking-[-0.045em]">
            <ProximityText
              lines={[
                { text: "Built in Pakistan." },
                { text: "Running on", className: "text-muted" },
                { text: "four continents.", className: "text-fg" },
              ]}
            />
          </h1>

          <p data-reveal className="hero-in mt-7 max-w-lg text-lg leading-relaxed text-muted">
            I&apos;m a full-stack engineer. My work runs in the UK, Australia, Cameroon and at home: payments and live
            streams, AI pipelines, a digital wallet, and the system that bills 6,000+ internet subscribers.
          </p>

          <div data-reveal className="hero-in mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollTo("work")}
                className="group flex h-12 items-center gap-3 rounded-full bg-fg pl-6 pr-1.5 text-sm font-medium text-invert"
              >
                See my work
                <span className="grid h-9 w-9 place-items-center rounded-full bg-invert/15 transition-transform duration-500 group-hover:translate-x-0.5">
                  <ArrowRight size={16} />
                </span>
              </button>
            </Magnetic>
            <button
              type="button"
              onClick={() => setAsking((a) => !a)}
              aria-expanded={asking}
              className="spot flex h-12 items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-5 text-sm backdrop-blur transition-colors hover:bg-surface"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              {asking ? <X size={15} /> : <Sparkles size={15} className="text-accent" />}
              {asking ? "Close assistant" : "Ask my assistant"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {asking && (
              <motion.div
                key="ask"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-5">
                  <AskAI />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p data-reveal className="hero-in mt-10 font-mono text-[11px] uppercase tracking-wider text-faint">
            Drag the globe · tap a country to open its project
          </p>
        </div>

        <div data-reveal className="hero-in absolute inset-x-4 bottom-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted sm:inset-x-8 lg:inset-x-12">
          <LocalTime />
          <button type="button" onClick={() => scrollTo("work")} className="-my-3 flex items-center gap-2 py-3 transition-colors hover:text-fg">
            Scroll <ArrowDown size={13} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
