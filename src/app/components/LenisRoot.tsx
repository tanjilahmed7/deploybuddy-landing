import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useGsapLenis } from "../hooks/useGsapLenis";

const LENIS_OPTIONS = {
  autoRaf: false,
  lerp: 0.1,
  duration: 1.1,
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: 1.2,
  wheelMultiplier: 0.95,
  autoResize: true,
  allowNestedScroll: true,
  anchors: true,
} as const;

type LenisRootProps = {
  children: ReactNode;
};

function LenisScrollBridge() {
  useGsapLenis();
  return null;
}

export default function LenisRoot({ children }: LenisRootProps) {
  return (
    <>
      <ReactLenis root options={LENIS_OPTIONS} />
      <LenisScrollBridge />
      {children}
    </>
  );
}
