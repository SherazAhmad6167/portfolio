"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { Globe, Layers, MessageSquare, Users } from "lucide-react";
import { places, stats } from "@/content/site";
import { projects } from "@/content/projects";
import { tint } from "@/lib/tints";
import { Shot } from "../Frames";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
// Subscribers, SMS, platforms, continents (same order as `stats`)
const statIcons = [Users, MessageSquare, Layers, Globe];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [n, setN] = useState(value);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(0, value, { duration: 2, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en-US")}
      <span className="iris-text">{suffix}</span>
    </span>
  );
}

function trackSpot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** One bento tile: the number on top, its picture underneath. */
function Tile({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const s = stats[index];
  const Icon = statIcons[index];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease, delay: (index % 2) * 0.12 }}
      onPointerMove={trackSpot}
      className={cn("spot flex flex-col gap-8 overflow-hidden rounded-[28px] border border-line bg-surface p-6 shadow-[var(--shadow)] sm:p-8", className)}
    >
      <div className="flex flex-col">
        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-2 text-fg">
          <Icon size={17} strokeWidth={1.8} />
        </span>
        <dd className="display order-2 mt-4 text-[clamp(3rem,6vw,5.25rem)] leading-none">
          <Counter value={s.value} suffix={s.suffix} />
        </dd>
        <dt className="order-3 mt-3 max-w-[32ch] text-sm leading-snug text-muted">{s.label}</dt>
      </div>
      <div className="mt-auto">{children}</div>
    </motion.div>
  );
}

// Each dot stands for 25 homes; a handful pulse like routers coming online
const COLS = 30;
const ROWS = 8;
function Subscribers() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div>
      <div ref={ref} className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} aria-hidden>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const live = (i * 37) % 23 === 0;
          return (
            <span
              key={i}
              className={cn("aspect-square rounded-full transition-[background-color,scale] duration-700", on ? "scale-100" : "scale-50 bg-fg/10", live && on && "animate-[dot-pulse_2.6s_ease-in-out_infinite]")}
              style={{
                backgroundColor: on ? `hsl(${200 + (c / COLS) * 130} 85% ${live ? 62 : 72}%)` : undefined,
                transitionDelay: `${(c + r * 2) * 22}ms`,
                animationDelay: live ? `${1.5 + (i % 7) * 0.35}s` : undefined,
              }}
            />
          );
        })}
      </div>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-faint">Each dot ≈ 25 homes on the network</p>
    </div>
  );
}

