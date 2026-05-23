import { useReducedMotion } from "motion/react";
import BlurText from "./react-bits/BlurText";
import { EASE_OUT } from "../lib/motion";

export type BlurRevealTextProps = {
  className?: string;
  children: string;
  delay?: number;
  as?: "p" | "div" | "span";
};

export default function BlurRevealText({
  className = "",
  children,
  delay = 32,
  as: Tag = "p",
}: BlurRevealTextProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <BlurText
      text={children}
      delay={delay}
      className={className}
      animateBy="words"
      direction="top"
      threshold={0.08}
      rootMargin="0px 0px -4% 0px"
      stepDuration={0.18}
      easing={EASE_OUT}
    />
  );
}
