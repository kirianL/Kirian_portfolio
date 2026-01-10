import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { data } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-border/40 pt-12">
          {/* Logo / Brand */}
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">
            Kirian Luna Quirós
          </div>

          {/* Social / Email Links - Text only */}
          <div className="flex gap-10">
            <a
              href={data.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href={data.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${data.contact.email}`}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors"
            >
              Email
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[10px] font-medium text-muted-foreground/40 tracking-wider">
            &copy; {currentYear} &mdash; {data.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
