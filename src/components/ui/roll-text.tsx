import { cn } from "@/lib/utils";

/**
 * Letters roll up one after another when a parent with the `group/roll` class is hovered.
 * Screen readers get the plain text once.
 */
export default function RollText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => {
        const c = ch === " " ? " " : ch;
        return (
          <span
            key={i}
            aria-hidden
            className="relative inline-block transition-transform duration-500 ease-out-expo group-hover/roll:-translate-y-full"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {c}
            <span className="absolute left-0 top-full">{c}</span>
          </span>
        );
      })}
    </span>
  );
}
