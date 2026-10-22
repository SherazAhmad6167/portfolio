"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Database, Monitor, Plug, Plus, Rocket, Server, Smartphone, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import IconCloud from "@/components/ui/icon-cloud";
import ToolIcon from "@/components/ui/tool-icon";
import { allTools, toolGroups } from "@/content/stack";

const groupIcons: Record<string, LucideIcon> = { Frontend: Monitor, Mobile: Smartphone, Backend: Server, Data: Database, Integrations: Plug, Delivery: Rocket };

export default function Stack() {
  const scope = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(toolGroups[0].group);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? open;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".stack-row", {
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".stack-list", start: "top 85%", once: true },
      });
      gsap.from(".stack-cloud", {
        scale: 0.85,
        autoAlpha: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".stack-cloud", start: "top 85%", once: true },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="stack" className="container-page scroll-mt-20 py-20 sm:py-28">
      <SectionHead label="Stack">
        <Reveal as="h2" className="display text-[clamp(2.4rem,5.5vw,5.5rem)]">
          Tools I&apos;ve shipped with, <span className="text-faint">not just tried.</span>
        </Reveal>
        <p className="mt-6 max-w-lg text-lg text-muted">
          {allTools.length} tools, every one of them running in a project above. Pick a category to light it up.
        </p>
      </SectionHead>

      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="relative order-1 lg:order-2 lg:col-span-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.2),rgba(125,211,252,0.1)_60%,transparent)] blur-2xl"
          />
          <IconCloud tools={allTools} active={active} className="stack-cloud mx-auto aspect-square w-full max-w-[620px]" />
          <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-wider text-faint">Drag to spin · hover a tile for its name</p>
        </div>

        <ul className="stack-list order-2 border-t border-line lg:order-1 lg:col-span-5" onMouseLeave={() => setHovered(null)}>
          {toolGroups.map((g, i) => {
            const isOpen = open === g.group;
            return (
              <li key={g.group} className="stack-row border-b border-line" onMouseEnter={() => setHovered(g.group)}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : g.group)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 py-5 text-left"
                >
                  <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition-colors group-hover:text-fg">
                    {(() => {
                      const Icon = groupIcons[g.group] ?? Plug;
                      return <Icon size={16} strokeWidth={1.8} />;
                    })()}
                  </span>
                  <span className={`flex-1 text-2xl font-medium tracking-tight transition-colors sm:text-3xl ${active === g.group ? "text-fg" : "text-muted"}`}>
                    {g.group}
                  </span>
                  <span className="hidden -space-x-2 sm:flex">
                    {g.tools.slice(0, 4).map((t) => (
                      <span key={t.name} className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface">
                        <ToolIcon tool={t} size={15} />
                      </span>
                    ))}
                  </span>
                  <span className="font-mono text-xs text-muted">{g.tools.length}</span>
                  <Plus size={18} className={`text-muted transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="tools"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 pl-10 text-sm text-muted">{g.blurb}</p>
                      <ul className="flex flex-wrap gap-2 pb-6 pl-10">
                        {g.tools.map((t, ti) => (
                          <motion.li
                            key={t.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + ti * 0.035, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-2 pr-3.5 text-sm"
                          >
                            <ToolIcon tool={t} size={16} />
                            {t.name}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
