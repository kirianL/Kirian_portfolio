import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export function Hero() {
  const { data } = useLanguage();

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-32 md:pt-40 pb-20 px-4 bg-background">
      {/* Enhanced Background Glows (Ray Lights) - More Vibrant */}
      <div className="absolute rounded-full blur-[30px] md:blur-[60px] ray-light h-[200px] md:h-[300px] w-[600px] md:w-[1200px] rotate-[-20deg] opacity-40 md:opacity-40 -top-[100px] md:-top-[200px] left-[-100px] md:left-[100px] will-change-transform" />
      <div className="absolute rounded-full blur-[30px] md:blur-[60px] ray-light-secondary h-[250px] md:h-[400px] w-[800px] md:w-[1500px] rotate-[40deg] opacity-40 md:opacity-60 -left-[100px] md:-left-[200px] -top-[150px] md:-top-[300px] will-change-transform" />
      <div className="absolute rounded-full blur-[30px] md:blur-[60px] ray-light h-[300px] md:h-[500px] w-[600px] md:w-[1200px] rotate-[-32deg] opacity-40 md:opacity-50 -top-[50px] md:-top-[100px] left-[200px] md:left-[800px] will-change-transform" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-0 lg:min-h-[75vh]">
          {/* Vibrant Profile Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[160px] md:max-w-[220px] lg:w-[45%] xl:w-[40%] aspect-[4/5] lg:aspect-[3/4] z-10 lg:mr-12"
          >
            <div className="w-full h-full bg-secondary/5 border border-border overflow-hidden relative group">
              <img
                src="/profile.webp"
                alt={data.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="eager"
                decoding="async"
                // @ts-ignore
                fetchpriority="high"
              />
            </div>
            {/* Grid Pattern Behind Photo Overlay */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-primary/20 -z-10" />
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full text-center lg:text-left lg:z-20 pt-8 lg:pt-0"
          >
            <div className="space-y-4 md:space-y-6 mb-10 flex flex-col items-center lg:items-start">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <span className="text-editorial-meta ml-1 text-primary font-bold">
                  {data.hero.role}
                </span>
                <div className="inline-flex">
                  <div className="px-3 py-1 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {data.hero.availability}
                  </div>
                </div>
              </div>
              <h1 className="text-editorial-huge relative break-words">
                <span className="block text-foreground selection:bg-primary selection:text-white">
                  {data.name.split(" ")[0]}
                </span>
                <span
                  className="block text-transparent stroke-text selection:text-white"
                  style={{ WebkitTextStroke: "1px hsl(var(--foreground)/0.6)" }}
                >
                  {data.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-center lg:items-start gap-10 md:gap-16">
              <p className="max-w-md text-lg text-muted-foreground leading-relaxed font-medium">
                {data.hero.desc
                  .split(/(el diseño|la seguridad)/g)
                  .map((part, i) =>
                    part === "el diseño" || part === "la seguridad" ? (
                      <span key={i} className="text-primary font-bold">
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
              </p>

              <div className="flex flex-col gap-6">
                <button
                  className="group flex items-center gap-4 text-editorial-meta text-foreground hover:text-primary transition-colors pr-4"
                  onClick={() => smoothScrollToElement("projects")}
                >
                  <span className="w-10 h-[1px] bg-foreground group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                  <span className="font-bold">{data.hero.ctaExplore}</span>
                </button>
                <div className="flex items-center gap-6 justify-center lg:justify-start">
                  {[
                    { icon: faGithub, href: data.contact.github },
                    { icon: faLinkedin, href: data.contact.linkedin },
                    { icon: faEnvelope, href: `mailto:${data.contact.email}` },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:scale-110 transition-all"
                    >
                      <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Primary Accent Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-[120px] -z-10 pointer-events-none"
      />
    </section>
  );
}
