import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageCircle, Calendar as CalendarIcon, Mail } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function Contact() {
  const { data } = useLanguage();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "1-hour-meeting" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  const whatsappUrl = `https://wa.me/50688775391?text=${encodeURIComponent(
    "Hola Kirian, vi tu portfolio y me gustaría contactarte."
  )}`;

  return (
    <section
      id="contact"
      className="py-32 bg-background border-t border-border/50"
    >
      <div className="container px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight">
            {data.contact.title}
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-normal">
            {data.contact.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Contact Options */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 md:p-10 space-y-8 backdrop-blur-xl shadow-xl"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-60 animate-pulse" />
                  <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    WhatsApp Directo
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Respuesta rápida para consultas inmediatas.
                  </p>
                </div>

                <Button
                  asChild
                  className="group relative w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-primary/20"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Enviar WhatsApp
                  </a>
                </Button>
              </div>

              <div className="pt-6 border-t border-border/40 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                    <Mail className="w-3 h-3" /> E-mail
                  </div>
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="text-base font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {data.contact.email}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-secondary/5 border border-border/40 rounded-[2rem] text-center"
            >
              <p className="text-sm text-muted-foreground italic">
                "Convertimos ideas complejas en soluciones digitales elegantes."
              </p>
            </motion.div>
          </div>

          {/* Cal.com Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-card dark:bg-card/40 border border-border/60 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl h-[600px] flex flex-col"
          >
            <div className="p-6 border-b border-border/40 flex items-center gap-4 bg-primary/5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground tracking-tight">
                  Agendar una Reunión
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/70">
                  Sesión de 1 hora
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-950">
              <Cal
                namespace="1-hour-meeting"
                calLink="kirianluna/1-hour-meeting"
                style={{ width: "100%", height: "100%" }}
                config={{ layout: "month_view", theme: "dark" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
