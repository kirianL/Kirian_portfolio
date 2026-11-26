import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import discordLogo from "@/assets/Logos/social/discord-blurple.svg";
import instagramLogo from "@/assets/Logos/social/instagram-2022.svg";
import linkedinLogo from "@/assets/Logos/social/linkedin-icon.svg";

interface RotatingContactProps {
  email: string;
  discordUrl: string;
  discordUser: string;
  instagramUrl: string;
  linkedinUrl: string;
  onCopyEmail: (email: string) => void;
}

/* Official Google "G" envelope, four-color Gmail mark. */
function GmailIcon() {
  return (
    <svg className="contact-icon contact-icon--gmail" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
      <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z" />
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
      <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301 8.095,8.29 7.331,8.822L3,12.298z" />
      <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301 39.905,8.29 40.669,8.822L45,12.298z" />
    </svg>
  );
}

/* Real brand SVGs: Discord (Blurple), Instagram 2022 and LinkedIn icon. */
const discordIcon = <img className="contact-icon contact-icon--img" src={discordLogo} alt="" aria-hidden="true" draggable={false} />;
const instagramIcon = <img className="contact-icon contact-icon--img" src={instagramLogo} alt="" aria-hidden="true" draggable={false} />;
const linkedinIcon = <img className="contact-icon contact-icon--img" src={linkedinLogo} alt="" aria-hidden="true" draggable={false} />;

interface ContactItem {
  id: string;
  label: string;
  href: string | null;
  icon: React.ReactNode;
  brand: "gmail" | "discord" | "instagram" | "linkedin";
}

export default function RotatingContact({
  email,
  discordUrl,
  discordUser,
  instagramUrl,
  linkedinUrl,
  onCopyEmail,
}: RotatingContactProps) {
  const contacts: ContactItem[] = [
    { id: "gmail", label: email, href: null, icon: <GmailIcon />, brand: "gmail" },
    { id: "discord", label: discordUser, href: discordUrl, icon: discordIcon, brand: "discord" },
    { id: "instagram", label: "@kiluzie", href: instagramUrl, icon: instagramIcon, brand: "instagram" },
    { id: "linkedin", label: "linkedin.com/in/kirianluna", href: linkedinUrl, icon: linkedinIcon, brand: "linkedin" },
  ];

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out">("idle");
  const [turns, setTurns] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const rotate = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPhase("out");
    // One full turn per click, always forward — never rewinds or accumulates
    // a half-spin. The rotation lives on the SVG via inline style.
    setTurns((t) => t + 1);

    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % contacts.length);
      setPhase("idle");
    }, 150);
  };

  const current = contacts[index];

  return (
    <>
      <button
        type="button"
        className="contact-rotate"
        onClick={rotate}
        title="Change contact"
        aria-label="Change contact"
        data-cuelume-hover="tick"
        data-cuelume-press=""
      >
        <ArrowsClockwiseIcon
          aria-hidden="true"
          style={{ transform: `rotate(${turns * 360}deg)` }}
        />
      </button>

      {current.href ? (
        <a
          key={current.id}
          className={`contact-value contact-reveal contact-value--${current.brand}${phase === "out" ? " is-out" : ""}`}
          href={current.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cuelume-hover="tick"
          aria-label={current.label}
        >
          {current.icon}
          <span className="underline underline-offset-4">{current.label}</span>
        </a>
      ) : (
        <button
          key={current.id}
          type="button"
          className={`contact-value contact-reveal contact-value--${current.brand}${phase === "out" ? " is-out" : ""}`}
          onClick={() => onCopyEmail(email)}
          data-cuelume-hover="tick"
          data-cuelume-press=""
          title={email}
        >
          {current.icon}
          <span className="underline underline-offset-4">{current.label}</span>
        </button>
      )}
    </>
  );
}
