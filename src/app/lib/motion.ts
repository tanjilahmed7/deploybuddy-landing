import type { Variants, Transition } from "motion/react";

/** Shared easing — soft, expressive ease-out used across all reveals. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const REVEAL_DURATION = 0.6;
export const STAGGER_STEP = 0.08;

/** Viewport config for `whileInView` — fire once, slightly before fully in view. */
export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const;

/**
 * Fade + rise reveal. Use `custom={index}` for manual stagger, or let a parent
 * `stagger` container drive timing via `staggerChildren`.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: REVEAL_DURATION,
      delay: i * STAGGER_STEP,
      ease: EASE_OUT,
    },
  }),
};

/** Parent container that staggers `fadeUp` children on reveal. */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER_STEP, delayChildren: 0.05 },
  },
};

/** Scale + fade entrance — for hero visuals / CTA panels. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Build a transition with a custom delay, reused for one-off reveals. */
export function revealTransition(delay = 0): Transition {
  return { duration: REVEAL_DURATION, delay, ease: EASE_OUT };
}
