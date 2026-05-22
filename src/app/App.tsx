import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import DeployBuddyLandingPage from "../imports/DeployBuddyLandingPage/DeployBuddyLandingPage";

const DESIGN_WIDTH = 1920;

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const lenis = useLenis();

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
      setContentHeight(
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height,
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const id = requestAnimationFrame(() => lenis.resize());
    return () => cancelAnimationFrame(id);
  }, [lenis, contentHeight, scale]);

  const isScaled = scale < 1;
  const scaledWidth = DESIGN_WIDTH * scale;
  const scaledHeight = contentHeight * scale;

  return (
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
          }}
        >
          <DeployBuddyLandingPage />
        </div>
      </div>
    </div>
  );
}
