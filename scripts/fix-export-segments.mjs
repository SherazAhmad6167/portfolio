// Post-build fixes for the static export in out/:
// 1. Next.js 16.4 writes client-navigation segment files with backslash paths on Windows,
//    so `__next.work.$d$slug.__PAGE__.txt` ends up as `__next.work/$d$slug/__PAGE__.txt`
//    and clicking a link fails. This flattens them back. On Linux/macOS it finds nothing to do.
// 2. Case-study share images are written as `opengraph-image` with no extension, which static
//    hosts serve without an image type. They get a `.png` name and every link to them follows.
import { readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
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

async function nameShareImages() {
  let renamed = 0;
  const files = await filesUnder(OUT);
  for (const f of files) {
    if (path.basename(f) === "opengraph-image") {
      await rename(f, `${f}.png`);
      renamed++;
    }
  }
  if (!renamed) return;
  for (const f of files) {
    if (!/\.(html|txt)$/.test(f) || f.includes(`${path.sep}_next${path.sep}`)) continue;
    const text = await readFile(f, "utf8");
    const next = text.replaceAll("/opengraph-image?", "/opengraph-image.png?");
    if (next !== text) await writeFile(f, next);
  }
  console.log(`Named ${renamed} share image(s) .png`);
}

if ((await stat(OUT).catch(() => null))?.isDirectory()) {
  await walk(OUT);
  if (fixed) console.log(`Flattened ${fixed} segment file(s) in ${OUT}/`);
  await nameShareImages();
}
