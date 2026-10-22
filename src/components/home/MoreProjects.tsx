import { moreProjects } from "@/content/projects";
import { Framed } from "../Frames";
import { VideoShowcase } from "@/components/ui/demo-video";

export default function MoreProjects() {
  return (
    <section aria-labelledby="more-title" className="container-page pb-10">
      <h2 id="more-title" className="label mb-8 border-t border-line pt-6">
        Also built
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {moreProjects.map((m) => (
          <li key={m.name} className="group flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface">
            <div className="relative h-56 overflow-hidden bg-surface-2 px-8 pt-8">
              {m.video ? (
                <VideoShowcase video={m.video} name={m.name} />
              ) : (
                <div
                  className={`mx-auto transition-transform duration-700 ease-out-expo group-hover:-translate-y-3 ${
                    m.shot.frame === "phone" ? "w-[44%]" : "w-full"
                  }`}
                >
                  <Framed shotRef={m.shot} alt={`${m.name} screen`} sizes="(min-width: 768px) 30vw, 90vw" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="text-xl font-medium tracking-tight">{m.name}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted">{m.text}</p>
              <p className="font-mono text-[11px] text-faint">{m.stack.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
