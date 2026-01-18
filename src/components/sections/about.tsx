import { useEffect, useState } from "react";

import { useLanguage } from "@/context/language-context";
import { GithubActivity } from "@/components/ui/github-activity";
import { MapComponent } from "@/components/ui/map-component";
import flag from "@/assets/costa-rica.webp";
import { Button } from "@/components/ui/button";

export function About() {
  const { data } = useLanguage();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Costa_Rica",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden bg-background"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col gap-32">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              {data.about.badgeLabel}
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-foreground font-heal leading-tight">
              {data.about.heroTitle}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {data.about.heroSubtitle}
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                className="rounded-full px-8 h-12 text-base font-medium transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="#projects">{data.about.ctaWork}</a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-medium border-primary/20 hover:bg-primary/5 transition-all duration-300"
                asChild
              >
                <a href="#contact">{data.about.ctaContact}</a>
              </Button>
            </div>
          </div>

          {/* 1. LEAD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">
            <div className="lg:col-span-5 space-y-8">
              <span className="text-editorial-meta">{data.about.title}</span>
              <h2 className="text-3xl md:text-5xl font-bold font-heal leading-tight text-foreground">
                {data.about.intro}
              </h2>
            </div>
            <div className="lg:col-span-1" /> {/* Spacer */}
            <div className="lg:col-span-6 space-y-8 text-lg text-muted-foreground leading-relaxed pt-2">
              {data.about.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0 ? "text-foreground font-medium text-xl" : ""
                  }
                >
                  {paragraph}
                </p>
              ))}

              <div className="pt-8 border-t border-border mt-12 grid grid-cols-2 gap-8">
                <div>
                  <span className="text-editorial-meta block mb-4">
                    {data.about.coreStackLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "Laravel", "Tailwind"].map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono text-foreground uppercase tracking-widest"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-editorial-meta block mb-4">
                    {data.about.locationLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground uppercase tracking-widest">
                      {data.hero.based}
                    </span>
                    <img
                      src={flag}
                      alt="CR"
                      className="w-5 h-auto transition-opacity hover:opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SECONDARY SECTION: MAP & STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-stretch border-y border-border py-16">
            <div className="lg:col-span-7 relative h-[400px] lg:h-auto min-h-[400px]">
              <div className="w-full h-full bg-secondary/5 border border-border transition-all duration-1000 overflow-hidden group">
                <MapComponent />
              </div>
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 border border-border z-10 shadow-sm">
                <span className="text-editorial-meta !text-primary font-bold">
                  GMT-6 / {time}
                </span>
              </div>
            </div>

            <div className="lg:col-span-1" />

            <div className="lg:col-span-4 flex flex-col justify-between gap-12 lg:gap-0">
              <div className="space-y-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h3 className="text-xl font-bold tracking-tight text-foreground uppercase">
                    {data.about.experienceSub}
                  </h3>
                </div>

                <div className="py-6 border-t border-border/60 group flex justify-between items-start gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/80 pt-1 shrink-0">
                    {data.about.educationLabel}
                  </span>
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold font-heal leading-tight group-hover:text-primary transition-colors text-balance">
                      {data.education.degree}
                    </p>
                    <p className="text-[10px] md:text-xs font-mono text-muted-foreground mt-1">
                      {data.education.institution}
                    </p>
                  </div>
                </div>

                <div className="py-6 border-t border-border/60 group flex justify-between items-start gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/80 pt-1 shrink-0">
                    {data.about.experienceLabel}
                  </span>
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold font-heal leading-tight group-hover:text-primary transition-colors">
                      {data.experience}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border/60 w-full" />
              </div>
            </div>
          </div>

          {/* 3. GITHUB ACTIVITY */}
          <div className="w-full">
            <GithubActivity />
          </div>
        </div>
      </div>
    </section>
  );
}
