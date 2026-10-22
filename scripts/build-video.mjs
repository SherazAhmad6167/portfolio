// Compresses the Ranjha Play screen recording for the web and grabs a poster frame.
// Sound is dropped: the clip plays muted, and the recording's audio is TV broadcast sound.
// Run with: npm run video
import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const SRC = "raw-screens/ranjha/IPTV/WhatsApp Video 2026-10-21 at 12.06.45 PM.mp4";
const OUT = "public/media/ranjha";
const POSTER_AT = "00:00:22";

await mkdir(OUT, { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

run([
  "-i", SRC,
  "-an",
  "-vf", "fps=30,scale=540:-2",
  "-c:v", "libx264", "-profile:v", "main", "-preset", "slow", "-crf", "29", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  `${OUT}/play-demo.mp4`,
]);

const frame = `${OUT}/play-demo-poster.png`;
run(["-ss", POSTER_AT, "-i", SRC, "-frames:v", "1", "-vf", "scale=540:-2", frame]);
await sharp(frame).webp({ quality: 80 }).toFile(`${OUT}/play-demo-poster.webp`);
await rm(frame);

console.log(`Wrote ${OUT}/play-demo.mp4 and play-demo-poster.webp`);
