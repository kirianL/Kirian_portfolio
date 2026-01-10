import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Contact() {
  const { data } = useLanguage();
  const whatsappUrl = `https://wa.me/50688775391?text=${encodeURIComponent(
    "Hola Kirian, vi tu portfolio y me gustaría contactarte."
  )}`;

  return (
    <section
      id="contact"
      className="py-32 bg-background border-t border-border/50"
    >
      <div className="container px-6 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight">
            {data.contact.title}
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-normal">
            {data.contact.desc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 md:p-14 space-y-8 backdrop-blur-xl shadow-2xl shadow-primary/5"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-60 animate-pulse" />
              <div className="relative w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Hablemos por WhatsApp
              </h3>
              <p className="text-muted-foreground font-medium">
                Click abajo para iniciar una conversación instantánea
              </p>
            </div>

            <Button
              asChild
              className="group relative w-full h-16 bg-primary text-white hover:bg-primary/90 rounded-2xl text-base font-bold transition-all duration-300 overflow-hidden shadow-lg shadow-primary/20"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                Contactar por WhatsApp
              </a>
            </Button>

            <div className="pt-4 border-t border-border/40 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                O si prefieres enviar un email
              </p>
              <a
                href={`mailto:${data.contact.email}`}
                className="text-lg font-bold text-foreground hover:text-primary transition-colors inline-block"
              >
                {data.contact.email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
