"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy, Download, Layers, Loader2, MapPin, Send } from "lucide-react";
import Reveal from "../Reveal";
import Magnetic from "../Magnetic";
import LocalTime from "../LocalTime";
import AskAI from "./AskAI";
import { GithubIcon, LinkedinIcon } from "../BrandIcons";
import { site } from "@/content/site";
import Avatar from "../Avatar";
import { asset } from "@/lib/media";
import { saveMessage } from "@/lib/firebase";

type State = "idle" | "sending" | "sent" | "error";

const needs = ["Web app", "Mobile app", "AI / automation", "Backend & APIs", "Hardware integration", "Something else"];
const banner = ["Let's build something", "Got a project?", "Let's talk"];

function Banner({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  const row = [...banner, ...banner, ...banner, ...banner];
  return (
    <div className="marquee flex overflow-hidden">
      <div
        className="marquee-track flex w-max shrink-0 items-center gap-10 pr-10"
        style={{ ["--marquee-speed" as string]: "38s", animationDirection: reverse ? "reverse" : "normal" }}
        aria-hidden
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`display whitespace-nowrap text-[clamp(3.5rem,10vw,9.5rem)] ${outline ? "text-transparent [-webkit-text-stroke:1.5px_var(--line-strong)]" : i % 3 === 1 ? "iris-text" : ""}`}
            >
              {t}
            </span>
            <span className="orb-dot inline-block h-[clamp(1.5rem,4vw,3.5rem)] w-[clamp(1.5rem,4vw,3.5rem)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Contact() {
  const [state, setState] = useState<State>("idle");
  const [picked, setPicked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Bots fill every field; people never see this one
    if (data.get("company")) return setState("sent");
    const text = (k: string) => String(data.get(k) ?? "").trim();
    setState("sending");
    try {
      if (site.formspreeId) {
        data.set("needs", picked.join(", ") || "Not specified");
        const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        await saveMessage({ name: text("name"), email: text("email"), message: text("message"), needs: picked });
      }
      form.reset();
      setPicked([]);
      setState("sent");
    } catch {
      setState("error");
    }
  };

  const copy = () => {
    navigator.clipboard?.writeText(site.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const field =
    "peer w-full rounded-2xl border border-line bg-bg/60 px-4 pb-3 pt-7 text-[15px] text-fg outline-none transition-colors placeholder:text-transparent focus:border-[#a78bfa] focus:bg-bg";
  const floating =
    "pointer-events-none absolute left-4 top-5 text-[15px] text-muted transition-all duration-200 peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider";

  return (
    <section id="contact" data-theme="dark" className="relative scroll-mt-16 overflow-hidden bg-bg text-fg">
      {/* Drifting colour in the dark */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] animate-[float_14s_ease-in-out_infinite] rounded-full bg-[radial-gradient(closest-side,rgba(139,123,255,0.28),transparent)] blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[560px] w-[560px] animate-[float_18s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.18),transparent)] blur-2xl" />

      <div className="relative -rotate-2 border-y border-line bg-surface/40 py-6 backdrop-blur-sm sm:py-8">
        <Banner />
        <div className="mt-2">
          <Banner reverse outline />
        </div>
      </div>

      <div className="container-page relative grid gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="label flex items-center gap-2">
            <span className="orb-dot inline-block h-3 w-3" />
            Contact
          </p>
          <Reveal as="h2" className="display mt-6 text-[clamp(2.8rem,5.5vw,5.4rem)]">
            Have a project? <span className="iris-text">Let&apos;s ship it.</span>
          </Reveal>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Tell me what you&apos;re building. Web, mobile, AI or something that talks to hardware: I&apos;ll take it from idea to
            production.
          </p>

          {/* The big email button */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-fg py-2 pl-6 pr-2 text-invert"
                data-cursor="Email"
              >
                <span className="text-base font-medium sm:text-lg">{site.email}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-invert text-fg transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copy}
              className="flex h-[60px] items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition-colors hover:bg-surface"
              aria-label="Copy email address"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-fg" /> {site.location} · <LocalTime prefix="" />
            </li>
            <li className="flex items-center gap-3">
              <Layers size={16} className="text-fg" /> Freelance projects and full-time roles
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            <a href={site.github} target="_blank" rel="noopener" className="flex h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:bg-surface">
              <GithubIcon size={16} /> GitHub
            </a>
            {site.linkedin && (
              <a href={site.linkedin} target="_blank" rel="noopener" className="flex h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:bg-surface">
                <LinkedinIcon size={16} /> LinkedIn
              </a>
            )}
            {site.resume && (
              <a href={asset(site.resume)} download className="flex h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:bg-surface">
                <Download size={16} /> Resume
              </a>
            )}
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <p className="label mb-4">Or ask my assistant first</p>
            <AskAI />
          </div>
        </div>

        {/* Form in a card with a slowly turning iridescent edge */}
        <div className="lg:col-span-7">
          <div className="iris-border relative rounded-[32px] p-[1.5px] shadow-[0_40px_120px_-40px_rgba(139,123,255,0.45)]">
            <div className="relative overflow-hidden rounded-[31px] bg-surface p-6 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                {state === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex min-h-[460px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      className="iris-border grid h-20 w-20 place-items-center rounded-full p-[2px]"
                    >
                      <span className="grid h-full w-full place-items-center rounded-full bg-surface">
                        <Check size={34} className="text-fg" />
                      </span>
                    </motion.span>
                    <p className="display mt-8 text-4xl">Message sent.</p>
                    <p className="mt-3 max-w-sm text-muted">Thanks for reaching out. I&apos;ll read it and get back to you soon.</p>
                    <button type="button" onClick={() => setState("idle")} className="mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-7">
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar size={44} className="ring-2 ring-line" />
                        <div>
                          <p className="text-2xl font-medium tracking-tight sm:text-3xl">Start a project</p>
                          <p className="text-xs text-muted">Goes straight to {site.name}</p>
                        </div>
                      </div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Takes about a minute</p>
                    </div>

                    <fieldset>
                      <legend className="label mb-3">What do you need?</legend>
                      <div className="flex flex-wrap gap-2">
                        {needs.map((n) => {
                          const on = picked.includes(n);
                          return (
                            <button
                              key={n}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggle(n)}
                              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                                on ? "border-transparent bg-fg text-invert" : "border-line-strong text-muted hover:border-fg hover:text-fg"
                              }`}
                            >
                              {on && <Check size={14} />}
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="relative block">
                        <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
                        <span className={floating}>Your name</span>
                      </label>
                      <label className="relative block">
                        <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="Email" className={field} />
                        <span className={floating}>Email</span>
                      </label>
                    </div>
                    <label className="relative block">
                      <textarea name="message" required rows={5} maxLength={5000} placeholder="Project details" className={`${field} resize-none`} />
                      <span className={floating}>Tell me about the project</span>
                    </label>

                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(100deg,#7dd3fc,#c4b5fd,#f9a8d4,#fde68a,#7dd3fc)] bg-[length:200%_100%] text-base font-semibold text-[#0a0a0a] transition-[background-position,transform] duration-700 hover:bg-[position:100%_0] active:scale-[0.99] disabled:opacity-70"
                    >
                      {state === "sending" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Send it, let&apos;s talk
                          <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                        </>
                      )}
                    </button>
                    {state === "error" && (
                      <p className="text-center text-sm text-red-400" role="alert">
                        That didn&apos;t go through. Email me directly at{" "}
                        <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                          {site.email}
                        </a>
                        .
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
