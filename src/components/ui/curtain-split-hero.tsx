"use client";

// Adapted from the 21st.dev "Curtain Split Hero". Changes from the original:
// - imports from "motion/react" (the current name of framer-motion, already installed)
// - progress follows page scroll through a sticky stage instead of hijacking the wheel,
//   so it plays nicely with Lenis smooth scrolling and touch screens
// - cards are links with labels, and items/text come in as props

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type CurtainItem = {
  src: string;
  srcSet?: string;
  alt: string;
  label: string;
  href: string;
  /** CSS object-position for the crop, e.g. "left center" */
  position?: string;
  /** Stacking order where cards overlap; higher sits on top */
  z?: number;
};

type Props = {
  items: CurtainItem[];
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
};

const SPRING_CONFIG = { stiffness: 65, damping: 22, mass: 0.5 };

type Stage = { width: number; height: number; isMobile: boolean };

type CardProps = {
  item: CurtainItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  isSpreadActive: boolean;
  stage: Stage;
};

function CurtainCard({ item, index, total, progress, pointer, isSpreadActive, stage }: CardProps) {
  const half = total / 2;
  const isLeft = index % 2 === 0;
  const wingIndex = Math.floor(index / 2);
  const norm = wingIndex / (half - 1) - 0.5; // -0.5 to 0.5
  const sideMult = isLeft ? -1 : 1;

  // Cards are sized from both the stage width and its height, so each wing's cards
  // fit top to bottom without overlapping on short screens
  const spread = stage.isMobile ? 0.62 : half >= 4 ? 0.76 : 0.58;
  const maxByHeight = (stage.height * spread) / Math.max(1, half - 1) / 1.06;
  const widthCap = stage.isMobile ? Math.min(74, stage.width * 0.2) : Math.min(196, stage.width * 0.14);
  const cardHeight = Math.min(widthCap * 1.34, maxByHeight);
  const cardWidth = cardHeight / 1.34;

  const archCurve = Math.cos(norm * Math.PI) * (stage.width * 0.025);
  // On phones the wings sit partly past the edge so the headline keeps its space
  const targetX = sideMult * (stage.width * (stage.isMobile ? 0.41 : 0.34) + archCurve);
  const targetY = norm * stage.height * spread;
  const targetRotate = sideMult * (norm * 18);

  const initialX = sideMult * (wingIndex * 5);
  const initialY = norm * 12;
  const initialRotate = sideMult * (wingIndex * 2.5);

  const translate = useTransform([progress, pointer.x, pointer.y], ([p, px, py]: number[]) => {
    const easeP = 1 - Math.pow(1 - p, 3);
    const tx = initialX + (targetX - initialX) * easeP;
    const ty = initialY + (targetY - initialY) * easeP;
    const maxParallaxX = stage.isMobile ? 8 : 18;
    const maxParallaxY = stage.isMobile ? 6 : 14;
    const dx = tx + px * (isLeft ? -maxParallaxX : maxParallaxX) * easeP;
    const dy = ty + py * maxParallaxY * easeP;
    return `calc(-50% + ${dx}px) calc(-50% + ${dy}px)`;
  });

  const rotate = useTransform(progress, [0, 0.45, 1], [initialRotate, isLeft ? -14 : 14, targetRotate]);
  const scale = useTransform(progress, [0, 0.5, 1], [1, 0.96, 0.92]);

  return (
    <motion.div
      className="group absolute left-1/2 top-1/2 will-change-transform select-none"
      style={{
        width: cardWidth,
        height: cardHeight,
        zIndex: item.z ?? (isLeft ? index + 1 : total - index),
        translate,
        rotate,
        scale,
      }}
      whileHover={isSpreadActive ? { scale: 1.08, zIndex: 50, rotate: 0, transition: SPRING_CONFIG } : { scale: 0.98 }}
      whileTap={{ scale: 1.04, zIndex: 50 }}
    >
      <Link
        href={item.href}
        transitionTypes={["nav-forward"]}
        tabIndex={isSpreadActive ? 0 : -1}
        aria-label={`${item.label}: view case study`}
        data-cursor="Open"
        className="block h-full w-full"
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface shadow-xl shadow-black/15 ring-1 ring-black/10 transition-shadow duration-300 group-hover:shadow-2xl group-hover:ring-fg/40 dark:shadow-black/60 dark:ring-white/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            srcSet={item.srcSet}
            sizes="200px"
            alt={item.alt}
            style={{ objectPosition: item.position ?? "center" }}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <span
          className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2.5 py-1 text-[11px] font-medium text-invert opacity-0 transition-opacity duration-300 ${
            isSpreadActive ? "group-hover:opacity-100" : ""
          }`}
        >
          {item.label}
        </span>
      </Link>
    </motion.div>
  );
}

export default function CurtainSplitHero({ items, eyebrow, title, description }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState<Stage>({ width: 1000, height: 640, isMobile: false });

  // 0 = closed deck in the centre, 1 = parted wings. Driven by how far the
  // sticky stage has been scrolled through its track.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const target = useTransform(scrollYProgress, [0.08, 0.72], [0, 1], { clamp: true });
  const progress = useSpring(target, SPRING_CONFIG);

  const [isSpreadActive, setIsSpreadActive] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setIsSpreadActive(p > 0.65));

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING_CONFIG);
  const pointerY = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (reduce) progress.jump(1);
  }, [reduce, progress]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setStage({ width: rect.width, height: rect.height, isMobile: rect.width < 768 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const textY = useTransform(progress, [0.25, 0.85], [30, 0]);
  const textOpacity = useTransform(progress, [0.3, 0.8], [0, 1]);
  const lineScale = useTransform(progress, [0.35, 0.85], [0, 1]);

  return (
    <div ref={trackRef} className="relative h-[230svh]">
      <div className="sticky top-16 flex h-[calc(100svh-5rem)] items-center">
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative flex h-full max-h-[760px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-line bg-surface-2 sm:rounded-[36px]"
        >
          {/* Dot grid, faded toward the edges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70 [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_50%,transparent_100%)]"
            style={{ backgroundImage: "radial-gradient(var(--line-strong) 1px, transparent 1px)" }}
          />
          <div aria-hidden className="orb-dot pointer-events-none absolute h-[46%] max-h-[340px] w-auto aspect-square opacity-25 blur-2xl" />

          {/* Centre headline, revealed as the curtain parts */}
          <motion.div
            className="pointer-events-none z-[5] flex max-w-[12.5rem] flex-col items-center text-center sm:max-w-md sm:px-4"
            style={{ y: textY, opacity: textOpacity }}
          >
            <span className="label">{eyebrow}</span>
            <h2 className="display mt-3 text-[clamp(1.75rem,4.8vw,4.6rem)]">{title}</h2>
            <motion.div style={{ scaleX: lineScale }} className="my-4 h-px w-16 origin-center bg-line-strong sm:my-5" />
            <p className="max-w-[34ch] text-[13px] leading-relaxed text-muted sm:text-base">{description}</p>
          </motion.div>

          <div className="absolute inset-0 z-10">
            {items.map((item, i) => (
              <CurtainCard
                key={item.src}
                item={item}
                index={i}
                total={items.length}
                progress={progress}
                pointer={{ x: pointerX, y: pointerY }}
                isSpreadActive={isSpreadActive}
                stage={stage}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-4 z-30 flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-[11px] font-medium text-muted backdrop-blur-md">
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${isSpreadActive ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span>{isSpreadActive ? "Pick a project to open it" : "Keep scrolling to open the deck"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
