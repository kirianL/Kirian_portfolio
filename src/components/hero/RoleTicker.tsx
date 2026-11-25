import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface RoleTickerProps {
  roles: string[];
}

function useMeasuredWidth() {
  const [width, setWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLSpanElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node && typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(([entry]) => {
        if (entry) {
          setWidth(entry.contentRect.width);
        }
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return [ref, width] as const;
}

const pillClassName =
  "mt-0.5 inline-flex items-center overflow-hidden rounded-[4px] bg-white/[0.05] px-2 py-[3px] font-hero-sans text-[12px] font-normal leading-[17px] text-[#f5f5f59e] whitespace-nowrap select-none";

export default function RoleTicker({ roles }: RoleTickerProps) {
  const [index, setIndex] = useState(0);
  const [measureRef, width] = useMeasuredWidth();
  const shouldReduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (shouldReduceMotion || roles.length <= 1) {
      setIndex(0);
      return;
    }

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 3000);

    return () => clearInterval(id);
  }, [roles.length, shouldReduceMotion]);

  if (roles.length === 0) {
    return null;
  }

  if (shouldReduceMotion || roles.length === 1) {
    return (
      <>
        <span className="sr-only">{roles.join(" / ")}</span>
        <span aria-hidden="true" className={pillClassName}>
          {roles[0]}
        </span>
      </>
    );
  }

  const currentRole = roles[index % roles.length] ?? roles[0];
  const isLimonense = currentRole.toLowerCase() === "limonense";

  return (
    <>
      <span className="sr-only">{roles.join(" / ")}</span>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ width: width > 0 ? width + 16 : "auto" }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        className={pillClassName}
      >
        <span ref={measureRef} className="relative inline-flex">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentRole}
              initial={{ y: 10, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -10, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={isLimonense ? "role-limonense-glow" : undefined}
            >
              {currentRole}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </>
  );
}
