"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Briefcase, GraduationCap, Rocket } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import { Shot } from "../Frames";
import { education, experience } from "@/content/site";
import { moreProjects, projects } from "@/content/projects";
import { tint } from "@/lib/tints";

const icons = [Briefcase, Rocket];
const reach = ["UK · Australia · Cameroon", "Pakistan · 6,000+ subscribers"];

function trackSpot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Experience() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".xp-card", {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".xp-grid", start: "top 82%", once: true },
      });
      gsap.from(".xp-thumb", {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".xp-grid", start: "top 70%", once: true },
      });
      gsap.from(".xp-edu", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".xp-edu", start: "top 90%", once: true },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="experience" className="container-page scroll-mt-20 py-20 sm:py-28">
      <SectionHead label="Experience">
        <Reveal as="h2" className="display text-[clamp(2.4rem,5.5vw,5.5rem)]">
          Where the work <span className="text-faint">happens.</span>
        </Reveal>
      </SectionHead>

      <div className="xp-grid grid gap-4 lg:grid-cols-2">
        {experience.map((e, i) => {
          const Icon = icons[i] ?? Briefcase;
          return (
            <article
              key={e.org}
              onPointerMove={trackSpot}
              className="xp-card spot flex flex-col rounded-[28px] border border-line bg-surface p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-fg text-invert">
                  <Icon size={20} />
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                  {e.kind}
                </span>
              </div>
              <h3 className="mt-8 text-3xl font-medium tracking-tight sm:text-4xl">{e.title}</h3>
              <p className="mt-1 text-xl text-muted">{e.org}</p>
              <p className="mt-5 max-w-xl leading-relaxed text-muted">{e.summary}</p>

              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {e.projects.map((name) => {
                  const p = projects.find((x) => x.name === name);
                  // Side projects without a case study still get their screenshot
                  const thumb = p?.cover ?? moreProjects.find((m) => m.name === name)?.shot;
                  const inner = (
                    <>
                      <div
                        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line"
                        style={{ background: p ? `radial-gradient(90% 90% at 100% 0%, ${tint(p.slug)}33, transparent 70%), var(--surface-2)` : "var(--surface-2)" }}
                      >
                        {thumb && (
                          <div className={`absolute ${thumb.frame === "phone" ? "inset-x-[30%] top-3" : "inset-x-3 top-3"} transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 group-hover:scale-[1.04]`}>
                            <Shot shotRef={thumb} alt="" sizes="160px" className="rounded-md shadow-md" />
                          </div>
                        )}
                      </div>
                      <span className="mt-2 flex items-center justify-between gap-1 text-sm">
                        <span className="truncate">{name}</span>
                        {p && <ArrowUpRight size={14} className="shrink-0 text-muted transition-transform duration-500 group-hover:rotate-45 group-hover:text-fg" />}
                      </span>
                    </>
                  );
                  return (
                    <li key={name} className="xp-thumb">
                      {p ? (
                        <Link href={`/work/${p.slug}/`} transitionTypes={["nav-forward"]} className="group block" data-cursor="Open">
                          {inner}
                        </Link>
                      ) : (
                        <div className="group block">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-auto pt-8 font-mono text-[11px] uppercase tracking-wider text-faint">{reach[i]}</p>
            </article>
          );
        })}
      </div>

      <div className="xp-edu mt-4 flex flex-col gap-6 rounded-[28px] border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line">
          <GraduationCap size={20} />
        </span>
        <div className="flex-1">
          <p className="label">Education</p>
          <p className="mt-1 text-2xl font-medium tracking-tight">{education.degree}</p>
        </div>
        <p className="text-lg text-muted">{education.school}</p>
      </div>
    </section>
  );
}
