import type { Tool } from "@/content/stack";

// Very dark brand colours (Next.js, Express, Mapbox...) would vanish in dark mode,
// so those follow the text colour instead.
function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.22;
}

/** Id of a logo in the page-wide sprite (see tool-icon-sprite.tsx). */
export const toolSymbolId = (name: string) => `tool-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export function toolColor(tool: Pick<Tool, "color">) {
  return isDark(tool.color) ? "var(--fg)" : tool.color;
}

export default function ToolIcon({ tool, size = 22, mono = false, className }: { tool: Tool; size?: number; mono?: boolean; className?: string }) {
  const color = mono ? "currentColor" : toolColor(tool);
  if ("path" in tool.icon) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden style={{ color }}>
        <use href={`#${toolSymbolId(tool.name)}`} />
      </svg>
    );
  }
  const Icon = tool.icon.lucide;
  return <Icon size={size} strokeWidth={1.9} className={className} aria-hidden style={{ color }} />;
}
