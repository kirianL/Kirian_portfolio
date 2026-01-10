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
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
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

        <div className="flex flex-col gap-8">
          {/* Top Row: Direct Contact Cards - Centered and Streamlined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/5 border border-primary/20 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-4 backdrop-blur-xl shadow-lg"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-primary/20 blur-xl rounded-full opacity-60 animate-pulse" />
                <div className="relative w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  WhatsApp
                </h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Respuesta inmediata
                </p>
              </div>
              <Button
                asChild
                className="w-full h-10 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-bold shadow-md shadow-primary/10"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Contactar ahora
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-secondary/5 border border-border/40 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-4 backdrop-blur-xl shadow-lg"
            >
              <div className="relative">
                <div className="relative w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center border border-border/20">
                  <Mail className="w-5 h-5 text-foreground/70" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Correo</h3>
                <p className="text-[10px] text-muted-foreground font-medium truncate w-full px-2 uppercase tracking-wider">
                  {data.contact.email}
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full h-10 rounded-lg text-sm font-bold border-border/60"
              >
                <a href={`mailto:${data.contact.email}`}>Enviar E-mail</a>
              </Button>
            </motion.div>
          </div>

          {/* Bottom Row: Tighter Calendar Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card dark:bg-card/40 border border-border/60 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl min-h-[650px] flex flex-col w-full max-w-5xl mx-auto"
          >
            <div className="px-6 py-4 border-b border-border/40 flex items-center gap-4 bg-primary/5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground tracking-tight">
                  Agendar una Reunión
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/70">
                  Consultoría de 1 hora
                </p>
              </div>
            </div>
            <div className="flex-1 w-full bg-white dark:bg-zinc-950">
              <Cal
                namespace="1-hour-meeting"
                calLink="kirianluna/1-hour-meeting"
                style={{ width: "100%", height: "100%", minHeight: "600px" }}
                config={{
                  layout: "month_view",
                  theme: "dark",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
