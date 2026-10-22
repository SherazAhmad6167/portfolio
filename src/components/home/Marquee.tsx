import { allTools } from "@/content/stack";
import ToolIcon from "@/components/ui/tool-icon";
import VelocityMarquee from "@/components/ui/velocity-marquee";
import { cn } from "@/lib/utils";

// Headline tools get the big row; everything else rides the chip row underneath
const featured = ["Angular", "React", "Next.js", "React Native", "Ionic", "Node.js", "Firestore", "Stripe", "FastAPI", "Kotlin", "MikroTik", "Three.js", "Claude", "Gemini"];
const names: Record<string, string> = { Firestore: "Firebase" };
const big = featured.flatMap((n) => allTools.filter((t) => t.name === n));
const rest = allTools.filter((t) => !featured.includes(t.name));

export default function Marquee() {
  return (
    <section
      aria-label="Technologies I work with"
      className="relative border-y border-line py-7 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] sm:py-9"
    >
      <VelocityMarquee speed={46} gap="gap-8 pr-8 sm:gap-12 sm:pr-12">
        {big.map((t, i) => (
          <span key={t.name} className="group/m flex items-center gap-4 sm:gap-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface shadow-[var(--shadow)] transition-transform duration-500 ease-out-expo group-hover/m:-rotate-6 group-hover/m:scale-110 sm:h-16 sm:w-16 sm:rounded-[20px]">
              <ToolIcon tool={t} size={26} className="sm:h-8 sm:w-8" />
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-4xl font-medium tracking-[-0.03em] transition-colors duration-300 group-hover/m:text-fg sm:text-6xl",
                i % 2 && "text-faint",
              )}
            >
              {names[t.name] ?? t.name}
            </span>
            <span aria-hidden className="orb-dot ml-4 inline-block h-4 w-4 shrink-0 sm:ml-7 sm:h-6 sm:w-6" />
          </span>
        ))}
      </VelocityMarquee>

      <VelocityMarquee speed={30} reverse gap="gap-2.5 pr-2.5" className="mt-6 sm:mt-8">
        {rest.map((t) => (
          <span
            key={t.name}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/70 py-2 pl-3 pr-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <ToolIcon tool={t} size={16} />
            {t.name}
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}
