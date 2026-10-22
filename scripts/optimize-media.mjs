// Turns the raw screenshots in raw-screens/ into web-ready WebP files in public/media/,
// blurring private data (customer names, phone numbers, router IPs, revenue) on the way.
// Run with: npm run media
import sharp from "sharp";
import { mkdir, writeFile, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const RAW = "raw-screens";
const OUT = "public/media";
const WIDTHS = [480, 960, 1600];

// [x1, y1, x2, y2] in source pixels
const media = {
  // Transparent cutout made by `node scripts/portrait.mjs`
  me: {
    portrait: { src: "me/portrait.png" },
  },
  ranjha: {
    login: { src: "ranjha/web app/login.png" },
    dashboard: {
      src: "ranjha/web app/dashboard.png",
      blur: [[1252, 440, 1410, 488], [220, 618, 350, 662], [564, 618, 715, 662], [908, 618, 1058, 662]],
    },
    "isp-panel": { src: "ranjha/web app/dashboard2.png" },
    collections: {
      src: "ranjha/web app/bill collection.png",
      blur: [[262, 455, 560, 778], [1128, 455, 1225, 778], [266, 208, 350, 226], [538, 208, 615, 226], [1352, 208, 1415, 226]],
    },
    mikrotik: {
      src: "ranjha/web app/mikrotik .png",
      blur: [[270, 390, 648, 767], [236, 128, 420, 154], [440, 128, 615, 154]],
    },
    "sms-broadcast": { src: "ranjha/web app/communication1.png", blur: [[238, 538, 420, 705]] },
    "mobile-home": { src: "ranjha/ionic app/WhatsApp Image 2026-10-21 at 11.53.47 AM.jpeg" },
    "mobile-collection": {
      src: "ranjha/ionic app/WhatsApp Image 2026-10-21 at 11.53.46 AM (2).jpeg",
      blur: [[170, 990, 460, 1225], [150, 1510, 480, 1600], [120, 308, 245, 345], [325, 308, 460, 345], [555, 370, 650, 408]],
    },
    "mobile-printer": { src: "ranjha/ionic app/WhatsApp Image 2026-10-21 at 11.53.46 AM.jpeg" },
    "mobile-users": {
      src: "ranjha/ionic app/WhatsApp Image 2026-10-21 at 11.53.47 AM (1).jpeg",
      blur: [[180, 840, 445, 1020], [180, 1205, 445, 1340], [180, 1340, 298, 1385], [380, 310, 495, 345]],
    },
    "mobile-new": { src: "ranjha/ionic app/WhatsApp Image 2026-10-21 at 11.53.47 AM (2).jpeg" },
    "sms-gateway": {
      src: "ranjha/sms-gateway/sms-gateway.jpeg",
      blur: [[55, 925, 530, 980], [55, 1010, 665, 1090], [55, 1205, 530, 1260], [55, 1290, 665, 1370], [55, 1490, 530, 1600]],
    },
    "web-hero": { src: "ranjha/portfolio website/hero section.png" },
    "web-coverage": { src: "ranjha/portfolio website/map.png" },
    "web-offers": { src: "ranjha/portfolio website/posters.png" },
    "web-reviews": { src: "ranjha/portfolio website/reviews.png" },
    "web-apply": { src: "ranjha/portfolio website/form.png" },
    "play-signin": { src: "ranjha/IPTV/WhatsApp Image 2026-10-21 at 12.06.45 PM.jpeg" },
    "play-account": { src: "ranjha/IPTV/WhatsApp Image 2026-10-21 at 12.06.45 PM (1).jpeg" },
  },
  thermox: {
    home: { src: "ranjha/thermox/WhatsApp Image 2026-10-21 at 12.00.03 PM.jpeg" },
    templates: { src: "ranjha/thermox/WhatsApp Image 2026-10-21 at 12.00.02 PM (2).jpeg" },
    "new-receipt": { src: "ranjha/thermox/WhatsApp Image 2026-10-21 at 12.00.03 PM (1).jpeg" },
    printer: { src: "ranjha/thermox/WhatsApp Image 2026-10-21 at 12.00.02 PM.jpeg" },
    settings: { src: "ranjha/thermox/WhatsApp Image 2026-10-21 at 12.00.02 PM (1).jpeg", blur: [[150, 550, 420, 595]] },
  },
  ifight: {
    home: { src: "iFight/home.png" },
    profiles: { src: "iFight/create profile.png" },
    events: { src: "iFight/events.png" },
    "network-map": { src: "iFight/network map.png" },
  },
  dowson: {
    home: { src: "dowson/home.png" },
    labels: { src: "dowson/printing.png" },
    reports: { src: "dowson/reports.png" },
    stock: { src: "dowson/stock.png" },
    warehouse: { src: "dowson/warehouse.png" },
  },
  praxis: {
    sourcing: { src: "praxis/WhatsApp Image 2026-10-21 at 1.03.11 PM.jpeg" },
  },
  campost: {
    dashboard: { src: "africasoft/customer-portal/dashboard.png" },
    "send-money": { src: "africasoft/customer-portal/payment.png" },
    "mobile-login": { src: "africasoft/customer-portal/mobile login.png" },
    "agent-home": { src: "africasoft/manager-portal/home.png" },
    "issuer-portal": { src: "africasoft/manager-portal/homw2.png" },
    services: { src: "africasoft/manager-portal/services.png" },
  },
};

async function blurBoxes(input, boxes) {
  const img = sharp(input);
  const { width, height } = await img.metadata();
  const layers = [];
  for (const [x1, y1, x2, y2] of boxes) {
    const left = Math.max(0, x1), top = Math.max(0, y1);
    const w = Math.min(width, x2) - left, h = Math.min(height, y2) - top;
    if (w <= 0 || h <= 0) continue;
    const patch = await sharp(input).extract({ left, top, width: w, height: h }).blur(14).toBuffer();
    layers.push({ input: patch, left, top });
  }
  return sharp(await img.composite(layers).toBuffer());
}

const manifest = {};
for (const [project, items] of Object.entries(media)) {
  await mkdir(path.join(OUT, project), { recursive: true });
  manifest[project] = {};
  for (const [name, { src, blur = [] }] of Object.entries(items)) {
    const input = path.join(RAW, src);
    const base = blur.length ? await blurBoxes(input, blur) : sharp(input);
    const buf = await base.png().toBuffer();
    const { width, height } = await sharp(buf).metadata();
    const widths = WIDTHS.filter((w) => w < width).concat(width > WIDTHS.at(-1) ? [] : [width]);
    for (const w of widths) {
      await sharp(buf).resize({ width: w }).webp({ quality: 82 }).toFile(path.join(OUT, project, `${name}-${w}.webp`));
    }
    manifest[project][name] = { w: width, h: height, sizes: widths };
  }
  console.log(project, Object.keys(items).length);
}

await writeFile("src/content/media.json", JSON.stringify(manifest, null, 2) + "\n");

// Social preview image; the orb becomes the "SA" monogram from `npm run avatar` when it exists
const avatarFile = path.join(RAW, "me/avatar.png");
const avatar = (await stat(avatarFile).catch(() => null))
  ? `<image href="data:image/png;base64,${(await sharp(avatarFile).png().toBuffer()).toString("base64")}" x="750" y="100" width="430" height="430"/>`
  : "";
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a5f3fc"/><stop offset="0.35" stop-color="#c4b5fd"/>
      <stop offset="0.7" stop-color="#fbcfe8"/><stop offset="1" stop-color="#fde68a"/>
    </linearGradient>
    <radialGradient id="s" cx="0.34" cy="0.28" r="0.75">
      <stop offset="0" stop-color="#fff" stop-opacity="0.95"/>
      <stop offset="0.42" stop-color="#fff" stop-opacity="0.15"/>
      <stop offset="1" stop-color="#0f0f1e" stop-opacity="0.22"/>
    </radialGradient>
    <linearGradient id="t" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7dd3fc"/><stop offset="0.35" stop-color="#a78bfa"/>
      <stop offset="0.7" stop-color="#f472b6"/><stop offset="1" stop-color="#fbbf24"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#f4f4f1"/>
  <circle cx="965" cy="315" r="215" fill="url(#g)"/>
  <circle cx="965" cy="315" r="215" fill="url(#s)"/>
  ${avatar}
  <text x="80" y="110" font-family="Arial, sans-serif" font-size="22" fill="#6b6b66" letter-spacing="2">SHERAZ AHMAD · SOFTWARE ENGINEER</text>
  <text x="76" y="330" font-family="Arial, sans-serif" font-weight="700" font-size="120" fill="#0a0a0a" letter-spacing="-6">Software</text>
  <text x="76" y="450" font-family="Arial, sans-serif" font-weight="700" font-size="120" fill="#0a0a0a" letter-spacing="-6">with a <tspan fill="url(#t)">pulse.</tspan></text>
  <text x="80" y="550" font-family="Arial, sans-serif" font-size="26" fill="#6b6b66">Web, mobile, AI and the hardware in between.</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log("og.png");
