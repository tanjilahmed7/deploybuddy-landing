import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

const SCROLL_DELTA = 4;
const TOP_THRESHOLD = 72;

/**
 * Show header at top of page; hide while scrolling down, show again when scrolling up.
 */
export function useScrollHeaderVisibility() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(true);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    lastScrollRef.current = lenis.scroll;

    const onScroll = () => {
      const scroll = lenis.scroll;

      if (scroll <= TOP_THRESHOLD) {
        setVisible(true);
        lastScrollRef.current = scroll;
        return;
      }

      const delta = scroll - lastScrollRef.current;
      if (delta > SCROLL_DELTA) {
        setVisible(false);
      } else if (delta < -SCROLL_DELTA) {
        setVisible(true);
      }

      lastScrollRef.current = scroll;
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return visible;
}
