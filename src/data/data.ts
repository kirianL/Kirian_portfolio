export type Language = "ES" | "EN" | "PT";

const es = {
  name: "Kirian Luna Quirós",
  title: "Ingeniero en Sistemas",
  location: "Costa Rica",
  locationIcon: "🇨🇷",
  experience: "2 años de experiencia",
  education: {
    degree: "Ingeniería en Sistemas",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "Soy Kirian,",
    role: "Ingeniero de Sistemas",
    sub: "Diseño experiencias digitales que impactan.",
    desc: "un ingeniero de sistemas apasionado por transformar ideas complejas en soluciones elegantes.",
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
  },
  about: {
    title: "Sobre Mí",
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
  },
  skills: {
    title: "Habilidades Técnicas",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      db: "Database",
      tools: "Herramientas",
      security: "Seguridad",
    },
    list: [
      // Frontend
      {
        name: "React",
        category: "Frontend",
        icon: "https://cdn.simpleicons.org/react/61DAFB",
      },
      {
        name: "Next.js",
        category: "Frontend",
        icon: "https://svgl.app/library/nextjs_icon_dark.svg",
        className: "dark:invert",
      },
      {
        name: "TypeScript",
        category: "Frontend",
        icon: "https://svgl.app/library/typescript.svg",
      },
      {
        name: "HTML5",
        category: "Frontend",
        icon: "https://svgl.app/library/html5.svg",
      },
      {
        name: "CSS3",
        category: "Frontend",
        icon: "https://svgl.app/library/css.svg",
      },
      {
        name: "JavaScript",
        category: "Frontend",
        icon: "https://svgl.app/library/javascript.svg",
      },
      {
        name: "TailwindCSS",
        category: "Frontend",
        icon: "https://svgl.app/library/tailwindcss.svg",
      },
      {
        name: "shadcn/ui",
        category: "Frontend",
        icon: "https://svgl.app/library/shadcn-ui_dark.svg",
        className: "dark:invert",
      },

      // Backend
      {
        name: "Laravel",
        category: "Backend",
        icon: "https://svgl.app/library/laravel.svg",
      },
      {
        name: "PHP",
        category: "Backend",
        icon: "https://svgl.app/library/php_dark.svg",
        className: "dark:invert",
      },
      {
        name: "Sanctum",
        category: "Backend",
        icon: "https://svgl.app/library/laravel.svg",
      },
      {
        name: "API REST",
        category: "Backend",
        icon: "https://api.iconify.design/lucide:server-cog.svg",
        className: "dark:invert",
      },

      // Database
      {
        name: "MySQL",
        category: "DB",
        icon: "https://cdn.simpleicons.org/mysql/4479A1",
        className: "dark:invert",
      },
      {
        name: "MariaDB",
        category: "DB",
        icon: "https://svgl.app/library/mariadb.svg",
        className: "dark:invert",
      },
      {
        name: "Eloquent",
        category: "DB",
        icon: "https://svgl.app/library/laravel.svg",
      },
      {
        name: "Diseño ERD",
        category: "DB",
        icon: "https://api.iconify.design/lucide:database.svg",
        className: "dark:invert",
      },

      // Tools
      {
        name: "Git",
        category: "Tools",
        icon: "https://svgl.app/library/git.svg",
      },
      {
        name: "GitHub",
        category: "Tools",
        icon: "https://cdn.simpleicons.org/github/181717",
        className: "dark:invert",
      },
      {
        name: "Figma",
        category: "Tools",
        icon: "https://svgl.app/library/figma.svg",
      },

      // Security
      {
        name: "Auth & Roles",
        category: "Security",
        icon: "https://api.iconify.design/lucide:shield-check.svg",
        className: "dark:invert",
      },
      {
        name: "Hashing",
        category: "Security",
        icon: "https://api.iconify.design/lucide:lock.svg",
        className: "dark:invert",
      },
      {
        name: "Validaciones",
        category: "Security",
        icon: "https://api.iconify.design/lucide:file-check.svg",
        className: "dark:invert",
      },
    ],
  },
  projects: {
    title: "Experiencia Destacada",
    subtitle: "Proyectos desarrollados de forma independiente",
    description:
      "Desarrollo y entrega completa de soluciones web para organizaciones reales, abarcando análisis, diseño, desarrollo, implementación y optimización. Cada proyecto fue realizado de forma individual, desde la arquitectura hasta el despliegue final.",
    featuresLabel: "Funcionalidades",
    resultsLabel: "Impacto",
    list: [
      {
        name: "Sistema de Asistencia y Gestión Académica",
        company: "Colegio Experimental Bilingüe de Pococí",
        industry: "Educación / Gestión Académica",
        location: "Pococí, Costa Rica",
        status: "Proyecto completo",
        logo: "/Logos/LogoLEBP.png",
        summary:
          "Sistema web full-stack desarrollado para digitalizar y automatizar completamente la gestión académica y de asistencia del colegio, reemplazando procesos manuales por una plataforma centralizada, segura y en tiempo real.",
        features: [
          "Gestión de estudiantes, cursos y materias",
          "Registro diario de asistencia con historial completo",
          "Gestión de calificaciones y cálculo automático de promedios",
          "Dashboards y reportes en tiempo real",
          "Exportación de datos y vistas optimizadas",
          "Sistema de usuarios (Admin, Profesor, Estudiante)",
        ],
        results: [
          "83% menos tiempo en registro de asistencia",
          "Reportes instantáneos (antes horas/días)",
          "Notificaciones a padres en minutos",
          "Gestión digital de 568+ estudiantes",
        ],
        technologies: [
          "Laravel 11",
          "React",
          "TypeScript",
          "MySQL",
          "Tailwind CSS",
          "Vite",
        ],
      },
      {
        name: "Sistema de Inventario Borinquen",
        company: "Corporación Agroindustrial Borinquen S.A",
        industry: "Manufactura y Logística",
        location: "Guápiles, Costa Rica",
        status: "Proyecto completo",
        logo: "/Logos/Borinquen S.A Logo.png",
        summary:
          "Plataforma integral para la gestión de inventarios, procesamiento de materia prima y control logístico, con trazabilidad y auditoría total de movimientos.",
        features: [
          "Inventario en tiempo real por categorías",
          "Seguimiento completo del ciclo de productos (ingreso → procesamiento → salida)",
          "Control de mermas y flujos",
          "Auditoría de acciones y roles de usuario",
          "Reportes de stock, movimientos y productividad",
          "Gestión de proveedores",
        ],
        results: [
          "100% trazabilidad de inventario",
          "Control total del procesamiento",
          "Optimización de tiempos operativos",
          "Sistema estable y disponible 24/7",
        ],
        technologies: [
          "PHP (MVC)",
          "MySQL (PDO)",
          "HTML5",
          "CSS3",
          "JavaScript",
        ],
      },
      {
        name: "Sistema de Gestión de Iglesia",
        company: "Monte Los Olivos",
        industry: "Gestión religiosa / cristiana",
        location: "Limón, Costa Rica",
        status: "Proyecto completo",
        logo: "/Logos/MonteLosOlivos.png",
        summary:
          "Sistema web integral para la administración de iglesias, orientado a centralizar información pastoral y facilitar la toma de decisiones basada en datos.",
        features: [
          "Dashboard con estadísticas y gráficos",
          "Gestión de miembros, visitas y asistencias",
          "Administración de grupos FC por edades",
          "Programación de cultos",
          "Reportes con exportación a Excel y PDF",
          "Sistema de usuarios con roles y permisos",
        ],
        results: [
          "Automatización total de procesos antes manuales",
          "Datos centralizados y análisis demográfico en tiempo real",
          "Seguimiento detallado de miembros y visitantes",
          "Planificación pastoral basada en métricas reales",
        ],
        technologies: [
          "React",
          "TypeScript",
          "Vite",
          "TailwindCSS",
          "Chart.js",
          "PHP (API REST)",
          "MySQL",
        ],
      },
      {
        name: "POS Restaurante",
        company: "Brisas del Río",
        industry: "Restaurantes / Punto de Venta",
        location: "Jiménez, Costa Rica",
        status: "Proyecto completo",
        logo: "/Logos/Brisas del Rio.png",
        summary:
          "Sistema de punto de venta (POS) para restaurante, enfocado en ventas rápidas, control de inventario y reportes operativos.",
        features: [
          "POS intuitivo y eficiente",
          "Control de inventario en tiempo real",
          "Facturación automática",
          "Reportes de ventas y productos",
        ],
        results: [
          "Reducción significativa en tiempos de atención",
          "Control preciso de inventario",
          "Reportes automáticos para toma de decisiones",
        ],
        technologies: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
      },
      {
        name: "Sistema de Tiempos",
        company: "Tiempos",
        industry: "Lotería",
        location: "Siquirres, Costa Rica",
        status: "Proyecto completo",
        logo: "",
        summary:
          "Plataforma web para automatizar y centralizar la operación de sorteos de lotería tipo 'Tiempos', controlando venta de tickets, límites de apuesta y gestión de pagos.",
        features: [
          "Tickets con código QR para validación rápida",
          "Módulo de límites dinámicos por número",
          "Sorteos abiertos/cerrados en tiempo real",
          "Gestión centralizada de sucursales",
          "Optimización para ventas móviles y admin escritorio",
          "Reportes detallados en Excel y PDF",
        ],
        results: [
          "Control del riesgo: no se sobrepasan límites",
          "Centralización de información entre sucursales",
          "-90% en tiempo para reportes diarios",
          "Tickets verificables y operación confiable",
        ],
        technologies: [
          "PHP 8.3",
          "MySQL",
          "JavaScript",
          "Bcrypt Security",
          "JSON Audit",
        ],
      },
    ],
  },
  contact: {
    title: "Contacto",
    desc: "¿Tienes alguna idea o proyecto en mente? ¡Hablemos!",
    infoTitle: "Información de contacto",
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
    email: "kirianluna.u@gmail.com",
    github: "https://github.com/kirianL",
    linkedin: "https://www.linkedin.com/in/kirianluna",
  },
  footer: {
    rights: "Todos los derechos reservados.",
  },
  nav: {
    about: "Sobre mí",
    skills: "Habilidades",
    experience: "Experiencia",
    contact: "Contacto",
    cv: "Descargar CV",
  },
};

