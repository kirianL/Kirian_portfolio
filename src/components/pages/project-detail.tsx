import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/context/language-context";
import { ArrowLeft, ExternalLink, CheckCircle2, Lightbulb } from "lucide-react";
import { AutoCarousel } from "@/components/ui/auto-carousel";
import { motion } from "framer-motion";
import { useLayoutEffect } from "react";

export function ProjectDetail() {
  const { slug } = useParams();
  const { data } = useLanguage();

  // Find project by slug
  const project = data.projects.list.find((p: any) => p.slug === slug);

  // Redundant synchronous scroll reset for maximum stability
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-heal">404</h1>
          <p>{data.projectDetail.notFound}</p>
          <Link to="/" className="text-primary hover:underline">
            {data.projectDetail.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-background text-foreground relative"
    >
      {/* Background Effects Layer - z-0 to be behind content (image covers it) and behind header (shows through if transparent) */}
      <div className="absolute inset-x-0 top-0 h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full blur-[24px] md:blur-[48px] ray-light-secondary h-[80px] md:h-[117px] w-[300px] md:w-[585px] -rotate-[37deg] opacity-20 -top-[20px] md:-top-[40px] left-[-10%] md:left-[560px] will-change-transform" />
        <div className="absolute rounded-full blur-[24px] md:blur-[48px] ray-light-secondary h-[150px] md:h-[267px] w-[600px] md:w-[1192px] -rotate-[37deg] opacity-30 md:opacity-45 -top-[30px] md:-top-[60px] left-[-5%] md:left-[680px] will-change-transform" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-x border-border/40 min-h-screen pt-24 md:pt-32 pb-24 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/#projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">
              {data.projectDetail.back}
            </span>
          </Link>
          <div className="flex gap-3">
            {/* Additional header actions if needed */}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,360px] gap-12 xl:gap-24 items-start">
          {/* Main Content */}
          <div className="space-y-16">
            {/* Title & Simple Hero */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heal leading-tight text-foreground">
                  {project.name}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {project.overview}
                </p>
              </div>
              {/* Static Hero Image */}
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative group">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Objective */}
            {project.objective && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold font-heal flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  {data.projectDetail.objectiveLabel}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.objective}
                </p>
              </section>
            )}

            {/* Concept & UX Grid */}
            <div className="grid md:grid-cols-2 gap-12">
              {project.concept && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold font-heal">
                    {data.projectDetail.conceptLabel}
                  </h2>
                  <ul className="space-y-4">
                    {project.concept.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {project.ux && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold font-heal">
                    {data.projectDetail.uxLabel}
                  </h2>
                  <ul className="space-y-4">
                    {project.ux.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Visual Highlight: Carousel */}
            {project.gallery && (
              <section className="space-y-6 pt-8 border-t border-border/50">
                <h2 className="text-2xl font-bold font-heal">
                  {data.projectDetail.visualSectionLabel}
                </h2>
                <AutoCarousel images={project.gallery} interval={3000} />
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground italic">
                    {data.projectDetail.visualQuote}
                  </p>
                  {project.credits && (
                    <p className="text-xs text-muted-foreground">
                      {data.projectDetail.photosBy}{" "}
                      <a
                        href={project.credits.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary transition-colors underline decoration-primary/30 hover:decoration-primary"
                      >
                        {project.credits.name}
                      </a>
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Key Sections & Challenges/Tech */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-border/50">
              {project.keySections && project.keySections.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold font-heal">
                    {data.projectDetail.keySectionsLabel}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.keySections.map((item: string, idx: number) => {
                      const isLast =
                        idx === (project.keySections?.length ?? 0) - 1;
                      const isOddCount =
                        (project.keySections?.length ?? 0) % 2 !== 0;
                      return (
                        <li
                          key={idx}
                          className={`p-3 rounded-lg bg-secondary/5 border border-border/50 text-foreground/90 font-medium text-sm flex items-center ${
                            isLast && isOddCount ? "sm:col-span-2" : ""
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              <div className="space-y-12">
                {project.challenges && (
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold font-heal">
                      {data.projectDetail.challengesLabel}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.challenges}
                    </p>
                  </section>
                )}
                {project.technical && (
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold font-heal">
                      {data.projectDetail.technicalLabel}
                    </h2>
                    <ul className="space-y-3">
                      {project.technical.map((item: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="p-6 rounded-2xl border border-border/50 bg-secondary/5 space-y-8">
              {project.slug === "young-legends" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Status
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {project.status}
                  </span>
                </div>
              )}
              {/* Role */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {data.projectDetail.role}
                </p>
                <p className="font-medium text-foreground">{project.role}</p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {data.projectDetail.tech}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-background border border-border rounded-md text-[11px] font-mono hover:border-primary/50 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
              >
                {data.projectDetail.view}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Closing Quote */}
            <blockquote className="text-xl font-heal italic text-muted-foreground text-center px-4">
              {project.closingQuote || data.projectDetail.closingQuote}
            </blockquote>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
