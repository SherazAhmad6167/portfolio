"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { ArrowRight, Copy, FileCode2, Hash, Mail, SunMoon } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { toggleTheme } from "@/lib/theme";
import { useScrollTo } from "@/lib/useScrollTo";
import { sections } from "./Nav";

const item =
  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-surface-2 data-[selected=true]:text-fg";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const scrollTo = useScrollTo();

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const show = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("open-palette", show);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("open-palette", show);
    };
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 60);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[14vh] z-[81] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[var(--shadow)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Hash size={16} className="text-muted" />
        <Command.Input placeholder="Type a command or search…" className="h-14 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted" />
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">ESC</kbd>
      </div>
      <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto p-2" data-lenis-prevent>
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">Nothing found.</Command.Empty>

        <Command.Group heading="Projects" className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
          {projects.map((p) => (
            <Command.Item key={p.slug} value={`${p.name} ${p.stack.join(" ")}`} onSelect={() => run(() => router.push(`/work/${p.slug}/`))} className={item}>
              <FileCode2 size={16} />
              <span className="flex-1 text-fg">{p.name}</span>
              <span className="font-mono text-[11px]">{p.where}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Go to" className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
          {sections.map((s) => (
            <Command.Item key={s.id} value={`go ${s.label}`} onSelect={() => run(() => scrollTo(s.id))} className={item}>
              <ArrowRight size={16} />
              {s.label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
          <Command.Item
            value="copy email"
            onSelect={() => {
              navigator.clipboard?.writeText(site.email);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className={item}
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy email address"}
          </Command.Item>
          <Command.Item value="send email" onSelect={() => run(() => (window.location.href = `mailto:${site.email}`))} className={item}>
            <Mail size={16} />
            Send an email
          </Command.Item>
          <Command.Item value="toggle theme dark light" onSelect={() => run(() => toggleTheme())} className={item}>
            <SunMoon size={16} />
            Toggle theme
          </Command.Item>
          <Command.Item value="github" onSelect={() => run(() => window.open(site.github, "_blank", "noopener"))} className={item}>
            <GithubIcon size={16} />
            Open GitHub
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
