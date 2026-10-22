import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-[100svh] flex-col items-start justify-center gap-10 py-32">
      <title>Page not found | Sheraz Ahmad</title>
      <h1 className="flex items-center gap-6" aria-label="404, page not found">
        <span aria-hidden className="display text-[clamp(7rem,24vw,20rem)]">4</span>
        <span aria-hidden className="orb-dot inline-block aspect-square w-[clamp(5rem,17vw,14rem)]" />
        <span aria-hidden className="display text-[clamp(7rem,24vw,20rem)]">4</span>
      </h1>
      <p className="max-w-md text-lg text-muted">This page doesn&apos;t exist, or it moved. The rest of the site is right where you left it.</p>
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        className="group inline-flex items-center gap-3 rounded-full bg-fg px-6 py-3 text-sm font-medium text-invert"
      >
        <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" />
        Back to the homepage
      </Link>
    </main>
  );
}
