import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
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
        "fixed top-0 w-full z-50 transition-all duration-300 gpu-accelerated",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/20 py-2 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 h-12 flex items-center justify-between">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Kirian.dev
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { key: "about", label: data.nav.about },
            { key: "skills", label: data.nav.skills },
            { key: "experience", label: data.nav.experience },
            { key: "contact", label: data.nav.contact },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => smoothScrollToElement(item.key)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex rounded-full px-4 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            asChild
          >
            <a href="/cv.pdf" download="CV_Kirian_Luna.pdf">
              {data.nav.cv}
            </a>
          </Button>
          <LanguageSelector />
          <AnimatedThemeToggler />
        </div>
      </div>
    </header>
  );
}
