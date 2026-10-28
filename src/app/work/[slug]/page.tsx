import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bot,
  CalendarCheck,
  Check,
  CloudOff,
  CreditCard,
  Factory,
  FileText,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  ListChecks,
  Map as MapIcon,
  MessageSquare,
  PenTool,
  Printer,
  QrCode,
  Radio,
  Router,
  ScanFace,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Swords,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { tint } from "@/lib/tints";
import { Framed, PhoneFrame, Shot } from "@/components/Frames";
import Reveal from "@/components/Reveal";
import Flow from "@/components/case/Flow";
import Gallery from "@/components/case/Gallery";
import FadeIn from "@/components/case/FadeIn";
import { CoverZoom, LitText, ReadingProgress, SectionNav } from "@/components/case/CaseExtras";
import PraxisVisual from "@/components/home/PraxisVisual";
import ImpactValue from "@/components/ui/impact-value";
import TechChip from "@/components/ui/tech-chip";
import Footer from "@/components/Footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `${site.primaryUrl}/work/${p.slug}/` },
    openGraph: { type: "article", title: `${p.name} · Case study`, description: p.summary },
    twitter: { card: "summary_large_image", title: `${p.name} · Case study`, description: p.summary },
  };
}

// An icon for each "What I built" card, by its title
const builtIcons: Record<string, LucideIcon> = {
  "Admin panel": LayoutDashboard,
  "Field app": Smartphone,
  "SMS gateway": MessageSquare,
  "Router bridge": Router,
  "Public website": Globe,
  "Payments & payouts": CreditCard,
  "Live streaming": Radio,
  Bookings: CalendarCheck,
  "Fight cards & matchmaking": Swords,
  "Network map & chat": MapIcon,
  "Agent pipeline": Bot,
  "Approvals queue": ListChecks,
  "Document output": FileText,
  Sourcing: ShoppingCart,
  "Labeling & scanning": QrCode,
  "Production & quality": Factory,
  "Stock & warehouse": Warehouse,
  "Knowledge & SOPs": BookOpen,
  "Customer wallet": Wallet,
  "Self-onboarding": ScanFace,
  "Agent portal": Store,
  "Services catalogue": LayoutGrid,
  "Native printer module": Printer,
  "Receipt designer": PenTool,
  "Offline first": CloudOff,
  Reports: BarChart3,
};

