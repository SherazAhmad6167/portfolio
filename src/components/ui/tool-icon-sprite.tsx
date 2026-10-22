import { allTools } from "@/content/stack";
import { toolSymbolId } from "./tool-icon";

/** Every brand logo drawn once per page; ToolIcon reuses them with <use>, so repeats cost almost nothing. */
export default function ToolIconSprite() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      {allTools.map((t) =>
        "path" in t.icon ? (
          <symbol key={t.name} id={toolSymbolId(t.name)} viewBox="0 0 24 24">
            <path d={t.icon.path} fill="currentColor" />
          </symbol>
        ) : null,
      )}
    </svg>
  );
}
