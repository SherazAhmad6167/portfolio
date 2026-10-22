import { ViewTransition } from "react";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Stats from "@/components/home/Stats";
import Work from "@/components/home/Work";
import MoreProjects from "@/components/home/MoreProjects";
import About from "@/components/home/About";
import Stack from "@/components/home/Stack";
import Experience from "@/components/home/Experience";
import Contact from "@/components/home/Contact";
import Footer from "@/components/Footer";
import { site } from "@/content/site";

// Lets search engines show a profile result for Sheraz
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  alternateName: site.name,
  jobTitle: "Full-Stack Software Engineer",
  worksFor: { "@type": "Organization", name: site.company },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Gujrat" },
  address: { "@type": "PostalAddress", addressCountry: "PK" },
  email: `mailto:${site.email}`,
  url: site.url,
  image: `${site.url}/og.png`,
  sameAs: [site.github, site.linkedin].filter(Boolean),
  knowsAbout: ["Angular", "React", "Next.js", "React Native", "Kotlin", "Node.js", "Firebase", "Azure Functions", "FastAPI", "Stripe"],
};

export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <Hero />
        <Marquee />
        <Stats />
        <Work />
        <MoreProjects />
        <About />
        <Stack />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </ViewTransition>
  );
}
