"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ArrowUpRight, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import Avatar from "../Avatar";

type Answer = { q: string; a: string; link?: { label: string; href: string } };

// A small offline assistant: it streams prewritten answers about this portfolio.
// No AI service is called, so nothing a visitor types leaves their browser.
const answers: Record<string, Answer> = {
  build: {
    q: "What does Sheraz build?",
    a: "Complete products, end to end: web apps in Angular, React and Next.js, mobile apps in React Native and Ionic, APIs on Node, Azure Functions and FastAPI, and the hardware they talk to, like MikroTik routers, Bluetooth thermal printers and Android SMS gateways.",
  },
  best: {
    q: "Best project?",
    a: "Probably the Ranjha 7 Star ISP Suite. He built it solo: an admin panel, a field app that prints receipts, a native SMS gateway and a bridge to the internet provider's routers. More than 6,000 subscribers are billed and notified through it.",
    link: { label: "Open the case study", href: "/work/ranjha-isp-suite/" },
  },
  ai: {
    q: "Has he worked with AI?",
    a: "Yes. On Praxis iPM he worked on a multi-stage agent pipeline using Claude, Gemini and OpenAI. It turns property photos and a voice brief into estimates, schedules and trade briefs, with a human approval at every step.",
    link: { label: "See how it works", href: "/work/praxis-ipm/" },
  },
  stack: {
    q: "What's his stack?",
    a: "Angular, React, Next.js and TypeScript on the front. React Native, Expo, Ionic and Kotlin on mobile. Node, Express, Azure Functions, Firebase and FastAPI on the back, with Firestore, Azure SQL, Supabase and SQLite for data. Plus Stripe, CometChat, Mapbox and LLM APIs.",
  },
  contact: {
    q: "How do I reach him?",
    a: `Email ${site.email}, or use the contact form at the bottom of this page.`,
    link: { label: "Go to contact", href: "/#contact" },
  },
};

const chips = ["best", "ai", "stack", "contact"] as const;

function match(text: string): Answer {
  const t = text.toLowerCase();
  if (/\b(ai|llm|gpt|claude|gemini|openai|agent|ml)\b/.test(t)) return answers.ai;
  if (/stack|tech|language|framework|tool|angular|react|node/.test(t)) return answers.stack;
  if (/best|proud|favou?rite|biggest|top|project/.test(t)) return answers.best;
  if (/hire|contact|email|reach|available|freelance|job|work with/.test(t)) return answers.contact;
  if (/build|make|do|who|about|what/.test(t)) return answers.build;
  return {
    q: text,
    a: `I only know what's on this site, so I can't answer that one. Try one of the suggestions below, or ask Sheraz directly at ${site.email}.`,
  };
}

export default function AskAI() {
  const [value, setValue] = useState("");
  const [current, setCurrent] = useState<Answer | null>(null);
  const [shown, setShown] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const typing = current !== null && shown.length < current.a.length;

  const ask = (ans: Answer) => {
    if (timer.current) clearInterval(timer.current);
    setCurrent(ans);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(ans.a);
      return;
    }
    setShown("");
    let i = 0;
    // A short "thinking" pause, then stream a few characters at a time
    setTimeout(() => {
      timer.current = setInterval(() => {
        i += 3;
        setShown(ans.a.slice(0, i));
        if (i >= ans.a.length && timer.current) clearInterval(timer.current);
      }, 18);
    }, 450);
  };

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <div className="w-full max-w-xl">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.q}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 rounded-2xl border border-line bg-surface/80 p-4 shadow-[var(--shadow)] backdrop-blur-xl"
            aria-live="polite"
          >
            <p className="label mb-2 flex items-center gap-2 normal-case tracking-normal">
              <Avatar size={20} />
              {current.q}
            </p>
            <p className={`text-[15px] leading-relaxed ${typing || shown.length === 0 ? "caret" : ""}`}>
              {shown || <span className="text-muted">Thinking</span>}
            </p>
            {current.link && !typing && shown.length > 0 && (
              <Link
                href={current.link.href}
                transitionTypes={current.link.href.startsWith("/work") ? ["nav-forward"] : undefined}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                {current.link.label}
                <ArrowUpRight size={14} />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = value.trim();
          if (!v) return;
          ask(match(v));
          setValue("");
        }}
        className="spot flex items-center gap-2 rounded-full border border-line bg-surface/70 p-1.5 pl-4 shadow-[var(--shadow)] backdrop-blur-xl"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        <Sparkles size={16} className="shrink-0 text-accent" aria-hidden />
        <label htmlFor="ask" className="sr-only">
          Ask about my work
        </label>
        <input
          id="ask"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about my work…"
          autoComplete="off"
          className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg text-invert transition-opacity hover:opacity-85"
          aria-label="Ask"
        >
          <ArrowUp size={17} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => ask(answers[k])}
            className="rounded-full border border-line bg-surface/50 px-3 py-1.5 text-[13px] text-muted backdrop-blur transition-colors hover:border-line-strong hover:text-fg"
          >
            {answers[k].q}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-faint">Portfolio assistant · answers come from this site</p>
    </div>
  );
}
