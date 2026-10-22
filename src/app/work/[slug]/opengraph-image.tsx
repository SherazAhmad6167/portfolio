// Share image for each case study (the preview card on WhatsApp, LinkedIn, X), made at build time.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content/projects";
import { tint } from "@/lib/tints";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Case study by ${site.name}`;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const font = (file: string) => readFile(path.join(process.cwd(), "node_modules/geist/dist/fonts", file));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) throw new Error(`Unknown project ${slug}`);
  const c = tint(slug);
  const [regular, semibold, mono] = await Promise.all([
    font("geist-sans/Geist-Regular.ttf"),
    font("geist-sans/Geist-SemiBold.ttf"),
    font("geist-mono/GeistMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#f4f4f1", fontFamily: "Geist", position: "relative" }}>
        {/* Project-tinted glow, like the case-study page */}
        <div style={{ position: "absolute", right: -140, top: -160, width: 640, height: 640, borderRadius: 9999, background: `radial-gradient(circle at 50% 50%, ${c}55 0%, ${c}00 62%)`, display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 9999, background: "linear-gradient(135deg, #7dd3fc, #c4b5fd 40%, #f9a8d4 70%, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 9999, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 600, color: "#1a1a2e", letterSpacing: -1 }}>SA</div>
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 2, color: "#6b6b66" }}>{`${site.name.toUpperCase()} · CASE STUDY`}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 940 }}>
          <div style={{ fontSize: p.name.length > 18 ? 92 : 112, fontWeight: 600, letterSpacing: -4, lineHeight: 1, color: "#0a0a0a" }}>{p.name}</div>
          <div style={{ fontSize: 32, lineHeight: 1.35, color: "#55554f" }}>{p.tagline}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[...p.platforms, p.where].map((t) => (
              <div key={t} style={{ fontFamily: "Geist Mono", fontSize: 20, padding: "10px 20px", borderRadius: 9999, border: "1.5px solid rgba(0,0,0,0.14)", color: "#3f3f3a" }}>{t}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            {p.impact.slice(0, 2).map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.5, color: "#0a0a0a" }}>{m.value}</div>
                <div style={{ fontSize: 18, color: "#6b6b66" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semibold, weight: 600 },
        { name: "Geist Mono", data: mono, weight: 400 },
      ],
    },
  );
}
