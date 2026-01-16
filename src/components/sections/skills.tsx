import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// SVGL Icons - Local imports
import { ReactIcon } from "@/components/ui/svgs/reactDark";
import { NextjsIcon } from "@/components/ui/svgs/nextjsIconDark";
import { TypescriptIcon } from "@/components/ui/svgs/typescript";
import { Tailwindcss } from "@/components/ui/svgs/tailwindcss";
import { ShadcnUi } from "@/components/ui/svgs/shadcnui";
import { Html5Icon } from "@/components/ui/svgs/html5";
import { CssOld } from "@/components/ui/svgs/cssOld";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Laravel } from "@/components/ui/svgs/laravel";
import { Php } from "@/components/ui/svgs/php";
import { Git } from "@/components/ui/svgs/git";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { Figma } from "@/components/ui/svgs/figma";

// Simple, Clean Local Icons for Categories
const Icons = {
  Layout: (props: any) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  Server: (props: any) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  ),
  Terminal: (props: any) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  ),
  Globe: (props: any) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
};

const iconMap: Record<string, any> = {
  React: ReactIcon,
  "Next.js": NextjsIcon,
  TypeScript: TypescriptIcon,
  TailwindCSS: Tailwindcss,
  "shadcn/ui": ShadcnUi,
  HTML5: Html5Icon,
  CSS3: CssOld,
  JavaScript: Javascript,
  Laravel: Laravel,
  PHP: Php,
  "API REST": Icons.Globe,
  Git: Git,
  GitHub: GithubDark,
  Figma: Figma,
};

function SkillItem({
  skill,
  index,
  prefersReducedMotion,
}: {
  skill: any;
  index: number;
  prefersReducedMotion: boolean;
}) {
  if (skill.name === "Sanctum") return null;
  const Icon = iconMap[skill.name] || Icons.Terminal;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{
        duration: 0.2,
        delay: prefersReducedMotion ? 0 : index * 0.02,
        ease: "easeOut",
      }}
      className="
        flex items-center gap-2.5 px-4 py-2 rounded-full
        border border-border/40 bg-background/50
        hover:border-primary/40 hover:bg-secondary/40
        cursor-default select-none
        group
      "
    >
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
      <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground">
        {skill.name}
      </span>
    </motion.div>
  );
}

export function Skills() {
  const { data }: { data: any } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    {
      id: "frontend",
      title: data.skills.categories?.frontend || "Frontend",
      items: data.skills.list.filter((s: any) => s.category === "Frontend"),
    },
    {
      id: "backend",
      title: data.skills.categories?.backend || "Backend",
      items: data.skills.list.filter(
        (s: any) =>
          s.category === "Backend" && s.id !== "Sanctum" && s.name !== "Sanctum"
      ),
    },
    {
      id: "tools",
      title: data.skills.categories?.tools || "Tools",
      items: data.skills.list.filter((s: any) => s.category === "Tools"),
    },
  ].filter((c) => c.items.length > 0);

  return (
    <section
      id="habilidades"
      className="py-16 md:py-24 bg-background border-t border-border/10"
    >
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-16 text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-foreground font-heal">
            {data.skills.title}
          </h2>
          <div className="h-1 w-12 bg-primary/60 rounded-full mx-auto" />
        </div>

        <div className="space-y-12">
          {categories.map((cat, catIndex) => (
            <div key={cat.id} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                {cat.title}
              </h3>

              <div className="flex flex-wrap gap-3">
                {cat.items.map((skill: any, idx: number) => (
                  <SkillItem
                    key={skill.name}
                    skill={skill}
                    index={idx}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