function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line py-16 first:border-t-0 first:pt-0 sm:py-20">
      <p className="label mb-8 flex items-center gap-2">
        <span aria-hidden className="orb-dot inline-block h-3 w-3" />
        {label}
      </p>
      {children}
    </section>
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];
  const color = tint(p.slug);

  const toc = [
    { id: "problem", label: "The problem" },
    { id: "built", label: "What I built" },
    { id: "how", label: "How it works" },
    { id: "notes", label: "Engineering notes" },
    { id: "stack", label: "Tech stack" },
    ...(p.gallery.length ? [{ id: "screens", label: "Screens" }] : []),
  ];

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main" className="relative overflow-x-clip pt-28 sm:pt-32">
        <ReadingProgress />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[720px] w-[1200px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${color}38, transparent)` }}
        />

        {/* Header */}
        <div className="container-page relative">
          <div className="flex items-center justify-between">
            <Link
              href="/#work"
              transitionTypes={["nav-back"]}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-muted backdrop-blur transition-colors hover:text-fg"
            >
              <ArrowLeft size={15} className="transition-transform duration-500 group-hover:-translate-x-1" />
              All work
            </Link>
            <p className="label">Case study</p>
          </div>

          <header className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-fg px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-invert">{p.engagement}</span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">{p.where}</span>
                {p.platforms.map((pl) => (
                  <span key={pl} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                    {pl}
                  </span>
                ))}
              </div>
              <Reveal as="h1" when="intro" className="display text-[clamp(3.2rem,9vw,9.5rem)]">
                {p.name}
              </Reveal>
              <FadeIn delay={0.25}>
                <p className="mt-8 max-w-3xl text-2xl leading-snug tracking-tight text-muted sm:text-3xl">{p.tagline}</p>
              </FadeIn>
            </div>

            <FadeIn delay={0.35} className="lg:col-span-4">
              <div className="rounded-[28px] border border-line bg-surface/70 p-6 backdrop-blur-xl">
                <dl className="space-y-4 text-sm">
                  {[
                    ["Client", p.client],
                    ["Role", p.role],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="label">{k}</dt>
                      <dd className="mt-1 leading-snug">{v}</dd>
                    </div>
                  ))}
                </dl>
                {p.links.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener"
                        className="group flex items-center justify-between gap-3 rounded-full bg-fg py-2 pl-5 pr-2 text-sm font-medium text-invert"
                      >
                        <span>
                          {l.label}
                          {l.note && <span className="ml-1.5 opacity-60">({l.note})</span>}
                        </span>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-invert/15 transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight size={15} />
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          </header>
        </div>

        {/* Cover: grows to full width as it scrolls in */}
        <div className="container-page relative mt-16 sm:mt-20">
          <CoverZoom className="relative border border-line">
            <div
              className="px-5 py-10 sm:px-14 sm:py-16 lg:px-24 lg:py-20"
              style={{ background: `radial-gradient(80% 90% at 100% 0%, ${color}30, transparent 60%), radial-gradient(60% 70% at 0% 100%, ${color}1c, transparent 60%), var(--surface-2)` }}
            >
              <ViewTransition name={`cover-${p.slug}`}>
                <div className={p.cover.frame === "phone" ? "mx-auto w-[min(62%,300px)]" : p.visual === "praxis" ? "mx-auto max-w-3xl" : "relative"}>
                  {p.visual === "praxis" ? (
                    <PraxisVisual />
                  ) : (
                    <Framed shotRef={p.cover} alt={`${p.name} main screen`} sizes="(min-width: 1440px) 1200px, 100vw" priority />
                  )}
                  {p.coverExtra?.frame === "phone" && p.cover.frame === "browser" && (
                    <div className="cover-float absolute -bottom-6 -right-2 w-[20%] min-w-[90px] sm:-right-8">
                      <PhoneFrame>
                        <Shot shotRef={p.coverExtra} alt={`${p.name} mobile screen`} sizes="240px" />
                      </PhoneFrame>
                    </div>
                  )}
                </div>
              </ViewTransition>
            </div>
          </CoverZoom>

          {/* Impact */}
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {p.impact.map((m, i) => (
              <FadeIn key={m.label} delay={i * 0.08} className="flex flex-col-reverse rounded-[24px] border border-line bg-surface p-6 sm:p-8">
                <dt className="mt-2 text-sm text-muted">{m.label}</dt>
                <dd className="display text-[clamp(2.8rem,5vw,4.5rem)]">
                  <ImpactValue value={m.value} />
                </dd>
              </FadeIn>
            ))}
          </dl>
        </div>

        {/* Body with a sticky table of contents */}
        <div className="container-page relative mt-20 grid gap-12 sm:mt-28 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <SectionNav items={toc} />
          </aside>

          <div className="lg:col-span-9">
            <Section id="problem" label="The problem">
              <LitText text={p.problem} className="text-[clamp(1.6rem,3vw,2.7rem)] font-medium leading-[1.2] tracking-[-0.02em]" />
            </Section>

            <Section id="built" label="What I built">
              <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
                {p.overview.map((o) => (
                  <FadeIn key={o.slice(0, 24)}>
                    <p>{o}</p>
                  </FadeIn>
                ))}
              </div>
              <ul className="mt-12 grid gap-3 sm:grid-cols-2">
                {p.built.map((b, i) => (
                  <FadeIn as="li" key={b.title} delay={i * 0.05} className="group relative overflow-hidden rounded-[24px] border border-line bg-surface p-7 transition-colors hover:border-line-strong">
                    <span
                      aria-hidden
                      className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: color }}
                    />
                    <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-fg text-invert">
                      {(() => {
                        const Icon = builtIcons[b.title] ?? Sparkles;
                        return <Icon size={18} strokeWidth={1.8} />;
                      })()}
                    </span>
                    <h3 className="relative mt-6 text-xl font-medium tracking-tight">{b.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
                  </FadeIn>
                ))}
              </ul>
            </Section>

            <Section id="how" label="How it works">
              <div className="space-y-16">
                {p.flows.map((f) => (
                  <Flow key={f.title} flow={f} />
                ))}
              </div>
            </Section>

            <Section id="notes" label="Engineering notes">
              <ul className="grid gap-3">
                {p.highlights.map((h, i) => (
                  <FadeIn as="li" key={h} delay={i * 0.04} className="flex gap-4 rounded-[20px] border border-line bg-surface p-5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                      <Check size={15} />
                    </span>
                    <p className="text-lg leading-relaxed">{h}</p>
                  </FadeIn>
                ))}
              </ul>
            </Section>

            <Section id="stack" label="Tech stack">
              <ul className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s}>
                    <TechChip label={s} className="py-2 pl-3 pr-4 text-sm" />
                  </li>
                ))}
              </ul>
            </Section>

            {p.gallery.length > 0 && (
              <Section id="screens" label="Screens">
                <Gallery shots={p.gallery} name={p.name} />
              </Section>
            )}
          </div>
        </div>

        {/* Next project: a big card with its cover peeking in */}
        <div className="container-page relative mt-10 pb-24">
          <Link
            href={`/work/${next.slug}/`}
            transitionTypes={["nav-forward"]}
            className="group relative block overflow-hidden rounded-[36px] border border-line p-8 sm:p-12"
            style={{ background: `radial-gradient(80% 100% at 100% 0%, ${tint(next.slug)}33, transparent 60%), var(--surface)` }}
            data-cursor="Next"
          >
            <p className="label">Next project</p>
            <div className="mt-6 grid items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="display text-[clamp(2.6rem,6vw,6rem)] transition-colors duration-500 group-hover:text-muted">{next.name}</p>
                <p className="mt-4 max-w-md text-muted">{next.summary}</p>
                <span className="mt-8 inline-flex items-center gap-3 rounded-full bg-fg py-2 pl-5 pr-2 text-sm font-medium text-invert">
                  Read the case study
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-invert/15 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight size={15} />
                  </span>
                </span>
              </div>
              <div className="relative h-56 lg:col-span-6 lg:h-72">
                <div className="absolute inset-x-0 -bottom-24 top-0 transition-transform duration-700 ease-out-expo group-hover:-translate-y-6 group-hover:rotate-[-1.5deg] sm:-bottom-28">
                  {next.visual === "praxis" ? (
                    <PraxisVisual />
                  ) : next.cover.frame === "phone" ? (
                    <div className="mx-auto w-[42%]">
                      <Framed shotRef={next.cover} alt={`${next.name} screen`} sizes="300px" />
                    </div>
                  ) : (
                    <Framed shotRef={next.cover} alt={`${next.name} screen`} sizes="(min-width: 1024px) 45vw, 100vw" />
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
        <Footer />
      </main>
    </ViewTransition>
  );
}
