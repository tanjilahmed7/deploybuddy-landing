import { FIGMA_HEADLINES } from "../lib/figma-headlines";
import ScrollRevealHeading from "./ScrollRevealHeading";
import BlurRevealText from "./BlurRevealText";
import { FEATURES_SECTION_GRADIENT_CLASS } from "../lib/section-backgrounds";
import img506 from "../imports/DeployBuddyLandingPage/4f388580dbf5cd692c0d00c14113857295288703.png";
import img507 from "../imports/DeployBuddyLandingPage/090c4ef71b7a19d03d97a2700ed0d65c18b358ee.png";
import img508 from "../imports/DeployBuddyLandingPage/51bf8bf67797c79c70b89bd52c569905a79aad5e.png";
import img509 from "../imports/DeployBuddyLandingPage/21f3d34a2b39c036c28ed17d4fd6964b2ff1029c.png";
import img510 from "../imports/DeployBuddyLandingPage/419632b82a28b455006959a8725a4503e2a8fb3e.png";
import img511 from "../imports/DeployBuddyLandingPage/2f3278a54a997e013b302b0dfb9b3a58db860746.png";
import img512 from "../imports/DeployBuddyLandingPage/1fa030b9415a692c944412d1da678c77ce657f66.png";
import img513 from "../imports/DeployBuddyLandingPage/7a3c6579088385839b17ee8e0167d0fe8e0c67dc.png";
import { imgSrc, type ImageImport } from "@/lib/img-src";

// ── Types ────────────────────────────────────────────────────────────────────

type FeatureCard = {
  type: "feature";
  image: ImageImport;
  title: string;
  description: string;
};

type TestimonialCard = {
  type: "testimonial";
  image: ImageImport;
  quote: string;
  author: string;
  role: string;
};

type CardData = FeatureCard | TestimonialCard;

// ── Card data ─────────────────────────────────────────────────────────────────

const TOP_CARDS: CardData[] = [
  {
    type: "feature",
    image: img506,
    title: "One-click WordPress deploy",
    description:
      "Dockerized WP sites with SSL, MariaDB, Redis, and Caddy out of the box.",
  },
  {
    type: "feature",
    image: img507,
    title: "Cloud server management",
    description:
      "Create + manage DigitalOcean droplets from one dashboard.",
  },
  {
    type: "feature",
    image: img508,
    title: "Automated backups",
    description:
      "Daily encrypted backups with one-click restore for every site.",
  },
  {
    type: "feature",
    image: img509,
    title: "Custom domains & SSL",
    description:
      "Point any domain, auto-provision SSL — zero manual configuration.",
  },
  {
    type: "feature",
    image: img506,
    title: "PHP & plugin updates",
    description:
      "Keep WordPress core and plugins in sync with a single click.",
  },
];

const BOTTOM_CARDS: CardData[] = [
  {
    type: "testimonial",
    image: img510,
    quote:
      "We chose DeployBuddy right off the bat because it's super flexible and has awesome automation features.",
    author: "Sabbir Ali Khan",
    role: "Founder & CEO – Bilkis Tours",
  },
  {
    type: "feature",
    image: img511,
    title: "Team access",
    description:
      "Owner / Admin / Developer / Viewer roles per team.",
  },
  {
    type: "feature",
    image: img512,
    title: "Uptime & monitoring",
    description:
      "Track uptime, response time, CPU, memory, disk, and Docker health.",
  },
  {
    type: "testimonial",
    image: img513,
    quote:
      "Switching to DeployBuddy cut our deployment time from 2 hours to under 5 minutes. Worth every cent.",
    author: "Rafi Hasan",
    role: "CTO – Pixel Labs",
  },
];

// Vertical offset per card position for the "floating" feel
const TOP_FLOATS  = [0, -20, 14, -12, 18] as const;
const BOTTOM_FLOATS = [-14, 10, -18, 8] as const;

