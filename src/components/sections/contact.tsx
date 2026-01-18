import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
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
    "Hola Kirian, vi tu portfolio y me gustaría contactarte.",
  )}`;

  return (
    <section
      id="contact"
      className="py-32 bg-background border-t border-border/50"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">
          {/* Left: Editorial Header */}
          <div className="lg:col-span-5 space-y-8">
            <span className="text-editorial-meta">
              {data.contact.connectLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none font-heal text-foreground">
              {data.contact.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              {data.contact.desc}
            </p>

            <div className="flex flex-col gap-6 pt-12 border-t border-border">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 border border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="w-5 h-5 text-primary"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-editorial-meta !text-primary font-bold">
                    {data.contact.instantLabel}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xl font-bold font-heal hover:text-primary transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 border border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="w-5 h-5 text-primary"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-editorial-meta !text-primary font-bold">
                    {data.contact.emailLabel}
                  </span>
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="block text-xl font-bold font-heal hover:text-primary transition-colors break-all md:break-normal"
                  >
                    {data.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1" />

          {/* Calendar - Full Width Horizontal */}
          <div className="lg:col-span-12 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card border border-border overflow-hidden backdrop-blur-sm shadow-xl flex flex-col w-full"
            >
              <div className="w-full bg-white dark:bg-zinc-950 min-h-[600px]">
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
              <div className="px-6 py-4 border-t border-border flex items-center justify-center bg-primary/5">
                <span className="text-editorial-meta">
                  {data.contact.meetingLabel}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
