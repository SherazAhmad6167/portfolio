"use client";

// A sphere of logo tiles you can spin. Tiles are plain DOM elements placed by a small
// 3D projection each frame, so they stay crisp, focusable and easy to style.

import { useEffect, useRef } from "react";
import type { Tool } from "@/content/stack";
import ToolIcon, { toolColor } from "./tool-icon";
import { cn } from "@/lib/utils";

type CloudTool = Tool & { groups: string[] };

type Props = {
  tools: CloudTool[];
  /** Group to light up; others fade back. Null lights everything. */
  active: string | null;
  className?: string;
};

export default function IconCloud({ tools, active, className }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Spread the tiles evenly over a sphere
    const n = tools.length;
    const points = tools.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = Math.PI * (3 - Math.sqrt(5)) * i;
      return [Math.cos(t) * r, y, Math.sin(t) * r];
    });

    let ax = -0.25;
    let ay = 0;
    let vx = 0;
    let vy = reduced ? 0 : 0.0035;
    let hover = { x: 0, y: 0, on: false };
    let drag: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const { width } = el.getBoundingClientRect();
      const R = width * 0.38;

      if (!drag) {
        // Drift toward where the pointer is, or keep a gentle idle spin
        const ty = hover.on ? hover.x * 0.012 : reduced ? 0 : 0.0035;
        const tx = hover.on ? -hover.y * 0.008 : 0;
        vy += (ty - vy) * 0.06;
        vx += (tx - vx) * 0.06;
      }
      ay += vy;
      ax = Math.max(-1.1, Math.min(1.1, ax + vx));

      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const act = activeRef.current;
      points.forEach(([x0, y0, z0], i) => {
        const node = tiles.current[i];
        if (!node) return;
        const x1 = x0 * cy + z0 * sy;
        const z1 = -x0 * sy + z0 * cy;
        const y2 = y0 * cx - z1 * sx;
        const z2 = y0 * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back, 1 front
        const scale = 0.55 + depth * 0.65;
        const lit = !act || tools[i].groups.includes(act);
        node.style.transform = `translate3d(${x1 * R}px, ${y2 * R}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = String((0.18 + depth * 0.82) * (lit ? 1 : 0.22));
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.filter = lit ? "none" : "grayscale(1)";
        node.dataset.lit = lit && act ? "true" : "false";
      });
    };
    frame();

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (drag) {
        vy = (e.clientX - drag.x) * 0.004;
        vx = -(e.clientY - drag.y) * 0.003;
        drag = { x: e.clientX, y: e.clientY };
      } else {
        hover = { x: nx * 2, y: ny * 2, on: true };
      }
    };
    const onLeave = () => (hover = { ...hover, on: false });
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const onUp = () => (drag = null);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [tools]);

  return (
    <div ref={box} className={cn("relative touch-pan-y select-none", className)} data-cursor="Spin" role="group" aria-label="Tools I work with">
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {tools.map((t, i) => (
          <div
            key={t.name}
            ref={(n) => {
              tiles.current[i] = n;
            }}
            title={t.name}
            className="group/tile absolute left-0 top-0 will-change-transform"
            style={{ ["--tool" as string]: toolColor(t) }}
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)] transition-[box-shadow,border-color] duration-300 group-data-[lit=true]/tile:border-[color:var(--tool)] group-data-[lit=true]/tile:shadow-[0_0_0_4px_color-mix(in_srgb,var(--tool)_18%,transparent),0_12px_30px_-10px_color-mix(in_srgb,var(--tool)_60%,transparent)] sm:h-16 sm:w-16">
              <ToolIcon tool={t} size={28} />
            </div>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2 py-0.5 text-[11px] font-medium text-invert opacity-0 transition-opacity group-hover/tile:opacity-100">
              {t.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
