import {
  motion,
  type Transition,
  type Easing,
  type TargetAndTransition,
} from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";

export type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: TargetAndTransition;
  animationTo?: TargetAndTransition[];
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: TargetAndTransition,
  steps: TargetAndTransition[],
): Record<string, TargetAndTransition[]> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, TargetAndTransition[]> = {};
  const asRecord = (t: TargetAndTransition) =>
    t as unknown as Record<string, TargetAndTransition>;
  keys.forEach((k) => {
    keyframes[k] = [
      asRecord(from)[k],
      ...steps.map((s) => asRecord(s)[k]),
    ];
  });
  return keyframes;
};

export default function BlurText({
  text = "",
  delay = 32,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.18,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(8px)", opacity: 0, y: -10 }
        : { filter: "blur(8px)", opacity: 0, y: 10 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(2px)",
        opacity: 0.75,
        y: direction === "top" ? 3 : -3,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  return (
    <p ref={ref} className={`inline-block ${className}`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={`${segment}-${index}`}
            initial={fromSnapshot}
            animate={
              (inView ? animateKeyframes : fromSnapshot) as TargetAndTransition
            }
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{
              display: "inline-block",
              willChange: inView ? "transform, opacity, filter" : undefined,
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
}
