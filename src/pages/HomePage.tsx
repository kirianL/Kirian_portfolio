import * as React from "react";
import { play } from "cuelume";
import RedDitherBanner from "@/components/hero/RedDitherBanner";
import CentralHero from "@/components/hero/CentralHero";
import SelectedWorkCarousel from "@/components/home/SelectedWorkCarousel";
import WorkHistorySection from "@/components/home/WorkHistorySection";
import { dictionaries } from "@/data/data";
import { professionalServiceSchema } from "@/lib/seo";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

interface HomePageProps {
  lang: "en" | "es";
}

export default function HomePage({ lang }: HomePageProps) {
  const isEs = lang === "es";
  const data = dictionaries[isEs ? "ES" : "EN"];

  useDocumentMeta({
    title: isEs
      ? "Kirian Luna | Ingeniero de Software"
      : "Kirian Luna | Software Engineer",
    description: isEs
      ? "Portafolio profesional de Kirian Luna, Ingeniero de Software basado en Costa Rica. Especialista en React, Next.js, Astro y desarrollo full-stack moderno."
      : "Professional portfolio of Kirian Luna, Software Engineer based in Costa Rica. Full-stack web engineering with TypeScript, React, Next.js and Astro.",
    lang,
    pageType: "ProfilePage",
    schema: professionalServiceSchema,
  });

  const handleCopyEmail = (email: string) => {
    if (!email || !navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(email)
      .then(() => {
        try {
          play("success");
        } catch {}
      })
      .catch(() => {});
  };

  return (
    <main
      id="main-content"
      className="relative w-full bg-[#0a0a0a] text-[#f5f5f5] overflow-x-clip"
    >
      {/* First Viewport: Dithered Banner + Centered Hero */}
      <section className="hero-section relative min-h-[100svh] w-full flex flex-col justify-center items-center pt-[22svh] lg:pt-[13svh] pb-10">
        <RedDitherBanner />
        <CentralHero
          lang={isEs ? "ES" : "EN"}
          name={data.name}
          pronunciation="/ˈkiː.ɹi.ɑːn ˈluː.nɑː/"
          roles={
            isEs
              ? ["Ingeniero de Software", "Design Engineer", "Limonense"]
              : ["Software Engineer", "Design Engineer", "Limonense"]
          }
          basedInPrefix={isEs ? "Basado en" : "Based in"}
          basedInLocation="Costa Rica"
          socialLabel="twitter"
          socialUrl={data.contact.twitter}
          rolePrefix={
            isEs
              ? "Actualmente trabajando como ingeniero de software"
              : "Currently working as a software engineer"
          }
          companyName="UltimateMediaProductions"
          companyUrl="https://ultimatemediaproductions.com"
          lines={
            isEs
              ? [
                  "Graduado de Ingeniería en Sistemas por la Universidad Latina de Costa Rica.",
                  "De Costa Rica, con más de 2 años de experiencia construyendo productos digitales y plataformas web.",
                  "En los últimos años he desarrollado plataformas SaaS, APIs REST con RBAC e interfaces accesibles con TypeScript, React 19, Next.js, Astro y PostgreSQL.",
                  "Como diseñador, presto mucha atención a los detalles pequeños y busco visuales que se sientan cuidados, no llamativos.",
                ]
              : [
                  "Graduated in Systems Engineering from Universidad Latina de Costa Rica.",
                  "From Costa Rica with 2+ years of experience building digital products and web platforms.",
                  "Over the last few years, I've built SaaS platforms, REST APIs with RBAC, and accessible interfaces using TypeScript, React 19, Next.js, Astro, and PostgreSQL.",
                  "As a designer, I pay close attention to small details and aim for visuals that feel considered, not flashy.",
                ]
          }
          ulatinaWord="Universidad Latina de Costa Rica"
          lifeLine={
            isEs
              ? {
                  before: "Fuera del código, trato de aprovechar al máximo la",
                  word: "vida",
                  after: ".",
                }
              : {
                  before: "Outside of code, I try to make the most of",
                  word: "life",
                  after: ".",
                }
          }
          githubLine={{
            before: isEs ? "El resto de ese trabajo vive en" : "The rest of that work lives on",
            linkLabel: "GitHub",
            after: isEs ? ", un commit a la vez." : ", one commit at a time.",
            url: data.contact.github,
          }}
          reachOutPrefix={isEs ? "Escríbeme a" : "Reach out to me at"}
          email={data.contact.email}
          discordUrl={data.contact.discord}
          discordUser={data.contact.discordUser}
          instagramUrl="https://www.instagram.com/kiluzie/"
          linkedinUrl={data.contact.linkedin}
          ctaPrimaryLabel={isEs ? "agendar llamada" : "book a call"}
          ctaPrimaryHref={isEs ? "/es/contact" : "/contact"}
          ctaSecondaryLabel={isEs ? "ver mi trabajo" : "view my work"}
          ctaSecondaryHref={isEs ? "/es/projects" : "/projects"}
          onCopyEmail={handleCopyEmail}
        />
      </section>

      {/* Second Section: Selected Work Horizontal Carousel */}
      <SelectedWorkCarousel lang={lang} />

      {/* Third Section: compact Work history */}
      <WorkHistorySection lang={lang} />
    </main>
  );
}
