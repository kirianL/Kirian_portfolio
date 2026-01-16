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
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header - Matching Skills Design */}
        <div className="mb-10 md:mb-16 text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-foreground font-heal">
            {data.projects.title}
          </h2>
          <div className="h-1 w-12 bg-primary/60 rounded-full mx-auto" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {data.projects.list.map((project: any, index: number) => (
            <Link
              key={index}
              to={`/project/${project.slug}`}
              className="group relative flex flex-col gap-4 cursor-pointer"
            >
              {/* Card Image / Visual */}
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-secondary/10 border border-border/50 relative">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-colors duration-500" />

                {/* Year Badge floating in image */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full border border-border/50 text-xs font-mono font-bold text-foreground z-10">
                  {project.year}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Card Content */}
              <div className="space-y-3 px-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-foreground font-heal group-hover:text-primary transition-colors leading-tight">
                    {project.name.split("·")[0]}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300 transform-origin-center mt-1" />
                </div>

                <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">
                  Read more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
