import { puertoLimonDetails } from "./data-puertolimon";
import { brisasDelRioDetails } from "./data-brisasdelrio";
import { youngLegendsDetails } from "./data-younglegends";
import { umpMusicDetails } from "./data-umpmusic";

export type Language = "ES" | "EN";

export interface Project {
  slug: string;
  name: string;
  year: string;
  industry: string;
  company: string;
  location: string;
  status: string;
  closingQuote?: string;
  image: string | any;
  description: string;
  longDescription: string;
  overview: string;
  role: string;
  stack: string[];
  objective?: string;
  concept?: string[];
  ux?: string[];
  keySections?: string[];
  gallery?: any[];
  challenges?: string;
  technical?: string[];
  credits?: {
    name: string;
    link: string;
  };
  link: string;
}

const es = {
  name: "Kirian Luna Quirós",
  title: "Ingeniero de Software",
  location: "Costa Rica",
  locationIcon: "",
  experience: "2+ Años",
  education: {
    degree: "Ingeniería en Sistemas Computacionales",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "Soy Kirian,",
    role: "Ingeniero de Software",
    sub: "Construyendo software escalable y productos digitales.",
    desc: "Ingeniero de Software especializado en aplicaciones full-stack modernas y soluciones digitales. Me apasiona crear software donde la estética cuidada, el diseño visual sofisticado y la excelencia técnica convergen para construir productos escalables con experiencias de usuario memorables.",
    based: "Basado en Costa Rica",
    ctaProjects: "Ver mis trabajos",
    ctaContact: "Hablemos",
    techStackLabel: "Stack:",
    techStack: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    stats: {
      exp: "2+ Años",
      projects: "Proyectos",
      commitment: "Compromiso",
    },
    availability: "Disponible para oportunidades en Ingeniería de Software",
    ctaExplore: "Explorar más",
  },
  about: {
    title: "Sobre Mí",
    badgeLabel: "En busca de nuevas oportunidades",
    heroTitle: "Desarrollador Full Stack & Amante de las Ideas",
    heroSubtitle:
      "Impulsando productos digitales con pasión por el código y el diseño.",
    ctaWork: "Mira mi trabajo",
    ctaContact: "Hablemos",
    experienceSub: "Trayectoria Profesional",
    intro:
      "Más que código, creo soluciones. Mi enfoque combina técnica sólida con diseño intuitivo.",
    bio: [
      "Soy un apasionado Ingeniero en Sistemas enfocado en crear soluciones tecnológicas eficientes y escalables. Con 2 años de experiencia en el desarrollo de software, me especializo en construir experiencias de usuario fluidas y arquitecturas robustas.",
      "Mi enfoque se centra en la limpieza del código, el rendimiento óptimo y el diseño centrado en el usuario. Siempre estoy en constante aprendizaje de las últimas tecnologías para ofrecer los mejores resultados en cada proyecto.",
    ],
    roleTitle: "El Desarrollador",
    locationTitle: "Ubicación",
    experienceTitle: "Experiencia",
    educationTitle: "Educación",
    stackTitle: "Stack Tecnológico Moderno",
    coreStackLabel: "Core Stack",
    locationLabel: "Ubicación",
    educationLabel: "Educación",
    experienceLabel: "Experiencia",
  },
  experienceList: [
    {
      period: "ene. 2026 – presente",
      role: "Ingeniero de Software",
      company: "Ultimate Media Productions",
      companyUrl: "https://ump-landing-page.vercel.app/es",
      companyColor: "bg-[#eef2ff]/90 hover:bg-[#e0e7ff] border-[#c7d2fe]/60 text-[#4f46e5] dark:bg-[#1e1b4b]/60 dark:border-[#3730a3]/50 dark:text-[#818cf8] dark:hover:bg-[#312e81]/60",
      companyLogo: "code",
      description: "Diseño, desarrollo y entrega de soluciones digitales personalizadas para clientes de Ultimate Media Productions, liderando proyectos desde la recolección de requerimientos hasta el despliegue. Construcción de aplicaciones web escalables, automatización de flujos de trabajo e integración de APIs de terceros para optimizar la eficiencia operativa y fortalecer la presencia digital.",
      stack: ["Next.js", "TypeScript", "React 19", "Node.js", "PostgreSQL", "Tailwind CSS", "Prisma ORM", "Docker"]
    },
    {
      period: "oct. 2025 - feb. 2026",
      role: "Desarrollador full-stack",
      company: "WebMasterCR",
      companyUrl: "https://webmastercr.com",
      companyColor: "bg-[#f3f3f3]/90 hover:bg-[#e4e4e7] border-black/5 text-[#111111] dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-zinc-200 dark:hover:bg-zinc-700/80",
      companyLogo: "cal",
      description: "Desarrollador Full-Stack en WebmasterCR, encargado del diseño, desarrollo e implementación de aplicaciones web completas, trabajando tanto en el frontend como en el backend. Participé en la creación de interfaces modernas, optimización de rendimiento y desarrollo de APIs, utilizando tecnologías actuales para ofrecer soluciones eficientes y escalables.",
      stack: ["React", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS"]
    },
    {
      period: "ene. 2026 – abr. 2026",
      role: "Práctica Profesional: Sistema de Gestión Académica",
      company: "Liceo Experimental Bilingüe de Pococí",
      companyUrl: "https://lebp.ed.cr",
      companyColor: "bg-[#ffebee]/90 hover:bg-[#ffcdd2] border-[#ffd0d6]/50 text-[#ff5a5f] dark:bg-[#3e1b1d] dark:border-[#5c2a2d] dark:text-[#ff8a8f] dark:hover:bg-[#4d2225]",
      companyLogo: "airbnb",
      description: "Asociado con Universidad Latina de Costa Rica. Diseñé e implementé un sistema integral full-stack para la gestión académica del Liceo Experimental Bilingüe Pococí (LEBP). El sistema centraliza la administración de estudiantes, matrículas, asistencia con alertas por correo, calificaciones y reportes en PDF/Excel. Construido con Next.js (App Router), React 19, TypeScript, PostgreSQL y Prisma ORM; implementando autenticación JWT con control de acceso por roles (RBAC) y un sistema robusto de auditoría.",
      stack: ["Next.js", "React 19", "TypeScript", "PostgreSQL", "Prisma ORM", "JWT / RBAC"]
    }
  ],
  skills: {
    title: "Habilidades Técnicas",
    categories: {
      languages: "Lenguajes",
      design: "Diseño",
      frontend: "Frontend",
      backend: "Backend & DB",
      ai: "AI",
    },
    list: [
      { name: "TypeScript", category: "languages" },
      { name: "JavaScript", category: "languages" },
      { name: "Python", category: "languages" },
      { name: "Figma", category: "design" },
      { name: "Paper", category: "design" },
      { name: "Pencil", category: "design" },
      { name: "React", category: "frontend" },
      { name: "Next.js", category: "frontend" },
      { name: "TanStack", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "shadcn/ui", category: "frontend" },
      { name: "Radix UI", category: "frontend" },
      { name: "Base UI", category: "frontend" },
      { name: "Motion", category: "frontend" },
      { name: "Fumadocs", category: "frontend" },
      { name: "Zod", category: "frontend" },
      { name: "Redux", category: "frontend" },
      { name: "Zustand", category: "frontend" },
      { name: "Better Auth", category: "backend" },
      { name: "Clerk", category: "backend" },
      { name: "Firebase", category: "backend" },
      { name: "Supabase", category: "backend" },
      { name: "Convex", category: "backend" },
      { name: "Node.js", category: "backend" },
      { name: "Bun", category: "backend" },
      { name: "Prisma", category: "backend" },
      { name: "Drizzle", category: "backend" },
      { name: "PostgreSQL", category: "backend" },
      { name: "MongoDB", category: "backend" },
      { name: "Redis", category: "backend" },
      { name: "Cursor", category: "ai" },
      { name: "Claude Code", category: "ai" },
      { name: "Pi", category: "ai" },
      { name: "OpenCode", category: "ai" },
      { name: "Codex", category: "ai" },
      { name: "Antigravity", category: "ai" },
    ],
    description:
      "Experiencia construida sobre frameworks modernos y principios fundamentales de ingeniería.",
  },
  projects: {
    title: "Proyectos Destacados",
    subtitle: "Experiencia Interactiva & Desarrollo",
    description:
      "Una selección de proyectos donde diseño, cultura y tecnología convergen.",
    featuresLabel: "Características",
    resultsLabel: "Impacto",
    caseStudyLabel: "Caso de Estudio",
    list: [
      puertoLimonDetails.ES,
      brisasDelRioDetails.ES,
      youngLegendsDetails.ES,
      umpMusicDetails.ES,
    ] as Project[],
  },
  contact: {
    title: "Contacto",
    desc: "¿Tienes alguna idea o proyecto en mente? ¡Hablemos!",
    infoTitle: "Información de contacto",
    instantLabel: "Instantáneo",
    emailLabel: "Correo",
    githubActivityTitle: "Actividad de GitHub",
    moreLabel: "Más",
    lessLabel: "Menos",
    contributionsLabel: "contribuciones en",
    capabilitiesLabel: "CAPACIDADES",
    connectLabel: "CONECTEMOS",
    form: {
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      email: "Email",
      emailPlaceholder: "tu@email.com",
      message: "Mensaje",
      messagePlaceholder: "¿Cómo puedo ayudarte?",
      submit: "Enviar mensaje",
      sending: "Enviando...",
    },
    meetingLabel: "REUNIÓN / 1 HORA",
    email: "kirianluna.u@gmail.com",
    github: "https://github.com/kirianL",
    linkedin: "https://www.linkedin.com/in/kirianluna",
    twitter: "https://x.com/kiriandev",
    discord: "https://discord.com/users/Kiluzie",
    discordUser: "@Kiluzie",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    brandName: "Kirian Luna Quirós",
    connectedLabel: "Conectado",
    directLabel: "Directo",
    bio: "Un solucionador de problemas dedicado que prospera aprendiendo y construyendo.",
    me: {
      title: "Yo",
      links: [
        { label: "Proyectos", href: "#proyectos" },
        { label: "Blog", href: "#" },
        { label: "Bookmarks", href: "#" },
      ],
    },
    site: {
      title: "Este site",
      links: [
        { label: "Analíticas", href: "#" },
        { label: "RSS", href: "/es/rss.xml" },
        {
          label: "Código Fuente",
          href: "https://github.com/kirianL/Kirian_portfolio",
        },
      ],
    },
  },
  nav: {
    about: "Sobre mí",
    skills: "Habilidades",
    projects: "Proyectos",
    contact: "Contacto",
    cv: "Descargar CV",
  },
  projectDetail: {
    back: "Volver a proyectos",
    about: "Sobre el proyecto",
    features: "Características Principales",
    approach: "Enfoque",
    details: "Detalles del Proyecto",
    role: "Rol",
    status: "Estado",
    tech: "Tecnologías",
    creditsLabel: "Créditos Foto",
    view: "Ver Proyecto",
    notFound: "Proyecto no encontrado",
    backHome: "Volver al inicio",
    objectiveLabel: "Objetivo del Proyecto",
    conceptLabel: "Enfoque Conceptual",
    uxLabel: "Experiencia de Usuario (UX)",
    visualSectionLabel: "Sección Visual Destacada",
    visualQuote: "Reforzando la narrativa visual y la conexión emocional.",
    keySectionsLabel: "Secciones Clave",
    challengesLabel: "Retos Abordados",
    technicalLabel: "Implementación Técnica",
    closingQuote: "“Pasión por el detalle e innovación”",
    photosBy: "Fotos por",
  },
};

const en: typeof es = {
  name: "Kirian Luna Quirós",
  title: "Software Engineer",
  location: "Costa Rica",
  locationIcon: "",
  experience: "2+ Years",
  education: {
    degree: "Computer Systems Engineering",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "I'm Kirian,",
    role: "Software Engineer",
    sub: "Building scalable software & digital products.",
    desc: "Software Engineer specializing in modern full-stack applications and digital solutions. I'm passionate about crafting software where refined aesthetics, thoughtful visual design, and high-performance engineering converge to build scalable products with memorable user experiences.",
    based: "Based in Costa Rica",
    ctaProjects: "View my work",
    ctaContact: "Let's talk",
    techStackLabel: "Stack:",
    techStack: ["React", "Next.js", "TypeScript", "TailwindCSS"],

    stats: {
      exp: "2+ Years",
      projects: "Projects",
      commitment: "Commitment",
    },
    availability: "Open to Software Engineering opportunities",
    ctaExplore: "Explore More",
  },
  about: {
    title: "About Me",
    badgeLabel: "Open to new opportunities",
    heroTitle: "Full Stack Developer & Passionate Creator",
    heroSubtitle:
      "Boosting digital products with a passion for code and design.",
    ctaWork: "See my work",
    ctaContact: "Let's talk",
    experienceSub: "Professional Path",
    intro:
      "More than code, I create solutions. My approach combines solid technique with intuitive design.",
    bio: [
      "I am a passionate Systems Engineer focused on creating efficient and scalable technological solutions. With 2 years of software development experience, I specialize in building smooth user experiences and robust architectures.",
      "My focus is on clean code, optimal performance, and user-centered design. I am always learning the latest technologies to deliver the best results in every project.",
    ],
    roleTitle: "The Developer",
    locationTitle: "Location",
    experienceTitle: "Experience",
    educationTitle: "Education",
    stackTitle: "Modern Tech Stack",
    coreStackLabel: "Core Stack",
    locationLabel: "Location",
    educationLabel: "Education",
    experienceLabel: "Experience",
  },
  experienceList: [
    {
      period: "Jan. 2026 – Present",
      role: "Software Engineer",
      company: "Ultimate Media Productions",
      companyUrl: "https://ump-landing-page.vercel.app/en",
      companyColor: "bg-[#eef2ff]/90 hover:bg-[#e0e7ff] border-[#c7d2fe]/60 text-[#4f46e5] dark:bg-[#1e1b4b]/60 dark:border-[#3730a3]/50 dark:text-[#818cf8] dark:hover:bg-[#312e81]/60",
      companyLogo: "code",
      description: "Designed and delivered custom digital solutions for clients, leading projects from requirements gathering to deployment. Built scalable web applications, automated business workflows, and integrated third-party APIs to improve operational efficiency and strengthen clients' digital presence.",
      stack: ["Next.js", "TypeScript", "React 19", "Node.js", "PostgreSQL", "Tailwind CSS", "Prisma ORM", "Docker"]
    },
    {
      period: "Oct. 2025 - Feb. 2026",
      role: "Full-Stack Developer",
      company: "WebMasterCR",
      companyUrl: "https://webmastercr.com",
      companyColor: "bg-[#f3f3f3]/90 hover:bg-[#e4e4e7] border-black/5 text-[#111111] dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-zinc-200 dark:hover:bg-zinc-700/80",
      companyLogo: "cal",
      description: "Full-Stack Developer at WebmasterCR, responsible for designing, developing, and implementing end-to-end web applications across both frontend and backend. Participated in building modern user interfaces, optimizing performance, and developing REST APIs to deliver efficient, scalable digital solutions.",
      stack: ["React", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS"]
    },
    {
      period: "Jan. 2026 - Apr. 2026",
      role: "Professional Internship: Academic Management System",
      company: "Liceo Experimental Bilingüe de Pococí",
      companyUrl: "https://lebp.ed.cr",
      companyColor: "bg-[#ffebee]/90 hover:bg-[#ffcdd2] border-[#ffd0d6]/50 text-[#ff5a5f] dark:bg-[#3e1b1d] dark:border-[#5c2a2d] dark:text-[#ff8a8f] dark:hover:bg-[#4d2225]",
      companyLogo: "airbnb",
      description: "Associated with Universidad Latina de Costa Rica. Designed and implemented a comprehensive full-stack system for academic management at Liceo Experimental Bilingüe Pococí (LEBP). The system centralizes student administration, enrollment, real-time attendance with email notifications, grades, and PDF/Excel reports. Built with Next.js (App Router), React 19, TypeScript, PostgreSQL, and Prisma ORM; featuring JWT authentication with Role-Based Access Control (RBAC) and a robust audit log system.",
      stack: ["Next.js", "React 19", "TypeScript", "PostgreSQL", "Prisma ORM", "JWT / RBAC"]
    }
  ],
  skills: {
    title: "Technical Skills",
    categories: {
      languages: "Languages",
      design: "Design",
      frontend: "Frontend",
      backend: "Backend & DB",
      ai: "AI",
    },
    list: [
      { name: "TypeScript", category: "languages" },
      { name: "JavaScript", category: "languages" },
      { name: "Python", category: "languages" },
      { name: "Figma", category: "design" },
      { name: "Paper", category: "design" },
      { name: "Pencil", category: "design" },
      { name: "React", category: "frontend" },
      { name: "Next.js", category: "frontend" },
      { name: "TanStack", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "shadcn/ui", category: "frontend" },
      { name: "Radix UI", category: "frontend" },
      { name: "Base UI", category: "frontend" },
      { name: "Motion", category: "frontend" },
      { name: "Fumadocs", category: "frontend" },
      { name: "Zod", category: "frontend" },
      { name: "Redux", category: "frontend" },
      { name: "Zustand", category: "frontend" },
      { name: "Better Auth", category: "backend" },
      { name: "Clerk", category: "backend" },
      { name: "Firebase", category: "backend" },
      { name: "Supabase", category: "backend" },
      { name: "Convex", category: "backend" },
      { name: "Node.js", category: "backend" },
      { name: "Bun", category: "backend" },
      { name: "Prisma", category: "backend" },
      { name: "Drizzle", category: "backend" },
      { name: "PostgreSQL", category: "backend" },
      { name: "MongoDB", category: "backend" },
      { name: "Redis", category: "backend" },
      { name: "Cursor", category: "ai" },
      { name: "Claude Code", category: "ai" },
      { name: "Pi", category: "ai" },
      { name: "OpenCode", category: "ai" },
      { name: "Codex", category: "ai" },
      { name: "Antigravity", category: "ai" },
    ],
    description:
      "Expertise built on modern frameworks and core engineering principles.",
  },
  projects: {
    title: "Featured Projects",
    subtitle: "Interactive Experience & Development",
    description:
      "A selection of projects where design, culture, and technology converge.",
    featuresLabel: "Features",
    resultsLabel: "Impact",
    caseStudyLabel: "Case Study",
    list: [
      puertoLimonDetails.EN,
      brisasDelRioDetails.EN,
      youngLegendsDetails.EN,
      umpMusicDetails.EN,
    ] as Project[],
  },
  contact: {
    title: "Contact",
    desc: "Have an idea or project in mind? Let's talk!",
    infoTitle: "Contact information",
    instantLabel: "Instant",
    emailLabel: "Email",
    githubActivityTitle: "GitHub Activity",
    moreLabel: "More",
    lessLabel: "Less",
    contributionsLabel: "contributions in",
    capabilitiesLabel: "CAPABILITIES",
    connectLabel: "LET'S CONNECT",
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      message: "Message",
      messagePlaceholder: "How can I help you?",
      submit: "Send message",
      sending: "Sending...",
    },
    meetingLabel: "MEETING / 1 HOUR",
    email: "kirianluna.u@gmail.com",
    github: "https://github.com/kirianL",
    linkedin: "https://www.linkedin.com/in/kirianluna",
    twitter: "https://x.com/kiriandev",
    discord: "https://discord.com/users/Kiluzie",
    discordUser: "@Kiluzie",
  },
  footer: {
    rights: "All rights reserved.",
    brandName: "Kirian Luna Quirós",
    connectedLabel: "Connected",
    directLabel: "Direct",
    bio: "A dedicated problem-solver who thrives on learning and building.",
    me: {
      title: "Me",
      links: [
        { label: "Projects", href: "#projects" },
        { label: "Blog", href: "#" },
        { label: "Bookmarks", href: "#" },
      ],
    },
    site: {
      title: "This site",
      links: [
        { label: "Analytics", href: "#" },
        { label: "RSS", href: "/rss.xml" },
        {
          label: "Source Code",
          href: "https://github.com/kirianL/Kirian_portfolio",
        },
      ],
    },
  },
  nav: {
    about: "About",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    cv: "Download CV",
  },
  projectDetail: {
    back: "Back to projects",
    about: "About the project",
    features: "Key Features",
    approach: "Approach",
    details: "Project Details",
    role: "Role",
    status: "Status",
    tech: "Technologies",
    creditsLabel: "Photo Credits",
    view: "View Project",
    notFound: "Project not found",
    backHome: "Back to home",
    objectiveLabel: "Project Objective",
    conceptLabel: "Conceptual Approach",
    uxLabel: "User Experience (UX)",
    visualSectionLabel: "Visual Highlight Section",
    visualQuote: "Reinforcing visual narrative and emotional connection.",
    keySectionsLabel: "Key Sections",
    challengesLabel: "Challenges Addressed",
    technicalLabel: "Technical Implementation",
    closingQuote: "“Passion for detail and innovation”",
    photosBy: "Photos by",
  },
};

export const dictionaries: Record<Language, typeof es> = {
  ES: es,
  EN: en,
};
