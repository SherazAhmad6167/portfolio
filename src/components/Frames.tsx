import { shot, type ShotRef } from "@/lib/media";
import { cn } from "@/lib/utils";

type ShotProps = {
  shotRef: Pick<ShotRef, "project" | "name">;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function Shot({ shotRef, alt, sizes = "(min-width: 1024px) 60vw, 100vw", priority, className = "" }: ShotProps) {
  const s = shot(shotRef);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={s.src}
      srcSet={s.srcSet}
      sizes={sizes}
      width={s.width}
      height={s.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("block h-auto w-full", className)}
    />
  );
}

export function BrowserFrame({ children, url, className = "" }: { children: React.ReactNode; url?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[var(--shadow)] ${className}`}>
      <div className="flex h-8 items-center gap-3 border-b border-line bg-surface-2 px-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        {url && (
          <div className="mx-auto max-w-[60%] truncate rounded-md bg-bg/60 px-3 py-0.5 text-center font-mono text-[11px] text-muted">{url}</div>
        )}
        <span className="w-[42px]" aria-hidden />
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[2rem] border border-line-strong bg-[#0a0a0a] p-1.5 shadow-[var(--shadow)] ${className}`}>
      <div className="overflow-hidden rounded-[1.6rem]">{children}</div>
    </div>
  );
}

/** A screenshot in the right device frame. */
export function Framed({ shotRef, alt, sizes, priority, className }: { shotRef: ShotRef } & Omit<ShotProps, "shotRef">) {
  const img = <Shot shotRef={shotRef} alt={alt} sizes={sizes} priority={priority} />;
  return shotRef.frame === "phone" ? (
    <PhoneFrame className={className}>{img}</PhoneFrame>
  ) : (
    <BrowserFrame url={shotRef.url} className={className}>
      {img}
    </BrowserFrame>
  );
}
