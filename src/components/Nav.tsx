"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Command } from "lucide-react";
import Avatar from "./Avatar";
import Magnetic from "./Magnetic";
import ThemeToggle from "./ThemeToggle";
import LocalTime from "./LocalTime";
import RollText from "./ui/roll-text";
import { openPalette } from "@/lib/theme";
import { useScrollTo } from "@/lib/useScrollTo";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const ease = [0.16, 1, 0.3, 1] as const;

/** Avatar wrapped in a ring that fills as the page scrolls. */
function ProgressLogo() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <span className="relative grid h-9 w-9 shrink-0 place-items-center">
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="nav-progress" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="0.5" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg/10" />
        <motion.circle cx="18" cy="18" r="16.5" fill="none" stroke="url(#nav-progress)" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: progress }} />
      </svg>
      <span className="transition-transform duration-500 ease-out-expo group-hover/logo:scale-110">
        <Avatar size={28} />
      </span>
    </span>
  );
}

/** Two bars that fold into an X. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-4" aria-hidden>
      <motion.span
        className="absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current"
        animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: 0, rotate: 0, y: 0 }}
        transition={{ duration: 0.45, ease }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-[1.5px] rounded-full bg-current"
        animate={open ? { bottom: "50%", rotate: -45, y: "50%", width: "100%" } : { bottom: 0, rotate: 0, y: 0, width: "62%" }}
        transition={{ duration: 0.45, ease }}
      />
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [overDark, setOverDark] = useState(false);
  const scrollTo = useScrollTo();
  const pathname = usePathname();

  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  // Switch the bar to dark styling while it sits over a section that is always dark
  useEffect(() => {
    const targets = document.querySelectorAll("main [data-theme='dark'], footer[data-theme='dark']");
    if (!targets.length) return;
    const inside = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inside.add(e.target) : inside.delete(e.target)));
        setOverDark(inside.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => setActive(pathname.startsWith("/work") ? "work" : null), [pathname]);

  useLenis(({ scroll }) => {
    setScrolled(scroll > 40);
    if (pathname !== "/") return;
    // The section crossing the upper middle of the screen is the active one
    const line = window.innerHeight * 0.45;
    let current: string | null = null;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= line) current = s.id;
    }
    setActive(current);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  const pill = hovered ?? active;

  return (
    <>
      <header className="container-page pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 text-fg" data-theme={overDark ? "dark" : undefined}>
        <nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto relative mx-auto grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full border transition-[max-width,padding,background-color,border-color,box-shadow] duration-700 ease-out-expo",
            scrolled || open
              ? "max-w-[980px] border-line bg-bg/70 pl-2 pr-2 shadow-[0_12px_40px_-16px_rgb(0_0_0/0.28)] backdrop-blur-xl backdrop-saturate-150"
              : "max-w-full border-transparent pl-0 pr-0",
          )}
        >
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            onClick={(e) => {
              if (pathname !== "/") return;
              e.preventDefault();
              go("top");
            }}
            className="group/logo group/roll flex items-center gap-2.5 justify-self-start rounded-full pr-2"
            aria-label={`${site.name}, home`}
          >
            <ProgressLogo />
            <RollText text={site.name} className="whitespace-nowrap text-[15px] font-medium tracking-tight" />
          </Link>

          <LayoutGroup id="nav">
            <ul className="hidden items-center lg:flex" onPointerLeave={() => setHovered(null)}>
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                    onPointerEnter={() => setHovered(s.id)}
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered(null)}
                    aria-current={active === s.id ? "true" : undefined}
                    className={cn(
                      "group/roll relative isolate flex items-baseline gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      pill === s.id || active === s.id ? "text-fg" : "text-muted",
                    )}
                  >
                    {pill === s.id && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-fg/[0.07]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                    <RollText text={s.label} />
                    {active === s.id && (
                      <motion.span layoutId="nav-active" className="orb-dot absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </LayoutGroup>

          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            <AnimatePresence initial={false}>
              {!scrolled && !open && (
                <motion.span
                  key="time"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.4, ease }}
                  className="mr-2 hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-muted 2xl:block"
                >
                  <LocalTime prefix="" suffix=" · Pakistan" />
                </motion.span>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={openPalette}
              className="hidden h-10 items-center gap-1 rounded-full border border-line px-3 font-mono text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
              aria-label="Open command menu"
            >
              <kbd className="grid h-5 min-w-5 place-items-center rounded-md bg-fg/[0.06] px-1 font-mono">{mac ? <Command size={11} /> : "Ctrl"}</kbd>
              <kbd className="grid h-5 w-5 place-items-center rounded-md bg-fg/[0.06] font-mono">K</kbd>
            </button>
            <ThemeToggle />
            <Magnetic className="hidden lg:block" strength={0.25}>
              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
                className="group/roll relative flex h-10 items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full bg-fg pl-4 pr-1.5 text-sm font-medium text-invert shadow-[0_8px_24px_-10px_rgb(167_139_250/0.7)] transition-shadow duration-500 hover:shadow-[0_10px_32px_-8px_rgb(167_139_250/0.95)]"
              >
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/70" />
                  <span className="relative h-2 w-2 rounded-full bg-[#4ade80]" />
                </span>
                <RollText text="Let's talk" />
                <span className="grid h-7 w-7 place-items-center rounded-full bg-invert/15 transition-transform duration-500 ease-out-expo group-hover/roll:rotate-45">
                  <ArrowUpRight size={14} />
                </span>
                {/* Light sweep on hover */}
                <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/roll:translate-x-[320%]" />
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:border-line-strong lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-bg pt-24 lg:hidden"
          >
            {/* Soft iridescent light behind the links */}
            <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#a78bfa]/25 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -left-20 bottom-24 h-72 w-72 rounded-full bg-[#7dd3fc]/25 blur-3xl" />

            <ul className="container-page relative flex flex-1 flex-col justify-center">
              {sections.map((s, i) => (
                <li key={s.id} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={`/#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease }}
                    className="group/roll flex items-center justify-between py-4"
                  >
                    <RollText text={s.label} className={cn("display text-5xl", active === s.id && "iris-text")} />
                    <ArrowUpRight size={22} className="text-muted transition-transform duration-500 group-hover/roll:rotate-45" />
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.5 } }}
              exit={{ opacity: 0 }}
              className="container-page relative flex flex-wrap items-center justify-between gap-3 py-6 font-mono text-xs text-muted"
            >
              <a href={`mailto:${site.email}`} className="text-fg">
                {site.email}
              </a>
              <span className="flex items-center gap-4">
                <LocalTime prefix="" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openPalette();
                  }}
                  className="rounded-full border border-line px-3 py-1.5"
                >
                  Search
                </button>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
