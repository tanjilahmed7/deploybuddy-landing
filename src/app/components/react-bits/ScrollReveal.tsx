import {
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ScrollRevealProps = {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  /** Viewport start position for ScrollTrigger */
  start?: string;
  /** Scroll-scrub stagger between words (lower = snappier cascade) */
  wordStagger?: number;
};

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 0,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "top 62%",
  wordAnimationEnd = "top 62%",
  start = "top 90%",
  wordStagger = 0.012,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof children !== "string" || !children.trim()) return;

    const scroller =
      scrollContainerRef?.current ? scrollContainerRef.current : undefined;

    const ctx = gsap.context(() => {
      const scrollConfig = {
        trigger: el,
        scroller,
        start,
        invalidateOnRefresh: true,
      };

      if (baseRotation !== 0) {
        gsap.fromTo(
          el,
          { transformOrigin: "0% 50%", rotate: baseRotation },
          {
            ease: "none",
            rotate: 0,
            scrollTrigger: {
              ...scrollConfig,
              end: rotationEnd,
              scrub: 0.35,
            },
          },
        );
      }

      const wordElements = el.querySelectorAll<HTMLElement>(".word");

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: wordStagger,
          scrollTrigger: {
            ...scrollConfig,
            end: wordAnimationEnd,
            scrub: 0.35,
          },
        },
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: wordStagger,
            scrollTrigger: {
              ...scrollConfig,
              end: wordAnimationEnd,
              scrub: 0.35,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [
    children,
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
    start,
    wordStagger,
  ]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <div className={textClassName}>{splitText}</div>
    </div>
  );
}
