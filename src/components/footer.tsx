import { useLanguage } from "@/context/language-context";
import costaRicaFlag from "@/assets/costa-rica.png";

export function Footer() {
  const { data } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-border/50">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand with Flag */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-foreground/80 font-heal tracking-[0.2em] uppercase">
            {data.footer.brandName}
          </div>
          <img
            src={costaRicaFlag}
            alt="Costa Rica"
            className="h-4 w-auto opacity-60"
          />
        </div>

        {/* Social Links (Text) with Flag */}
        <div className="flex items-center gap-8">
          <a
            href={data.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-heal"
          >
            Github
          </a>
          <a
            href={data.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-heal"
          >
            Linkedin
          </a>
          <a
            href={`mailto:${data.contact.email}`}
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-heal"
          >
            Email
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          &copy; {currentYear} — {data.footer.rights}
        </div>
      </div>
    </footer>
  );
}
