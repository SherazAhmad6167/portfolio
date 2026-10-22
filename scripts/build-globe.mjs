// Precomputes the dots of the hero globe: points spread evenly over the sphere,
// kept only where there is land. Writes a compact [lat*10, lng*10, ...] list.
// Run with: node scripts/build-globe.mjs
import { readFile, writeFile } from "node:fs/promises";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const topo = JSON.parse(await readFile("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land);

const COUNT = 16000;
const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < COUNT; i++) {
  const y = 1 - (i / (COUNT - 1)) * 2;
  const theta = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // skip Antarctica, it only adds a white cap
  if (geoContains(land, [lng, lat])) out.push(Math.round(lat * 10), Math.round(lng * 10));
}

await writeFile("src/content/globe-land.json", JSON.stringify(out));
console.log(`${out.length / 2} land dots`);
