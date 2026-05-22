import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import howItWorksPreview from "../../imports/DeployBuddyLandingPage/how-it-works-preview.png";

const STEPS = [
  {
    id: 1,
    title: "Connect DigitalOcean",
    description:
      "Link your DigitalOcean account with an encrypted API token—authorize DeployBuddy to manage droplets for you.",
  },
  {
    id: 2,
    title: "Create a server",
    description:
      "Create and manage DigitalOcean droplets from one dashboard—pick the region and size you need.",
  },
  {
    id: 3,
    title: "Launch WordPress",
    description:
      "Deploy a Dockerized WordPress site with SSL, MariaDB, Redis, and nginx/php-fpm pre-wired.",
  },
  {
    id: 4,
    title: "Collaborate",
    description:
      "Invite your team with Owner, Admin, Developer, and Viewer roles so everyone ships from one place.",
    titleGap: 18,
  },
] as const;

const AUTO_ADVANCE_MS = 4500;
const CIRCLE_SIZE = 60;
const STEPS_GAP = 30;
const CONTENT_GAP = 20;
const GREY_01 = "#c6c9d0";
const DEEP_BLUE = "#1447e6";
const easeOut = [0.22, 1, 0.36, 1] as const;

type StepConnectorProps = {
  isActive: boolean;
  isPaused: boolean;
  prefersReducedMotion: boolean | null;
  fillKey: number;
};

function StepConnector({
  isActive,
  isPaused,
  prefersReducedMotion,
  fillKey,
}: StepConnectorProps) {
  return (
    <div
      className="relative min-h-0 w-[1.5px] flex-1 shrink-0"
      style={{
        marginBottom: -STEPS_GAP,
        paddingBottom: STEPS_GAP,
        backgroundColor: GREY_01,
      }}
      aria-hidden
    >
      {isActive && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {prefersReducedMotion ? (
            <div
              className="step-connector__fill step-connector__fill--complete size-full"
              style={{ backgroundColor: DEEP_BLUE }}
            />
          ) : (
            <div
              key={fillKey}
              className={`step-connector__fill size-full ${isPaused ? "step-connector__fill--paused" : ""}`}
              style={{
                backgroundColor: DEEP_BLUE,
                animationDuration: `${AUTO_ADVANCE_MS}ms`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

type TimelineStepProps = {
  step: (typeof STEPS)[number];
  row: number;
  isActive: boolean;
  isLast: boolean;
  isPaused: boolean;
  prefersReducedMotion: boolean | null;
  fillKey: number;
  onSelect: () => void;
};

function TimelineStep({
  step,
  row,
  isActive,
  isLast,
  isPaused,
  prefersReducedMotion,
  fillKey,
  onSelect,
}: TimelineStepProps) {
  const titleGap = "titleGap" in step && step.titleGap ? step.titleGap : 20;
  const showDescription = isActive && Boolean(step.description);
  const contentGap = showDescription ? 10 : 0;

  return (
    <>
      <div
        className="flex h-full min-h-0 flex-col items-center self-stretch"
        style={{ gridRow: row, gridColumn: 1 }}
      >
        <div
          data-step={step.id}
          data-circle-wrap
          data-step-index={step.id}
          className="relative z-[2] flex size-[60px] shrink-0 items-center justify-center"
        >
          <div
            className={`flex size-[60px] items-center justify-center rounded-[40px] p-[20px] transition-colors duration-300 ${
              isActive ? "bg-[#17171b]" : "bg-[#f1f3f4]"
            }`}
          >
            <span
              className={`text-step-number ${isActive ? "text-white" : "text-[#141414]"}`}
            >
              {step.id}
            </span>
          </div>
        </div>

        {!isLast && (
          <StepConnector
            isActive={isActive}
            isPaused={isPaused}
            prefersReducedMotion={prefersReducedMotion}
            fillKey={fillKey}
          />
        )}
      </div>

      <div
        className={`min-w-0 ${showDescription ? "flex flex-col" : ""}`}
        style={{
          gridRow: row,
          gridColumn: 2,
          gap: contentGap,
          paddingLeft: titleGap - CONTENT_GAP,
        }}
      >
        <button
          type="button"
          onClick={onSelect}
          className="steps__step-head flex w-full items-center text-left"
          style={{ minHeight: CIRCLE_SIZE }}
          aria-current={isActive ? "step" : undefined}
          aria-expanded={showDescription}
        >
          <p
            className={`text-title-2 min-w-0 flex-1 ${
              isActive ? "text-[#1447e6]" : "text-[#141414]"
            }`}
          >
            {step.title}
          </p>
        </button>

        <AnimatePresence initial={false}>
          {showDescription && (
            <motion.div
              key="description"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="overflow-hidden"
            >
              <p
                className="text-body-2 text-[#141414]"
                style={{ maxWidth: 446 }}
              >
                {step.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.35, once: false });
  const prefersReducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % STEPS.length);
  }, []);

  useEffect(() => {
    if (!isInView || isPaused || prefersReducedMotion) return;
    const timer = window.setInterval(advanceStep, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isInView, isPaused, prefersReducedMotion, advanceStep]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveStep((p) => (p + 1) % STEPS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveStep((p) => (p - 1 + STEPS.length) % STEPS.length);
    }
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1920px] shrink-0 bg-white scroll-mt-[78px]"
      data-name="Frame 2147224485"
      data-node-id="76:449"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col items-start py-[140px] pl-[240px] pr-6 lg:pr-[240px]">
        <div
          className="flex w-full max-w-[1680px] flex-col items-start gap-[122px] lg:flex-row"
          data-node-id="76:450"
        >
          <div
            className="flex w-full max-w-[588px] shrink-0 flex-col items-start gap-[80px]"
            data-node-id="76:451"
          >
            <motion.h2
              className="text-h2 text-[#141414]"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <span className="block">Do token to live WordPress in </span>
              <span className="block text-[#1447e6]">under five minutes.</span>
            </motion.h2>

            <div
              className="steps grid w-full max-w-[526px] items-stretch"
              style={{
                gridTemplateColumns: `${CIRCLE_SIZE}px 1fr`,
                columnGap: CONTENT_GAP,
                rowGap: STEPS_GAP,
              }}
              role="tablist"
              aria-label="Deployment steps"
              data-node-id="76:453"
              onKeyDown={handleKeyDown}
            >
              {STEPS.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  row={index + 1}
                  isActive={activeStep === index}
                  isLast={index === STEPS.length - 1}
                  isPaused={isPaused}
                  prefersReducedMotion={prefersReducedMotion}
                  fillKey={activeStep}
                  onSelect={() => setActiveStep(index)}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="relative h-[min(770px,60vw)] w-full max-w-[970px] shrink-0 overflow-hidden rounded-bl-[16px] rounded-tl-[16px] bg-[#e8f0ff] lg:h-[770px] lg:w-[970px]"
            data-node-id="76:476"
            initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
          >
            <img
              src={howItWorksPreview}
              alt="DeployBuddy dashboard preview"
              className="size-full object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-0 rounded-bl-[16px] rounded-tl-[16px] ring-1 ring-inset ring-black/6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
