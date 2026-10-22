import type { ShotRef } from "@/lib/media";

export type Flow = { title: string; steps: { title: string; detail: string }[] };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  client: string;
  where: string;
  engagement: "Freelance" | "Technoverse" | "Open source";
  role: string;
  platforms: string[];
  stack: string[];
  impact: { value: string; label: string }[];
  links: { label: string; href: string; note?: string }[];
  cover: ShotRef;
  coverExtra?: ShotRef;
  /** A custom illustrated visual is used instead of screenshots on the home page */
  visual?: "praxis";
  problem: string;
  overview: string[];
  built: { title: string; text: string }[];
  flows: Flow[];
  highlights: string[];
  gallery: ShotRef[];
};

export const projects: Project[] = [
  {
    slug: "ranjha-isp-suite",
    name: "Ranjha 7 Star ISP Suite",
    tagline: "Five connected apps that run a whole internet provider, from the router to the receipt.",
    summary:
      "Admin panel, field app, SMS gateway, receipt-printer app and website for a local ISP, all built solo and running daily for 6,000+ subscribers.",
    client: "Ranjha 7 Star Internet",
    where: "Pakistan",
    engagement: "Freelance",
    role: "Sole developer: design, frontend, backend, mobile, deployment",
    platforms: ["Web", "Android", "PWA"],
    stack: ["Angular 19", "Ionic + Capacitor", "React Native", "Kotlin", "Node.js", "Express", "Firebase", "MikroTik API"],
    impact: [
      { value: "6,000+", label: "subscribers managed" },
      { value: "12,000+", label: "SMS on peak days" },
      { value: "5", label: "apps, one system" },
    ],
    links: [{ label: "Admin panel", href: "https://ranjha7starcable.web.app/", note: "login required" }],
    cover: { project: "ranjha", name: "dashboard", frame: "browser", url: "ranjha7starcable.web.app" },
    coverExtra: { project: "ranjha", name: "mobile-home", frame: "phone" },
    problem:
      "Ranjha 7 Star connects thousands of homes across dozens of villages. Billing, cash collection, router accounts, complaints and customer messages were all handled by hand, on paper and in WhatsApp chats.",
    overview: [
      "I designed and built the full software stack for the business on my own. Office staff run everything from one admin panel, recovery officers collect payments in the field with a mobile app that prints receipts on a Bluetooth printer, and every customer gets an SMS the moment they pay.",
      "The admin panel talks directly to the MikroTik routers through a small Node.js proxy, so staff can enable, disable and create PPPoE accounts without opening Winbox. Bills, collections, defaulters, stock, expenses and complaints all live in one place, with role-based access for admins and operators.",
    ],
    built: [
      {
        title: "Admin panel",
        text: "Angular 19 + Firebase PWA with 30+ modules: billing, collections, defaulters, recovery officers, stock, expenses, complaints, logs and page-level permissions.",
      },
      {
        title: "Field app",
        text: "Ionic + Capacitor Android app for recovery officers: collect payments, add new connections, scan IDs and print receipts over Bluetooth.",
      },
      {
        title: "SMS gateway",
        text: "Android app with a native Kotlin foreground service that turns a SIM card into a gateway, delivering queued SMS even when the app is closed or the phone reboots.",
      },
      {
        title: "Router bridge",
        text: "Node.js + Express proxy for the MikroTik RouterOS API and ZalUltra panel, so PPPoE users can be managed straight from the admin panel.",
      },
      {
        title: "Public website",
        text: "React + Vite site with offers, a village-by-village coverage map, moderated reviews and an online connection form, all editable from the admin panel.",
      },
    ],
    flows: [
      {
        title: "From payment to SMS",
        steps: [
          { title: "Officer collects", detail: "Payment recorded in the field app" },
          { title: "Receipt prints", detail: "Bluetooth thermal printer, on the spot" },
          { title: "Firestore queue", detail: "SMS document created as pending" },
          { title: "Gateway claims it", detail: "Native listener locks it in a transaction" },
          { title: "Customer notified", detail: "Sent through SIM 1, retried up to 8 times" },
        ],
      },
      {
        title: "From admin panel to router",
        steps: [
          { title: "Admin action", detail: "Enable, disable or create a user" },
          { title: "Node proxy", detail: "Validated request, allowed origins only" },
          { title: "RouterOS API", detail: "PPPoE secret updated on port 8728" },
          { title: "Panel refreshes", detail: "Live status back in the dashboard" },
        ],
      },
    ],
    highlights: [
      "Moved the SMS queue out of JavaScript and into a native Android service, so delivery no longer stops when the app is swiped away.",
      "Each SMS is claimed inside a Firestore transaction, so two phones can never send the same message twice.",
      "Broadcast messages with per-customer variables like {name}, {package} and {amount}, filtered by area.",
      "Firestore backup and data-check scripts that keep 6,000+ customer records consistent.",
    ],
    gallery: [
      { project: "ranjha", name: "login", frame: "browser", caption: "Admin sign-in" },
      { project: "ranjha", name: "isp-panel", frame: "browser", caption: "Live subscriber health from the router panel" },
      { project: "ranjha", name: "collections", frame: "browser", caption: "Bill collections (customer data blurred)" },
      { project: "ranjha", name: "mikrotik", frame: "browser", caption: "MikroTik PPPoE users, managed from the panel" },
      { project: "ranjha", name: "sms-broadcast", frame: "browser", caption: "Broadcast SMS with personalised templates" },
      { project: "ranjha", name: "mobile-home", frame: "phone", caption: "Field app home" },
      { project: "ranjha", name: "mobile-collection", frame: "phone", caption: "Collections on the go" },
      { project: "ranjha", name: "mobile-printer", frame: "phone", caption: "Bluetooth printer pairing" },
      { project: "ranjha", name: "mobile-new", frame: "phone", caption: "New connection form" },
      { project: "ranjha", name: "sms-gateway", frame: "phone", caption: "SMS gateway status" },
      { project: "ranjha", name: "web-hero", frame: "browser", caption: "Public website" },
      { project: "ranjha", name: "web-coverage", frame: "browser", caption: "Coverage, village by village" },
    ],
  },
  {
    slug: "ifight",
    name: "iFight",
    tagline: "A combat-sports network for the UK: fighters, clubs, promoters, bookings, tickets and live streams.",
    summary:
      "Multi-profile platform with Stripe payments, paid live streams, matchmaking, bookings, chat and a UK-wide map, running on Azure.",
    client: "iFight UK",
    where: "United Kingdom",
    engagement: "Technoverse",
    role: "Full-stack engineer: Angular frontend and Azure Functions APIs",
    platforms: ["Web"],
    stack: ["Angular 17", "Azure Functions", "Azure SQL", "Firebase Auth", "Stripe Connect", "CometChat", "Mapbox"],
    impact: [
      { value: "177", label: "Azure Functions" },
      { value: "8", label: "profile types" },
      { value: "4", label: "release stages" },
    ],
    links: [{ label: "Visit ifight.uk", href: "https://www.ifight.uk/" }],
    cover: { project: "ifight", name: "home", frame: "browser", url: "ifight.uk" },
    coverExtra: { project: "ifight", name: "network-map", frame: "browser", url: "ifight.uk/network" },
    problem:
      "Combat sports in the UK run on scattered spreadsheets, social media posts and cash on the door. Fighters, coaches, clubs and promoters had no single place to find each other, sell tickets or book sessions.",
    overview: [
      "iFight brings the whole scene into one platform. A single account can hold several profiles (member, fighter, youth, coach, club, promoter, association or service provider), and each one unlocks its own tools.",
      "I work across the Angular frontend and the Azure Functions API layer: payments and payouts with Stripe Connect, subscriptions, paid live streams and replays, session bookings, fight cards and matchmaking, community events, real-time chat and calls, and a map of every club and fighter in the country.",
    ],
    built: [
      { title: "Payments & payouts", text: "Stripe Connect onboarding for clubs, promoters and associations, ticket and stream checkouts, memberships, subscriptions and webhook sync." },
      { title: "Live streaming", text: "Pay-per-view event streams with pricing, broadcaster tools, recordings and paid replay access." },
      { title: "Bookings", text: "Coaches and providers publish availability and session types; members book, pay, reschedule or cancel." },
      { title: "Fight cards & matchmaking", text: "Promoters build cards, propose bouts, record results; fighters post match requests and interest." },
      { title: "Network map & chat", text: "Mapbox directory of clubs and fighters across the UK, plus CometChat messaging and calls." },
    ],
    flows: [
      {
        title: "Selling a live stream",
        steps: [
          { title: "Promoter sets price", detail: "Stream pricing saved per event" },
          { title: "Fan checks out", detail: "Stripe Checkout session created" },
          { title: "Webhook confirms", detail: "Access granted in Azure SQL" },
          { title: "Watch live or replay", detail: "Playback unlocked for that fan" },
          { title: "Payout", detail: "Funds routed to the promoter's Connect account" },
        ],
      },
    ],
    highlights: [
      "177 serverless endpoints on Azure Functions backed by Azure SQL.",
      "Branch flow from Develop to UAT to PreProd to Prod, automated with Jira and Azure Static Web Apps.",
      "One login, many roles: profile-aware navigation and permissions across eight profile types.",
      "Affiliate programme wired in through FirstPromoter webhooks.",
    ],
    gallery: [
      { project: "ifight", name: "home", frame: "browser", caption: "Home feed with upcoming events" },
      { project: "ifight", name: "network-map", frame: "browser", caption: "UK network map" },
      { project: "ifight", name: "profiles", frame: "browser", caption: "Eight profile types, one account" },
      { project: "ifight", name: "events", frame: "browser", caption: "Event and show management" },
    ],
  },
  {
    slug: "praxis-ipm",
    name: "Praxis iPM",
    tagline: "Drop in photos, speak the brief, set a budget: AI agents produce the whole renovation job pack.",
    summary:
      "An AI project manager for renovation work: multi-stage agent pipeline, approvals queue, supplier sourcing and auto-generated estimates, schedules and trade briefs.",
    client: "Praxis Enhancement",
    where: "Australia",
    engagement: "Technoverse",
    role: "Full-stack engineer: Next.js app, FastAPI agents, Supabase",
    platforms: ["Web"],
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "Supabase", "Claude", "Gemini", "OpenAI"],
    impact: [
      { value: "40+", label: "app modules" },
      { value: "6", label: "document types generated" },
      { value: "35", label: "releases shipped" },
    ],
    links: [],
    cover: { project: "praxis", name: "sourcing", frame: "browser", url: "praxis · sourcing" },
    visual: "praxis",
    problem:
      "Scoping a renovation means walking the property, taking hundreds of photos, then spending days turning notes into estimates, material lists, schedules and briefs for every trade.",
    overview: [
      "Praxis iPM turns that into a pipeline. The project manager creates a job, uploads photos and videos, records a voice brief and sets a budget. AI agents then run stage by stage, and each stage lands in an approvals queue before the next one starts.",
      "Approved work becomes a complete, organised job pack: scope of works and estimate spreadsheets, site assessment and photo reports, shopping lists, a Gantt schedule, a brief for each trade, owner updates and budget tracking. Around the pipeline sit 40+ modules, from inspections and defects to AI-assisted supplier sourcing and calling.",
    ],
    built: [
      { title: "Agent pipeline", text: "FastAPI agents that turn photos, voice and budget into scope, estimate, materials, schedule and briefs." },
      { title: "Approvals queue", text: "Every stage pauses for a human decision; approving one fires the next." },
      { title: "Document output", text: "Generated .docx and .xlsx files filed into numbered project folders automatically." },
      { title: "Sourcing", text: "Step-by-step supplier search for materials and trades, with saved results and a call queue." },
    ],
    flows: [
      {
        title: "The job pipeline",
        steps: [
          { title: "Intake", detail: "Address, photos, videos, voice brief, budget" },
          { title: "Scope", detail: "Agent drafts the scope of works" },
          { title: "Estimate", detail: "Costed SOW spreadsheet" },
          { title: "Materials", detail: "Shopping list and supply plan" },
          { title: "Schedule", detail: "Gantt plan and daily briefs" },
          { title: "Trade briefs", detail: "One brief per trade, ready to send" },
        ],
      },
    ],
    highlights: [
      "Multi-model setup using Claude, Gemini and OpenAI where each fits best.",
      "Human-in-the-loop by design: nothing moves forward without approval.",
      "Supabase for auth, Postgres and file storage, with Resend for email.",
      "A living changelog: 35 versioned releases with design-system clean-ups along the way.",
    ],
    gallery: [{ project: "praxis", name: "sourcing", frame: "browser", caption: "AI sourcing: tell it what and where" }],
  },
  {
    slug: "dowson-mes",
    name: "Dowson MES",
    tagline: "The factory floor in one app: work orders, labels, assembly, quality, stock and warehouse.",
    summary:
      "Manufacturing execution system for a pump factory: QR labels, production tracking, quality reports, stock and a rack-level warehouse map.",
    client: "Dowson",
    where: "Manufacturing",
    engagement: "Technoverse",
    role: "Lead developer: Angular PWA, Firebase, Cloud Functions",
    platforms: ["Web", "PWA"],
    stack: ["Angular 19", "Angular SSR", "Firebase", "Cloud Functions", "Web Push", "Chart.js", "QR / Barcode"],
    impact: [
      { value: "15+", label: "factory modules" },
      { value: "2", label: "hosted apps" },
      { value: "QR", label: "label to warehouse" },
    ],
    links: [{ label: "Live app", href: "https://dowsonpwa.web.app/", note: "login required" }],
    cover: { project: "dowson", name: "home", frame: "browser", url: "dowsonpwa.web.app" },
    coverExtra: { project: "dowson", name: "labels", frame: "browser", url: "dowsonpwa.web.app/labeling" },
    problem:
      "Components, sub-assemblies and finished pumps were tracked on paper and spreadsheets, so nobody could see live stock, production by shift, or where a pallet was sitting in the warehouse.",
    overview: [
      "Dowson MES follows every part from goods-inward to the warehouse rack. Each component gets a printed QR label; scanning it moves it through assembly, production and quality, and every action is written to a history log.",
      "Supervisors see production by shift and quality averages in real-time charts, stock levels for every component, and a rack-by-rack warehouse map. Web push notifications, OTP sign-in and auto-logout keep the shop floor PWA practical on shared devices.",
    ],
    built: [
      { title: "Labeling & scanning", text: "Generate, print and scan QR labels for components, sub-assemblies and finished goods." },
      { title: "Production & quality", text: "Shift-based production records, dose-weight and pump checks, approvals and reports." },
      { title: "Stock & warehouse", text: "Component stock with in-transit tracking and a rack-level warehouse layout." },
      { title: "Knowledge & SOPs", text: "Troubleshooting guides, SOPs and a knowledge base right on the floor." },
    ],
    flows: [
      {
        title: "A part's journey",
        steps: [
          { title: "Goods inward", detail: "Material received and logged" },
          { title: "QR label", detail: "Printed and stuck on the box" },
          { title: "Assembly", detail: "Scanned into sub and final assembly" },
          { title: "Quality check", detail: "Measured and approved by shift" },
          { title: "Warehouse", detail: "Placed on a mapped rack" },
        ],
      },
    ],
    highlights: [
      "Two Firebase Hosting targets from one codebase: the shop-floor PWA and the MES dashboard.",
      "Cloud Functions for push notifications with VAPID keys and server-side logic.",
      "Full audit trail: material, stock, production, settings and user history.",
      "Wrote the large majority of the codebase.",
    ],
    gallery: [
      { project: "dowson", name: "home", frame: "browser", caption: "Production dashboard" },
      { project: "dowson", name: "labels", frame: "browser", caption: "Label printing and scanning" },
      { project: "dowson", name: "reports", frame: "browser", caption: "Quality report by shift" },
      { project: "dowson", name: "stock", frame: "browser", caption: "Stock management" },
      { project: "dowson", name: "warehouse", frame: "browser", caption: "Rack-level warehouse map" },
    ],
  },
  {
    slug: "campost-money",
    name: "Campost Money",
    tagline: "A digital wallet for Cameroon: send money, pay bills, borrow and cash out, with agents everywhere.",
    summary:
      "Fintech customer wallet and agent portals for Cameroon Postal Services: transfers, GIMAC cross-border payments, micro-loans and face-verified onboarding.",
    client: "Campost (Cameroon Postal Services)",
    where: "Cameroon",
    engagement: "Technoverse",
    role: "Frontend engineer: built the customer wallet, contributed to the agent portal",
    platforms: ["Web", "Mobile web"],
    stack: ["Angular 17", "Tailwind CSS", "Firebase", "ngx-translate", "face-api.js", "ECharts", "Leaflet"],
    impact: [
      { value: "2", label: "portals" },
      { value: "EN · FR", label: "bilingual" },
      { value: "KYC", label: "face-verified sign-up" },
    ],
    links: [],
    cover: { project: "campost", name: "dashboard", frame: "browser", url: "campost money · wallet" },
    coverExtra: { project: "campost", name: "mobile-login", frame: "phone" },
    problem:
      "Many people in Cameroon live far from a bank branch. Campost wanted its post offices and agents to act as a bank: deposits, transfers, bill payments and small loans.",
    overview: [
      "The customer wallet lets people sign up on their own with face verification, send money locally or across the CEMAC region through GIMAC, deposit, cash out, take micro-loans and pay for services.",
      "Agents and managers use a separate portal for cash-in and cash-out, float requests, commissions, merchant settlements, monthly statements and receipt reprints, plus a catalogue of bill, school, university, tax and utility payments.",
    ],
    built: [
      { title: "Customer wallet", text: "Send money, GIMAC transfers, deposits, self cash-out, micro-loans, ePOS payments and account limits." },
      { title: "Self-onboarding", text: "Sign-up with face detection and matching in the browser using face-api.js." },
      { title: "Agent portal", text: "Transactions, float requests, commissions, settlements, statements and receipt reprints." },
      { title: "Services catalogue", text: "Bill, school, university, tax and utility payments in one place." },
    ],
    flows: [
      {
        title: "Sending money",
        steps: [
          { title: "Pick a contact", detail: "Local or international" },
          { title: "Enter amount", detail: "Live rate and fees shown" },
          { title: "Recipient details", detail: "Wallet, bank or GIMAC" },
          { title: "Confirm", detail: "Second factor and receipt" },
        ],
      },
    ],
    highlights: [
      "Built almost the entire customer wallet portal.",
      "English and French throughout with ngx-translate.",
      "Two-factor sign-in and captcha on sensitive flows.",
    ],
    gallery: [
      { project: "campost", name: "dashboard", frame: "browser", caption: "Customer wallet" },
      { project: "campost", name: "send-money", frame: "browser", caption: "International transfer" },
      { project: "campost", name: "mobile-login", frame: "phone", caption: "Mobile sign-in" },
      { project: "campost", name: "agent-home", frame: "browser", caption: "Agent portal" },
      { project: "campost", name: "issuer-portal", frame: "browser", caption: "Issuer portal" },
      { project: "campost", name: "services", frame: "browser", caption: "Services catalogue" },
    ],
  },
  {
    slug: "thermox",
    name: "Thermox",
    tagline: "Design receipts on your phone and print them on any Bluetooth thermal printer, even in Urdu.",
    summary:
      "Offline-first Android app with a custom Kotlin printer module, a block-based receipt designer, English and Urdu printing, and cloud backup.",
    client: "Own product",
    where: "Pakistan",
    engagement: "Open source",
    role: "Creator",
    platforms: ["Android"],
    stack: ["React Native", "Expo SDK 57", "Kotlin", "ESC/POS", "SQLite", "Firebase", "i18next"],
    impact: [
      { value: "8", label: "ready-made templates" },
      { value: "58 / 80", label: "mm paper" },
      { value: "EN + UR", label: "languages printed" },
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/SherazAhmad6167/thermox" }],
    cover: { project: "thermox", name: "home", frame: "phone" },
    coverExtra: { project: "thermox", name: "templates", frame: "phone" },
    problem:
      "Cheap Bluetooth thermal printers are everywhere in small shops, but their apps are clunky, English-only and cannot print Urdu letters joined correctly.",
    overview: [
      "Thermox pairs with MTP-II, PT-210 and other ESC/POS printers through a native Kotlin module I wrote. English prints in fast text mode; Urdu and other scripts are drawn by Android's text engine and printed as an image, so letters join properly.",
      "Shops design receipts with a block editor (logo, rows, item tables, totals, QR codes, signature lines) using variables like {customer.phone}. Everything works offline in SQLite and syncs to each user's private Firestore space when online.",
    ],
    built: [
      { title: "Native printer module", text: "Kotlin Bluetooth ESC/POS driver: scan, pair, reconnect, darkness, speed and copies." },
      { title: "Receipt designer", text: "Block editor with live preview, custom fields and 8 ready-made templates." },
      { title: "Offline first", text: "SQLite per account on the device, synced to Firestore when online." },
      { title: "Reports", text: "Sales, collections, balance due, top items and CSV export." },
    ],
    flows: [
      {
        title: "Printing Urdu",
        steps: [
          { title: "Pick template", detail: "Or design one with blocks" },
          { title: "Render", detail: "Android text engine joins the letters" },
          { title: "Rasterise", detail: "Bitmap sized to 58 or 80 mm" },
          { title: "Print", detail: "ESC/POS over Bluetooth" },
        ],
      },
    ],
    highlights: [
      "Auto mode chooses text or image printing per receipt.",
      "Share receipts as an image on WhatsApp or as a PDF.",
      "English and Urdu interface with right-to-left layout, light and dark themes.",
    ],
    gallery: [
      { project: "thermox", name: "home", frame: "phone", caption: "Home" },
      { project: "thermox", name: "templates", frame: "phone", caption: "Receipt templates" },
      { project: "thermox", name: "new-receipt", frame: "phone", caption: "New receipt" },
      { project: "thermox", name: "printer", frame: "phone", caption: "Printer settings" },
      { project: "thermox", name: "settings", frame: "phone", caption: "Business settings" },
    ],
  },
];

export const moreProjects = [
  {
    name: "Ranjha Play",
    text: "IPTV player for the same ISP's customers: live TV, movies and series with picture-in-picture. Built twice, in Expo and in native Kotlin with ExoPlayer.",
    stack: ["React Native", "Kotlin", "Media3"],
    shot: { project: "ranjha", name: "play-signin", frame: "phone" } as ShotRef,
    // Made by `npm run video` from the raw screen recording
    video: { src: "/media/ranjha/play-demo.mp4", poster: "/media/ranjha/play-demo-poster.webp", w: 540, h: 1230, length: "1:17" },
  },
  {
    name: "Ranjha 7 Star website",
    text: "Marketing site with offers, coverage map, moderated reviews and an online connection form.",
    stack: ["React", "Vite", "Firebase"],
    shot: { project: "ranjha", name: "web-hero", frame: "browser" } as ShotRef,
  },
  {
    name: "Ranjha SMS",
    text: "Android SMS gateway with a native foreground service that survives reboots and app kills.",
    stack: ["React Native", "Kotlin", "Firestore"],
    shot: { project: "ranjha", name: "sms-gateway", frame: "phone" } as ShotRef,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
