import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Contact() {
  const { data } = useLanguage();

  return (
    <section
      id="contact"
      className="py-32 bg-background border-t border-border/50"
    >
      <div className="container px-6 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight">
            {data.contact.title}
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-normal">
            {data.contact.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Contact Info - Ultra Minimalist */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                {data.contact.infoTitle}
              </h3>

              <div className="flex flex-col gap-12">
                <div className="group flex flex-col gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                    Email
                  </p>
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors duration-300"
                  >
                    {data.contact.email}
                  </a>
                </div>

                <div className="flex gap-8 pt-4">
                  {/* Social Links would go here if needed, but keeping it clean for now */}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Minimalist Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">
                    {data.contact.form.name}
                  </label>
                  <input
                    placeholder={data.contact.form.namePlaceholder}
                    className="w-full bg-transparent border-0 border-b border-border/60 rounded-none px-1 h-12 outline-none focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">
                    {data.contact.form.email}
                  </label>
                  <input
                    type="email"
                    placeholder={data.contact.form.emailPlaceholder}
                    className="w-full bg-transparent border-0 border-b border-border/60 rounded-none px-1 h-12 outline-none focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30 text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">
                  {data.contact.form.message}
                </label>
                <textarea
                  placeholder={data.contact.form.messagePlaceholder}
                  className="w-full min-h-[120px] bg-transparent border-0 border-b border-border/60 rounded-none px-1 outline-none focus:outline-none focus:border-primary transition-all resize-none placeholder:text-muted-foreground/30 text-base flex-1"
                />
              </div>

              <Button className="group relative w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-none text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {data.contact.form.submit} <Send className="w-4 h-4" />
                </span>
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
