import { motion } from "framer-motion";
import { MapPin, Globe, Smartphone } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { GithubActivity } from "@/components/ui/github-activity";
import { MapComponent } from "@/components/ui/map-component";
import flag from "@/assets/costa-rica.png";

export function About() {
  const { data } = useLanguage();

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
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-24"
        >
          {/* 1. MAIN SPLIT SECTION */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start"
          >
            {/* Left Column: Bio & Stack */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-foreground leading-tight font-heal">
                {data.about.title}
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground/90 text-xl">
                  {data.about.intro}
                </p>
                {data.about.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-8 border-t border-border/40">
                <h4 className="text-sm font-bold text-foreground font-heal tracking-widest uppercase mb-4">
                  {data.about.stackTitle}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {["React", "Next.js", "Laravel", "Tailwind"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-md bg-secondary/50 border border-border/50 text-xs font-mono text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Map & Info */}
            <div className="flex flex-col gap-8">
              {/* Map Section - Right Only */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground font-heal tracking-wide flex items-center gap-3">
                    {data.hero.based}
                    <img
                      src={flag}
                      alt="Costa Rica Flag"
                      className="w-8 h-auto object-contain rounded-sm shadow-sm"
                    />
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full border border-border/50">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                      GMT-6
                    </span>
                  </div>
                </div>
                <div className="relative w-full aspect-[2.5/1] md:aspect-square rounded-3xl overflow-hidden border border-border/50 bg-secondary/10 shadow-2xl">
                  <MapComponent />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 h-full">
                {/* Experience Card - Stat Style */}
                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/40 hover:border-primary/20 hover:bg-secondary/20 transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 h-full">
                  <div className="p-2 rounded-full bg-purple-500/10 mb-1">
                    <Smartphone className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-bold text-foreground font-heal leading-none">
                      2+
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {data.about.experienceTitle}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 leading-tight">
                    Desarrollo Web
                  </p>
                </div>

                {/* Education Card - Stat Style */}
                <div className="p-4 rounded-2xl bg-secondary/10 border border-border/40 hover:border-primary/20 hover:bg-secondary/20 transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 h-full">
                  <div className="p-2 rounded-full bg-orange-500/10 mb-1">
                    <Globe className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg md:text-xl font-bold text-foreground font-heal leading-none text-center">
                      Ing. Sistemas
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {data.about.educationTitle}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 leading-tight line-clamp-1">
                    Universidad Latina
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. GITHUB ACTIVITY */}
          <motion.div variants={itemVariants} className="w-full">
            <GithubActivity />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
