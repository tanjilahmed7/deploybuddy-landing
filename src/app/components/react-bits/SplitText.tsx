import {
  useRef,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import gsap from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText);

export type SplitTextProps = {
  text: string;
  className?: string;
  /** Stagger between chars/words in seconds (delay/1000 in React Bits) */
  stagger?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
  /** Hero: play once on mount. Sections: use scroll (not used on hero). */
  trigger?: "mount" | "scroll";
  /** Extra delay before this instance starts (e.g. second hero line) */
  startDelay?: number;
  onAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  stagger,
  delay = 28,
  duration = 0.55,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 28 },
  to = { opacity: 1, y: 0 },
  tag = "span",
  textAlign = "center",
  trigger = "mount",
  startDelay = 0,
  onAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const staggerSec = stagger ?? delay / 1000;
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      type SplitEl = HTMLElement & { _rbsplitInstance?: GSAPSplitText };
      const node = el as SplitEl;

      if (node._rbsplitInstance) {
        try {
          node._rbsplitInstance.revert();
        } catch {
          /* empty */
        }
        node._rbsplitInstance = undefined;
      }

      let targets: Element[] = [];
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes("chars") && self.chars?.length) {
          targets = self.chars;
        } else if (splitType.includes("words") && self.words?.length) {
          targets = self.words;
        } else if (splitType.includes("lines") && self.lines?.length) {
          targets = self.lines;
        }
        if (!targets.length) {
          targets = self.chars || self.words || self.lines;
        }
      };

      const splitInstance = new GSAPSplitText(node, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          assignTargets(self);

          const tweenVars: gsap.TweenVars = {
            ...to,
            duration,
            ease,
            stagger: staggerSec,
            delay: startDelay,
            onComplete: onAnimationComplete,
            willChange: "transform, opacity",
            force3D: true,
          };

          if (trigger === "scroll") {
            return gsap.fromTo(targets, { ...from }, {
              ...tweenVars,
              scrollTrigger: {
                trigger: node,
                start: "top 88%",
                once: true,
              },
            });
          }

          return gsap.fromTo(targets, { ...from }, tweenVars);
        },
      });

      node._rbsplitInstance = splitInstance;

      return () => {
        try {
          splitInstance.revert();
        } catch {
          /* empty */
        }
        node._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        trigger,
        startDelay,
        staggerSec,
        fontsLoaded,
        JSON.stringify(from),
        JSON.stringify(to),
      ],
      scope: ref,
    },
  );

  const style: CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };
  const Tag = (tag || "span") as ElementType;

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={`split-parent inline-block whitespace-normal ${className}`}
    >
      {text}
    </Tag>
  );
}
