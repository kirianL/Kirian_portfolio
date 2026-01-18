import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { GithubActivity } from "@/components/ui/github-activity";
import { MapComponent } from "@/components/ui/map-component";
import flag from "@/assets/costa-rica.png";

export function About() {
  const { data } = useLanguage();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format for Costa Rica (GMT-6)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden bg-background"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-32"
        >
          {/* 1. LEAD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">
            <div className="lg:col-span-5 space-y-8">
              <span className="text-editorial-meta">{data.about.title}</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none font-heal text-foreground">
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
                        className="text-xs font-mono text-foreground"
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
                  LIVE FEED / GMT-6 / {time}
                </span>
              </div>
            </div>

            <div className="lg:col-span-1" />

            <div className="lg:col-span-4 flex flex-col justify-between gap-12 lg:gap-0">
              <div className="space-y-12">
                <div className="group space-y-2">
                  <span className="text-editorial-meta">
                    {data.about.educationLabel}
                  </span>
                  <p className="text-sm font-mono text-muted-foreground">
                    {data.education.degree}
                  </p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {data.education.institution}
                  </p>
                </div>

                <div className="group space-y-2">
                  <span className="text-editorial-meta">
                    {data.about.experienceLabel}
                  </span>
                  <p className="text-sm font-mono text-muted-foreground">
                    {data.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. GITHUB ACTIVITY */}
          <motion.div variants={itemVariants} className="w-full">
            <GithubActivity />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
