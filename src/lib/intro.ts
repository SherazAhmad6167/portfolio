"use client";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

/** Runs cb once the preloader has finished (or right away if it already has). */
export function onIntroDone(cb: () => void) {
  if (window.__introDone) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("intro-done", h, { once: true });
  return () => window.removeEventListener("intro-done", h);
}

export function markIntroDone() {
  window.__introDone = true;
  window.dispatchEvent(new Event("intro-done"));
}
