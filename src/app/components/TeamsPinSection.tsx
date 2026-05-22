import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TeamsPinSectionProps = {
  header: ReactNode;
  card1: ReactNode;
  card2: ReactNode;
};

type StageLayout = {
  card1H: number;
  card2H: number;
  ready: boolean;
};

/** GSAP wraps the pinned node inside `.pin-spacer` (parent); keep it on-brand dark. */
function paintPinSpacer(pinnedEl: HTMLElement) {
  const spacer = pinnedEl.parentElement;
  if (spacer?.classList.contains("pin-spacer")) {
    spacer.style.backgroundColor = "#030813";
  }
}

export default function TeamsPinSection({
  header,
  card1,
  card2,
}: TeamsPinSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<StageLayout>({
    card1H: 445,
    card2H: 613,
    ready: false,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const c1 = card1Ref.current;
      const c2 = card2Ref.current;
      if (!c1 || !c2) return;
      setLayout({
        card1H: c1.offsetHeight,
        card2H: c2.offsetHeight,
        ready: true,
      });
    };

    measure();

    const c1 = card1Ref.current;
    if (!c1) return;
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(c1);
    if (card2Ref.current) ro.observe(card2Ref.current);
    return () => ro.disconnect();
  }, [card1, card2]);

  useGSAP(
    () => {
      if (!layout.ready) return;

      const section = sectionRef.current;
      const pinWrap = pinWrapRef.current;
      const viewport = viewportRef.current;
      const card1El = card1Ref.current;
      const card2El = card2Ref.current;
      if (!section || !pinWrap || !viewport || !card1El || !card2El) return;

      /* The two inner cards inside card 2 (Container54 + Container70). */
      const subCards = card2El.firstElementChild
        ? Array.from(
            (card2El.firstElementChild as HTMLElement).children,
          )
        : [];

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isDesktop, reduced } = ctx.conditions as {
            isDesktop: boolean;
            reduced: boolean;
          };

          // Mobile or reduced-motion → static stacked layout, no pin.
          if (!isDesktop || reduced) {
            viewport.style.height = "";
            viewport.style.overflow = "";
            gsap.set([card1El, card2El, ...subCards], { clearProps: "all" });
            return;
          }

          /* Constant-height stage (= taller card) so card 2 overlaps with no reflow. */
          const stageH = Math.max(layout.card1H, layout.card2H);
          const peek = layout.card1H; // card 2 rests flush under card 1
          /* Reveal plays over `peek` of scroll, then the section stays pinned for
             `hold` more so the finished stack lingers before releasing. */
          const reveal = peek;
          const hold = 360;
          const scrollDistance = reveal + hold;

          const applyStageLayout = () => {
            viewport.style.height = `${stageH}px`;
            viewport.style.overflow = "hidden";
            gsap.set(card1El, {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 2,
              transformOrigin: "50% 0%",
              force3D: true,
            });
            gsap.set(card2El, {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 3,
              y: peek,
              force3D: true,
            });
          };

          const clearStageLayout = () => {
            viewport.style.height = "";
            viewport.style.overflow = "";
            gsap.set([card1El, card2El, ...subCards], { clearProps: "all" });
          };

          applyStageLayout();

          const tl = gsap.timeline({
            scrollTrigger: {
              // Pin the whole section so its header + cards sit flush at the
              // top of the viewport while the reveal plays, then release.
              trigger: section,
              start: "top top",
              end: `+=${scrollDistance}`,
              scrub: 0.8,
              pin: section,
              pinType: "transform", // safe inside App's scaled wrapper
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              onRefresh: () => paintPinSpacer(section),
              onEnter: () => {
                paintPinSpacer(section);
                applyStageLayout();
              },
              onEnterBack: () => paintPinSpacer(section),
              onLeaveBack: () => {
                paintPinSpacer(section);
                applyStageLayout();
              },
            },
          });

          // card 1 recedes (scale down + dim) as card 2 rises over it.
          tl.to(
            card1El,
            { scale: 0.94, opacity: 0.5, ease: "none", duration: reveal },
            0,
          ).to(card2El, { y: 0, ease: "none", duration: reveal }, 0);

          // Inner two cards settle in, staggered, as card 2 arrives.
          if (subCards.length) {
            tl.fromTo(
              subCards,
              { yPercent: 6, opacity: 0.4 },
              {
                yPercent: 0,
                opacity: 1,
                ease: "none",
                stagger: reveal * 0.18,
                duration: reveal,
              },
              0,
            );
          }

          // Empty tail keeps the section pinned after the reveal completes.
          tl.to({}, { duration: hold });

          const refresh = () => {
            paintPinSpacer(pinWrap);
            ScrollTrigger.refresh();
          };
          window.addEventListener("resize", refresh);
          requestAnimationFrame(() => requestAnimationFrame(refresh));

          return () => {
            window.removeEventListener("resize", refresh);
            tl.scrollTrigger?.kill();
            tl.kill();
            clearStageLayout();
          };
        },
      );

      return () => mm.revert();
    },
    {
      scope: sectionRef,
      dependencies: [layout.ready, layout.card1H, layout.card2H],
    },
  );

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="teams-pin-section bg-[#030813] flex flex-col gap-[80px] items-start px-[240px] py-[140px] relative shrink-0 w-full max-w-[1920px] mx-auto scroll-mt-[78px]"
      data-node-id="76:540"
    >
      <div className="relative z-10 w-full max-w-[1440px] shrink-0">
        {header}
      </div>

      <div
        ref={pinWrapRef}
        className="teams-pin-pin-wrap relative w-full max-w-[1440px] bg-[#030813]"
      >
        <div
          ref={viewportRef}
          className="teams-pin-viewport relative w-full bg-[#030813] lg:overflow-visible"
        >
          <div
            ref={card1Ref}
            className="teams-pin-card1 relative z-[2] w-full shrink-0"
          >
            {card1}
          </div>
          <div
            ref={card2Ref}
            className="teams-pin-card2 relative z-[3] w-full shrink-0 lg:mt-[24px]"
          >
            {card2}
          </div>
        </div>
      </div>
    </section>
  );
}
