"use client";

import { useRef, ViewTransition } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/content/projects";
import { tint } from "@/lib/tints";
import { shot } from "@/lib/media";
import { PhoneFrame, Shot } from "../Frames";
import Magnetic from "../Magnetic";
import PraxisVisual from "./PraxisVisual";
import CurtainSplitHero, { type CurtainItem } from "@/components/ui/curtain-split-hero";
import ShowcaseCarousel from "@/components/ui/showcase-carousel";
import TechChip from "@/components/ui/tech-chip";
import ImpactValue from "@/components/ui/impact-value";

// The curtain deck that opens the section: eight screens, four per side
// (even = left wing, odd = right wing, top to bottom). Tall cards crop wide dashboards
// toward their colourful areas; z puts the strongest shots on top where cards overlap.
const deck: { project: string; name: string; slug: string; label: string; position?: string; z: number }[] = [
  { project: "ranjha", name: "dashboard", slug: "ranjha-isp-suite", label: "Ranjha 7 Star ISP Suite", position: "left center", z: 6 },
  { project: "ranjha", name: "mobile-collection", slug: "ranjha-isp-suite", label: "Ranjha collections", position: "center top", z: 5 },
  { project: "campost", name: "mobile-login", slug: "campost-money", label: "Campost Money", z: 8 },
  { project: "ifight", name: "network-map", slug: "ifight", label: "iFight network map", z: 8 },
  { project: "ranjha", name: "mobile-home", slug: "ranjha-isp-suite", label: "Ranjha field app", position: "center 30%", z: 3 },
  { project: "dowson", name: "home", slug: "dowson-mes", label: "Dowson MES", position: "left center", z: 2 },
  { project: "ranjha", name: "sms-gateway", slug: "ranjha-isp-suite", label: "Ranjha SMS gateway", position: "center top", z: 7 },
  { project: "thermox", name: "home", slug: "thermox", label: "Thermox", z: 7 },
];

const curtainItems: CurtainItem[] = deck.map((d) => {
  const s = shot(d);
  return { src: s.src, srcSet: s.srcSet, alt: `${d.label} screen`, label: d.label, href: `/work/${d.slug}/`, position: d.position, z: d.z };
});

