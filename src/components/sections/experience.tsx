import { useLanguage } from "@/context/language-context";
import { CheckCircle2, MapPin } from "lucide-react";

export function Experience() {
  const { data } = useLanguage();

  return (
    <section id="experience" className="py-20 bg-background/50">
      <div className="container px-6 mx-auto max-w-6xl">
        <div className="">
          {/* Header */}
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight">
              {data.projects.title}
            </h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
            <p className="text-lg text-foreground/80 dark:text-muted-foreground/90 max-w-3xl mx-auto font-medium">
              {data.projects.subtitle}
            </p>
            <p className="text-sm text-foreground/70 dark:text-muted-foreground/80 max-w-4xl mx-auto">
              {data.projects.description}
            </p>
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
            {data.projects.list.map((project, index) => {
              return (
                <div
                  key={index}
                  className="group relative flex flex-col md:flex-row bg-card dark:bg-card/40 backdrop-blur-xl border border-border/60 rounded-[2rem] overflow-hidden hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Left Side: Logo & Industry */}
                  <div className="relative w-full md:w-1/3 p-8 flex flex-col items-center justify-center bg-primary/5 border-b md:border-b-0 md:border-r border-border/40">
                    <div className="relative mb-6">
                      <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full opacity-60" />
                      {project.logo ? (
                        <img
                          src={project.logo}
                          alt={project.company}
                          className="relative w-32 h-32 md:w-40 md:h-40 object-contain"
                        />
                      ) : (
                        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                          <span className="text-4xl font-bold text-primary">
                            {project.company.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="relative text-[11px] font-bold px-5 py-2 bg-primary/20 dark:bg-primary/30 border border-primary/30 dark:border-primary/50 rounded-full text-primary dark:text-white backdrop-blur-md uppercase tracking-[0.15em] shadow-sm text-center">
                      {project.industry}
                    </span>
                  </div>

                  {/* Right Side: Details */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col">
                    <div className="space-y-3 mb-6">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-foreground dark:text-white tracking-tight leading-tight">
                          {project.name}
                        </h3>
                        <span className="shrink-0 text-[10px] uppercase tracking-widest font-black px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md border border-green-500/30 w-fit">
                          {project.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-foreground dark:text-white/90">
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-[2px] bg-primary/60" />
                          {project.company}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 dark:bg-white/5 rounded-md text-[10px] uppercase tracking-wider text-foreground/70 dark:text-white/60">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {project.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-[15px] md:text-base text-foreground/90 dark:text-white/80 leading-relaxed font-medium mb-10">
                      {project.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 mt-auto">
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-foreground/80 dark:text-white/60 uppercase tracking-[0.2em] border-b border-primary/20 pb-1 w-fit">
                          {data.projects.featuresLabel}
                        </h4>
                        <ul className="space-y-3">
                          {project.features.slice(0, 4).map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-[13px] text-foreground/80 dark:text-white/70 font-medium leading-tight"
                            >
                              <span className="w-2 h-2 rounded-full bg-primary/60 mt-1 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-foreground/80 dark:text-white/60 uppercase tracking-[0.2em] border-b border-green-500/20 pb-1 w-fit">
                          {data.projects.resultsLabel}
                        </h4>
                        <ul className="space-y-3">
                          {project.results.slice(0, 4).map((result, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-[13px] text-foreground/80 dark:text-white/70 font-medium leading-tight"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 mt-0 flex-shrink-0" />
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border/40">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-black px-3.5 py-1.5 bg-primary/5 dark:bg-white/5 text-foreground/80 dark:text-white/90 rounded-lg border border-border/60 hover:border-primary/30 transition-all cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
