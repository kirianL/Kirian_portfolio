import * as React from "react";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";
import { projectItemListSchema } from "@/lib/seo";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

interface ProjectsPageProps {
  lang: "en" | "es";
}

export default function ProjectsPage({ lang }: ProjectsPageProps) {
  const isEs = lang === "es";

  useDocumentMeta({
    title: isEs ? "Proyectos | Kirian Luna" : "Projects | Kirian Luna",
    description: isEs
      ? "Proyectos seleccionados de Kirian Luna: plataformas full-stack, experiencias de patrimonio cultural, productos SaaS y landing pages de alto rendimiento."
      : "Selected projects by Kirian Luna: full-stack platforms, cultural heritage experiences, SaaS products and high-performance landing pages.",
    lang,
    pageType: "CollectionPage",
    schema: projectItemListSchema,
  });

  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-grayscale-1">
        <div className="max-w-2xl mx-auto px-6 sm:px-0 pt-28 pb-12 flex flex-col gap-10">
          <ProjectsSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
