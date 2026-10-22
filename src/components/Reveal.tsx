"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  children: React.ReactNode;
  className?: string;
  /** "scroll" waits for the element to enter the viewport; "intro" waits for the preloader */
  when?: "scroll" | "intro";
  delay?: number;
  by?: "lines" | "words";
};

/** Masked line-by-line text reveal. */
export default function Reveal({ as: Tag = "div", children, className, when = "scroll", delay = 0, by = "lines" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { visibility: "visible" });
        return;
      }
      let cleanup = () => {};
      const start = () => {
        const split = SplitText.create(el, {
          type: by === "lines" ? "lines" : "words,lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(by === "lines" ? self.lines : self.words, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: by === "lines" ? 0.09 : 0.03,
              delay,
              scrollTrigger: when === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
          },
        });
        cleanup = () => split.revert();
      };
      const off = when === "intro" ? onIntroDone(start) : (start(), () => {});
      return () => {
        off();
        cleanup();
      };
    },
    { dependencies: [] },
  );

  return (
    <Tag ref={ref as never} className={className} data-reveal>
      {children}
    </Tag>
  );
}
