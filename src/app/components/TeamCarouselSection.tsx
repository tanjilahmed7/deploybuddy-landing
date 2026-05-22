import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

import imgImage3 from "../../imports/DeployBuddyLandingPage/313f5bd7015154f27e139a57456f469aa33c6c91.png";
import imgImage33 from "../../imports/DeployBuddyLandingPage/2916c962228e4aaf7cd0c6ba3b62875f14bd4e0a.png";
import ScrollRevealHeading from "./ScrollRevealHeading";
import BlurRevealText from "./BlurRevealText";

const AUTOPLAY_MS = 4500;
const easeOut = [0.22, 1, 0.36, 1] as const;

const unsplashUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80`;

const SLIDES = [
  {
    heading: "Build for Different Type of Team",
    description:
      "Find everything you need to start building, from API access to deep technical docs, and try our models in the Playground.",
    panelImage: imgImage33,
    panelAlt: "DeployBuddy dashboard preview",
  },
  {
    heading: "Deploy WordPress in Minutes",
    description:
      "Launch Dockerized WordPress sites with SSL, Redis, and MariaDB pre-configured — no SSH or command-line knowledge needed.",
    panelImage: unsplashUrl("photo-1542831371-d531d36971e6"),
    panelAlt: "Code editor on a laptop screen",
  },
  {
    heading: "Manage Servers with Ease",
    description:
      "Create, resize, and monitor DigitalOcean droplets from a single dashboard. Full VPS control without the complexity.",
    panelImage: unsplashUrl("photo-1551288049-bebda4e38f71"),
    panelAlt: "Analytics dashboard on screen",
  },
  {
    heading: "Automated Backups & Restores",
    description:
      "Daily encrypted backups with one-click restore. Never lose your WordPress data — all stored securely in the cloud.",
    panelImage: unsplashUrl("photo-1460925895917-afdab827c52f"),
    panelAlt: "Data charts and business metrics",
  },
  {
    heading: "Team Collaboration Built In",
    description:
      "Assign Owner, Admin, Developer, or Viewer roles. Every action is tracked in the audit log for full accountability.",
    panelImage: unsplashUrl("photo-1504384308090-c894fdcc538d"),
    panelAlt: "People working together at a desk",
  },
] as const;

const TOTAL = SLIDES.length;
const ACTIVE_W = 151;
const INACTIVE_W = 89;
const GAP = 8;

const imageMotion = (reduced: boolean | null) =>
  reduced
    ? { initial: false as const }
    : {
        initial: { opacity: 0, scale: 1.04 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
        transition: { duration: 0.55, ease: easeOut },
      };

export default function TeamCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.2,
    once: true,
    margin: "0px 0px -8% 0px",
  });
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const useScrollHeading = isInView && activeIndex === 0;

  const slide = SLIDES[activeIndex];

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % TOTAL);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion, advance]);

  useEffect(() => {
    const next = SLIDES[(activeIndex + 1) % TOTAL];
    const img = new Image();
    const src =
      typeof next.panelImage === "string" && next.panelImage.startsWith("http")
        ? `${next.panelImage}&w=2860&h=1566&fit=crop`
        : next.panelImage;
    img.src = src;
  }, [activeIndex]);

  return (
    <section
      id="teams"
      ref={sectionRef}
      className="bg-[#2e2e2e] h-[950px] relative shrink-0 w-full scroll-mt-[78px]"
      data-name="Section"
      data-node-id="76:908"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* ── Original Figma background + per-slide right panel ─────── */}
      <div
        className="absolute h-[950px] left-0 overflow-clip top-[-0.05px] w-full"
        data-name="Image"
        data-node-id="76:909"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgImage3}
        />
        <div
          className="absolute h-[783px] left-[961px] overflow-hidden rounded-tl-[16px] top-[188px] w-[1430px]"
          data-name="image 33"
          data-node-id="76:910"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`panel-${slide.panelImage}`}
              alt={slide.panelAlt}
              className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] size-full"
              src={
                typeof slide.panelImage === "string" &&
                slide.panelImage.startsWith("http")
                  ? `${slide.panelImage}&w=2860&h=1566&fit=crop`
                  : slide.panelImage
              }
              {...imageMotion(prefersReducedMotion)}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ── Text overlay ─────────────────────────────────────────── */}
      <div
        className="absolute content-stretch flex flex-col gap-[16px] items-start left-[240px] pr-[270px] top-[579px] w-[721px] z-10"
        data-name="Container"
        data-node-id="76:911"
      >
        <div
          className="content-stretch flex items-start relative shrink-0 w-[550px]"
          data-name="Heading 3"
          data-node-id="76:912"
        >
          {useScrollHeading ? (
            <ScrollRevealHeading
              className="text-h2 [word-break:break-word] flex-[1_0_0] min-w-px relative text-white"
              text={SLIDES[0].heading}
              darkBg
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                className="text-h2 [word-break:break-word] flex-[1_0_0] min-w-px relative text-white"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                {slide.heading}
              </motion.p>
            </AnimatePresence>
          )}
        </div>

        <div
          className="content-stretch flex flex-col gap-[60px] items-start relative shrink-0 w-[543px]"
          data-name="Container"
          data-node-id="76:914"
        >
          {useScrollHeading ? (
            <BlurRevealText className="text-title-2 [word-break:break-word] min-w-full relative shrink-0 text-white w-[min-content]">
              {SLIDES[0].description}
            </BlurRevealText>
          ) : (
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                className="text-title-2 [word-break:break-word] min-w-full relative shrink-0 text-white w-[min-content]"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: 0.05, ease: easeOut }}
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>
          )}

          <div className="flex items-center" style={{ gap: GAP }}>
            {SLIDES.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeIndex === i ? "true" : undefined}
                onClick={() => setActiveIndex(i)}
                className="rounded-full cursor-pointer shrink-0"
                style={{ height: 4 }}
                animate={{
                  width: activeIndex === i ? ACTIVE_W : INACTIVE_W,
                  backgroundColor: activeIndex === i ? "#1447e6" : "#c6c9d0",
                }}
                transition={{ duration: 0.4, ease: easeOut }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
