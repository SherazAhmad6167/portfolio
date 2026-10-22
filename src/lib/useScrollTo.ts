"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";

/** Smooth-scrolls to a home-page section, navigating home first when needed. */
export function useScrollTo() {
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  return (id: string) => {
    if (id === "top") {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    } else {
      router.push(`/#${id}`);
    }
  };
}
