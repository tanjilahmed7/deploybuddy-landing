"use client";

import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import DeployBuddyLandingPage, {
  SiteHeaderBar,
} from "@/imports/DeployBuddyLandingPage/DeployBuddyLandingPage";
import StickyHeader from "@/components/StickyHeader";
import { useScrollHeaderVisibility } from "@/hooks/useScrollHeaderVisibility";
import { debounce } from "@/lib/debounce";

const DESIGN_WIDTH = 1920;
const HEIGHT_RESIZE_THRESHOLD = 32;

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef(0);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const lenis = useLenis();
  const headerVisible = useScrollHeaderVisibility();

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(1, window.innerWidth / DESIGN_WIDTH));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const measure = () => {
      const height = element.offsetHeight;
      if (Math.abs(height - lastHeightRef.current) < HEIGHT_RESIZE_THRESHOLD) {
        return;
      }
      lastHeightRef.current = height;
      setContentHeight(height);
    };

    measure();

    const observer = new ResizeObserver(() => requestAnimationFrame(measure));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const resizeLenis = debounce(() => {
      lenis.resize();
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    }, 250);

    resizeLenis();

    return () => resizeLenis.cancel();
  }, [lenis, contentHeight, scale]);

  const isScaled = scale < 1;

  return (
    <>
      <StickyHeader visible={headerVisible} scale={scale}>
        <SiteHeaderBar />
      </StickyHeader>
      <div className="w-full bg-white">
        <div
          ref={contentRef}
          className={`page-canvas${isScaled ? " is-scaled" : ""}`}
          style={
            isScaled
              ? ({
                  "--page-scale": scale,
                  "--page-scale-collapse": `${-contentHeight * (1 - scale)}px`,
                } as CSSProperties)
              : undefined
          }
        >
          <DeployBuddyLandingPage />
        </div>
      </div>
    </>
  );
};
