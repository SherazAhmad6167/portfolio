"use client";

// Screen-recording player. The file only downloads once the clip nears the screen,
// and it plays (muted, looping) only while visible.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Play, X } from "lucide-react";
import { PhoneFrame } from "../Frames";
import { asset } from "@/lib/media";
import { cn } from "@/lib/utils";

export type VideoRef = { src: string; poster: string; w: number; h: number; length: string };

export function DemoVideo({ video, label, controls = false, className }: { video: VideoRef; label: string; controls?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !controls;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return v.pause();
        if (!v.getAttribute("src")) v.src = asset(video.src);
        if (!still) v.play().catch(() => {});
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [video.src, controls]);

  return (
    <video
      ref={ref}
      poster={asset(video.poster)}
      width={video.w}
      height={video.h}
      muted
      loop
      playsInline
      preload="none"
      controls={controls}
      aria-label={label}
      className={cn("block h-auto w-full bg-black", className)}
    />
  );
}

/** Card preview that plays on its own; clicking opens the full recording in a lightbox. */
export function VideoShowcase({ video, name }: { video: VideoRef; name: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", key);
    };
  }, [open, lenis]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="Play"
        className="absolute inset-0 px-8 pt-8 text-left"
        aria-label={`Play the ${name} demo video (${video.length})`}
      >
        <span className="mx-auto block w-[44%] transition-transform duration-700 ease-out-expo group-hover:-translate-y-3">
          <PhoneFrame>
            <DemoVideo video={video} label={`${name} demo`} />
          </PhoneFrame>
        </span>
        <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-fg py-1.5 pl-1.5 pr-3 text-xs font-medium text-invert shadow-[var(--shadow)] transition-transform duration-500 ease-out-expo group-hover:scale-105">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ef233c] text-white">
            <Play size={11} fill="currentColor" />
          </span>
          Watch demo · {video.length}
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="video"
                role="dialog"
                aria-modal="true"
                aria-label={`${name} demo video`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-md"
                onClick={() => setOpen(false)}
                data-lenis-prevent
              >
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative"
                  style={{ width: `min(90vw, calc(min(86vh, 820px) * ${video.w / video.h}))` }}
                >
                  <PhoneFrame>
                    <DemoVideo video={video} label={`${name} demo`} controls />
                  </PhoneFrame>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-lg sm:-right-14 sm:top-0"
                    aria-label="Close video"
                    autoFocus
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
