import { useLanguage } from "@/context/language-context";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Experience() {
  const { data }: { data: any } = useLanguage();

  return (
    <section
      id="projects"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-20 space-y-4">
          <span className="text-editorial-meta">{data.projects.title}</span>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none font-heal text-foreground">
            {data.hero.ctaExplore}
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-24">
          {data.projects.list.map((project: any, index: number) => {
            return (
              <Link
                key={index}
                to={`/project/${project.slug}`}
                className="group flex flex-col gap-3 md:gap-6"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] w-full overflow-hidden border border-border relative bg-secondary/5">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2 md:space-y-4 max-w-3xl relative">
                  {/* Arrow Icon - Positioned absolutely */}
                  <ArrowRight className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-500" />

                  <div className="space-y-0.5 md:space-y-1 pr-8 md:pr-10">
                    <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-primary font-bold block">
                      {data.projects.caseStudyLabel}
                    </span>
                    <h3 className="text-base md:text-2xl font-bold text-foreground font-heal group-hover:text-primary transition-colors leading-tight">
                      {project.name.split("·")[0]}
                    </h3>
                  </div>

                  <p className="text-muted-foreground line-clamp-2 leading-relaxed text-xs md:text-lg">
                    {project.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