// Two weeks of gateway traffic: ordinary days sit at 200–1,000, notices and greetings spike
const days: { v: number; kind?: "notice" | "greeting" }[] = [
  { v: 420 }, { v: 610 }, { v: 380 }, { v: 890 }, { v: 540 }, { v: 720 }, { v: 300 },
  { v: 5200, kind: "notice" }, { v: 650 }, { v: 480 }, { v: 12400, kind: "greeting" }, { v: 830 }, { v: 560 }, { v: 700 },
];
const peak = Math.sqrt(Math.max(...days.map((d) => d.v)));
function SmsBars() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div>
      <div ref={ref} className="relative flex h-40 items-end gap-1.5 sm:gap-2" aria-hidden>
        {days.map((d, i) => (
          <span
            key={i}
            className={cn(
              "relative flex-1 origin-bottom rounded-t-md rounded-b-sm transition-[scale] duration-1000 ease-out-expo",
              on ? "scale-y-100" : "scale-y-0",
              d.kind === "greeting" ? "bg-[linear-gradient(180deg,#f472b6,#a78bfa_55%,#7dd3fc)]" : d.kind === "notice" ? "bg-fg/30" : "bg-fg/12",
            )}
            style={{ height: `${(Math.sqrt(d.v) / peak) * 100}%`, transitionDelay: `${i * 45}ms` }}
          >
            {d.kind === "greeting" && (
              <span
                className={cn(
                  "absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2.5 py-1 font-mono text-[11px] text-invert transition-[opacity,translate] delay-1000 duration-500",
                  on ? "opacity-100" : "translate-y-2 opacity-0",
                )}
              >
                12,000+
              </span>
            )}
          </span>
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-faint">
        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fg/15" />Daily</li>
        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fg/35" />Maintenance notice</li>
        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#f472b6,#7dd3fc)]" />Greeting broadcast</li>
      </ul>
    </div>
  );
}

/** The six shipped products as small live tiles, each opening its case study. */
function Platforms() {
  const ref = useRef<HTMLUListElement>(null);
  const on = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <ul ref={ref} className="grid grid-cols-3 gap-2 sm:gap-3">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          className={cn("transition-[opacity,scale,translate] duration-700 ease-out-expo", on ? "opacity-100" : "translate-y-4 scale-90 opacity-0")}
          style={{ transitionDelay: `${150 + i * 80}ms` }}
        >
          <Link
            href={`/work/${p.slug}/`}
            transitionTypes={["nav-forward"]}
            className="group/t relative block aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface-2"
            style={{ ["--t" as string]: tint(p.slug) }}
          >
            <Shot shotRef={p.cover} alt="" sizes="180px" className="h-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover/t:scale-110" />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,color-mix(in_oklab,var(--t)_70%,black))] opacity-80 transition-opacity group-hover/t:opacity-100" />
            <span className="absolute inset-x-2 bottom-1.5 truncate text-[11px] font-medium text-white sm:text-xs">{p.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Dotted world map clipped to 80°N–60°S, with arcs flying out from home
const W = 360;
const H = 140;
// Labels sit over open ocean where possible
const labelLeft = new Set(["uk", "cm", "au"]);
const px = (lng: number) => lng + 180;
const py = (lat: number) => 80 - lat;
function WorldMap() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-15% 0px" });
  const [land, setLand] = useState("");
  const home = places.find((p) => p.home) ?? places[0];
  const others = places.filter((p) => p !== home);

  useEffect(() => {
    import("@/content/globe-land.json").then((m) => {
      const a = m.default as number[];
      let d = "";
      for (let i = 0; i < a.length; i += 2) {
        const lat = a[i] / 10;
        if (lat > 80 || lat < -60) continue;
        d += `M${px(a[i + 1] / 10).toFixed(1)} ${py(lat).toFixed(1)}h0`;
      }
      setLand(d);
    });
  }, []);

  const arc = (to: (typeof places)[number]) => {
    const [x1, y1, x2, y2] = [px(home.lng), py(home.lat), px(to.lng), py(to.lat)];
    const lift = Math.hypot(x2 - x1, y2 - y1) * 0.35;
    return `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
  };

  return (
    <div ref={ref} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="stats-arc" x1="0" x2="1">
            <stop offset="0" stopColor="#f472b6" />
            <stop offset="0.5" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
        <path d={land} stroke="currentColor" strokeWidth={1.15} strokeLinecap="round" className={cn("text-fg/25 transition-opacity duration-1000", land ? "opacity-100" : "opacity-0")} />
        {others.map((p, i) => (
          <g key={p.id}>
            <motion.path
              d={arc(p)}
              fill="none"
              stroke="url(#stats-arc)"
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={on ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.6, ease, delay: 0.3 + i * 0.25 }}
            />
            {/* A spark that keeps travelling along each route */}
            <path
              d={arc(p)}
              pathLength={100}
              fill="none"
              stroke="#fff"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeDasharray="5 100"
              className={cn("animate-[arc-run_3.4s_linear_infinite] drop-shadow-[0_0_2px_#a78bfa] transition-opacity", on ? "opacity-100 delay-[2200ms]" : "opacity-0")}
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          </g>
        ))}
      </svg>

      {places.map((p, i) => {
        const left = labelLeft.has(p.id);
        return (
          <Link
            key={p.id}
            href={p.href}
            transitionTypes={["nav-forward"]}
            className={cn(
              "group/pin absolute flex -translate-y-1/2 items-center gap-2 transition-[opacity,scale] duration-700 ease-out-expo before:absolute before:-inset-2 before:content-['']",
              left ? "flex-row-reverse -translate-x-[calc(100%-6px)]" : "-translate-x-[6px]",
              on ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
            style={{ left: `${(px(p.lng) / W) * 100}%`, top: `${(py(p.lat) / H) * 100}%`, transitionDelay: `${p.home ? 100 : 900 + i * 250}ms` }}
          >
            <span className="relative grid h-3 w-3 place-items-center">
              <span className={cn("absolute inset-0 animate-ping rounded-full", p.home ? "bg-[#a78bfa]/60" : "bg-fg/25")} />
              <span className={cn("relative rounded-full ring-2 ring-surface", p.home ? "orb-dot h-3.5 w-3.5" : "h-2.5 w-2.5 bg-fg")} />
            </span>
            <span className="whitespace-nowrap rounded-full border border-line bg-surface/90 px-2.5 py-1 text-[11px] shadow-[var(--shadow)] backdrop-blur transition-colors group-hover/pin:border-line-strong">
              {p.label}
              <span className="hidden text-muted sm:inline"> · {p.sub.replace("Home · ", "")}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function Stats() {
  return (
    <section aria-label="Numbers" className="container-page py-20 sm:py-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <p className="label flex items-center gap-2">
          <span className="orb-dot inline-block h-3 w-3" />
          By the numbers
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">Real users, real traffic. Every figure here comes from software running in production.</p>
      </div>

      <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Tile index={0} className="md:col-span-2 lg:col-span-7">
          <Subscribers />
        </Tile>
        <Tile index={1} className="lg:col-span-5">
          <SmsBars />
        </Tile>
        <Tile index={2} className="lg:col-span-5">
          <Platforms />
        </Tile>
        <Tile index={3} className="md:col-span-2 lg:col-span-7">
          <WorldMap />
        </Tile>
      </dl>
    </section>
  );
}
