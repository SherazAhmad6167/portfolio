"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Keeps ScrollTrigger in step with Lenis and resets scroll on navigation. */
function LenisBridge() {
  const lenis = useLenis(ScrollTrigger.update);
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    if (prefersReducedMotion()) lenis.options.smoothWheel = false;
    if (process.env.NODE_ENV === "development") (window as unknown as { __lenis: typeof lenis }).__lenis = lenis;
  }, [lenis]);

  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  // Drive Lenis from GSAP's ticker so both share one frame loop
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    history.scrollRestoration = "manual";
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, anchors: { offset: -80 } }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
