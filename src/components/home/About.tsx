"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, GraduationCap, Printer, Router, ScanLine, Smartphone } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "../Reveal";
import SectionHead from "../SectionHead";
import PortraitCard from "./PortraitCard";
import { education, site } from "@/content/site";

const bio =
  "I'm a full-stack engineer from Pakistan. At Technoverse I build client platforms for teams in the UK, Australia and Cameroon. On my own, I built the complete software that runs a local internet provider.";

const hardware = [
  { icon: Router, label: "MikroTik routers", note: "PPPoE users from the admin panel" },
  { icon: Printer, label: "Thermal printers", note: "Receipts over Bluetooth, even in Urdu" },
  { icon: Smartphone, label: "Android SIM gateways", note: "Thousands of SMS on peak days" },
  { icon: ScanLine, label: "QR and barcode scanners", note: "Labels on a factory floor" },
];

const values = ["Fast for the people using it", "Honest about errors", "Easy for non-technical teams", "Kept running after launch"];

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: site.timezone }).format(d);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {now ? fmt(now) : "--:--:--"}
    </span>
  );
}

function trackSpot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

const tile = "about-tile spot rounded-[24px] border border-line bg-surface p-6";

export default function About() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Words brighten one by one as the paragraph scrolls through view
      gsap.fromTo(
        ".about-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: ".about-bio", start: "top 82%", end: "bottom 55%", scrub: true },
        },
      );
      gsap.from(".about-tile", {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".about-grid", start: "top 85%", once: true },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="about" className="container-page scroll-mt-20 py-20 sm:py-28">
      <SectionHead label="About">
        <Reveal as="h2" className="display text-[clamp(2.4rem,5.5vw,5.5rem)]">
          I like software that leaves the screen and <span className="text-faint">does something real.</span>
        </Reveal>
      </SectionHead>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
          <PortraitCard />
        </div>

        <div className="lg:col-span-7">
          <p className="about-bio text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-[1.25] tracking-[-0.02em]">
            {bio.split(" ").map((w, i) => (
              <span key={i} className="about-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            I enjoy the whole journey: shaping the idea, designing the screens, writing the APIs, wiring up payments, AI and
            hardware, and keeping it all running after launch.
          </p>

          <div className="about-grid mt-12 grid gap-3 sm:grid-cols-2">
            <div className={`${tile} sm:col-span-2`} onPointerMove={trackSpot}>
              <div className="flex items-start justify-between gap-4">
                <span className="label flex items-center gap-2">
                  <Briefcase size={14} /> Currently
                </span>
                <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Active
                </span>
              </div>
              <p className="mt-5 text-2xl font-medium tracking-tight sm:text-3xl">
                {site.role} <span className="text-muted">at</span> {site.company}
              </p>
              <p className="mt-1 text-muted">Plus freelance work: the full software suite for Ranjha 7 Star Internet.</p>
            </div>

            <div className={tile} onPointerMove={trackSpot}>
              <span className="label">Local time</span>
              <p className="display mt-5 text-5xl">
                <LiveClock />
              </p>
              <p className="mt-2 text-sm text-muted">{site.location} · PKT, UTC+5</p>
            </div>

            <div className={tile} onPointerMove={trackSpot}>
              <span className="label flex items-center gap-2">
                <GraduationCap size={14} /> Education
              </span>
              <p className="mt-5 text-xl font-medium leading-snug tracking-tight">{education.degree}</p>
              <p className="mt-1 text-sm text-muted">{education.school}</p>
            </div>

            <div className={`${tile} sm:col-span-2`} onPointerMove={trackSpot}>
              <span className="label">Hardware my code talks to</span>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {hardware.map(({ icon: Icon, label, note }) => (
                  <li key={label} className="group flex items-center gap-3 rounded-2xl border border-line bg-bg/50 p-3 transition-colors hover:border-line-strong">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-fg group-hover:text-invert">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-xs leading-snug text-muted">{note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${tile} sm:col-span-2`} onPointerMove={trackSpot}>
              <span className="label">What I care about</span>
              <ul className="mt-5 flex flex-wrap gap-2">
                {values.map((v) => (
                  <li key={v} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm">
                    <span aria-hidden className="orb-dot inline-block h-2.5 w-2.5" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
