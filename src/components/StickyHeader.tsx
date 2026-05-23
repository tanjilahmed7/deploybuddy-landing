import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const DESIGN_WIDTH = 1920;
const HEADER_HEIGHT = 78;
const easeOut = [0.22, 1, 0.36, 1] as const;

type StickyHeaderProps = {
  visible: boolean;
  scale: number;
  children: ReactNode;
};

export default function StickyHeader({
  visible,
  scale,
  children,
}: StickyHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const isScaled = scale < 1;
  const scaledWidth = DESIGN_WIDTH * scale;
  const barHeight = HEADER_HEIGHT * scale;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] flex justify-center"
      style={{ height: barHeight }}
    >
      <motion.header
        className="pointer-events-auto overflow-hidden border-b border-[#ececee] bg-white/90 backdrop-blur-[8px]"
        style={{
          width: isScaled ? scaledWidth : "100%",
          maxWidth: DESIGN_WIDTH,
          height: barHeight,
        }}
        initial={false}
        animate={{ y: visible || prefersReducedMotion ? 0 : "-100%" }}
        transition={{ duration: 0.35, ease: easeOut }}
      >
        <div
          className="origin-top-left"
          style={{
            width: DESIGN_WIDTH,
            height: HEADER_HEIGHT,
            transform: isScaled ? `scale(${scale})` : undefined,
          }}
        >
          {children}
        </div>
      </motion.header>
    </div>
  );
}
