/**
 * Central SEO / AEO (Answer Engine Optimization) definitions.
 *
 * Everything an AI crawler needs to identify, understand and cite this
 * portfolio lives here or is generated from here, so the HTML, JSON-LD,
 * llms.txt and Markdown endpoints never drift apart.
 */

export const SITE_URL = "https://kirian.dev";
export const SITE_NAME = "Kirian Luna — Software Engineer";
export const PERSON_ID = `${SITE_URL}/#person`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SERVICE_ID = `${SITE_URL}/#service`;

export const EMAIL = "kirianluna.u@gmail.com";
export const GITHUB_URL = "https://github.com/kirianL";
export const LINKEDIN_URL = "https://www.linkedin.com/in/kirianluna";
export const X_URL = "https://x.com/kiriandev";
export const SORINLABS_URL = "https://sorinlabs.dev";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).href;
}

/** Normalize a path so canonical + hreflang + sitemap always agree. */
export function withTrailingSlash(path: string): string {
  if (!path || path === "/") return "/";
  const clean = path.replace(/\/+$/, "");
  return `${clean}/`;
}

/**
 * Blog posts use translated slugs, so they cannot be derived by prefixing
 * `/es` to the English path. Keep the mapping in one place.
 */
export const blogAlternates: Record<
  string,
  { en: string; es: string }
> = {
  "digitalizing-a-cultural-identity": {
    en: "/blog/digitalizing-a-cultural-identity/",
    es: "/es/blog/digitalizar-una-identidad-cultural/",
  },
};

export function resolveBlogAlternates(pathname: string) {
  const clean = withTrailingSlash(pathname);
  for (const pair of Object.values(blogAlternates)) {
    if (clean === pair.en) return { en: pair.en, es: pair.es };
    if (clean === pair.es) return { en: pair.en, es: pair.es };
  }
  return undefined;
}

/** Default language alternates for pages that share the same slug. */
export function defaultAlternates(pathname: string) {
  const clean = pathname.replace(/^\/es(?=\/|$)/, "") || "/";
  const en = withTrailingSlash(clean);
  const es = clean === "/" ? "/es/" : `/es${withTrailingSlash(clean)}`;
  return { en, es };
}

/**
 * Language alternates for any page.
 *
 * Blog posts use translated slugs and a post may only exist in one language,
 * so we must never guess the counterpart URL (that would advertise a 404).
 */
export function resolveAlternates(pathname: string): { en?: string; es?: string } {
  const blogPair = resolveBlogAlternates(pathname);
  if (blogPair) return blogPair;

  if (/^\/(?:es\/)?blog\/[^/]+\/?$/.test(pathname)) {
    const self = withTrailingSlash(pathname);
    return self.startsWith("/es/") ? { es: self } : { en: self };
  }

  return defaultAlternates(pathname);
}

export type BreadcrumbItem = { name: string; path: string };

const breadcrumbLabels: Record<string, { en: string; es: string }> = {
  "/": { en: "Home", es: "Inicio" },
  "/about": { en: "About", es: "Sobre mí" },
  "/projects": { en: "Projects", es: "Proyectos" },
  "/blog": { en: "Blog", es: "Blog" },
  "/contact": { en: "Contact", es: "Contacto" },
  "/privacy": { en: "Privacy", es: "Privacidad" },
};

export function defaultBreadcrumbs(
  pathname: string,
  lang: "en" | "es",
): BreadcrumbItem[] {
  const clean = withTrailingSlash(
    pathname.replace(/^\/es(?=\/|$)/, "") || "/",
  );
  if (clean === "/") return [];

  const items: BreadcrumbItem[] = [{ name: breadcrumbLabels["/"][lang], path: "/" }];

  const segments = clean.split("/").filter(Boolean);
  let current = "";
  for (const segment of segments) {
    current += `/${segment}`;
    const label =
      breadcrumbLabels[current]?.[lang] ??
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    items.push({
      name: label,
      path: lang === "es" ? `/es${withTrailingSlash(current)}` : withTrailingSlash(current),
    });
  }
  return items;
}

