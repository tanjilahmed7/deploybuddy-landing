import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import DeployBuddyLandingPage, {
  SiteHeaderBar,
} from "../imports/DeployBuddyLandingPage/DeployBuddyLandingPage";
import StickyHeader from "./components/StickyHeader";
import { useScrollHeaderVisibility } from "./hooks/useScrollHeaderVisibility";
import { debounce } from "./lib/debounce";

const DESIGN_WIDTH = 1920;
const HEIGHT_RESIZE_THRESHOLD = 32;

export default function App() {
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

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const height =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      if (Math.abs(height - lastHeightRef.current) < HEIGHT_RESIZE_THRESHOLD) {
        return;
      }
      lastHeightRef.current = height;
      setContentHeight(height);
    });

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
  const scaledWidth = DESIGN_WIDTH * scale;
  const scaledHeight = contentHeight * scale;

  return (
    <>
      <StickyHeader visible={headerVisible} scale={scale}>
        <SiteHeaderBar />
      </StickyHeader>
      <div className="w-full overflow-x-hidden bg-white">
      <div
        className="relative mx-auto"
        style={{
          width: isScaled ? scaledWidth : "100%",
          maxWidth: DESIGN_WIDTH,
          height: isScaled && contentHeight > 0 ? scaledHeight : undefined,
        }}
      >
        <div
          ref={contentRef}
          className={isScaled ? "absolute left-0 top-0" : "mx-auto"}
          style={{
            width: DESIGN_WIDTH,
            transform: isScaled ? `scale(${scale})` : undefined,
            transformOrigin: "top left",
            willChange: isScaled ? "transform" : undefined,
          }}
        >
          <DeployBuddyLandingPage />
        </div>
      </div>
    </div>
    </>
  );
}
