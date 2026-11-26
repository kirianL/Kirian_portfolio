import * as React from "react";
import { dictionaries } from "@/data/data";
import { useLineReveal, useRiseIn } from "@/lib/reveal";
import umpLogo from "@/assets/Logos/UMP.svg";
import sorinLabsLogo from "@/assets/Logos/SorinLabs/LogoBlanco.svg";

interface WorkHistorySectionProps {
  lang: "en" | "es";
}

/**
 * Company logos keyed by the exact `company` value in experienceList.
 * Logos are white SVGs so they stay legible on the dark editorial background.
 */
const LOGOS: Record<string, string> = {
  "Ultimate Media Productions": umpLogo,
  "Sorin Labs": sorinLabsLogo,
};

function LogoSlot({ name }: { name: string }) {
  const src = LOGOS[name];
  const tint = name === "Sorin Labs" ? "sorin" : name === "Ultimate Media Productions" ? "ump" : "";
  return (
    <span className={`work-history-logo${tint ? ` work-history-logo--${tint}` : ""}`}>
      {src ? (
        <img
          className="work-history-logo-img"
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : (
        <span className="work-history-logo-fallback">
          {name.charAt(0)}
        </span>
      )}
    </span>
  );
}

export default function WorkHistorySection({ lang }: WorkHistorySectionProps) {
  const isEs = lang === "es";
  const data = dictionaries[isEs ? "ES" : "EN"];

  const workLabel = isEs ? "Trabajo" : "Work";
  const improvementsLabel = isEs ? "Mejoras" : "Improvements";
  const toolsLabel = isEs ? "Herramientas" : "Tools";

  const headingRef = useLineReveal<HTMLHeadingElement>({
    mask: true,
    start: "view",
    duration: 760,
  });
  const rowsRef = useRiseIn<HTMLUListElement>({
    start: "view",
    selector: "li",
    delay: 50,
    stagger: 55,
    distance: 12,
    duration: 640,
  });

  // Sorin Labs starts open on first entry so its improvements + tools are
  // visible immediately, matching the intended editorial layout.
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(() => {
    const sorinIndex = data.experienceList.findIndex(
      (e) => e.company === "Sorin Labs",
    );
    return sorinIndex >= 0 ? sorinIndex : null;
  });

  return (
    <section
      id="work-history"
      aria-label={isEs ? "Experiencia" : "Experience"}
      className="work-history work-col-header mx-auto px-6 sm:px-0 pb-24 sm:pb-32"
    >
      <div className="work-history-panel">
        <h2 ref={headingRef} className="work-history-heading">{workLabel}</h2>
        <ul ref={rowsRef} className="work-history-list">
          {data.experienceList.map((exp, i) => {
            const isOpen = expandedIndex === i;
            const panelId = `work-history-panel-${i}`;
            return (
              <li key={`${exp.company}-${i}`} className="work-history-item">
                <div className="work-history-row">
                  <LogoSlot name={exp.company} />
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