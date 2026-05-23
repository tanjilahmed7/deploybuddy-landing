import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import ScrollRevealHeading from "./ScrollRevealHeading";
import { FIGMA_HEADLINES } from "../lib/figma-headlines";
import {
  HOW_IT_WORKS_THEME_VARS,
  HOW_IT_WORKS_THEMES,
  type HowItWorksTheme,
  type HowItWorksThemeId,
} from "../lib/how-it-works-theme";

const UNSPLASH = (id: string, alt: string) =>
  ({
    image: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1940&h=1540&q=80`,
    imageAlt: alt,
  }) as const;

const STEPS = [
  {
    id: 1,
    title: "Connect DigitalOcean",
    description:
      "Link your DigitalOcean account with an encrypted API token—authorize DeployBuddy to manage droplets for you.",
    ...UNSPLASH(
      "photo-1451187580459-43490279c0fa",
      "Global network and cloud infrastructure",
    ),
  },
  {
    id: 2,
    title: "Create a server",
    description:
      "Create and manage DigitalOcean droplets from one dashboard—pick the region and size you need.",
    ...UNSPLASH(
      "photo-1558494949-ef010cbdcc31",
      "Server room with racks and networking equipment",
    ),
  },
  {
    id: 3,
    title: "Launch WordPress",
    description:
      "Deploy a Dockerized WordPress site with SSL, MariaDB, Redis, and nginx/php-fpm pre-wired.",
    ...UNSPLASH(
      "photo-1555066931-4365d14bab8c",
      "Developer workspace with code on screen",
    ),
  },
  {
    id: 4,
    title: "Collaborate",
    description:
      "Invite your team with Owner, Admin, Developer, and Viewer roles so everyone ships from one place.",
    titleGap: 18,
    ...UNSPLASH(
      "photo-1522071820081-009f0129c71c",
      "Team collaborating around a laptop",
    ),
  },
] as const;

const AUTO_ADVANCE_MS = 4500;
const CIRCLE_SIZE = 60;
const STEPS_GAP = 30;
const CONTENT_GAP = 20;
const STEP_DESC_GAP = 10;
const DESC_MAX_WIDTH = 446;
const FALLBACK_DESC_SLOT_HEIGHT = 72;
const easeOut = [0.22, 1, 0.36, 1] as const;
const fadeTransition = { duration: 0.18, ease: easeOut };
const imageFadeTransition = { duration: 0.18, ease: easeOut };

function titlePaddingLeft(step: (typeof STEPS)[number]): number {
  const gap = "titleGap" in step && step.titleGap ? step.titleGap : 20;
  return gap - CONTENT_GAP;
}

/** Measure tallest step copy once so the active slot height never changes between steps. */
function useDescriptionSlotHeight() {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState(FALLBACK_DESC_SLOT_HEIGHT);

  const longest = STEPS.reduce((a, b) =>
    a.description.length >= b.description.length ? a : b,
  );

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setHeight(Math.max(FALLBACK_DESC_SLOT_HEIGHT, Math.ceil(el.offsetHeight)));
  }, []);

  const measureNode = (
    <p
      ref={measureRef}
      aria-hidden
      className="pointer-events-none absolute left-[-9999px] top-0 w-[446px] text-body-2 leading-[1.35]"
    >
      {longest.description}
    </p>
  );

  return { height, measureNode };
}

type StepConnectorProps = {
  isCompleted: boolean;
  isActive: boolean;
  segmentProgress: number;
  prefersReducedMotion: boolean | null;
  theme: HowItWorksTheme;
};

/** Figma `76:468` / `how-it-works-connector.svg`: 1px stroked lines, not filled rects. */
function StepConnector({
  isCompleted,
  isActive,
  segmentProgress,
  prefersReducedMotion,
  theme,
}: StepConnectorProps) {
  const fillScale = isCompleted
    ? 1
    : isActive
      ? prefersReducedMotion
        ? 1
        : segmentProgress
      : 0;

  const showFill = fillScale > 0;
  const fillEnd = 100 * fillScale;

  return (
    <div
      className="step-connector-rail relative min-h-0 w-px flex-1 shrink-0 border-0"
      style={{
        marginBottom: -STEPS_GAP,
        paddingBottom: STEPS_GAP,
      }}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 1 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100"
          stroke={theme.connectorTrack}
          vectorEffect="non-scaling-stroke"
        />
        {showFill && (
          <line
            x1="0.5"
            y1="0"
            x2="0.5"
            y2={fillEnd}
            stroke={theme.connectorFill}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}

type TimelineStepProps = {
  step: (typeof STEPS)[number];
  row: number;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
  descSlotHeight: number;
  segmentProgress: number;
  prefersReducedMotion: boolean | null;
  theme: HowItWorksTheme;
  onSelect: () => void;
};

const TimelineStep = memo(function TimelineStep({
  step,
  row,
  isActive,
  isCompleted,
  isLast,
  descSlotHeight,
  segmentProgress,
  prefersReducedMotion,
  theme,
  onSelect,
}: TimelineStepProps) {
  const paddingLeft = titlePaddingLeft(step);
  const hasDescription = Boolean(step.description);

  return (
    <>
      <div
        className="flex h-full min-h-0 flex-col items-center self-stretch"
        style={{ gridRow: row, gridColumn: 1, minHeight: "100%" }}
      >
        <div
          data-step={step.id}
          data-circle-wrap
          className="relative z-[2] flex size-[60px] shrink-0 items-center justify-center"
        >
          <div
            className={`box-border flex size-[60px] shrink-0 items-center justify-center rounded-[40px] p-[20px] transition-colors duration-[350ms] ease-out ${
              isActive ? theme.circleActive : theme.circleInactive
            }`}
          >
            <span
              className={`text-step-number leading-none transition-colors duration-[350ms] ease-out ${
                isActive ? theme.stepNumberActive : theme.stepNumberInactive
              }`}
            >
              {step.id}
            </span>
          </div>
        </div>

        {!isLast && (
          <StepConnector
            isCompleted={isCompleted}
            isActive={isActive}
            segmentProgress={segmentProgress}
            prefersReducedMotion={prefersReducedMotion}
            theme={theme}
          />
        )}
      </div>

      <div
        className="flex min-w-0 flex-col items-start self-start"
        style={{
          gridRow: row,
          gridColumn: 2,
          paddingLeft,
        }}
      >
        <button
          type="button"
          onClick={onSelect}
          className="steps__step-head flex w-full shrink-0 items-center text-left"
          style={{ minHeight: CIRCLE_SIZE }}
          aria-current={isActive ? "step" : undefined}
          aria-expanded={isActive && hasDescription}
        >
          <p
            className={`text-title-2 min-w-0 flex-1 transition-colors duration-[350ms] ease-out ${
              isActive ? theme.stepTitleActive : theme.stepTitle
            }`}
          >
            {step.title}
          </p>
        </button>

        {isActive && hasDescription && (
          <div
            className="steps__desc-slot relative w-full shrink-0 overflow-hidden"
            style={{
              height: descSlotHeight,
              marginTop: STEP_DESC_GAP,
              maxWidth: DESC_MAX_WIDTH,
            }}
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.p
                key={`desc-${step.id}`}
                className={`text-body-2 leading-[1.35] ${theme.stepDescription}`}
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={fadeTransition}
              >
                {step.description}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
});

type HowItWorksSectionProps = {
  forceTheme?: HowItWorksThemeId;
};

export default function HowItWorksSection({
  forceTheme,
}: HowItWorksSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { height: descSlotHeight, measureNode } = useDescriptionSlotHeight();

  const isRevealInView = useInView(sectionRef, {
    amount: 0.2,
    once: true,
    margin: "0px 0px -8% 0px",
  });
  const prefersReducedMotion = useReducedMotion();
  const theme = forceTheme
    ? HOW_IT_WORKS_THEMES[forceTheme]
    : HOW_IT_WORKS_THEME_VARS;
  const [activeStep, setActiveStep] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const loopTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const startStepLoop = useCallback(
    (startAtIndex = 0) => {
      loopTimelineRef.current?.kill();

      if (prefersReducedMotion) return;

      const progress = { value: 0 };
      const tl = gsap.timeline({ repeat: -1 });
      const order = Array.from({ length: STEPS.length }, (_, i) =>
        (startAtIndex + i) % STEPS.length,
      );

      order.forEach((index) => {
        tl.add(() => {
          setActiveStep(index);
          progress.value = 0;
          setSegmentProgress(0);
        });
        tl.to(progress, {
          value: 1,
          duration: AUTO_ADVANCE_MS / 1000,
          ease: "none",
          onUpdate: () => setSegmentProgress(progress.value),
        });
      });

      loopTimelineRef.current = tl;
    },
    [prefersReducedMotion],
  );

  /** One repeating timeline — no per-step effect teardown (fixes 4→1 gap). */
  useEffect(() => {
    if (prefersReducedMotion) {
      setSegmentProgress(1);
      const timer = window.setInterval(() => {
        setActiveStep((prev) => (prev + 1) % STEPS.length);
      }, AUTO_ADVANCE_MS);
      return () => window.clearInterval(timer);
    }

    startStepLoop(0);
    return () => {
      loopTimelineRef.current?.kill();
      loopTimelineRef.current = null;
    };
  }, [prefersReducedMotion, startStepLoop]);

  useEffect(() => {
    const next = STEPS[(activeStep + 1) % STEPS.length];
    const img = new Image();
    img.src = next.image;
  }, [activeStep]);

  const goToStep = useCallback(
    (index: number) => {
      setActiveStep(index);
      setSegmentProgress(prefersReducedMotion ? 1 : 0);
      if (!prefersReducedMotion) startStepLoop(index);
    },
    [prefersReducedMotion, startStepLoop],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        goToStep((activeStep + 1) % STEPS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goToStep((activeStep - 1 + STEPS.length) % STEPS.length);
      }
    },
    [activeStep, goToStep],
  );

  const selectStep = useCallback(
    (index: number) => {
      goToStep(index);
    },
    [goToStep],
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="how-it-works-section relative isolate mx-auto w-full max-w-[1920px] shrink-0 overflow-hidden scroll-mt-[78px] bg-white"
      data-theme={theme.id}
      data-name="Frame 2147224485"
      data-node-id="76:449"
    >
      <div className="relative flex flex-col items-start py-[140px] pl-[240px] pr-6 lg:pr-[240px]">
        <div
          className="flex w-full max-w-[1680px] flex-col items-start gap-[122px] lg:flex-row"
          data-node-id="76:450"
        >
          <div
            className="flex w-full max-w-[588px] shrink-0 flex-col items-start gap-[80px]"
            data-node-id="76:451"
          >
            <ScrollRevealHeading
              className={`text-h2 ${theme.heading}`}
              lines={[...FIGMA_HEADLINES.howItWorks.lines]}
              accentLineIndex={FIGMA_HEADLINES.howItWorks.accentLineIndex}
              accentLineClassName={theme.headingAccent}
              darkBg={theme.scrollRevealDarkBg}
            />

            <div
              className="steps relative grid w-full max-w-[526px] items-start"
              style={{
                gridTemplateColumns: `${CIRCLE_SIZE}px 1fr`,
                columnGap: CONTENT_GAP,
                rowGap: STEPS_GAP,
                gridAutoRows: "minmax(auto, auto)",
              }}
              role="tablist"
              aria-label="Deployment steps"
              data-node-id="76:453"
              onKeyDown={handleKeyDown}
            >
              {measureNode}

              {STEPS.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  row={index + 1}
                  isActive={activeStep === index}
                  isCompleted={index < activeStep}
                  isLast={index === STEPS.length - 1}
                  descSlotHeight={descSlotHeight}
                  segmentProgress={segmentProgress}
                  prefersReducedMotion={prefersReducedMotion}
                  theme={theme}
                  onSelect={() => selectStep(index)}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="relative h-[min(770px,60vw)] w-full max-w-[970px] shrink-0 overflow-hidden rounded-bl-[16px] rounded-tl-[16px] bg-[#e8f0ff] lg:h-[770px] lg:w-[970px]"
            data-node-id="76:476"
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 40 }}
            animate={isRevealInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.img
                key={STEPS[activeStep].id}
                src={STEPS[activeStep].image}
                alt={STEPS[activeStep].imageAlt}
                className="absolute inset-0 size-full object-cover object-center"
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={imageFadeTransition}
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 rounded-bl-[16px] rounded-tl-[16px] ring-1 ring-inset ring-black/6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