function CardVisual({ p }: { p: Project }) {
  if (p.visual === "praxis") return <PraxisVisual />;

  if (p.cover.frame === "phone") {
    const phones = p.gallery.filter((g) => g.frame === "phone").slice(0, 5);
    return (
      <div className="mx-auto flex w-full max-w-[460px] items-start justify-center gap-5">
        <ShowcaseCarousel slides={phones} frame="phone" className="w-[48%]" />
        {p.coverExtra && (
          <div className="card-float mt-14 w-[44%] rotate-3">
            <PhoneFrame>
              <Shot shotRef={p.coverExtra} alt={`${p.name} second screen`} sizes="220px" />
            </PhoneFrame>
          </div>
        )}
      </div>
    );
  }

  const slides = [p.cover, ...p.gallery.filter((g) => g.frame === "browser" && g.name !== p.cover.name)].slice(0, 5);
  const phone = p.coverExtra?.frame === "phone" ? p.coverExtra : undefined;
  return (
    <div className="relative w-full">
      <ShowcaseCarousel slides={slides} frame="browser" url={p.cover.url} />
      {phone && (
        <div className="card-float absolute -bottom-4 -right-2 w-[24%] min-w-[96px] sm:-right-4">
          <div className="animate-[bob_6s_ease-in-out_infinite]">
            <PhoneFrame>
              <Shot shotRef={phone} alt={`${p.name} mobile screen`} sizes="200px" />
            </PhoneFrame>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const href = `/work/${p.slug}/`;
  const live = p.links[0];

  return (
    <article
      className="project-card relative flex origin-top flex-col overflow-hidden rounded-[32px] border border-line shadow-[var(--shadow)] lg:min-h-[min(78vh,720px)] lg:rounded-[40px]"
      style={{
        background: `radial-gradient(80% 90% at 100% 0%, ${tint(p.slug)}2e, transparent 60%), radial-gradient(60% 70% at 0% 100%, ${tint(p.slug)}1a, transparent 60%), var(--surface)`,
      }}
    >
      <div className="relative grid h-full gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-5 lg:col-span-5 lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-fg px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-invert">{p.platforms.join(" · ")}</span>
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              {p.engagement} · {p.where}
            </span>
          </div>

          <div>
            <h3>
              <Link href={href} transitionTypes={["nav-forward"]} className="display block text-[clamp(2.2rem,4.2vw,4.4rem)] transition-colors hover:text-muted">
                {p.name}
              </Link>
            </h3>
            <p className="mt-3 max-w-md text-[17px] leading-relaxed text-muted">{p.tagline}</p>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-y border-line py-5">
            {p.impact.map((m) => (
              <div key={m.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs leading-snug text-muted">{m.label}</dt>
                <dd className="text-[clamp(1.35rem,1.9vw,1.9rem)] font-semibold tracking-tight">
                  <ImpactValue value={m.value} />
                </dd>
              </div>
            ))}
          </dl>

          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {p.stack.slice(0, 6).map((s) => (
              <li key={s}>
                <TechChip label={s} />
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href={href}
                transitionTypes={["nav-forward"]}
                className="group flex h-11 items-center gap-3 rounded-full bg-fg pl-5 pr-1 text-sm font-medium text-invert"
                aria-label={`${p.name}: view case study`}
              >
                View case study
                <span className="grid h-9 w-9 place-items-center rounded-full bg-invert/15 transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </Magnetic>
            {live && (
              <a
                href={live.href}
                target="_blank"
                rel="noopener"
                className="flex h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:bg-surface-2"
              >
                {live.label}
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>

        <div className="relative flex items-center lg:col-span-7" data-cursor="View">
          <ViewTransition name={`cover-${p.slug}`}>
            <div className="w-full">
              <CardVisual p={p} />
            </div>
          </ViewTransition>
        </div>
      </div>

      {/* Fades the card back as the next one slides over it */}
      <div aria-hidden className="card-dim pointer-events-none absolute inset-0 z-30 bg-bg opacity-0" />
    </article>
  );
}

export default function Work() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: cards stack; each one shrinks and fades as the next slides over it
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const wraps = gsap.utils.toArray<HTMLElement>(".project-wrap");
        wraps.forEach((wrap, i) => {
          const next = wraps[i + 1];
          if (!next) return;
          const card = wrap.querySelector<HTMLElement>(".project-card");
          const dim = wrap.querySelector<HTMLElement>(".card-dim");
          gsap
            .timeline({
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: () => `top ${parseFloat(getComputedStyle(next).top) || 96}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(card, { scale: 0.92, ease: "none" }, 0)
            .to(dim, { opacity: 0.55, ease: "none" }, 0);
        });
        ScrollTrigger.refresh();
      });
      // The floating phone in each card rises in the first time it arrives
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        const floats = card.querySelectorAll(".card-float");
        if (!floats.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        gsap.from(floats, { y: 80, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 75%", once: true } });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="work" className="container-page scroll-mt-20 pb-20 sm:pb-28">
      <CurtainSplitHero
        items={curtainItems}
        eyebrow="Selected work"
        title={
          <>
            Six products, <span className="iris-text">four continents.</span>
          </>
        }
        description="From an internet provider's billing system to a UK sports network and an AI renovation planner."
      />

      <div className="mt-20 space-y-6 sm:mt-28 lg:space-y-0">
        {projects.map((p, i) => (
          <div key={p.slug} className="project-wrap lg:sticky lg:pb-[12vh] lg:last:pb-0" style={{ top: `calc(5.5rem + ${i * 16}px)` }}>
            <ProjectCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
