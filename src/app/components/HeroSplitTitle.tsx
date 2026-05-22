import { Fragment } from "react";
import { useReducedMotion } from "motion/react";
import { FIGMA_COLORS, FIGMA_HEADLINES } from "../lib/figma-headlines";
import SplitText from "./react-bits/SplitText";

const CHAR_STAGGER = 0.028;
const LINE_DURATION = 0.55;
const FIGMA_H1_TRACKING = "-1.2px";

const heroLineClass = (accent?: boolean) =>
  accent ? "hero-h1--accent" : "hero-h1--base";

/** GSAP char splits collapse trailing/leading spaces on inline-block parents */
function HeroWordGap() {
  return <span className="hero-h1-word-gap" aria-hidden="true"> </span>;
}

export default function HeroSplitTitle() {
  const prefersReducedMotion = useReducedMotion();
  const { lines, line2Parts, maxWidthClass } = FIGMA_HEADLINES.hero;
  const line1 = lines[0];
  const line2Start = line1.length * CHAR_STAGGER + 0.08;

  if (prefersReducedMotion) {
    return (
      <h1
        className={`text-h1 ${maxWidthClass} mx-auto w-full text-center`}
      >
        <span
          className="block"
          style={{ color: FIGMA_COLORS.black }}
        >
          {line1}
        </span>
        <span className="block" style={{ color: FIGMA_COLORS.black }}>
          {line2Parts.map((part, index) => (
            <Fragment key={index}>
              {index > 0 ? " " : null}
              {part.accent ? (
                <span style={{ color: FIGMA_COLORS.deepBlue }}>
                  {part.text}
                </span>
              ) : (
                <span>{part.text}</span>
              )}
            </Fragment>
          ))}
        </span>
      </h1>
    );
  }

  let line2Delay = line2Start;

  return (
    <h1
      className={`text-h1 ${maxWidthClass} mx-auto w-full text-center`}
    >
      <span className="block">
        <SplitText
          text={line1}
          tag="span"
          className={heroLineClass(false)}
          splitType="chars"
          delay={28}
          duration={LINE_DURATION}
          letterSpacing={FIGMA_H1_TRACKING}
          startDelay={0}
          trigger="mount"
          from={{ opacity: 0, y: 32 }}
          to={{ opacity: 1, y: 0 }}
        />
      </span>
      <span className="block">
        {line2Parts.map((part, index) => {
          if (index > 0) {
            line2Delay += CHAR_STAGGER;
          }
          const startDelay = line2Delay;
          line2Delay += part.text.length * CHAR_STAGGER;
          return (
            <Fragment key={index}>
              {index > 0 ? <HeroWordGap /> : null}
              <SplitText
                text={part.text}
                tag="span"
                className={heroLineClass(part.accent)}
                splitType="chars"
                delay={28}
                duration={LINE_DURATION}
                letterSpacing={FIGMA_H1_TRACKING}
                startDelay={startDelay}
                trigger="mount"
                from={{ opacity: 0, y: 32 }}
                to={{ opacity: 1, y: 0 }}
              />
            </Fragment>
          );
        })}
      </span>
    </h1>
  );
}