// ── SliderCard ────────────────────────────────────────────────────────────────

function SliderCard({
  card,
  offsetY = 0,
  imgW,
  imgH,
}: {
  card: CardData;
  offsetY?: number;
  imgW: number;
  imgH: number;
}) {
  const alt =
    card.type === "feature" ? card.title : card.author;

  return (
    <div
      className="marquee-card flex shrink-0 items-end gap-[20px]"
      style={{ transform: `translateY(${offsetY}px)`, marginRight: 240 }}
    >
      {/* Image */}
      <div
        className="shrink-0 rounded-[8px] overflow-hidden"
        style={{ width: imgW, height: imgH }}
      >
        <img
          src={imgSrc(card.image)}
          alt={alt}
          className="size-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Text */}
      <div
        className="flex shrink-0 flex-col items-start justify-end"
        style={{ width: 310 }}
      >
        {card.type === "feature" ? (
          <div className="flex flex-col gap-[20px]">
            <p className="text-card-title text-white">
              {card.title}
            </p>
            <p className="text-body-2 text-[#b3b5b7]">
              {card.description}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[40px]">
            <p className="text-quote text-white">
              {card.quote}
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-title-2 text-white">
                {card.author}
              </p>
              <p className="text-body-2 text-[#b3b5b7]">
                {card.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MarqueeRow ────────────────────────────────────────────────────────────────

function MarqueeRow({
  cards,
  floats,
  direction,
  duration,
  imgW,
  imgH,
}: {
  cards: CardData[];
  floats: readonly number[];
  direction: "left" | "right";
  duration: number;
  imgW: number;
  imgH: number;
}) {
  // Duplicate for seamless infinite loop
  const doubled = [...cards, ...cards];

  return (
    // py-[28px] gives breathing room for the ±20px float offsets
    <div className="relative py-[28px] overflow-visible">
      <div
        className="marquee-track flex will-change-transform"
        style={{
          animationName:
            direction === "left" ? "marquee-left" : "marquee-right",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {doubled.map((card, i) => (
          <SliderCard
            key={i}
            card={card}
            offsetY={floats[i % cards.length]}
            imgW={imgW}
            imgH={imgH}
          />
        ))}
      </div>
    </div>
  );
}

// ── FeaturesSliderSection ─────────────────────────────────────────────────────

export default function FeaturesSliderSection() {
  return (
    <section
      id="features"
      className={`relative ${FEATURES_SECTION_GRADIENT_CLASS} py-[140px] scroll-mt-[78px]`}
      data-name="Frame 2147224488"
      data-node-id="76:478"
    >
      {/* Left/right edge fade — blends marquee edges into the section bg */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[140px] bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[140px] bg-gradient-to-l from-[#03125d] to-transparent" />

      {/* ── Heading ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-[18px] px-[240px] mb-[72px]">
        <ScrollRevealHeading
          className={`text-h2 text-center text-white ${FIGMA_HEADLINES.features.maxWidthClass} mx-auto w-full`}
          lines={[...FIGMA_HEADLINES.features.lines]}
          darkBg
        />
        <BlurRevealText className="text-body-2 text-center text-[#aaa] w-[789px]">
          Replace the SSH + FTP + cPanel + spreadsheet stack with one focused
          control panel.
        </BlurRevealText>
      </div>

      {/* ── Top row — right to left, 32s ─────────────────────────── */}
      <MarqueeRow
        cards={TOP_CARDS}
        floats={TOP_FLOATS}
        direction="left"
        duration={32}
        imgW={350}
        imgH={400}
      />

      <div className="h-[40px]" aria-hidden />

      {/* ── Bottom row — left to right, 36s ──────────────────────── */}
      <MarqueeRow
        cards={BOTTOM_CARDS}
        floats={BOTTOM_FLOATS}
        direction="right"
        duration={36}
        imgW={450}
        imgH={350}
      />
    </section>
  );
}
