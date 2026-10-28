"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useScrollTo } from "@/lib/useScrollTo";
import LocalTime from "./LocalTime";
import Avatar from "./Avatar";
import { sections } from "./Nav";
import { site } from "@/content/site";
import { asset } from "@/lib/media";

export default function Footer() {
  const scrollTo = useScrollTo();
  const links = [
    { label: "Email", href: `mailto:${site.email}` },
    { label: "GitHub", href: site.github },
    ...(site.linkedin ? [{ label: "LinkedIn", href: site.linkedin }] : []),
  ];

  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-bg text-fg">
      <div className="container-page border-t border-line pb-6 pt-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="flex items-center gap-2.5 text-lg font-medium tracking-tight">
              <Avatar size={36} className="ring-2 ring-line" /> {site.name}
            </p>
            <p className="mt-4 max-w-sm text-muted">
              {site.role} at {site.company}. Building web, mobile and AI products, and the hardware they talk to.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <p className="label mb-4">Explore</p>
            <ul className="space-y-2.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={asset(`/#${s.id}`)}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(s.id);
                    }}
                    className="text-muted transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="label mb-4">Connect</p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener"
                    className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
                  >
                    {l.label}
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex md:col-span-1 md:justify-end">
            <button
              type="button"
              onClick={() => scrollTo("top")}
              className="grid h-12 w-12 place-items-center rounded-full border border-line-strong transition-colors hover:bg-fg hover:text-invert"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        <p
          aria-hidden
          className="group display mt-16 select-none whitespace-nowrap text-center text-[14vw] leading-[0.8] text-fg/[0.07] transition-colors duration-700 hover:text-fg/[0.14] 2xl:text-[14.6rem]"
        >
          Sheraz Ahmad
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
          <LocalTime />
          <span>Next.js · GSAP · three.js</span>
        </div>
      </div>
    </footer>
  );
}
