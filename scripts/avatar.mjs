// Renders still copies of the liquid-glass "SA" monogram (the live one is CSS, see .glass-mono
// in globals.css): src/app/apple-icon.png for home screens and raw-screens/me/avatar.png,
// which `npm run media` puts on the social preview image.
// Run with: npm run avatar
import sharp from "sharp";

const S = 512;
const C = S / 2;
const STOPS = ["#7dd3fc", "#c4b5fd", "#f9a8d4", "#fde68a", "#7dd3fc"];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (t) => {
  const seg = Math.min(STOPS.length - 2, Math.floor(t * (STOPS.length - 1)));
  const f = t * (STOPS.length - 1) - seg;
  const [a, b] = [hex(STOPS[seg]), hex(STOPS[seg + 1])];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(",")})`;
};

// SVG has no conic gradient, so the orb is drawn as thin wedges and softened
const N = 240;
const wedges = Array.from({ length: N }, (_, i) => {
  const a0 = (i / N) * 2 * Math.PI - Math.PI / 2;
  const a1 = ((i + 1.6) / N) * 2 * Math.PI - Math.PI / 2;
  const p = (a) => `${(C + Math.cos(a) * S).toFixed(1)} ${(C + Math.sin(a) * S).toFixed(1)}`;
  return `<path d="M${C} ${C} L${p(a0)} L${p(a1)} Z" fill="${mix(i / N)}"/>`;
}).join("");

const r = S * 0.37; // glass disc: inset 13%, as in the CSS
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
  <defs>
    <clipPath id="orb"><circle cx="${C}" cy="${C}" r="${C}"/></clipPath>
    <clipPath id="disc"><circle cx="${C}" cy="${C}" r="${r}"/></clipPath>
    <filter id="smooth"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="frost"><feGaussianBlur stdDeviation="18"/></filter>
    <radialGradient id="spec" cx="0.32" cy="0.24" r="0.6">
      <stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#orb)"><g filter="url(#smooth)">${wedges}</g></g>
  <g clip-path="url(#disc)"><g filter="url(#frost)">${wedges}</g></g>
  <circle cx="${C}" cy="${C}" r="${r}" fill="#fff" fill-opacity="0.42"/>
  <circle cx="${C}" cy="${C}" r="${r}" fill="url(#spec)"/>
  <circle cx="${C}" cy="${C}" r="${r - 1.5}" fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="3"/>
  <text x="${C}" y="${C}" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="600" font-size="${S * 0.34}" letter-spacing="${-S * 0.017}" fill="#1a1a2e">SA</text>
</svg>`;

const round = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${C}" cy="${C}" r="${C}"/></svg>`);
const master = await sharp(Buffer.from(svg)).composite([{ input: round, blend: "dest-in" }]).png().toBuffer();

await sharp(master).toFile("raw-screens/me/avatar.png");
// Home-screen icons are square, so that one keeps the full orb behind the disc
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("src/app/apple-icon.png");

console.log("avatar: src/app/apple-icon.png, raw-screens/me/avatar.png");
