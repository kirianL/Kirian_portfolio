import { motion } from "framer-motion";
import { User, MapPin, GraduationCap, Code } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function About() {
  const { data } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase text-left">
              {data.about.title}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-foreground max-w-2xl text-left leading-tight">
              {data.about.intro}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start border-t border-border pt-12">
            {/* Left Column: Biography */}
            <div className="md:col-span-7 space-y-8">
              <div className="prose prose-lg dark:prose-invert text-foreground/80 dark:text-muted-foreground leading-relaxed">
                {data.about.bio.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.4,
                      delay: prefersReducedMotion ? 0 : index * 0.1,
                    }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="md:col-span-5 space-y-8 md:pl-8 md:border-l border-border/50">
              {/* Role & Location */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.4,
                    delay: prefersReducedMotion ? 0 : 0.2,
                  }}
                  className="flex items-start gap-4 gpu-accelerated"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {data.about.roleTitle}
                    </h4>
                    <p className="text-sm text-foreground/70 dark:text-muted-foreground">
                      {data.title}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.4,
                    delay: prefersReducedMotion ? 0 : 0.3,
                  }}
                  className="flex items-start gap-4 gpu-accelerated"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {data.about.locationTitle}
                    </h4>
                    <p className="text-sm text-foreground/70 dark:text-muted-foreground">
                      {data.location}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="w-full h-px bg-border/50" />

              {/* Experience & Education */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.4,
                    delay: prefersReducedMotion ? 0 : 0.4,
                  }}
                  className="flex items-start gap-4 gpu-accelerated"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {data.about.experienceTitle}
                    </h4>
                    <p className="text-sm text-foreground/80 dark:text-white/90">
                      {data.experience}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.4,
                    delay: prefersReducedMotion ? 0 : 0.5,
                  }}
                  className="flex items-start gap-4 gpu-accelerated"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {data.about.educationTitle}
                    </h4>
                    <p className="text-sm text-foreground/80 dark:text-white/90">
                      {data.education.degree}
                    </p>
                    <p className="text-xs text-foreground/70 dark:text-white/70">
                      {data.education.institution} • {data.education.period}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Tech Stack Mini-Preview (Optional) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.4,
                  delay: prefersReducedMotion ? 0 : 0.6,
                }}
                className="pt-4"
              >
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 dark:text-muted-foreground mb-4">
                  {data.about.stackTitle}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "Laravel", "Tailwind"].map(
                    (tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: prefersReducedMotion ? 0.01 : 0.3,
                          delay: prefersReducedMotion ? 0 : 0.7 + index * 0.05,
                        }}
                        className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground transition-transform duration-200 hover:scale-105 gpu-accelerated"
                      >
                        {tech}
                      </motion.span>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
