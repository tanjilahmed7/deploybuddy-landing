import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Re-measure ScrollTrigger after scroll-text components mount or layout shifts. */
export function useScrollRevealRefresh(deps: unknown[] = []) {
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    refresh();

    const t = window.setTimeout(refresh, 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller passes layout deps
  }, deps);
}
