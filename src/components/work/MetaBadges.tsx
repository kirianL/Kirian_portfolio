import * as React from "react";

/**
 * Meta badges for a project: the role split into its parts plus the year.
 *
 * The design is copied from the reference pills: 32px tall, 4px radius, a 1px
 * border one step darker than the fill, a soft fill and a deep ink. Colour is
 * deliberately neutral here — a grey ramp, with the year one step deeper so the
 * row reads as a hierarchy instead of three identical chips.
 */

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
        <span key={`${part}-${index}`} className="meta-badge" data-badge="">
          {part}
        </span>
      ))}
      <span className="meta-badge" data-badge="" data-badge-year="">
        {year}
      </span>
    </div>
  );
}
