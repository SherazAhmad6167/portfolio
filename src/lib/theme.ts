"use client";

export type Theme = "dark" | "light";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Switches theme with a circular reveal that grows from the clicked point. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    apply();
    return;
  }
  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 40;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--tx", `${x}px`);
  root.style.setProperty("--ty", `${y}px`);
  root.style.setProperty("--tr", `${r}px`);
  root.classList.add("theme-switch");
  const t = document.startViewTransition(apply);
  t.finished.finally(() => root.classList.remove("theme-switch"));
}

export function openPalette() {
  window.dispatchEvent(new CustomEvent("open-palette"));
}
