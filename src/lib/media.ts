import manifest from "@/content/media.json";

export type ShotRef = {
  project: string;
  name: string;
  frame: "browser" | "phone";
  url?: string;
  caption?: string;
};

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a public/ path with the GitHub Pages base path, if any. */
export function asset(path: string) {
  return `${base}${path}`;
}

export function shot(ref: Pick<ShotRef, "project" | "name">) {
  const entry = (manifest as Record<string, Record<string, { w: number; h: number; sizes: number[] }>>)[ref.project]?.[ref.name];
  if (!entry) throw new Error(`Missing media ${ref.project}/${ref.name}. Run npm run media.`);
  const file = (w: number) => asset(`/media/${ref.project}/${ref.name}-${w}.webp`);
  return {
    src: file(entry.sizes[entry.sizes.length - 1]),
    srcSet: entry.sizes.map((w) => `${file(w)} ${w}w`).join(", "),
    width: entry.w,
    height: entry.h,
  };
}
