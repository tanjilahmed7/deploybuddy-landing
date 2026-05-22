import { useReducedMotion } from "motion/react";
import SplitText from "./react-bits/SplitText";

const LINE1 = "Manage WordPress servers ";
const LINE2 = "without SSH.";
const CHAR_STAGGER = 0.028;
const LINE_DURATION = 0.55;

export default function HeroSplitTitle() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <p className="text-h1 min-w-full relative shrink-0 text-[#17171b] w-[min-content] text-center">
        <span>{LINE1}</span>
        <span className="text-[#1447e6]">{LINE2}</span>
      </p>
    );
  }

  const line2Start = LINE1.length * CHAR_STAGGER + 0.08;

  return (
    <p className="text-h1 min-w-full relative shrink-0 w-[min-content] text-center leading-[1.1]">
      <SplitText
        text={LINE1}
        tag="span"
        className="text-[#17171b]"
        splitType="chars"
        delay={28}
        duration={LINE_DURATION}
        startDelay={0}
        trigger="mount"
        from={{ opacity: 0, y: 32 }}
        to={{ opacity: 1, y: 0 }}
      />
      <SplitText
        text={LINE2}
        tag="span"
        className="text-[#1447e6]"
        splitType="chars"
        delay={28}
        duration={LINE_DURATION}
        startDelay={line2Start}
        trigger="mount"
        from={{ opacity: 0, y: 32 }}
        to={{ opacity: 1, y: 0 }}
      />
    </p>
  );
}
