"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Mail, Play, Plus, RotateCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pointer that reacts to what it is over:
 * - free: a dot plus a ring that trails behind and stretches with speed
 * - buttons and small links: the ring wraps the element with an iridescent outline
 * - large links: the ring swells
 * - text fields: the ring becomes a caret
 * - data-cursor="View" (any word): a pill with that word; data-cursor="hide" hides it
 * Clicking squeezes the ring and sends out a ripple. Off on touch screens and reduced motion.
 */
type Mode = "idle" | "wrap" | "grow" | "label" | "text" | "hide";

const INTERACTIVE = "[data-cursor], a, button, [role=button], label, select, summary, input, textarea, [contenteditable=true]";
const TEXT_FIELD = "textarea, [contenteditable=true], input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=range])";
const icons: Record<string, LucideIcon> = { View: ArrowUpRight, Open: ArrowUpRight, Next: ArrowRight, Zoom: Plus, Spin: RotateCw, Email: Mail, Play };

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    let m: Mode = "idle";
    let target: HTMLElement | null = null;
    let radius = 0;
    let caret = 24;
    let x = -100, y = -100, lastX = x, lastY = y;
    let cx = x, cy = y, cw = 32, ch = 32, cr = 16;
    let vx = 0, vy = 0, press = 1, pressTo = 1;
    let raf = 0;

    const set = (next: Mode, el: HTMLElement | null = null, text = "") => {
      m = next;
      target = el;
      setMode(next);
      if (text) setLabel(text);
    };

    const detect = (el: Element | null) => {
      // Match the theme of the section underneath (Contact and the footer are always dark)
      setDark(el?.closest("[data-theme]")?.getAttribute("data-theme") === "dark");
      const t = el?.closest<HTMLElement>(INTERACTIVE) ?? null;
      if (!t) return set("idle");
      const c = t.dataset.cursor;
      if (c === "hide") return set("hide");
      if (c) return set("label", t, c);
      if (t.matches(TEXT_FIELD)) {
        caret = Math.min(parseFloat(getComputedStyle(t).fontSize) * 1.35, 34);
        return set("text", t);
      }
      const r = t.getBoundingClientRect();
      if (r.width > 420 || r.height > 120) return set("grow", t);
      const br = parseFloat(getComputedStyle(t).borderTopLeftRadius) || 6;
      radius = Math.min(br, r.height / 2);
      set("wrap", t);
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      detect(e.target as Element);
    };
    // Smooth scrolling moves elements under a still pointer, so look again on scroll
    const scroll = () => detect(document.elementFromPoint(x, y));
    const leave = () => set("hide");
    const down = () => {
      pressTo = 0.82;
      const r = document.createElement("span");
      r.className = "cursor-ripple";
      r.style.left = `${x}px`;
      r.style.top = `${y}px`;
      r.addEventListener("animationend", () => r.remove());
      layer.current?.appendChild(r);
    };
    const up = () => (pressTo = 1);

    const tick = () => {
      let tx = x, ty = y, tw = 32, th = 32, tr = 16, k = 0.2;
      if (target && !target.isConnected) set("idle");

      if (m === "wrap" && target) {
        const r = target.getBoundingClientRect();
        const pad = 6;
        const mx = r.left + r.width / 2;
        const my = r.top + r.height / 2;
        tw = r.width + pad * 2;
        th = r.height + pad * 2;
        tr = Math.min(radius + pad, th / 2);
        // Leans a little toward the pointer, like it is being pulled
        tx = mx + (x - mx) * 0.1;
        ty = my + (y - my) * 0.1;
        k = 0.26;
      } else if (m === "grow") {
        tw = th = 68;
        tr = 34;
      } else if (m === "label") {
        th = 46;
        tw = Math.max(46, (labelRef.current?.offsetWidth ?? 40) + 34);
        tr = 23;
      } else if (m === "text") {
        tw = 2.5;
        th = caret;
        tr = 2;
        k = 0.35;
      }

      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      cw += (tw - cw) * 0.22;
      ch += (th - ch) * 0.22;
      cr += (tr - cr) * 0.22;
      press += (pressTo - press) * 0.25;

      vx += (x - lastX - vx) * 0.25;
      vy += (y - lastY - vy) * 0.25;
      lastX = x;
      lastY = y;
      const stretch = m === "idle" ? Math.min(Math.hypot(vx, vy) / 40, 0.55) : 0;
      const angle = m === "idle" ? (Math.atan2(vy, vx) * 180) / Math.PI : 0;

      const el = ring.current;
      if (el) {
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.borderRadius = `${cr}px`;
        el.style.transform = `translate3d(${cx - cw / 2}px, ${cy - ch / 2}px, 0) rotate(${angle}deg) scale(${(1 + stretch) * press}, ${(1 - stretch * 0.5) * press})`;
      }
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0) scale(${press})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  const Icon = icons[label];
  // The plain dot, ring and caret are white and inverted against whatever is below,
  // so they stay visible on light pages, dark sections and screenshots alike
  const blend = mode === "idle" || mode === "text";
  return (
    <div
      ref={layer}
      aria-hidden
      data-theme={dark ? "dark" : undefined}
      className={cn("pointer-events-none fixed inset-0 z-[90]", blend && "mix-blend-difference")}
    >
      <div
        ref={ring}
        data-mode={mode}
        className={cn(
          "absolute left-0 top-0 flex items-center justify-center overflow-hidden border will-change-transform transition-[background-color,border-color,opacity,box-shadow] duration-300",
          mode === "idle" && "border-white/70 bg-transparent",
          mode === "wrap" && "border-transparent bg-[#a78bfa]/[0.1] shadow-[0_0_24px_-6px_rgb(167_139_250/0.55)]",
          mode === "grow" && "border-line-strong bg-[#a78bfa]/15 backdrop-blur-[2px]",
          mode === "label" && "border-transparent bg-fg shadow-[0_10px_30px_-10px_rgb(0_0_0/0.4)]",
          mode === "text" && "border-transparent bg-white",
          mode === "hide" && "opacity-0",
        )}
      >
        <span className={cn("iris-ring transition-opacity duration-300", mode === "wrap" || mode === "label" ? "opacity-100" : "opacity-0")} />
        <span
          ref={labelRef}
          className={cn(
            "flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-widest text-invert transition-[opacity,translate] duration-300",
            mode === "label" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {label}
          {Icon && <Icon size={13} strokeWidth={2.2} />}
        </span>
      </div>
      <div
        ref={dot}
        className={cn(
          "absolute left-0 top-0 h-1.5 w-1.5 rounded-full transition-opacity duration-200 will-change-transform",
          blend ? "bg-white" : "bg-fg",
          mode === "idle" || mode === "grow" ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
