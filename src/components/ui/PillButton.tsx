import * as React from "react";
import { Link } from "react-router-dom";

interface PillButtonProps {
  variant?: "primary-light" | "secondary-dark";
  href?: string;
  type?: "button" | "submit";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  children: React.ReactNode;
}

const baseStyles =
  "group inline-flex items-center justify-center gap-1.5 h-[35px] px-3.5 rounded-[9px] font-hero-sans text-[13.5px] font-medium leading-none tracking-[-0.005em] transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1c5ad] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]";

export default function PillButton({
  variant = "primary-light",
  href,
  type = "button",
  external = false,
  className = "",
  ariaLabel,
  onClick,
  children,
}: PillButtonProps) {
  const variantStyles =
    variant === "primary-light"
      ? "bg-[#ebebeb] text-[#0a0a0a] hover:bg-white hover:shadow-[0_4px_14px_rgba(255,255,255,0.14)]"
      : "bg-[#141414] text-[#a3a3a3] border border-white/[0.08] hover:bg-[#1c1c1c] hover:text-[#f5f5f5] hover:border-white/[0.2] hover:shadow-[0_4px_14px_rgba(0,0,0,0.4)]";

  const classes = `${baseStyles} ${variantStyles} ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          data-cuelume-hover="tick"
          data-cuelume-press="page"
          onClick={onClick}
          className={classes}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        to={href}
        aria-label={ariaLabel}
        data-cuelume-hover="tick"
        data-cuelume-press="page"
        onClick={onClick}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      data-cuelume-hover="tick"
      data-cuelume-press=""
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
