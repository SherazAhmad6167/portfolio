"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Shot } from "../Frames";
import ToolIcon from "@/components/ui/tool-icon";
import { allTools } from "@/content/stack";
import { site } from "@/content/site";

// Logos that float around the portrait, each at its own depth and spot
const floaters = [
  { name: "React", x: "8%", y: "26%", depth: 70, delay: "0s" },
  { name: "Angular", x: "78%", y: "18%", depth: 55, delay: "-1.4s" },
  { name: "Kotlin", x: "82%", y: "52%", depth: 80, delay: "-2.6s" },
  { name: "Firestore", x: "4%", y: "58%", depth: 60, delay: "-3.2s" },
];

/** Photo on a living iridescent backdrop. Tilts in 3D with the pointer; layers move at different depths. */
export default function PortraitCard() {
  const scope = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = card.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((l) => ({
        d: Number(l.dataset.depth),
        x: gsap.quickTo(l, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(l, "y", { duration: 0.8, ease: "power3.out" }),
      }));
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        rx(-ny * 10);
        ry(nx * 12);
        layers.forEach((l) => {
          l.x(nx * l.d * 0.35);
          l.y(ny * l.d * 0.35);
        });
        el.style.setProperty("--shine-x", `${(nx + 0.5) * 100}%`);
        el.style.setProperty("--shine-y", `${(ny + 0.5) * 100}%`);
      };
      const leave = () => {
        rx(0);
        ry(0);
        layers.forEach((l) => {
          l.x(0);
          l.y(0);
        });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);

      gsap.from(el, {
        y: 60,
        rotationX: 14,
        autoAlpha: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="mx-auto w-full max-w-[460px] [perspective:1200px]">
      <div
        ref={card}
        className="portrait-card group relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-line shadow-[var(--shadow)] [container-type:inline-size]"
        data-cursor="Hi!"
      >
        {/* Living backdrop: soft colour blobs drifting over a tinted base */}
        <div aria-hidden className="absolute inset-0 bg-[#f1edff] dark:bg-[#15112a]">
          <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] animate-[float_12s_ease-in-out_infinite] rounded-full bg-[#c4b5fd] opacity-80 blur-3xl dark:bg-[#6d28d9] dark:opacity-50" />
          <div className="absolute -right-1/4 top-1/4 h-[70%] w-[70%] animate-[float_15s_ease-in-out_infinite_reverse] rounded-full bg-[#a5f3fc] opacity-80 blur-3xl dark:bg-[#0e7490] dark:opacity-45" />
          <div className="absolute -bottom-1/4 left-1/4 h-[70%] w-[70%] animate-[float_18s_ease-in-out_infinite] rounded-full bg-[#fbcfe8] opacity-80 blur-3xl dark:bg-[#be185d] dark:opacity-35" />
          <div className="absolute right-0 top-0 h-[40%] w-[40%] animate-[float_10s_ease-in-out_infinite_reverse] rounded-full bg-[#fde68a] opacity-60 blur-3xl dark:opacity-15" />
          <div
            className="absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 0.7) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />
        </div>

        {/* Name set huge behind the photo */}
        <p
          aria-hidden
          data-depth="-25"
          className="display pointer-events-none absolute inset-x-0 top-[9%] select-none text-center text-[24cqw] leading-none text-white/75 dark:text-white/10"
        >
          SHERAZ
        </p>

        {/* The photo */}
        <div data-depth="22" className="absolute inset-x-[4%] -bottom-3 top-[14%]">
          <div className="absolute inset-x-[18%] bottom-0 top-[20%] rounded-full bg-white/50 blur-3xl dark:bg-violet-500/25" aria-hidden />
          <div className="relative h-full w-full">
            <Shot
              shotRef={{ project: "me", name: "portrait" }}
              alt={`Portrait of ${site.fullName}`}
              sizes="460px"
              className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_20px_40px_rgba(30,20,60,0.35)]"
            />
          </div>
        </div>

        {/* Floating logos */}
        {floaters.map((f) => {
          const tool = allTools.find((t) => t.name === f.name);
          if (!tool) return null;
          return (
            <div key={f.name} data-depth={f.depth} className="absolute" style={{ left: f.x, top: f.y }}>
              <div
                className="grid h-12 w-12 animate-[bob_5s_ease-in-out_infinite] place-items-center rounded-2xl border border-white/60 bg-white/60 shadow-lg backdrop-blur-md dark:border-white/15 dark:bg-white/10"
                style={{ animationDelay: f.delay }}
                title={tool.name}
              >
                <ToolIcon tool={tool} size={22} />
              </div>
            </div>
          );
        })}

        {/* Status pill */}
        <div data-depth="40" className="absolute left-4 top-4">
          <span className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-[11px] font-medium text-[#0a0a0a] backdrop-blur-md dark:border-white/15 dark:bg-black/40 dark:text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {site.role} · {site.company}
          </span>
        </div>

        {/* Glass name bar */}
        <div data-depth="30" className="absolute inset-x-4 bottom-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/65 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-black/45">
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-[#0a0a0a] dark:text-white">{site.fullName}</p>
              <p className="text-xs text-[#52525b] dark:text-white/60">Full-stack engineer · {site.location}</p>
            </div>
            <span className="orb-dot inline-block h-8 w-8 shrink-0" />
          </div>
        </div>

        {/* Light that follows the pointer across the glass */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(600px circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,0.55), transparent 40%)" }}
        />
      </div>
    </div>
  );
}
