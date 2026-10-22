// Cuts the white background out of raw-screens/me/passport.jpg and writes
// raw-screens/me/portrait.png (transparent), ready for `npm run media`.
// Works for photos on a plain, light background.
import sharp from "sharp";

const SRC = "raw-screens/me/passport.jpg";
const OUT = "raw-screens/me/portrait.png";

// Light touch-up first: a little contrast, colour and sharpness
const base = sharp(SRC).modulate({ saturation: 1.06 }).linear(1.06, -6).sharpen({ sigma: 0.8 });
const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;

// 1. Near-white, near-neutral pixels are background candidates
const cand = new Uint8Array(w * h);
for (let i = 0; i < w * h; i++) {
  const r = data[i * c], g = data[i * c + 1], b = data[i * c + 2];
  const lo = Math.min(r, g, b), hi = Math.max(r, g, b);
  cand[i] = lo > 200 && hi - lo < 30 ? 1 : 0;
}

// 2. Background = candidates connected to the image border (keeps the white shirt)
const bg = new Uint8Array(w * h);
const stack = [];
const seed = (x, y) => {
  const i = y * w + x;
  if (cand[i] && !bg[i]) {
    bg[i] = 1;
    stack.push(i);
  }
};
for (let x = 0; x < w; x++) {
  seed(x, 0);
  seed(x, h - 1);
}
for (let y = 0; y < h; y++) {
  seed(0, y);
  seed(w - 1, y);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % w, y = (i / w) | 0;
  if (x > 0) seed(x - 1, y);
  if (x < w - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < h - 1) seed(x, y + 1);
}
// The photo is cropped at the bottom, so the suit touches the edge: keep it opaque there
let alpha = Buffer.alloc(w * h);
for (let i = 0; i < w * h; i++) alpha[i] = bg[i] ? 0 : 255;

// 3. Pull the edge in by a pixel and soften it so no white halo remains
const eroded = Buffer.alloc(w * h);
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    let m = 255;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const xx = Math.min(w - 1, Math.max(0, x + dx)), yy = Math.min(h - 1, Math.max(0, y + dy));
        m = Math.min(m, alpha[yy * w + xx]);
      }
    eroded[y * w + x] = m;
  }
alpha = await sharp(eroded, { raw: { width: w, height: h, channels: 1 } }).blur(0.9).extractChannel(0).raw().toBuffer();

// 4. Remove the white mixed into semi-transparent edge pixels
const out = Buffer.alloc(w * h * 4);
for (let i = 0; i < w * h; i++) {
  const a = alpha[i] / 255;
  for (let k = 0; k < 3; k++) {
    const v = data[i * c + k];
    out[i * 4 + k] = a > 0.02 && a < 0.98 ? Math.max(0, Math.min(255, Math.round((v - 255 * (1 - a)) / a))) : v;
  }
  out[i * 4 + 3] = alpha[i];
}
await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(OUT);
console.log(`Wrote ${OUT} (${w}x${h})`);
