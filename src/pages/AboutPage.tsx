import * as React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

interface AboutPageProps {
  lang: "en" | "es";
}

export default function AboutPage({ lang }: AboutPageProps) {
  const isEs = lang === "es";

  useDocumentMeta({
    title: isEs
      ? "Sobre mí | Kirian Luna — Ingeniero de Software"
      : "About | Kirian Luna — Software Engineer",
    description: isEs
      ? "Soy Kirian Luna, ingeniero de software en Limón, Costa Rica. Construyo productos digitales con un enfoque en diseño reflexivo, arquitectura sólida y experiencia de usuario."
      : "I'm Kirian Luna, a software engineer based in Limón, Costa Rica. I build digital products with a focus on thoughtful design, sound architecture, and user experience.",
    lang,
    pageType: "AboutPage",
  });

  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-grayscale-1">
        <div className="max-w-xl mx-auto px-6 sm:px-0 pt-28 pb-6 flex flex-col gap-10">
          <div>
            <Link
              to={isEs ? "/es/" : "/"}
              data-cuelume-hover="tick"
              className="inline-flex items-center gap-1 text-xs font-mono text-grayscale-10 hover:text-grayscale-12 transition-colors select-none"
            >
              <span>←</span>
              <span>{isEs ? "Inicio" : "Home"}</span>
            </Link>
          </div>

          <section className="flex flex-col gap-3.5">
            <h1 className="text-sm font-semibold text-grayscale-12 font-mono tracking-tight select-none">
              {isEs ? "Sobre mí" : "About"}
            </h1>
            <div className="flex flex-col gap-3 text-xs sm:text-[13px] text-grayscale-11 leading-relaxed">
              {isEs ? (
                <>
                  <p>
                    Soy Kirian Luna, ingeniero de software con base en Limón, Costa Rica. Construyo productos digitales con un enfoque en diseño reflexivo, arquitectura sólida y los detalles que hacen que el software se sienta intuitivo y natural de usar.
                  </p>
                  <p>
                    Trabajo a lo largo de todo el stack, desde el diseño de sistemas backend y modelos de datos hasta la creación de interfaces responsivas y el perfeccionamiento de las interacciones con el usuario. Me interesa la intersección entre la ingeniería de software y el diseño de producto: no solo hacer que las cosas funcionen, sino que funcionen bien.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I'm Kirian Luna, a software engineer based in Limón, Costa Rica. I build digital products with a focus on thoughtful design, sound architecture, and the details that make software feel effortless to use.
                  </p>
                  <p>
                    I work across the stack, from designing backend systems and data models to building responsive interfaces and refining user interactions. I'm interested in the intersection of software engineering and product design: not just making things work, but making them work well.
                  </p>
                </>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-10 text-xs sm:text-[13px] leading-relaxed">
            <section className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-2 sm:gap-6 items-baseline">
              <span className="text-xs font-mono text-grayscale-10 select-none">
                {isEs ? "Trayectoria" : "Path"}
              </span>
              <div className="flex flex-col gap-3.5 text-grayscale-11">
                {isEs ? (
                  <>
                    <p>
                      Cuento con un Bachillerato en Ingeniería de Sistemas de Computación por la{" "}
                      <a
                        href="https://www.ulatina.ac.cr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        Universidad Latina de Costa Rica
                      </a>
                      . Actualmente continúo mi formación académica en ingeniería de software en la Universidad Internacional de las Américas (UIA), al tiempo que curso una carrera en Educación en la Universidad Americana (UAM).
                    </p>
                    <p>
                      Mi formación académica y experiencia profesional se complementan: disfruto resolver problemas técnicos, comprender cómo las personas interactúan con el software y construir sistemas confiables, fáciles de mantener e intuitivos.
                    </p>
                    <p>
                      En UMP desarrollo soluciones digitales que respaldan a la empresa y a sus clientes. A través de Sorin Labs, mi estudio de software independiente, diseño y construyo aplicaciones full-stack, sitios web corporativos, herramientas internas y APIs a medida. Mi trabajo combina tecnologías web modernas con un fuerte énfasis en usabilidad, rendimiento y mantenibilidad a largo plazo.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      I hold a Bachelor's Degree in Computer Systems Engineering from{" "}
                      <a
                        href="https://www.ulatina.ac.cr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        Universidad Latina de Costa Rica
                      </a>
                      . I'm currently continuing my academic journey in software engineering at Universidad Internacional de las Américas (UIA), while also pursuing a degree in Education at Universidad Americana (UAM).
                    </p>
                    <p>
                      My academic background and professional experience complement each other: I enjoy solving technical problems, understanding how people use software, and building systems that are reliable, maintainable, and intuitive.
                    </p>
                    <p>
                      At UMP, I work on digital solutions that support the company and its clients. Through Sorin Labs, my independent software studio, I design and build full-stack applications, business websites, internal tools, and custom APIs. My work combines modern web technologies with a strong focus on usability, performance, and long-term maintainability.
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-2 sm:gap-6 items-baseline">
              <span className="text-xs font-mono text-grayscale-10 select-none">
                {isEs ? "Más allá del trabajo" : "Beyond the work"}
              </span>
              <div className="flex flex-col gap-3.5 text-grayscale-11">
                {isEs ? (
                  <>
                    <p>
                      Fuera de los proyectos para clientes y equipos, creo herramientas independientes y exploro ideas que resuelven problemas prácticos. Me interesa especialmente el oficio de la web: tipografía, diseño de interacción, accesibilidad y las decisiones de ingeniería detrás de experiencias rápidas y confiables.
                    </p>
                    <p>
                      También me apasiona cómo la tecnología puede abrir oportunidades y respaldar iniciativas significativas en Costa Rica, construyendo a la vez productos capaces de alcanzar una audiencia global.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Outside client and team projects, I build independent tools and explore ideas that solve practical problems. I'm especially interested in the craft of the web: typography, interaction design, accessibility, and the engineering decisions behind fast, reliable experiences.
                    </p>
                    <p>
                      I'm also interested in how technology can create opportunities and support meaningful projects in Costa Rica, while building products that can reach a wider audience.
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-2 sm:gap-6 items-baseline">
              <span className="text-xs font-mono text-grayscale-10 select-none">
                {isEs ? "Filosofía" : "Philosophy"}
              </span>
              <div className="flex flex-col gap-3.5 text-grayscale-11">
                {isEs ? (
                  <>
                    <p>
                      El buen software es intencional. Valoro las arquitecturas simples, los tipos explícitos, las interfaces accesibles y el rendimiento medido a través de la experiencia real del usuario.
                    </p>
                    <p>
                      Prefiero comprender un problema en profundidad antes de añadir complejidad innecesaria. Cada dependencia, abstracción e interacción debe tener una razón de ser.
                    </p>
                    <p>
                      El objetivo no es usar la mayor cantidad de tecnología, sino construir lo correcto, y construirlo bien.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Good software is intentional. I value simple architectures, explicit types, accessible interfaces, and performance measured by real user experience.
                    </p>
                    <p>
                      I prefer understanding a problem deeply over adding complexity for its own sake. Every dependency, abstraction, and interaction should have a reason to exist.
                    </p>
                    <p>
                      The goal isn't to use the most technology. It's to build the right thing, well.
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-2 sm:gap-6 items-baseline">
              <span className="text-xs font-mono text-grayscale-10 select-none">
                {isEs ? "Contacto" : "Connect"}
              </span>
              <div className="flex flex-col gap-3.5 text-grayscale-11">
                {isEs ? (
                  <>
                    <p>
                      Estoy disponible para oportunidades en ingeniería de software, colaboraciones y conversaciones sobre la creación de productos útiles.
                    </p>
                    <p>
                      Para consultas profesionales, puedes escribirme a{" "}
                      <a
                        href="mailto:kirianluna.u@gmail.com"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        kirianluna.u@gmail.com
                      </a>
                      , conectar conmigo en{" "}
                      <a
                        href="https://linkedin.com/in/kirianluna"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        LinkedIn
                      </a>{" "}
                      o explorar mis proyectos en{" "}
                      <a
                        href="https://github.com/kirianL"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        GitHub
                      </a>
                      . También puedes ponerte en contacto a través de la{" "}
                      <Link
                        to="/es/contact"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        página de contacto
                      </Link>
                      .
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      I'm open to software engineering opportunities, collaborations, and conversations about building useful products.
                    </p>
                    <p>
                      For professional inquiries, feel free to reach out at{" "}
                      <a
                        href="mailto:kirianluna.u@gmail.com"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        kirianluna.u@gmail.com
                      </a>
                      , connect with me on{" "}
                      <a
                        href="https://linkedin.com/in/kirianluna"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        LinkedIn
                      </a>
                      , or explore my work on{" "}
                      <a
                        href="https://github.com/kirianL"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        GitHub
                      </a>
                      . You can also get in touch through the{" "}
                      <Link
                        to="/contact"
                        className="text-grayscale-12 underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        contact page
                      </Link>
                      .
                    </p>
                  </>
                )}
              </div>
            </section>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
