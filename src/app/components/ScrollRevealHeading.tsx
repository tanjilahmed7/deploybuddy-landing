import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import ScrollReveal from "./react-bits/ScrollReveal";

export type ScrollRevealHeadingProps = {
  className?: string;
  /** Plain string lines (preferred for Scroll Reveal word split) */
  lines?: string[];
  /** Single string headline */
  text?: string;
  /** Optional accent line class applied to second line when using `lines` */
  accentLineClassName?: string;
  /** Custom content when not using string lines (no scroll reveal — static only) */
  children?: ReactNode;
  baseOpacity?: number;
  darkBg?: boolean;
};

export default function ScrollRevealHeading({
  className = "",
  lines,
  text,
  children,
  accentLineClassName,
  baseOpacity,
  darkBg = false,
}: ScrollRevealHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const opacity = baseOpacity ?? (darkBg ? 0.25 : 0.15);

  if (prefersReducedMotion) {
    if (lines?.length) {
      return (
        <div className={className}>
          {lines.map((line, i) => (
            <span
              key={line}
              className={i === 1 && accentLineClassName ? accentLineClassName : "block"}
            >
              {line}
            </span>
          ))}
        </div>
      );
    }
    if (text) {
      return <div className={className}>{text}</div>;
    }
    return <div className={className}>{children}</div>;
  }

  if (lines?.length) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <ScrollReveal
            key={line}
            baseOpacity={opacity}
            baseRotation={0}
            enableBlur
            blurStrength={4}
            containerClassName="block"
            textClassName={
              i === 1 && accentLineClassName
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
        containerClassName={className}
        textClassName=""
      >
        {text}
      </ScrollReveal>
    );
  }

  return <div className={className}>{children}</div>;
}
