import { toolFor } from "@/content/stack";
import ToolIcon from "./tool-icon";
import { cn } from "@/lib/utils";

/** A tech label with its brand logo when one is known. */
export default function TechChip({ label, className }: { label: string; className?: string }) {
  const tool = toolFor(label);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-2 pr-3 text-xs", !tool && "pl-3", className)}>
      {tool && <ToolIcon tool={tool} size={13} />}
      {label}
    </span>
  );
}
