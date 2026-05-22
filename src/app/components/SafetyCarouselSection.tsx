import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useInView, useReducedMotion } from "motion/react";

import imgCard1 from "../../imports/DeployBuddyLandingPage/a329e092dcdf5e6fe3a7c8c8bad0301f7c484b87.png";
import imgCard2 from "../../imports/DeployBuddyLandingPage/9a924853e95ea3bd17fe860f989588821d532401.png";
import imgCard3a from "../../imports/DeployBuddyLandingPage/ece298d0ec2c16f10310d45724b276a6035cb503.png";
import imgCard3b from "../../imports/DeployBuddyLandingPage/0d9c525082c6e2d775f7cfb1534692c856e62eb2.png";
import imgCard3c from "../../imports/DeployBuddyLandingPage/4b5acbf746da80235c9078c52f0f4a53bf01d1ec.png";
import imgCard3d from "../../imports/DeployBuddyLandingPage/6de158f6e898059aae561a651b88202b10f84767.png";
import svgPaths from "../../imports/DeployBuddyLandingPage/svg-ozithytiez";

const CARD_W = 669;
const CARD_GAP = 25;
const TOTAL = 3;
const AUTOPLAY_MS = 3500;
const easeOut = [0.22, 1, 0.36, 1] as const;

const SLIDES = [
  { id: "encrypted", Card: Card1 },
  { id: "roles", Card: Card2 },
  { id: "audit", Card: Card3 },
] as const;

// ── Cards ─────────────────────────────────────────────────────────────────────

function Card1() {
  return (
    <div
      className="bg-white shrink-0 rounded-[8px] overflow-clip p-[45px]"
      style={{ width: CARD_W, height: 533 }}
    >
      <div className="flex flex-col gap-[40px] items-end h-full">
        <div className="flex flex-col gap-[20px] items-start w-full">
          <p className="text-title-1 capitalize text-[#17171b] whitespace-nowrap">
            {`Encrypted API & SSH keys`}
          </p>
          <p className="text-body-1 text-[#4d3933] w-[579px]">
            DigitalOcean + Cloudflare tokens encrypted at rest, Private keys stored with Laravel encrypted casts; never logged.
          </p>
        </div>
        <div className="relative shrink-0" style={{ width: 288, height: 216 }}>
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgCard1}
          />
        </div>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div
      className="bg-white shrink-0 rounded-[8px] overflow-clip p-[45px]"
      style={{ width: CARD_W, height: 533 }}
    >
      <div className="flex flex-col gap-[40px] items-end h-full">
        <div className="flex flex-col gap-[20px] items-start w-full">
          <p className="text-title-1 capitalize text-[#17171b] whitespace-nowrap">
            Role-based team access
          </p>
          <p className="text-body-1 text-[#4d3933] w-full">
            The roles of Owner, Admin, Developer, and Viewer follow the principle of least privilege, granting users only the access needed to perform their tasks. This enhances security and reduces potential risks.
          </p>
        </div>
        <div className="flex items-end justify-between w-full shrink-0">
          <div className="relative shrink-0 size-[80px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
              <g clipPath="url(#safety-arrow-clip)" id="Frame">
                <g id="Vector" />
                <path d={svgPaths.p37d16600} id="Vector_2" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 30L30 50" id="Vector_3" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M35 30H50V45" id="Vector_4" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="safety-arrow-clip">
                  <rect fill="white" height="80" width="80" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="relative shrink-0" style={{ width: 342.667, height: 257 }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute h-[150.02%] left-0 max-w-none top-[0.06%] w-full"
                src={imgCard2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div
      className="bg-white shrink-0 rounded-[8px] overflow-clip p-[45px]"
      style={{ width: CARD_W, height: 533 }}
    >
      <div className="flex flex-col gap-[40px] items-end h-full">
        <div className="flex flex-col gap-[20px] items-start w-full">
          <p className="text-title-1 capitalize text-[#17171b] whitespace-nowrap">
            Audit logs
          </p>
          <p className="text-body-1 text-[#4d3933] w-full">
            Every sensitive action recorded with user, IP, and metadata.
          </p>
        </div>
        <div className="relative shrink-0" style={{ width: 285.333, height: 214 }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgCard3a} />
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgCard3b} />
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgCard3c} />
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgCard3d} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SafetyCarouselSection ─────────────────────────────────────────────────────

export default function SafetyCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.2,
    once: true,
    margin: "0px 0px -8% 0px",
  });
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const isDraggingRef = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    duration: prefersReducedMotion ? 0 : 25,
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    const onPointerDown = () => {
      isDraggingRef.current = true;
      setPaused(true);
    };
    const onPointerUp = () => {
      isDraggingRef.current = false;
      setPaused(false);
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused || prefersReducedMotion) return;

    const id = window.setInterval(() => {
      if (isDraggingRef.current) return;
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [emblaApi, paused, prefersReducedMotion]);

  return (
    <section
      id="security"
      ref={sectionRef}
      className="relative w-full max-w-[1920px] mx-auto shrink-0 bg-[#f4f4f4] px-[240px] py-[140px] scroll-mt-[78px]"
      data-name="Frame 2147224490"
      data-node-id="76:540"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!isDraggingRef.current) setPaused(false);
      }}
    >
      <motion.div
        className="flex items-end justify-between w-full mb-[80px]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <p className="text-h2 text-[#030813] w-[522px]">
          Built with control and safety in mind.
        </p>
        <p className="text-body-2 text-[#030813] whitespace-nowrap">
          You stay in control of your servers. DeployBuddy helps you manage them safely.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-[80px]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
      >
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y select-none"
          style={{ height: 533 }}
          data-node-id="76:547"
          aria-roledescription="carousel"
        >
          <div className="flex" style={{ gap: CARD_GAP, marginLeft: 0 }}>
            {SLIDES.map(({ id, Card }, i) => (
              <motion.div
                key={id}
                className="min-w-0 shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${TOTAL}`}
                animate={{ opacity: activeIndex === i ? 1 : 0.55 }}
                transition={{ duration: 0.4, ease: easeOut }}
                style={{ flex: `0 0 ${CARD_W}px` }}
              >
                <Card />
              </motion.div>
            ))}
          </div>
        </div>

        <div
          className="relative flex gap-[2px] items-center w-[1440px]"
          data-node-id="76:575"
          role="tablist"
          aria-label="Safety feature slides"
        >
          <div className="bg-[#5e5e6e] flex-[1_0_0] h-[2px] min-w-px opacity-50 relative" />
          <div
            className="absolute bg-[#1447e6] h-[2px] left-0 top-0"
            style={{
              width: `${((activeIndex + 1) / TOTAL) * 100}%`,
              transition: "width 600ms ease",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
