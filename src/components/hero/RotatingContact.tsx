import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";

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

/* Official brand marks (Simple Icons SVG paths) drawn in the brand color. */
function DiscordIcon() {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
    { id: "discord", label: discordUser, href: discordUrl, icon: <DiscordIcon />, brand: "discord" },
    { id: "instagram", label: "@kiluzie", href: instagramUrl, icon: <InstagramIcon />, brand: "instagram" },
    { id: "linkedin", label: "linkedin.com/in/kirianluna", href: linkedinUrl, icon: <LinkedInIcon />, brand: "linkedin" },
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
