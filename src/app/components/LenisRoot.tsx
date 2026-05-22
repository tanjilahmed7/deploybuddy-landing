import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

const LENIS_OPTIONS = {
  autoRaf: false,
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  touchMultiplier: 1.5,
  wheelMultiplier: 1,
  autoResize: true,
  allowNestedScroll: true,
  anchors: true,
} as const;

type LenisRootProps = {
  children: ReactNode;
};

/**
 * Root Lenis setup per https://www.lenis.dev/ and lenis/react README:
 * - Import lenis.css in main.tsx
 * - ReactLenis root on document scroll
 * - Motion/Framer frame loop drives lenis.raf() (keeps scroll + animations in sync)
 */
export default function LenisRoot({ children }: LenisRootProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <>
      <ReactLenis root options={LENIS_OPTIONS} ref={lenisRef} />
      {children}
    </>
  );
}
