import { motion } from "framer-motion";
import { FolderGit2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Projects() {
  const { data } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
          className="mb-16 text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            {data.projects.title}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Projects Horizontal List */}
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          {data.projects.list.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: prefersReducedMotion ? 0 : i * 0.1,
                duration: prefersReducedMotion ? 0.01 : 0.5,
              }}
              whileHover={prefersReducedMotion ? {} : { y: -5 }}
              className="group relative flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-3xl bg-secondary/20 hover:bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all duration-300 gpu-accelerated"
            >
              {/* Icon / Visual Side */}
              <div className="flex-shrink-0 flex items-start justify-center md:pt-2">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-300 gpu-accelerated">
                  <FolderGit2 className="w-8 h-8 md:w-10 md:h-10" />
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-foreground dark:text-white group-hover:text-primary transition-colors duration-200">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/70 font-medium">
                      <span>{project.company}</span>
                      {project.location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-[11px]">
                            {project.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="w-fit text-xs px-3 py-1 bg-secondary dark:bg-secondary/40 rounded-full text-muted-foreground dark:text-white/80 font-medium border border-border/50">
                    {project.industry}
                  </span>
                </div>

                <p className="text-muted-foreground dark:text-white/80 leading-relaxed max-w-3xl">
                  {project.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-[11px] font-medium text-primary bg-primary/10 rounded-full border border-primary/10 transition-transform duration-200 hover:scale-105 gpu-accelerated"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Results Brief */}
                  {project.results && (
                    <div className="flex flex-wrap gap-4">
                      {project.results.slice(0, 2).map((result, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                          <span className="text-xs text-muted-foreground/80 dark:text-white/60 font-medium">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
