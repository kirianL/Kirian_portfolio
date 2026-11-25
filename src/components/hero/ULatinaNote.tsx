import * as React from "react";

/**
 * QS Stars note for the education pencil-word.
 *
 * Same interaction as the "based in Costa Rica" note: the note follows the
 * cursor and its lines unfold in staggered bands. Portalled to document.body
 * because its owning word lives inside the collapsing bio disclosure.
 */

interface ULatinaNoteProps {
  lang: "EN" | "ES";
  active: boolean;
}

const MINI_STAR_PATH =
  "M5 0.8 L6.1 3.5 L9 3.5 L6.8 5.4 L7.7 8.3 L5 6.5 L2.3 8.3 L3.2 5.4 L1 3.5 L3.9 3.5 Z";

const MINI_STARS = [0, 1, 2, 3, 4];

const ULatinaNote = React.forwardRef<HTMLDivElement, ULatinaNoteProps>(
  function ULatinaNote({ lang, active }, ref) {
    const place = lang === "ES" ? "en Latinoamérica" : "in Latin America";
    const source =
      lang === "ES"
        ? "según QS World University Rankings"
        : "per QS World University Rankings";
    const caption = "QS Stars";

    return (
      <div
        ref={ref}
        data-note="ulatina"
        className={`ulatina-note${active ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        <span className="ulatina-note-label">
          <span className="ulatina-note-stars" aria-hidden="true">
            {MINI_STARS.map((i) => (
              <svg
                key={i}
                className="ulatina-note-star"
                style={{ "--i": i } as React.CSSProperties}
                viewBox="0 0 10 10"
                fill="none"
                focusable="false"
              >
                <path d={MINI_STAR_PATH} pathLength={1} />
              </svg>
            ))}
          </span>
          <span className="ulatina-note-stars-caption">{caption}</span>
        </span>
        <span className="ulatina-note-rank">Top #120 {place}</span>
        <span className="ulatina-note-source">{source}</span>
      </div>
    );
  },
);

export default ULatinaNote;
