"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Framed } from "../Frames";
import { shot, type ShotRef } from "@/lib/media";

export default function Gallery({ shots, name }: { shots: ShotRef[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const desktop = shots.map((s, i) => ({ s, i })).filter(({ s }) => s.frame === "browser");
  const phones = shots.map((s, i) => ({ s, i })).filter(({ s }) => s.frame === "phone");

  useEffect(() => {
    if (open === null) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shots.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shots.length) % shots.length));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, lenis, shots.length]);

  const tile = (s: ShotRef, i: number, sizes: string) => (
    <figure key={s.name} className="group">
      <button
        type="button"
        onClick={() => setOpen(i)}
        className="block w-full text-left transition-transform duration-700 ease-out-expo hover:-translate-y-1.5"
        data-cursor="Zoom"
        aria-label={`Enlarge: ${s.caption ?? s.name}`}
      >
        <motion.div layoutId={`shot-${s.name}`}>
          <Framed shotRef={s} alt={s.caption ?? `${name} screen`} sizes={sizes} />
        </motion.div>
      </button>
      {s.caption && <figcaption className="mt-3 font-mono text-xs text-muted">{s.caption}</figcaption>}
    </figure>
  );

  const current = open !== null ? shots[open] : null;
  const full = current ? shot(current) : null;

  return (
    <>
      {desktop.length > 0 && (
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {desktop.map(({ s, i }, n) => (
            <div key={s.name} className={desktop.length % 2 === 1 && n === 0 ? "md:col-span-2" : ""}>
              {tile(s, i, desktop.length % 2 === 1 && n === 0 ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 768px) 45vw, 100vw")}
            </div>
          ))}
        </div>
      )}
      {phones.length > 0 && (
        <div className={`grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 ${desktop.length ? "mt-16" : ""}`}>
          {phones.map(({ s, i }) => tile(s, i, "(min-width: 1024px) 18vw, 45vw"))}
        </div>
      )}

      <AnimatePresence>
        {current && full && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex flex-col bg-bg/90 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={current.caption ?? "Screenshot"}
            onClick={() => setOpen(null)}
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-8">
              <p className="font-mono text-xs text-muted">
                {(open ?? 0) + 1} of {shots.length} · {current.caption}
              </p>
              <button type="button" onClick={() => setOpen(null)} className="grid h-11 w-11 place-items-center rounded-full border border-line" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-20">
              <motion.div
                layoutId={`shot-${current.name}`}
                className="max-h-full"
                onClick={(e) => e.stopPropagation()}
                style={{ aspectRatio: `${full.width} / ${full.height}`, height: current.frame === "phone" ? "100%" : "auto", width: current.frame === "phone" ? "auto" : "min(100%, 1400px)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={full.src} alt={current.caption ?? ""} className="h-full w-full rounded-xl object-contain" />
              </motion.div>
              {shots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen((o) => (o === null ? o : (o - 1 + shots.length) % shots.length));
                    }}
                    className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface sm:left-6"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen((o) => (o === null ? o : (o + 1) % shots.length));
                    }}
                    className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface sm:right-6"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
