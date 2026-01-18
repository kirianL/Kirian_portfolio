import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import profileImage from "@/assets/profile.png";

export function Hero() {
  const { data } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 px-4 bg-background">
      {/* Restored Background Glows (Ray Lights) */}
      <div className="absolute rounded-full blur-[48px] ray-light h-[267px] w-[1192px] rotate-[-20deg] opacity-100 md:opacity-40 -top-[252px] left-[100px]" />
      <div className="absolute rounded-full blur-[48px] ray-light h-[276px] w-[1192px] rotate-[-32deg] opacity-25 -top-[200px] left-[240px]" />
      <div className="absolute rounded-full blur-[48px] ray-light h-[388px] w-[1758px] rotate-[40deg] opacity-80 -left-[200px] -top-[440px]" />
      <div className="absolute rounded-full blur-[48px] ray-light h-[492px] w-[1192px] rotate-[-32deg] opacity-75 -top-[280px] left-[960px]" />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Vertical Photo Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-1 relative group"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-[70%] max-w-[260px] sm:w-full sm:max-w-sm mx-auto lg:mx-0 rounded-[2rem] bg-secondary/5 border border-white/5 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer group-hover:shadow-blue-500/10 transition-all duration-500">
              <img
                src={profileImage}
                alt="Kirian Luna Quirós"
                className="w-full h-full object-cover scale-[1.01] group-hover:scale-110 transition-transform duration-700"
                loading="eager"
                decoding="async"
              />
            </div>
          </motion.div>

          {/* Right Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-2 space-y-8 text-center lg:text-left"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-500/90 uppercase tracking-[0.2em] font-heal">
                {data.hero.availability}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wider text-foreground font-heal leading-[1.1]">
                <span className="text-blue-500 block mb-2">{data.name}</span>
                <span className="text-foreground/80 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans tracking-tight block">
                  {data.hero.role}
                </span>
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                {data.hero.desc
                  .split(
                    /(el diseño|la seguridad|design|security|o design|a segurança)/i,
                  )
                  .map((part, i) =>
                    /(el diseño|la seguridad|design|security|o design|a segurança)/i.test(
                      part,
                    ) ? (
                      <span
                        key={i}
                        className="text-blue-500 font-heal tracking-wide"
                      >
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
              </p>
            </div>

            {/* Minimalist Social & CTA - No Pill Container */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center gap-6">
                <a
                  href={data.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-500 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-muted-foreground hover:text-blue-500 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>

              <div className="h-6 w-[1px] bg-border/40 hidden sm:block" />

              <button
                className="font-heal uppercase tracking-[0.4em] text-xs sm:text-sm text-foreground hover:text-blue-500 transition-all font-bold group flex items-center gap-2"
                onClick={() => smoothScrollToElement("projects")}
              >
                {data.hero.ctaExplore}
                <span className="w-8 h-[1px] bg-blue-500/50 group-hover:w-12 transition-all duration-300" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Blur Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-[100px] -z-10 pointer-events-none"
      />
    </section>
  );
}
