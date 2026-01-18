import { LanguageSelector } from "@/components/language-selector";
import { ModeToggle } from "@/components/mode-toggle";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { smoothScrollToElement } from "@/utils/smooth-scroll";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const { data } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle location changes
  useEffect(() => {
    // Scroll behavior logic if needed
  }, [location]);

  const handleNavClick = (sectionId: string) => {
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
        "fixed top-0 w-full z-50 gpu-accelerated transition-all duration-500",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent border-b border-transparent py-6",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-10 flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold font-heal tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        >
          KIRIAN<span className="text-primary">.</span>DEV
        </button>

        <nav className="hidden md:flex items-center gap-12">
          {[
            { key: "about", label: data.nav.about },
            { key: "habilidades", label: data.nav.skills },
            { key: "projects", label: data.nav.projects },
            { key: "contact", label: data.nav.contact },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className="text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="/CV.pdf"
            download="CV_Kirian_Luna.pdf"
            className="hidden sm:block text-[10px] font-mono font-bold border border-border px-4 py-1.5 hover:bg-foreground hover:text-background transition-all uppercase tracking-widest"
          >
            {data.nav.cv}
          </a>
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
