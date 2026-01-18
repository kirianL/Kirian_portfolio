import { useLanguage } from "@/context/language-context";

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

// Skill item logic integrated into main map

export function Skills() {
  const { data }: { data: any } = useLanguage();

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
          s.category === "Backend" &&
          s.id !== "Sanctum" &&
          s.name !== "Sanctum",
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
      className="py-32 bg-background border-t border-border editorial-grid"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-20 space-y-4">
          <span className="text-editorial-meta">
            {data.contact.capabilitiesLabel}
          </span>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none font-heal text-foreground">
            {data.skills.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-border">
          <div className="lg:col-span-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.skills.description}
            </p>
          </div>

          <div className="lg:col-span-8 space-y-16">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-6">
                <h3 className="text-editorial-meta text-primary font-bold">
                  {cat.title}
                </h3>

                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  {cat.items.map((skill: any) => {
                    const Icon = iconMap[skill.name] || Icons.Terminal;
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center gap-3 group"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground transition-all group-hover:scale-125 duration-300" />
                        <span className="text-sm font-mono text-foreground/80 group-hover:text-primary transition-colors uppercase tracking-widest font-bold">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
