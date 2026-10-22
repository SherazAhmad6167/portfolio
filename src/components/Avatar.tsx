import { cn } from "@/lib/utils";

/** Liquid-glass "SA" monogram: a frosted disc over the turning iridescent orb. Tiny sizes show just "S". */
export default function Avatar({ size = 32, className }: { size?: number; className?: string }) {
  const short = size < 24;
  return (
    <span
      aria-hidden
      className={cn("glass-mono shrink-0 select-none font-semibold leading-none tracking-[-0.05em]", className)}
      style={{ width: size, height: size, fontSize: Math.round(size * (short ? 0.46 : 0.34)) }}
    >
      {short ? "S" : "SA"}
    </span>
  );
}
