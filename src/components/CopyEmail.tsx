"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/content/site";

export default function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(site.email).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className={`flex h-13 items-center gap-3 rounded-full border border-line-strong px-5 text-sm transition-colors hover:bg-surface ${className}`}
      data-cursor={copied ? "Copied" : "Copy"}
      aria-label={`Copy email address ${site.email}`}
    >
      {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
      <span className="font-mono text-xs">{copied ? "Copied to clipboard" : site.email}</span>
    </button>
  );
}
