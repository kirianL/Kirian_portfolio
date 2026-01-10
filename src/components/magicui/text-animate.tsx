import { motion, type MotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextAnimateProps extends MotionProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: "fadeIn" | "slideUp" | "popIn" | "blurIn" | "blurInUp" | "blurInDown";
  animation?:
    | "fadeIn"
    | "slideUp"
    | "popIn"
    | "blurIn"
    | "blurInUp"
    | "blurInDown";
  by?: "word" | "character";
  once?: boolean;
}

export function TextAnimate({
  text,
  children,
  className,
  delay = 0,
  duration = 0.5,
  type = "fadeIn", // Default
  animation, // Allow overriding type
  by = "word",
  once = false,
  ...props
}: TextAnimateProps) {
  const selectedType = animation || type;
  const content = text || (typeof children === "string" ? children : "");
  const segments = by === "word" ? content.split(" ") : content.split("");

  const variants: Record<string, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: {
          delay: i * (by === "word" ? 0.1 : 0.05) + delay,
          duration,
        },
      }),
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * (by === "word" ? 0.1 : 0.05) + delay,
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      }),
    },
    popIn: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
          delay: i * (by === "word" ? 0.1 : 0.05) + delay,
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      }),
    },
    blurIn: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: (i: number) => ({
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          delay: i * (by === "word" ? 0.1 : 0.05) + delay,
          duration,
        },
      }),
    },
    blurInUp: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          delay: i * (by === "word" ? 0.1 : 0.05) + delay,
          duration, // using duration for blur effects usually looks smoother than spring sometimes, but spring is good too
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      }),
    },
    blurInDown: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      visible: (i: number) => ({
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          delay: i * (by === "word" ? 0.1 : 0.05) + delay,
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      }),
    },
  };

  return (
    <div className={cn("flex flex-wrap gap-x-2", className)}>
      {segments.map((segment, i) => (
        <motion.span
          key={i}
          variants={variants[selectedType]}
          initial="hidden"
          whileInView={once ? "visible" : undefined}
          animate={once ? undefined : "visible"}
          viewport={{ once }}
          custom={i}
          className="inline-block"
          {...props}
        >
          {segment === " " ? "\u00A0" : segment}
        </motion.span>
      ))}
    </div>
  );
}
