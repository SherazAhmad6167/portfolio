// Next.js 16.4 writes client-navigation segment files with backslash paths on Windows,
// so `__next.work.$d$slug.__PAGE__.txt` ends up as `__next.work/$d$slug/__PAGE__.txt`
// and clicking a link fails. This flattens them back. On Linux/macOS it finds nothing to do.
import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const OUT = "out";

async function filesUnder(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await filesUnder(p)));
    else out.push(p);
  }
  return out;
}

let fixed = 0;
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (e.name.startsWith("__next.")) {
      for (const f of await filesUnder(p)) {
        const flat = [e.name, ...path.relative(p, f).split(path.sep)].join(".");
        await rename(f, path.join(dir, flat));
        fixed++;
      }
      await rm(p, { recursive: true, force: true });
    } else if (e.name !== "_next" && e.name !== "media") {
      await walk(p);
    }
  }
}

if ((await stat(OUT).catch(() => null))?.isDirectory()) {
  await walk(OUT);
  if (fixed) console.log(`Flattened ${fixed} segment file(s) in ${OUT}/`);
}