export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Kirian Luna",
  givenName: "Kirian",
  familyName: "Luna",
  alternateName: ["kiriandev", "Kirian Luna Umaña"],
  url: SITE_URL,
  image: absoluteUrl("/OG/KirianLunaOG.png"),
  email: `mailto:${EMAIL}`,
  jobTitle: "Software Engineer",
  description:
    "Kirian Luna is a Software Engineer from Limón, Costa Rica, specializing in full-stack web engineering, TypeScript, React, Next.js, Astro, PostgreSQL and high-performance digital products.",
  worksFor: [
    { "@id": ORGANIZATION_ID },
    {
      "@type": "Organization",
      name: "Ultimate Media Productions",
      url: "https://ultimatemediaproductions.com",
    },
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidad Latina de Costa Rica",
    url: "https://www.ulatina.ac.cr/",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Limón",
    addressRegion: "Limón",
    addressCountry: "CR",
  },
  nationality: { "@type": "Country", name: "Costa Rica" },
  knowsLanguage: [
    { "@type": "Language", name: "Spanish", alternateName: "es" },
    { "@type": "Language", name: "English", alternateName: "en" },
  ],
  sameAs: [GITHUB_URL, LINKEDIN_URL, X_URL],
  knowsAbout: [
    "Software Engineering",
    "Systems Engineering",
    "Full-Stack Web Development",
    "TypeScript",
    "React",
    "Next.js",
    "Astro",
    "Node.js",
    "PostgreSQL",
    "Prisma ORM",
    "REST APIs",
    "JWT Authentication",
    "Role-Based Access Control (RBAC)",
    "TailwindCSS",
    "Web Performance",
    "Core Web Vitals",
    "Search Engine Optimization (SEO)",
    "Search Experience Optimization (SXO)",
    "UI/UX Design",
    "Web Accessibility (WCAG 2.1)",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer",
    occupationLocation: { "@type": "Country", name: "Costa Rica" },
    skills:
      "Full-stack web engineering, TypeScript, React, Next.js, Astro, Node.js, PostgreSQL, Prisma, REST API design, performance optimization and accessible UI engineering.",
  },
};

export const organizationSchema = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Sorin Labs",
  alternateName: ["SorinLabs", "SorinLabs.dev"],
  url: SORINLABS_URL,
  logo: absoluteUrl("/LogoKirian.png"),
  image: absoluteUrl("/OG/KirianLunaOG.png"),
  email: `mailto:${EMAIL}`,
  founder: { "@id": PERSON_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Limón",
    addressRegion: "Limón",
    addressCountry: "CR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: `mailto:${EMAIL}`,
      contactType: "sales",
      availableLanguage: ["English", "Spanish"],
    },
  ],
  sameAs: [SORINLABS_URL, GITHUB_URL, LINKEDIN_URL, X_URL],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: "kirian.dev",
  description:
    "Official portfolio of Kirian Luna, a Software Engineer from Limón, Costa Rica, building full-stack web products with TypeScript, React, Next.js and Astro.",
  publisher: { "@id": PERSON_ID },
  inLanguage: ["en", "es"],
};

export const professionalServiceSchema = {
  "@type": "ProfessionalService",
  "@id": SERVICE_ID,
  name: "Kirian Luna — Software Engineering Services",
  url: absoluteUrl("/contact/"),
  image: absoluteUrl("/OG/KirianLunaOG.png"),
  description:
    "Full-stack web engineering, backend and database architecture, performance audits, and accessible UI/UX implementation for companies and founders.",
  provider: { "@id": PERSON_ID },
  areaServed: [
    { "@type": "Country", name: "Costa Rica" },
    { "@type": "Place", name: "Worldwide (remote)" },
  ],
  availableLanguage: ["English", "Spanish"],
  knowsAbout: personSchema.knowsAbout,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software engineering services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full-stack web application development",
          description:
            "Production web applications built with TypeScript, React, Next.js and Astro.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Backend & database architecture",
          description:
            "PostgreSQL schemas, Prisma ORM data layers, Redis caching, REST APIs, authentication and Role-Based Access Control.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Performance & accessibility engineering",
          description:
            "Core Web Vitals optimization, Lighthouse 100/100 targets and WCAG 2.1 accessibility.",
        },
      },
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "1200",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          minPrice: "1200",
          description:
            "Fixed-scope milestone projects start at USD $1,200. Monthly retainers and full-time roles are also available.",
        },
        itemOffered: {
          "@type": "Service",
          name: "Fixed-scope project",
          description:
            "Well-defined web applications, landing systems and bespoke redesigns delivered by milestone.",
        },
      },
    ],
  },
};

