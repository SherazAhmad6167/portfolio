// Personal details shown across the site. Empty strings hide that link.
export const site = {
  name: "Sheraz Ahmad",
  fullName: "Muhammad Sheraz Ahmad",
  role: "Software Engineer",
  company: "Technoverse",
  location: "Pakistan",
  timezone: "Asia/Karachi",
  // Set NEXT_PUBLIC_SITE_URL when deploying somewhere else, e.g. a custom domain
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadsherazahmad.web.app",
  email: "chaudhrysheraz10@gmail.com",
  github: "https://github.com/SherazAhmad6167",
  linkedin: "",
  // Put the PDF in public/ (e.g. public/resume.pdf) and set this to "/resume.pdf"
  resume: "",
  // Formspree form id (https://formspree.io). Without it the contact form opens the visitor's mail app.
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",
  description:
    "Sheraz Ahmad is a full-stack software engineer who ships complete products: web apps, mobile apps, cloud APIs and the hardware they talk to.",
};

export const stats = [
  { value: 6000, suffix: "+", label: "ISP subscribers on a system I built solo" },
  { value: 12000, suffix: "+", label: "SMS sent on peak days by my Android gateway" },
  { value: 6, suffix: "", label: "Production platforms shipped" },
  { value: 4, suffix: "", label: "Continents of clients" },
];

// Where the work runs. Coordinates are the country's main city; labels name the country only.
export const places = [
  { id: "pk", lat: 32.57, lng: 74.08, label: "Pakistan", sub: "Home · Ranjha 7 Star", href: "/work/ranjha-isp-suite/", home: true },
  { id: "uk", lat: 51.51, lng: -0.13, label: "United Kingdom", sub: "iFight", href: "/work/ifight/" },
  { id: "cm", lat: 3.87, lng: 11.52, label: "Cameroon", sub: "Campost Money", href: "/work/campost-money/" },
  { id: "au", lat: -33.87, lng: 151.21, label: "Australia", sub: "Praxis iPM", href: "/work/praxis-ipm/" },
];

export const stack = [
  {
    group: "Frontend",
    items: ["Angular", "React", "Next.js", "TypeScript", "Tailwind CSS", "RxJS", "PWA"],
  },
  {
    group: "Mobile",
    items: ["React Native", "Expo", "Ionic", "Capacitor", "Kotlin native modules"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express", "Azure Functions", "Firebase Functions", "FastAPI", "REST & webhooks"],
  },
  {
    group: "Data",
    items: ["Firestore", "Azure SQL", "Supabase / Postgres", "SQLite", "Offline sync"],
  },
  {
    group: "Integrations",
    items: ["Stripe Connect", "CometChat", "Mapbox", "MikroTik RouterOS", "Bluetooth ESC/POS", "LLM APIs", "OCR", "Barcode & QR"],
  },
  {
    group: "Delivery",
    items: ["Azure Static Web Apps", "Firebase Hosting", "EAS Build", "GitHub Actions", "Jira workflows"],
  },
];


export const experience = [
  {
    title: "Software Engineer",
    org: "Technoverse",
    kind: "Full-time",
    summary:
      "Building client platforms end to end: Angular and Next.js frontends, Azure and Firebase backends, payments, real-time chat and AI pipelines.",
    projects: ["iFight", "Praxis iPM", "Dowson MES", "Campost Money"],
  },
  {
    title: "Full-Stack Developer",
    org: "Freelance",
    kind: "Independent",
    summary:
      "Designed and built the complete software suite for Ranjha 7 Star, a local internet provider: admin panel, field app, SMS gateway, printer app and website.",
    projects: ["Ranjha 7 Star ISP Suite", "Thermox", "Ranjha Play"],
  },
];

export const education = {
  degree: "BS Software Engineering",
  school: "University of Gujrat",
};
