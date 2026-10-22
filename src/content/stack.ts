import {
  siAndroid,
  siAngular,
  siApacheecharts,
  siBitbucket,
  siBluetooth,
  siCapacitor,
  siClaude,
  siExpo,
  siExpress,
  siFastapi,
  siFirebase,
  siGit,
  siGithubactions,
  siGooglegemini,
  siGreensock,
  siIonic,
  siJira,
  siKotlin,
  siLeaflet,
  siMapbox,
  siMikrotik,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPwa,
  siPython,
  siReact,
  siReactivex,
  siSqlite,
  siStripe,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
} from "simple-icons";
import { CloudCog, Database, Globe, MessagesSquare, Sparkles, type LucideIcon } from "lucide-react";

/** Either a brand mark from simple-icons (an SVG path) or a generic lucide icon. */
export type ToolIcon = { path: string } | { lucide: LucideIcon };
export type Tool = { name: string; icon: ToolIcon; color: string };
export type ToolGroup = { group: string; blurb: string; tools: Tool[] };

const si = (icon: { path: string; hex: string }, name: string, color = `#${icon.hex}`): Tool => ({ name, icon: { path: icon.path }, color });
const lu = (lucide: LucideIcon, name: string, color: string): Tool => ({ name, icon: { lucide }, color });

// Brands missing from simple-icons (Microsoft Azure, OpenAI, CometChat) use a generic icon in the brand colour
export const toolGroups: ToolGroup[] = [
  {
    group: "Frontend",
    blurb: "Interfaces that feel fast and stay maintainable.",
    tools: [
      si(siAngular, "Angular", "#E23237"),
      si(siReact, "React"),
      si(siNextdotjs, "Next.js"),
      si(siTypescript, "TypeScript"),
      si(siTailwindcss, "Tailwind CSS"),
      si(siReactivex, "RxJS"),
      si(siGreensock, "GSAP"),
      si(siThreedotjs, "Three.js"),
      si(siPwa, "PWA"),
    ],
  },
  {
    group: "Mobile",
    blurb: "Android apps that talk to printers, SIM cards and scanners.",
    tools: [
      si(siReact, "React Native"),
      si(siExpo, "Expo"),
      si(siIonic, "Ionic"),
      si(siCapacitor, "Capacitor"),
      si(siKotlin, "Kotlin"),
      si(siAndroid, "Android"),
    ],
  },
  {
    group: "Backend",
    blurb: "APIs, serverless functions and the glue between systems.",
    tools: [
      si(siNodedotjs, "Node.js"),
      si(siExpress, "Express"),
      lu(CloudCog, "Azure Functions", "#0078D4"),
      si(siFirebase, "Cloud Functions"),
      si(siFastapi, "FastAPI"),
      si(siPython, "Python"),
    ],
  },
  {
    group: "Data",
    blurb: "Realtime, relational and offline-first storage.",
    tools: [
      si(siFirebase, "Firestore"),
      lu(Database, "Azure SQL", "#0078D4"),
      si(siSupabase, "Supabase"),
      si(siPostgresql, "PostgreSQL"),
      si(siSqlite, "SQLite"),
    ],
  },
  {
    group: "Integrations",
    blurb: "Payments, maps, chat, AI models and real hardware.",
    tools: [
      si(siStripe, "Stripe"),
      lu(MessagesSquare, "CometChat", "#6851D6"),
      si(siMapbox, "Mapbox"),
      si(siLeaflet, "Leaflet"),
      si(siMikrotik, "MikroTik"),
      si(siBluetooth, "Bluetooth ESC/POS"),
      si(siClaude, "Claude"),
      si(siGooglegemini, "Gemini"),
      lu(Sparkles, "OpenAI", "#10A37F"),
      si(siApacheecharts, "ECharts"),
    ],
  },
  {
    group: "Delivery",
    blurb: "Shipping, hosting and keeping teams in sync.",
    tools: [
      si(siGithubactions, "GitHub Actions"),
      si(siFirebase, "Firebase Hosting"),
      lu(Globe, "Azure Static Web Apps", "#0078D4"),
      si(siExpo, "EAS Build"),
      si(siGit, "Git"),
      si(siBitbucket, "Bitbucket"),
      si(siJira, "Jira"),
    ],
  },
];

/** Every tool once (first occurrence wins), with the groups it belongs to. */
export const allTools = (() => {
  const map = new Map<string, Tool & { groups: string[] }>();
  for (const g of toolGroups) {
    for (const t of g.tools) {
      const key = t.name;
      const hit = map.get(key);
      if (hit) hit.groups.push(g.group);
      else map.set(key, { ...t, groups: [g.group] });
    }
  }
  return [...map.values()];
})();

// Project pages list tech as free text ("Angular 19", "Stripe Connect"); these map it to a logo
const aliases: Record<string, string> = {
  firebase: "Firestore",
  "firebase auth": "Firestore",
  "cloud functions": "Cloud Functions",
  "esc/pos": "Bluetooth ESC/POS",
  "mikrotik api": "MikroTik",
  "ionic + capacitor": "Ionic",
  "stripe connect": "Stripe",
  "angular ssr": "Angular",
  "react native": "React Native",
  "llm apis": "Claude",
};

export function toolFor(label: string) {
  const key = label.toLowerCase().trim();
  const alias = aliases[key];
  if (alias) return allTools.find((t) => t.name === alias);
  return (
    allTools.find((t) => t.name.toLowerCase() === key) ??
    allTools.find((t) => key.startsWith(t.name.toLowerCase() + " ")) // "Angular 19", "Expo SDK 57"
  );
}