const en: typeof es = {
  name: "Kirian Luna Quirós",
  title: "Systems Engineer",
  location: "Costa Rica",
  locationIcon: "🇨🇷",
  experience: "2 years of experience",
  education: {
    degree: "Systems Engineering",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "I'm Kirian,",
    role: "Systems Engineer",
    sub: "Designing impactful digital experiences.",
    desc: "a systems engineer passionate about transforming complex ideas into elegant solutions.",
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
  },
  about: {
    title: "About Me",
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
  },
  skills: {
    title: "Technical Skills",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      db: "Database",
      tools: "Tools",
      security: "Security",
    },
    list: es.skills.list, // Keeping skills same for now as names are universal usually
  },
  projects: {
    title: "Featured Experience",
    subtitle: "Projects developed independently",
    description:
      "Complete development and delivery of web solutions for real organizations, covering analysis, design, development, implementation, and optimization. Each project was carried out individually, from architecture to final deployment.",
    featuresLabel: "Features",
    resultsLabel: "Impact",
    list: [
      {
        ...es.projects.list[0],
        name: "Attendance and Academic Management System",
        company: "Colegio Experimental Bilingüe de Pococí",
        industry: "Education / Academic Management",
        summary:
          "Full-stack web system developed to completely digitize and automate the school's academic and attendance management, replacing manual processes with a centralized, secure, and real-time platform.",
        features: [
          "Student, course, and subject management",
          "Daily attendance registration with full history",
          "Grade management and automatic average calculation",
          "Real-time dashboards and reports",
          "Data export and optimized views",
          "User system (Admin, Teacher, Student)",
        ],
        results: [
          "83% less time in attendance registration",
          "Instant reports (previously hours/days)",
          "Parent notifications in minutes",
          "Digital management of 568+ students",
        ],
      },
      {
        ...es.projects.list[1],
        name: "Borinquen Inventory System",
        company: "Corporación Agroindustrial Borinquen S.A",
        industry: "Manufacturing and Logistics",
        summary:
          "Comprehensive platform for inventory management, raw material processing, and logistics control, with full traceability and movement auditing.",
        features: [
          "Real-time inventory by categories",
          "Full tracking of product cycle (entry → processing → exit)",
          "Waste and flow control",
          "Audit of actions and user roles",
          "Stock, movement, and productivity reports",
          "Supplier management",
        ],
        results: [
          "100% inventory traceability",
          "Total processing control",
          "Optimization of operational times",
          "Stable system available 24/7",
        ],
      },
      {
        ...es.projects.list[2],
        name: "Church Management System",
        company: "Monte Los Olivos",
        industry: "Religious management",
        summary:
          "Comprehensive web system for church administration, aimed at centralizing pastoral information and facilitating data-driven decision making.",
        features: [
          "Dashboard with statistics and charts",
          "Member, visitor, and attendance management",
          "FC group management by age",
          "Service scheduling",
          "Reports with Excel and PDF export",
          "User system with roles and permissions",
        ],
        results: [
          "Full automation of previously manual processes",
          "Centralized data and real-time demographic analysis",
          "Detailed tracking of members and visitors",
          "Pastoral planning based on real metrics",
        ],
      },
      {
        ...es.projects.list[3],
        name: "Restaurant POS",
        company: "Brisas del Río",
        industry: "Restaurants / Point of Sale",
        summary:
          "Point of sale (POS) system for restaurant, focused on fast sales, inventory control, and operational reports.",
        features: [
          "Intuitive and efficient POS",
          "Real-time inventory control",
          "Automatic billing",
          "Sales and product reports",
        ],
        results: [
          "Significant reduction in service times",
          "Precise inventory control",
          "Automatic reports for decision making",
        ],
      },
      {
        ...es.projects.list[4],
        name: "Time System",
        company: "Tiempos",
        industry: "Lottery",
        summary:
          "Web platform to automate and centralize the operation of 'Tiempos' type lottery draws, controlling ticket sales, bet limits, and payment management.",
        features: [
          "Tickets with QR code for fast validation",
          "Module for dynamic limits per number",
          "Open/closed draws in real time",
          "Centralized branch management",
          "Optimization for mobile sales and desktop admin",
          "Detailed reports in Excel and PDF",
        ],
        results: [
          "Risk control: limits are not exceeded",
          "Centralization of information between branches",
          "-90% in time for daily reports",
          "Verifiable tickets and reliable operation",
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    desc: "Have an idea or project in mind? Let's talk!",
    infoTitle: "Contact information",
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
    email: "kirianluna.u@gmail.com",
    github: "https://github.com/kirianL",
    linkedin: "https://www.linkedin.com/in/kirianluna",
  },
  footer: {
    rights: "All rights reserved.",
  },
  nav: {
    about: "About",
    skills: "Skills",
    experience: "Experience",
    contact: "Contact",
    cv: "Download CV",
  },
};

const pt: typeof es = {
  name: "Kirian Luna Quirós",
  title: "Engenheiro de Sistemas",
  location: "Costa Rica",
  locationIcon: "🇨🇷",
  experience: "2 anos de experiência",
  education: {
    degree: "Engenharia de Sistemas",
    institution: "Universidad Latina de Costa Rica",
    period: "2023–2026",
  },
  hero: {
    greeting: "Eu sou Kirian,",
    role: "Engenheiro de Sistemas",
    sub: "Projetando experiências digitais impactantes.",
    desc: "um engenheiro de sistemas apaixonado por transformar ideias complexas em soluções elegantes.",
    based: "Baseado na Costa Rica",
    ctaProjects: "Ver meus trabalhos",
    ctaContact: "Vamos conversar",
    techStackLabel: "Stack:",
    techStack: ["React", "Next.js", "TypeScript", "TailwindCSS"],

    stats: {
      exp: "2+ Anos",
      projects: "Projetos",
      commitment: "Compromisso",
    },
  },
  about: {
    title: "Sobre Mim",
    intro:
      "Mais do que código, crio soluções. Minha abordagem combina técnica sólida com design intuitivo.",
    bio: [
      "Sou un apaixonado Engenheiro de Sistemas focado em criar soluções tecnológicas eficientes e escaláveis. Com 2 anos de experiência em desenvolvimento de software, eu me especializo em construir experiências de usuário fluidas e arquiteturas robustas.",
      "Meu foco está no código limpo, desempenho ideal e design centrado no usuário. Estou sempre aprendendo as últimas tecnologias para entregar os melhores resultados em cada projeto.",
    ],
    roleTitle: "O Desenvolvedor",
    locationTitle: "Localização",
    experienceTitle: "Experiência",
    educationTitle: "Educação",
    stackTitle: "Stack Tecnológica Moderna",
  },
  skills: {
    title: "Habilidades Técnicas",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      db: "Database",
      tools: "Ferramentas",
      security: "Segurança",
    },
    list: es.skills.list, // Keeping skills same for now as names are universal usually
  },
  projects: {
    title: "Experiência de Destaque",
    subtitle: "Projetos desenvolvidos de forma independente",
    description:
      "Desenvolvimento e entrega completa de soluções web para organizações reais, abrangendo análise, design, desenvolvimento, implementação e otimização. Cada projeto foi realizado individualmente, desde a arquitetura até a implantação final.",
    featuresLabel: "Funcionalidades",
    resultsLabel: "Impacto",
    list: [
      {
        ...es.projects.list[0],
        name: "Sistema de Assistência e Gestão Acadêmica",
        company: "Colegio Experimental Bilingüe de Pococí",
        industry: "Educação / Gestão Acadêmica",
        summary:
          "Sistema web full-stack desenvolvido para digitalizar e automatizar completamente a gestão acadêmica e de assistência do colégio, substituindo processos manuais por uma plataforma centralizada, segura e em tempo real.",
        features: [
          "Gestão de estudantes, cursos e disciplinas",
          "Registro diário de presença com histórico completo",
          "Gestão de notas e cálculo automático de médias",
          "Dashboards e relatórios em tempo real",
          "Exportação de dados e visualizações otimizadas",
          "Sistema de usuários (Admin, Professor, Estudante)",
        ],
        results: [
          "83% menos tempo no registro de presença",
          "Relatórios instantâneos (antes horas/dias)",
          "Notificações aos pais em minutos",
          "Gestão digital de 568+ estudantes",
        ],
      },
      {
        ...es.projects.list[1],
        name: "Sistema de Inventário Borinquen",
        company: "Corporación Agroindustrial Borinquen S.A",
        industry: "Manufatura e Logística",
        summary:
          "Plataforma integral para gestão de inventários, processamento de matéria-prima e controle logístico, com total rastreabilidade e auditoria de movimentos.",
        features: [
          "Inventário em tempo real por categorias",
          "Acompanhamento completo do ciclo do produto (entrada → processamento → saída)",
          "Controle de perdas e fluxos",
          "Auditoria de ações e funções de usuário",
          "Relatórios de estoque, movimentos e produtividade",
          "Gestão de fornecedores",
        ],
        results: [
          "100% de rastreabilidade de inventário",
          "Controle total de processamento",
          "Otimização de tempos operacionais",
          "Sistema estável e disponível 24 horas por dia, 7 dias por semana",
        ],
      },
      {
        ...es.projects.list[2],
        name: "Sistema de Gestão de Igreja",
        company: "Monte Los Olivos",
        industry: "Gestão religiosa",
        summary:
          "Sistema web abrangente para administração de igrejas, visando centralizar informações pastorais e facilitar a tomada de decisão baseada em dados.",
        features: [
          "Dashboard com estatísticas e gráficos",
          "Gestão de membros, visitas e presenças",
          "Gestão de grupos FC por idade",
          "Agendamento de cultos",
          "Relatórios com exportação para Excel e PDF",
          "Sistema de usuários com funções e permissões",
        ],
        results: [
          "Automação total de processos anteriormente manuais",
          "Dados centralizados e análise demográfica em tempo real",
          "Acompanhamento detalhado de membros e visitantes",
          "Planejamento pastoral baseado em métricas reais",
        ],
      },
      {
        ...es.projects.list[3],
        name: "Restaurante POS",
        company: "Brisas del Río",
        industry: "Restaurantes / Ponto de Venda",
        summary:
          "Sistema de ponto de venda (POS) para restaurante, focado em vendas rápidas, controle de estoque e relatórios operacionais.",
        features: [
          "POS intuitivo e eficiente",
          "Controle de estoque em tempo real",
          "Faturamento automático",
          "Relatórios de vendas e produtos",
        ],
        results: [
          "Redução significativa nos tempos de serviço",
          "Controle preciso de estoque",
          "Relatórios automáticos para tomada de decisão",
        ],
      },
      {
        ...es.projects.list[4],
        name: "Sistema de Tempo",
        company: "Tiempos",
        industry: "Loteria",
        summary:
          "Plataforma web para automatizar e centralizar a operação de sorteios de loteria do tipo 'Tiempos', controlando a venda de bilhetes, limites de apostas e gestão de pagamentos.",
        features: [
          "Bilhetes com código QR para validação rápida",
          "Módulo de limites dinâmicos por número",
          "Sorteios abertos/fechados em tempo real",
          "Gestão centralizada de agências",
          "Otimização para vendas móveis e administração desktop",
          "Relatórios detalhados em Excel e PDF",
        ],
        results: [
          "Controle de risco: os limites não são excedidos",
          "Centralização de informações entre agências",
          "-90% no tempo para relatórios diários",
          "Bilhetes verificáveis e operação confiável",
        ],
      },
    ],
  },
  contact: {
    title: "Contato",
    desc: "Tem uma ideia ou projeto em mente? Vamos conversar!",
    infoTitle: "Informações de contato",
    form: {
      name: "Nome",
      namePlaceholder: "Seu nome",
      email: "E-mail",
      emailPlaceholder: "voce@email.com",
      message: "Mensagem",
      messagePlaceholder: "Como posso ajudar você?",
      submit: "Enviar mensagem",
      sending: "Enviando...",
    },
    email: "kirianluna.u@gmail.com",
    github: "https://github.com/kirianL",
    linkedin: "https://www.linkedin.com/in/kirianluna",
  },
  footer: {
    rights: "Todos os direitos reservados.",
  },
  nav: {
    about: "Sobre",
    skills: "Habilidades",
    experience: "Experiência",
    contact: "Contato",
    cv: "Baixar CV",
  },
};

export const dictionaries: Record<Language, typeof es> = {
  ES: es,
  EN: en,
  PT: pt,
};
