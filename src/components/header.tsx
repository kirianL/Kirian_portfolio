import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import { useEffect, useState } from "react";

export function Header() {
  const { data } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Use IntersectionObserver instead of scroll events for better performance
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "20px";
    sentinel.style.height = "1px";
    sentinel.style.width = "100%";
    sentinel.style.pointerEvents = "none";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 gpu-accelerated border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/10 py-3 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.2)]"
          : "bg-transparent border-transparent py-5 shadow-none"
      )}
    >
      <div className="container mx-auto px-6 h-12 flex items-center justify-between">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 font-heal tracking-wider">
          Kirian.dev
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { key: "about", label: data.nav.about },
            { key: "habilidades", label: data.nav.skills },
            { key: "projects", label: data.nav.projects },
            { key: "contact", label: data.nav.contact },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => smoothScrollToElement(item.key)}
              className="text-sm font-black text-zinc-700 dark:text-zinc-400 hover:text-foreground transition-all duration-300 ease-in-out uppercase tracking-tight"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex rounded-full px-6 py-2 h-auto border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500 hover:text-white transition-all duration-300 font-heal tracking-widest uppercase text-[10px] font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:border-blue-400 group"
            asChild
          >
            <a
              href="/CV.pdf"
              download="CV_Kirian_Luna.pdf"
              className="flex items-center gap-2"
            >
              <span className="relative z-10">{data.nav.cv}</span>
            </a>
          </Button>
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
