import { useLanguage } from "@/context/language-context";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export function Hero() {
  const { data } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-32 md:pt-40 pb-20 px-4 bg-background overflow-hidden"
    >
      {/* Premium Background Glows - Top Localized - Visible Stacking */}
      <div className="absolute rounded-full blur-[50px] md:blur-[80px] ray-light h-[300px] md:h-[400px] w-[800px] md:w-[1500px] rotate-[-20deg] opacity-60 md:opacity-50 -top-[150px] md:-top-[250px] -left-20 pointer-events-none z-0" />
      <div className="absolute rounded-full blur-[50px] md:blur-[80px] ray-light-secondary h-[350px] md:h-[500px] w-[900px] md:w-[1800px] rotate-[40deg] opacity-40 md:opacity-60 -right-[200px] -top-[200px] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-32 min-h-[60vh]">
          {/* Profile Container */}
          <div className="relative w-full max-w-[200px] md:max-w-[280px] lg:w-[40%] z-10">
            <div className="w-full aspect-[4/5] bg-secondary/10 border border-border/50 overflow-hidden relative group shadow-2xl">
              <img
                src="/profile.webp"
                alt={data.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="eager"
                decoding="async"
                // @ts-ignore
                fetchpriority="high"
              />
            </div>
            {/* Decorative Patterns */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-r border-b border-primary/40 -z-10" />
            <div className="absolute -top-6 -left-6 w-16 h-16 border-t border-l border-primary/20 -z-10" />
          </div>

          {/* Text Content */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="space-y-6 mb-12 flex flex-col items-center lg:items-start">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <span className="text-editorial-meta text-primary font-bold">
                  {data.hero.role}
                </span>
                <div className="px-3 py-0.5 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {data.hero.availability}
                </div>
              </div>

              <h1 className="text-editorial-huge leading-[0.85] py-2">
                <span className="block text-foreground">
                  {data.name.split(" ")[0]}
                </span>
                <span
                  className="block text-transparent"
                  style={{
                    WebkitTextStroke: "1.5px hsla(var(--foreground)/0.5)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {data.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-center lg:items-start gap-12 lg:gap-24">
              <p className="max-w-md text-lg text-muted-foreground leading-relaxed font-medium">
                {data.hero.desc}
              </p>

              <div className="flex flex-col gap-8 items-center lg:items-start">
                <button
                  className="group flex items-center gap-4 text-editorial-meta text-foreground hover:text-primary transition-colors"
                  onClick={() => smoothScrollToElement("projects")}
                >
                  <span className="w-12 h-[1.5px] bg-foreground group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                  <span className="font-bold uppercase tracking-widest">
                    {data.hero.ctaExplore}
                  </span>
                </button>
                <div className="flex items-center gap-8">
                  {[
                    { icon: faGithub, href: data.contact.github },
                    { icon: faLinkedin, href: data.contact.linkedin },
                    { icon: faEnvelope, href: `mailto:${data.contact.email}` },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 p-2"
                    >
                      <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
