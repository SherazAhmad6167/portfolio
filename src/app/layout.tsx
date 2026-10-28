import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { site } from "@/content/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import CommandPalette from "@/components/CommandPalette";
import Preloader from "@/components/Preloader";
import ToolIconSprite from "@/components/ui/tool-icon-sprite";

export const metadata: Metadata = {
  // Includes the GitHub Pages base path, so relative image URLs below resolve to this copy of the site
  metadataBase: new URL(`${site.url}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`),
  title: {
    default: `${site.name} | Full-Stack Software Engineer`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: `${site.primaryUrl}/` },
  authors: [{ name: site.fullName }],
  openGraph: {
    type: "website",
    title: `${site.name} | Full-Stack Software Engineer`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

// Runs before paint so the saved theme never flashes
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{d.dataset.theme=localStorage.getItem("theme")==="dark"?"dark":"light";if(sessionStorage.getItem("seen"))d.classList.add("seen")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ToolIconSprite />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-invert"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Nav />
          {children}
        </SmoothScroll>
        <CommandPalette />
        <Cursor />
        <div className="grain-wrap" aria-hidden>
          <div className="grain" />
        </div>
      </body>
    </html>
  );
}
