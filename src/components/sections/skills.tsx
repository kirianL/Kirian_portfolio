import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Lazy loading skill icon component
function SkillCard({
  skill,
  prefersReducedMotion,
}: {
  skill: any;
  prefersReducedMotion: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.3,
      }}
      className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/10 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 gap-2 group gpu-accelerated"
    >
      <div className="w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-60 group-hover:opacity-100">
        {!imageLoaded && <div className="w-6 h-6 rounded skeleton" />}
        <img
          src={skill.icon}
          alt={skill.name}
          className={cn(
            "w-6 h-6 object-contain grayscale transition-all duration-300",
            skill.className,
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <span className="text-xs font-semibold text-foreground/70 dark:text-white/70 group-hover:text-foreground transition-colors truncate w-full text-center">
        {skill.name}
      </span>
    </motion.div>
  );
}

export function Skills() {
  const { data } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    {
      title: data.skills.categories.frontend,
      items: data.skills.list.filter((s) => s.category === "Frontend"),
    },
    {
      title: data.skills.categories.backend,
      items: data.skills.list.filter((s) => s.category === "Backend"),
    },
    {
      title: data.skills.categories.db,
      items: data.skills.list.filter((s) => s.category === "DB"),
    },
    {
      title: data.skills.categories.tools,
      items: data.skills.list.filter((s) => s.category === "Tools"),
    },
    {
      title: data.skills.categories.security,
      items: data.skills.list.filter((s) => s.category === "Security"),
    },
  ];

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container px-6 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
          className="mb-20 text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight">
            {data.skills.title}
          </h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: prefersReducedMotion ? 0 : idx * 0.1,
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-lg font-semibold text-foreground/80 mb-4 border-l-4 border-primary/50 pl-3">
                {category.title}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {category.items.map((skill) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
