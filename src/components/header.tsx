import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const { data } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        smoothScrollToElement(sectionId);
      }, 100);
    } else {
      // Already on home page, just scroll
      smoothScrollToElement(sectionId);
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      // Navigate to home page
      navigate("/");
    } else {
      // Already on home page, scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

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
      { threshold: 0 },
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
          : "bg-transparent border-transparent py-5 shadow-none",
      )}
    >
      <div className="container mx-auto px-6 h-12 flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 font-heal tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
        >
          Kirian.dev
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { key: "about", label: data.nav.about },
            { key: "habilidades", label: data.nav.skills },
            { key: "projects", label: data.nav.projects },
            { key: "contact", label: data.nav.contact },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
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
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full h-10 w-10 border border-border/40"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-xl border-b border-border/10 shadow-2xl py-8 px-6 space-y-8"
          >
            <nav className="flex flex-col gap-6">
              {[
                { key: "about", label: data.nav.about },
                { key: "habilidades", label: data.nav.skills },
                { key: "projects", label: data.nav.projects },
                { key: "contact", label: data.nav.contact },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className="text-lg font-black text-zinc-700 dark:text-zinc-400 hover:text-foreground transition-all duration-300 uppercase tracking-wider text-left"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-8 border-t border-border/40">
              <Button
                variant="default"
                className="w-full flex rounded-xl px-6 py-4 h-auto bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 font-heal tracking-widest uppercase text-xs font-bold shadow-lg shadow-blue-500/20"
                asChild
              >
                <a
                  href="/CV.pdf"
                  download="CV_Kirian_Luna.pdf"
                  className="flex items-center justify-center gap-3"
                >
                  {data.nav.cv}
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
