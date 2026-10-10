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
  name: "Kirian Luna",
  title: "Ingeniero en Sistemas",
  location: "Costa Rica",
  locationIcon: "",
  experience: "2+ Años",
  education: {
    degree: "Ingeniería en Sistemas",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "Soy Kirian,",
    role: "Ingeniero en Sistemas",
    desc: "<span>Soy Ingeniero en Sistemas de Limón, Costa Rica, enfocado en construir productos digitales modernos que <strong class=\"text-grayscale-12 font-medium\">resuelven problemas reales y generan valor para usuarios y empresas</strong>. Combino ingeniería, diseño y experiencia de usuario para crear soluciones <strong class=\"text-grayscale-12 font-medium\">escalables, eficientes, intuitivas y cuidadosamente construidas</strong>. Graduado de Ingeniería en Sistemas por la <a href=\"https://www.ulatina.ac.cr/\" target=\"_blank\" rel=\"noopener noreferrer\" data-cuelume-hover=\"tick\" data-cuelume-press data-cuelume-release class=\"text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors\">Universidad Latina de Costa Rica</a> y actualmente fortaleciendo mi formación en Ingeniería de Software y Docencia, mi enfoque va más allá de escribir código: entiendo el problema, diseño soluciones efectivas y transformo ideas en <strong class=\"text-grayscale-12 font-medium\">productos digitales funcionales, confiables y con propósito</strong>, colaborando con equipos y empresas tanto en Costa Rica como a nivel internacional.</span>",
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
    availability: "Disponible para oportunidades en Ingeniería en Sistemas",
    ctaExplore: "Explorar más",
  },
  about: {
    title: "Sobre Mí",
    badgeLabel: "En busca de nuevas oportunidades",
    heroTitle: "Ingeniero en Sistemas & Amante de las Ideas",
    heroSubtitle:
      "Impulsando productos digitales con pasión por el código y el diseño.",
    ctaWork: "Mira mi trabajo",
    ctaContact: "Hablemos",
    experienceSub: "Trayectoria Profesional",
    intro:
      "Más que código, creo soluciones. Mi enfoque combina técnica sólida con diseño intuitivo.",
    bio: [
      "Soy un apasionado Ingeniero en Sistemas enfocado en crear soluciones tecnológicas eficientes y escalables. Estudié en la Universidad Latina de Costa Rica y actualmente me encuentro de forma paralela estudiando la licenciatura en docencia en la Universidad Americana y la licenciatura en ingeniería de software en la Universidad Internacional de las Américas. Con más de 2 años de experiencia en el desarrollo de software, me especializo en construir experiencias de usuario fluidas y arquitecturas robustas.",
      "Mi enfoque se centra en la limpieza del código, el rendimiento óptimo y el diseño centrado en el usuario. Siempre estoy en constante aprendizaje de las últimas tecnologías para ofrecer los mejores resultados en cada proyecto.",
    ],
    roleTitle: "El Ingeniero en Sistemas",
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
      year: "2026",
      period: "ene. 2026 – presente",
      role: "Ingeniero en Sistemas",
      company: "Ultimate Media Productions",
      companyUrl: "https://ump-landing-page.vercel.app/es",
      companyColor: "bg-[#eef2ff]/90 hover:bg-[#e0e7ff] border-[#c7d2fe]/60 text-[#4f46e5] dark:bg-[#1e1b4b]/60 dark:border-[#3730a3]/50 dark:text-[#818cf8] dark:hover:bg-[#312e81]/60",
      companyLogo: "code",
      description: "Diseño, desarrollo y entrega de soluciones digitales personalizadas para clientes de Ultimate Media Productions, liderando proyectos desde la recolección de requerimientos hasta el despliegue. Construcción de aplicaciones web escalables, automatización de flujos de trabajo e integración de APIs de terceros para optimizar la eficiencia operativa y fortalecer la presencia digital.",
      stack: ["Next.js", "TypeScript", "React 19", "Node.js", "PostgreSQL", "Tailwind CSS", "Prisma ORM", "Docker"]
    },
    {
      year: "2025",
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
      year: "2026",
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
    },
    list: [
      { name: "TypeScript", category: "languages" },
      { name: "JavaScript", category: "languages" },
      { name: "Python", category: "languages" },
      { name: "HTML5", category: "languages" },
      { name: "CSS3", category: "languages" },
      { name: "SQL", category: "languages" },
      { name: "PHP", category: "languages" },
      { name: "C#", category: "languages" },
      { name: "Java", category: "languages" },
      { name: "Figma", category: "design" },
      { name: "PS", category: "design" },
      { name: "AI", category: "design" },
      { name: "React", category: "frontend" },
      { name: "Next.js", category: "frontend" },
      { name: "Astro", category: "frontend" },
      { name: "TanStack", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "shadcn/ui", category: "frontend" },
      { name: "Radix UI", category: "frontend" },
      { name: "Base UI", category: "frontend" },
      { name: "Motion", category: "frontend" },
      { name: "Redux", category: "frontend" },
      { name: "Zustand", category: "frontend" },
      { name: "Better Auth", category: "backend" },
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
    brandName: "Kirian Luna",
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
  name: "Kirian Luna",
  title: "Systems Engineer",
  location: "Costa Rica",
  locationIcon: "",
  experience: "2+ Years",
  education: {
    degree: "Systems Engineering",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "I'm Kirian,",
    desc: "<span>I’m a Systems Engineer from Limón, Costa Rica, focused on building modern digital products that <strong class=\"text-grayscale-12 font-medium\">solve real problems and create value for users and businesses</strong>. I combine engineering, design, and user experience to create <strong class=\"text-grayscale-12 font-medium\">scalable, performant, intuitive, and thoughtfully crafted solutions</strong>. I hold a degree in Systems Engineering from <a href=\"https://www.ulatina.ac.cr/\" target=\"_blank\" rel=\"noopener noreferrer\" data-cuelume-hover=\"tick\" data-cuelume-press data-cuelume-release class=\"text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors\">Universidad Latina de Costa Rica</a> and am currently furthering my education in Software Engineering and Teaching. My approach goes beyond writing code: I understand the problem, design effective solutions, and turn ideas into <strong class=\"text-grayscale-12 font-medium\">functional, reliable, and purposeful digital products</strong>, collaborating with teams and companies both in Costa Rica and internationally.</span>",
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
    availability: "Open to Systems Engineering opportunities",
    ctaExplore: "Explore More",
  },
  about: {
    title: "About Me",
    badgeLabel: "Open to new opportunities",
    heroTitle: "Systems Engineer & Passionate Creator",
    heroSubtitle:
      "Boosting digital products with a passion for code and design.",
    ctaWork: "See my work",
    ctaContact: "Let's talk",
    experienceSub: "Professional Path",
    intro:
      "More than code, I create solutions. My approach combines solid technique with intuitive design.",
    bio: [
      "I am a passionate Systems Engineer focused on creating efficient and scalable technological solutions. I studied at Universidad Latina de Costa Rica, and I am currently pursuing parallel Licentiate degrees in Teaching at Universidad Americana and Software Engineering at Universidad Internacional de las Américas. With 2+ years of software development experience, I specialize in building smooth user experiences and robust architectures.",
      "My focus is on clean code, optimal performance, and user-centered design. I am always learning the latest technologies to deliver the best results in every project.",
    ],
    roleTitle: "The Systems Engineer",
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
      year: "2026",
      period: "Jan. 2026 – Present",
      role: "Systems Engineer",
      company: "Ultimate Media Productions",
      companyUrl: "https://ump-landing-page.vercel.app/en",
      companyColor: "bg-[#eef2ff]/90 hover:bg-[#e0e7ff] border-[#c7d2fe]/60 text-[#4f46e5] dark:bg-[#1e1b4b]/60 dark:border-[#3730a3]/50 dark:text-[#818cf8] dark:hover:bg-[#312e81]/60",
      companyLogo: "code",
      description: "Designed and delivered custom digital solutions for clients, leading projects from requirements gathering to deployment. Built scalable web applications, automated business workflows, and integrated third-party APIs to improve operational efficiency and strengthen clients' digital presence.",
      stack: ["Next.js", "TypeScript", "React 19", "Node.js", "PostgreSQL", "Tailwind CSS", "Prisma ORM", "Docker"]
    },
    {
      year: "2025",
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
      year: "2026",
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
    },
    list: [
      { name: "TypeScript", category: "languages" },
      { name: "JavaScript", category: "languages" },
      { name: "Python", category: "languages" },
      { name: "HTML5", category: "languages" },
      { name: "CSS3", category: "languages" },
      { name: "SQL", category: "languages" },
      { name: "PHP", category: "languages" },
      { name: "C#", category: "languages" },
      { name: "Java", category: "languages" },
      { name: "Figma", category: "design" },
      { name: "PS", category: "design" },
      { name: "AI", category: "design" },
      { name: "React", category: "frontend" },
      { name: "Next.js", category: "frontend" },
      { name: "Astro", category: "frontend" },
      { name: "TanStack", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "shadcn/ui", category: "frontend" },
      { name: "Radix UI", category: "frontend" },
      { name: "Base UI", category: "frontend" },
      { name: "Motion", category: "frontend" },
      { name: "Redux", category: "frontend" },
      { name: "Zustand", category: "frontend" },
      { name: "Better Auth", category: "backend" },
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
    brandName: "Kirian Luna",
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
