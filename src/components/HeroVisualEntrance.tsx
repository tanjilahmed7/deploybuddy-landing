import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { heroVisualIn, heroVisualInReduced } from "../lib/motion";

type HeroVisualEntranceProps = {
  children: ReactNode;
};

/** Wraps hero visual with 3D entrance (flat fallback when reduced motion is on). */
export default function HeroVisualEntrance({ children }: HeroVisualEntranceProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex w-full justify-center"
      variants={prefersReducedMotion ? heroVisualInReduced : heroVisualIn}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
