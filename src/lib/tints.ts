// Accent glow per project, taken from each product's own brand colours
const tints: Record<string, string> = {
  "ranjha-isp-suite": "#7c3aed",
  ifight: "#f97316",
  "praxis-ipm": "#d97706",
  "dowson-mes": "#2563eb",
  "campost-money": "#0ea5e9",
  thermox: "#6366f1",
};

export const tint = (slug: string) => tints[slug] ?? "#f5a524";
