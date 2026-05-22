import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

const TILT_MAX_X = 8;
const TILT_MAX_Y = 12;
const COUNTER_FACTOR = 0.35;

export type HeroTiltResult = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  counterRotateX: MotionValue<number>;
  counterRotateY: MotionValue<number>;
  enabled: boolean;
  sceneProps: {
    onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: () => void;
  };
};

export function useHeroTilt(
  sceneRef: RefObject<HTMLElement | null>,
): HeroTiltResult {
  const prefersReducedMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanTilt(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const rotateX = useSpring(rotateXTarget, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(rotateYTarget, { stiffness: 120, damping: 20 });
  const counterRotateX = useTransform(rotateX, (v) => -v * COUNTER_FACTOR);
  const counterRotateY = useTransform(rotateY, (v) => -v * COUNTER_FACTOR);

  const enabled = canTilt && !prefersReducedMotion;

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const el = sceneRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      rotateYTarget.set(x * TILT_MAX_Y * 2);
      rotateXTarget.set(-y * TILT_MAX_X * 2);
    },
    [enabled, sceneRef, rotateXTarget, rotateYTarget],
  );

  const onPointerLeave = useCallback(() => {
    rotateXTarget.set(0);
    rotateYTarget.set(0);
  }, [rotateXTarget, rotateYTarget]);

  return {
    rotateX,
    rotateY,
    counterRotateX,
    counterRotateY,
    enabled,
    sceneProps: enabled
      ? { onPointerMove, onPointerLeave }
      : {},
  };
}
