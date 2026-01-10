import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import profileImg from "@/assets/profile.png";
import flagImg from "@/assets/costa-rica.png";

export function Hero() {
  const { data } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-12 px-4">
      <div className="absolute top-0 z-0 h-full w-full bg-white dark:bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-tight">
                  {data.name}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground/80 dark:text-muted-foreground">
                  {data.hero.role}
                </h2>
              </div>

              <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg text-foreground/70 dark:text-muted-foreground/80 leading-relaxed">
                {data.hero.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => smoothScrollToElement("projects")}
              >
                {data.hero.ctaProjects}{" "}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex items-center gap-4 px-4 h-12 sm:h-14">
                <a
                  href={data.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 hover:bg-secondary rounded-full"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 hover:bg-secondary rounded-full"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 hover:bg-secondary rounded-full"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70 dark:text-muted-foreground">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{data.location}</span>
                <img
                  src={flagImg}
                  alt="Costa Rica"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain ml-1"
                  loading="eager"
                />
              </div>

              {/* Tech Stack Section */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 p-3 sm:p-4 rounded-2xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                <span className="text-xs sm:text-sm font-semibold text-foreground/70 dark:text-muted-foreground">
                  {data.hero.techStackLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.hero.techStack.map((tech, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-background border border-border shadow-sm text-xs font-medium text-foreground transition-transform duration-200 hover:scale-105"
                    >
                      {tech === "React" && (
                        <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      )}
                      {tech === "Next.js" && (
                        <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-foreground" />
                      )}
                      {tech === "TypeScript" && (
                        <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                      )}
                      {tech === "TailwindCSS" && (
                        <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-500" />
                      )}
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[400px] aspect-[3/4]">
              {/* Image Container */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-background">
                <img
                  src={profileImg}
                  alt={data.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-in-out hover:scale-105"
                  loading="eager"
                />
              </div>

              {/* Badge - Hidden on mobile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 -left-4 sm:bottom-8 sm:-left-8 md:bottom-8 md:-left-12 bg-background border border-border p-3 sm:p-4 md:p-5 rounded-2xl shadow-xl z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-secondary rounded-xl text-primary">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Experiencia
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                      {data.hero.stats.exp}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
