import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Keeps Lenis smooth scroll and GSAP ScrollTrigger in sync (required for pin/scrub).
 * @see https://www.lenis.dev/ — GSAP ScrollTrigger integration
 */
export function useGsapLenis() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ScrollTrigger.update;
    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onRefresh = () => {
      document
        .querySelectorAll<HTMLElement>(".teams-pin-section .pin-spacer")
        .forEach((spacer) => {
          spacer.style.backgroundColor = "#030813";
        });
    };
    ScrollTrigger.addEventListener("refreshInit", onRefresh);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
    };
  }, [lenis]);
}
