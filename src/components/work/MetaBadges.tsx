import * as React from "react";

/**
 * Meta badges for a project: the role split into its parts plus the year.
 *
 * The design is copied from the reference pills: 32px tall, 4px radius, a 1px
 * border one step darker than the fill, soft tinted background and a deep ink
 * of the same family. Colour carries meaning here, so every part gets a real
 * hue instead of a neutral chip: blue for design, green for engineering, red
 * for the year.
 */

type Tone = "blue" | "green" | "red";

const FALLBACK_TONES: Tone[] = ["blue", "green", "red"];

function toneFor(token: string, index: number): Tone {
  const value = token.toLowerCase();
  if (/design|diseñ|identidad|brand/.test(value)) return "blue";
  if (
    /engineer|ingenier|develop|desarrollo|frontend|backend|full-stack|web/.test(
      value,
    )
  ) {
    return "green";
  }
  return FALLBACK_TONES[index % FALLBACK_TONES.length] ?? "blue";
}

export function splitRole(role: string) {
  // The parts are joined with "&" in English and "e"/"y" in Spanish and
  // Portuguese; requiring the surrounding spaces keeps words intact.
  return role
    .split(/\s+(?:&|e|y)\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

interface MetaBadgesProps {
  role: string;
  year: string;
  /** `sm` keeps the same design at card scale. */
  size?: "md" | "sm";
  className?: string;
}

export default function MetaBadges({
  role,
  year,
  size = "md",
  className = "",
}: MetaBadgesProps) {
  const parts = splitRole(role);

  return (
    <div
      className={`meta-badges${size === "sm" ? " meta-badges--sm" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className="meta-badge"
          data-tone={toneFor(part, index)}
          data-badge=""
        >
          {part}
        </span>
      ))}
      <span className="meta-badge" data-tone="red" data-badge="" data-badge-year="">
        {year}
      </span>
    </div>
  );
}
