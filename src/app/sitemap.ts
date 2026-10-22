import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${site.url}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
  return [
    { url: `${base}/`, priority: 1 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}/`, priority: 0.8 })),
  ];
}