export type ProjectSummary = {
  slug: string;
  name: string;
  description: string;
  url: string;
  year: string;
  role: string;
  stack: string[];
};

export const projects: ProjectSummary[] = [
  {
    slug: "gigblades",
    name: "GigBlades",
    description:
      "SaaS web platform for DJs with bookings, a self-managed dashboard, hosting and custom club themes.",
    url: "https://www.gigblades.com",
    year: "2026",
    role: "Project Lead · Full-Stack Architecture & Development · UI/UX",
    stack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Node.js"],
  },
  {
    slug: "puerto-limon",
    name: "Puerto Limón",
    description:
      "Interactive editorial platform preserving the Afro-Caribbean identity of Puerto Limón, Costa Rica.",
    url: "https://archivopuertolimon.vercel.app/",
    year: "2025-2026",
    role: "Research · Content Curation · UX/UI · Web Development",
    stack: ["Next.js", "TailwindCSS", "Framer Motion", "Leaflet"],
  },
  {
    slug: "mantenimiento",
    name: "Mantenimiento",
    description:
      "Web system for managing and resolving internal maintenance requests.",
    url: "https://procesosing.vercel.app/",
    year: "2026",
    role: "UX/UI Design · Full-Stack Development",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "brisas-del-rio",
    name: "Brisas del Rio",
    description:
      "Web platform for a residential real-estate project, focused on property visualization and conversion.",
    url: "https://landind-page-brisas-del-rio.vercel.app/",
    year: "2024-2025",
    role: "Full-Stack Design · Web Development",
    stack: ["Next.js", "TailwindCSS", "Framer Motion"],
  },
  {
    slug: "young-legends",
    name: "Young Legends",
    description:
      "Digital platform for an urban art collective, built to consolidate its cultural legacy.",
    url: "https://landing-young-legends-web.vercel.app/en",
    year: "2024",
    role: "Full-Stack Design · Web Development · Content Strategy",
    stack: ["Next.js", "TailwindCSS", "Framer Motion", "TypeScript"],
  },
  {
    slug: "ump-music",
    name: "UMP Music",
    description:
      "High-impact music label landing page with a cinematic, brutalist aesthetic and performance-first build.",
    url: "https://ultimatemediaproductions.com",
    year: "2024",
    role: "UI/UX Design · Frontend Development · Optimization",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
  },
];

export const projectItemListSchema = {
  "@type": "ItemList",
  "@id": `${SITE_URL}/projects/#itemlist`,
  name: "Selected projects by Kirian Luna",
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.name,
      description: project.description,
      url: project.url,
      dateCreated: project.year,
      creator: { "@id": PERSON_ID },
      keywords: project.stack.join(", "),
    },
  })),
};

export const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "Ultimate Media Productions",
    companyUrl: "https://ultimatemediaproductions.com",
    period: "Jan 2026 – Present",
    description:
      "Designs and delivers custom digital solutions for clients, leading projects from requirements gathering to deployment. Builds scalable web applications, automates business workflows and integrates third-party APIs.",
    stack: [
      "Next.js",
      "TypeScript",
      "React 19",
      "Node.js",
      "PostgreSQL",
      "Prisma ORM",
      "Docker",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "WebMasterCR",
    companyUrl: "",
    period: "Oct 2025 – Feb 2026",
    description:
      "Designed, developed and implemented end-to-end web applications across frontend and backend, including modern interfaces, performance optimization and REST APIs.",
    stack: ["React", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS"],
  },
  {
    role: "Professional Internship: Academic Management System",
    company: "Liceo Experimental Bilingüe de Pococí (LEBP)",
    companyUrl: "",
    period: "Jan 2026 – Apr 2026",
    description:
      "Built a full-stack academic management system centralizing student administration, enrollment, real-time attendance with email notifications, grades, PDF/Excel reports, RBAC and audit logs.",
    stack: ["Next.js", "React 19", "TypeScript", "PostgreSQL", "Prisma ORM"],
  },
];
