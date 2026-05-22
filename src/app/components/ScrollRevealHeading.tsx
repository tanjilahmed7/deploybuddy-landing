import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import ScrollReveal from "./react-bits/ScrollReveal";

export type ScrollRevealHeadingProps = {
  className?: string;
  /** Plain string lines — each renders as its own block (Figma line breaks). */
  lines?: string[];
  /** Single string headline (short titles only; prefer `lines` for H2). */
  text?: string;
  /** Accent class for `accentLineIndex` when using `lines`. */
  accentLineClassName?: string;
  accentLineIndex?: number;
  children?: ReactNode;
  baseOpacity?: number;
  darkBg?: boolean;
};

function stripBreakWord(className: string): string {
  return className.replace(/\s*\[word-break:break-word\]\s*/g, " ").trim();
}

export default function ScrollRevealHeading({
  className = "",
  lines,
  text,
  children,
  accentLineClassName,
  accentLineIndex = 1,
  baseOpacity,
  darkBg = false,
}: ScrollRevealHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const opacity = baseOpacity ?? (darkBg ? 0.25 : 0.15);
  const rootClass = stripBreakWord(className);

  if (prefersReducedMotion) {
    if (lines?.length) {
      return (
        <div className={rootClass}>
          {lines.map((line, i) => (
            <span
              key={line}
              className={`block ${
                i === accentLineIndex && accentLineClassName
                  ? accentLineClassName
                  : ""
              }`}
            >
              {line}
            </span>
          ))}
        </div>
      );
    }
    if (text) {
      return <div className={rootClass}>{text}</div>;
    }
    return <div className={rootClass}>{children}</div>;
  }

  if (lines?.length) {
    return (
      <div className={rootClass}>
        {lines.map((line, i) => (
          <ScrollReveal
            key={line}
            baseOpacity={opacity}
            baseRotation={0}
            enableBlur
            blurStrength={4}
            containerClassName="block"
            textClassName={
              i === accentLineIndex && accentLineClassName
                ? `block ${accentLineClassName}`
                : "block"
            }
          >
            {line}
          </ScrollReveal>
        ))}
      </div>
    );
  }

  if (text) {
    return (
      <ScrollReveal
        baseOpacity={opacity}
        baseRotation={0}
        enableBlur
        blurStrength={4}
        containerClassName={rootClass}
        textClassName="block"
      >
        {text}
      </ScrollReveal>
    );
  }

  return <div className={rootClass}>{children}</div>;
}
