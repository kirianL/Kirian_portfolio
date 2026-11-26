import * as React from "react";
import { dictionaries } from "@/data/data";

interface WorkHistorySectionProps {
  lang: "en" | "es";
}

/**
 * Compact editorial Work history list.
 * Clicking a company name smoothly expands a panel with short, concrete
 * improvements and minimalist tool tags — no cards, no gradients, no slop.
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
  const improvementsLabel = isEs ? "Mejoras" : "Improvements";
  const toolsLabel = isEs ? "Herramientas" : "Tools";

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  return (
    <section
      id="work-history"
      aria-label={isEs ? "Experiencia" : "Experience"}
      className="work-history work-col-header mx-auto px-6 sm:px-0 pb-24 sm:pb-32"
    >
      <div className="work-history-panel">
        <h2 className="work-history-heading">{workLabel}</h2>
        <ul className="work-history-list">
          {data.experienceList.map((exp, i) => {
            const isOpen = expandedIndex === i;
            const panelId = `work-history-panel-${i}`;
            return (
              <li key={`${exp.company}-${i}`} className="work-history-item">
                <div className="work-history-row">
                  <LogoSlot name={exp.company} color={exp.companyColor} />
                  <button
                    type="button"
                    className="work-history-name work-history-name--button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpandedIndex(isOpen ? null : i)}
                  >
                    {exp.company}
                  </button>
                  <span className="work-history-meta">{exp.role}</span>
                  <span className="work-history-year">{exp.year}–</span>
                </div>

                {/* Smooth expandable panel */}
                <div
                  id={panelId}
                  className={`work-history-expand ${isOpen ? "is-open" : ""}`}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className="work-history-expand-inner">
                    <h3 className="work-history-expand-label">{improvementsLabel}</h3>
                    <ul className="work-history-expand-list">
                      {exp.shortImprovements.map((imp, j) => (
                        <li key={j} className="work-history-expand-item">
                          {imp}
                        </li>
                      ))}
                    </ul>

                    <div className="work-history-expand-rule" aria-hidden="true" />

                    <h3 className="work-history-expand-label">{toolsLabel}</h3>
                    <div className="work-history-expand-tags">
                      {exp.stack.map((tool, j) => (
                        <span key={j} className="work-history-expand-tag">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}