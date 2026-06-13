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
  image: string;
  description: string;
  longDescription: string;
  overview: string;
  role: string;
  stack: string[];
  objective?: string;
  concept?: string[];
  ux?: string[];
  keySections?: string[];
  gallery?: string[];
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
  title: "Ingeniero en Sistemas",
  location: "Costa Rica",
  locationIcon: "🇨🇷",
  experience: "2 años",
  education: {
    degree: "Ingeniería en Sistemas Computacionales",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "Soy Kirian,",
    role: "Ingeniero de Sistemas",
    sub: "Diseño experiencias digitales que impactan.",
    desc: "Apasionado por el desarrollo web, enfocado en transformar ideas complejas en soluciones elegantes, funcionales y seguras, donde el diseño, la experiencia del usuario y la seguridad son tan importantes como el rendimiento y la calidad del código.",
    based: "Basado en Costa Rica",
    ctaProjects: "Ver mis trabajos",
    ctaContact: "Hablemos",
    techStackLabel: "Stack:",
    techStack: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    stats: {
      exp: "2 años",
      projects: "Proyectos",
      commitment: "Compromiso",
    },
    availability: "Disponible para proyectos",
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
  skills: {
    title: "Habilidades Técnicas",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      tools: "Herramientas",
    },
    list: [
      { name: "React", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "TailwindCSS", category: "Frontend" },
      { name: "shadcn/ui", category: "Frontend" },
      { name: "HTML5", category: "Frontend" },
      { name: "CSS3", category: "Frontend" },
      { name: "JavaScript", category: "Frontend" },
      { name: "Laravel", category: "Backend" },
      { name: "PHP", category: "Backend" },
      { name: "API REST", category: "Backend" },
      { name: "Git", category: "Tools" },
      { name: "GitHub", category: "Tools" },
      { name: "Figma", category: "Tools" },
    ],
    description:
      "Experiencia construida sobre frameworks modernos y principios fundamentales de ingeniería.",
  },
  projects: {
    title: "Proyectos",
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
        { label: "RSS", href: "#" },
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
  title: "Systems Engineer",
  location: "Costa Rica",
  locationIcon: "🇨🇷",
  experience: "2 years",
  education: {
    degree: "Computer Systems Engineering",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "I'm Kirian,",
    role: "Systems Engineer",
    sub: "Designing impactful digital experiences.",
    desc: "Passionate about web development, focused on transforming complex ideas into elegant, functional, and secure solutions, where design, user experience, and security are as important as performance and code quality.",
    based: "Based in Costa Rica",
    ctaProjects: "View my work",
    ctaContact: "Let's talk",
    techStackLabel: "Stack:",
    techStack: ["React", "Next.js", "TypeScript", "TailwindCSS"],

    stats: {
      exp: "2 years",
      projects: "Projects",
      commitment: "Commitment",
    },
    availability: "Available for projects",
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
  skills: {
    title: "Technical Skills",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      tools: "Tools",
    },
    list: [
      { name: "React", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "TailwindCSS", category: "Frontend" },
      { name: "shadcn/ui", category: "Frontend" },
      { name: "HTML5", category: "Frontend" },
      { name: "CSS3", category: "Frontend" },
      { name: "JavaScript", category: "Frontend" },
      { name: "Laravel", category: "Backend" },
      { name: "PHP", category: "Backend" },
      { name: "API REST", category: "Backend" },
      { name: "Git", category: "Tools" },
      { name: "GitHub", category: "Tools" },
      { name: "Figma", category: "Tools" },
    ],
    description:
      "Expertise built on modern frameworks and core engineering principles.",
  },
  projects: {
    title: "Projects",
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
        { label: "RSS", href: "#" },
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
