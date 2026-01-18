import { useLanguage } from "@/context/language-context";
import costaRicaFlag from "@/assets/costa-rica.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export function Footer() {
  const { data } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-16 md:gap-12">
          {/* Brand & Rights */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold font-heal tracking-tighter uppercase whitespace-nowrap text-foreground">
                {data.footer.brandName}
              </span>
              <div className="w-[1px] h-6 bg-border" />
              <img
                src={costaRicaFlag}
                alt="CR"
                className="h-5 w-auto drop-shadow-sm"
              />
            </div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-medium">
              &copy; {currentYear} — {data.footer.rights}
            </p>
          </div>

          {/* Social Links Editorial Grid */}
          <div className="flex gap-16 md:gap-24">
            <div className="space-y-6">
              <span className="text-editorial-meta !text-primary font-bold">
                {data.footer.connectedLabel}
              </span>
              <div className="flex flex-col gap-3">
                <a
                  href={data.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono uppercase tracking-widest hover:text-primary transition-all hover:translate-x-1 flex items-center gap-3 group"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  GitHub
                </a>
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono uppercase tracking-widest hover:text-primary transition-all hover:translate-x-1 flex items-center gap-3 group"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-editorial-meta !text-primary font-bold">
                {data.footer.directLabel}
              </span>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-sm font-mono uppercase tracking-widest hover:text-primary transition-all hover:translate-x-1 flex items-center gap-3 group"
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
