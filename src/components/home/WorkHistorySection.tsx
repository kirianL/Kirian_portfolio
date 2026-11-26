import * as React from "react";
import { dictionaries } from "@/data/data";
import { WORK_ITEMS } from "@/components/home/SelectedWorkCarousel";

interface WorkHistorySectionProps {
  lang: "en" | "es";
}

/**
 * Compact editorial Work / Projects list. Logos are rendered from the
 * LOGOS map when provided; until the real SVGs are dropped in, a small
 * monogram placeholder is shown.
 */
const LOGOS: Record<string, React.ReactNode> = {};

function LogoSlot({ name, color }: { name: string; color?: string }) {
  const custom = LOGOS[name];
  if (custom) {
    return <span className="work-history-logo">{custom}</span>;
  }
  return (
    <span className={`work-history-logo work-history-logo--fallback ${color ?? ""}`}>
      {name.charAt(0)}
    </span>
  );
}

export default function WorkHistorySection({ lang }: WorkHistorySectionProps) {
  const isEs = lang === "es";
  const data = dictionaries[isEs ? "ES" : "EN"];

  const workLabel = isEs ? "Trabajo" : "Work";
  const projectsLabel = isEs ? "Proyectos" : "Projects";

  return (
    <section
      id="work-history"
      aria-label={isEs ? "Experiencia y proyectos" : "Experience and projects"}
      className="work-history work-col-header mx-auto px-6 sm:px-0 pb-24 sm:pb-32"
    >
      <div className="work-history-panel">
        <h2 className="work-history-heading">{workLabel}</h2>
        <ul className="work-history-list">
          {data.experienceList.map((exp, i) => (
            <li key={`${exp.company}-${i}`} className="work-history-row">
              <LogoSlot name={exp.company} color={exp.companyColor} />
              <span className="work-history-name">{exp.company}</span>
              <span className="work-history-meta">{exp.role}</span>
              <span className="work-history-year">{exp.year}–</span>
            </li>
          ))}
        </ul>

        <h2 className="work-history-heading work-history-heading--second">
          {projectsLabel}
        </h2>
        <ul className="work-history-list">
          {WORK_ITEMS.map((item) => {
            const title = isEs ? item.titleEs : item.title;
            const [name, ...rest] = title.split(" — ");
            const description = rest.join(" — ");
            return (
              <li key={item.id} className="work-history-row">
                <LogoSlot name={name} />
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-history-name work-history-name--link"
                  >
                    {name}
                  </a>
                ) : (
                  <span className="work-history-name">{name}</span>
                )}
                <span className="work-history-meta">{description}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
