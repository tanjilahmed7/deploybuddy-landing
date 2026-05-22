import fs from "fs";
import path from "path";

const ROOT = path.join(import.meta.dirname, "..");

const FILES = [
  "src/imports/DeployBuddyLandingPage/DeployBuddyLandingPage.tsx",
  "src/app/components/HowItWorksSection.tsx",
  "src/app/components/FeaturesSliderSection.tsx",
  "src/app/components/SafetyCarouselSection.tsx",
  "src/app/components/TeamCarouselSection.tsx",
];

const FIGMA_FONT =
  /font-\['(?:Clash_Display|Manrope):(?:Medium|Regular)',sans-serif\]\s*/g;

function migrateClassList(cls) {
  let c = cls.replace(FIGMA_FONT, "");
  c = c.replace(/\bfont-normal\b\s*/g, "");
  c = c.replace(/\bfont-medium\b\s*/g, "");
  c = c.replace(/\bnot-italic\b\s*/g, "");

  const has = (re) => re.test(c);

  let token = null;

  if (has(/text-\[76px\]/) && has(/tracking-\[-1\.2px\]/)) {
    token = "text-h1";
    c = c
      .replace(/text-\[76px\]\s*/g, "")
      .replace(/leading-none\s*/g, "")
      .replace(/tracking-\[-1\.2px\]\s*/g, "");
  } else if (has(/text-\[56px\]/) && has(/leading-\[1\.1\]/)) {
    token = "text-h2";
    c = c.replace(/text-\[56px\]\s*/g, "").replace(/leading-\[1\.1\]\s*/g, "");
  } else if (has(/text-\[56px\]/)) {
    token = "text-h2";
    c = c.replace(/text-\[56px\]\s*/g, "");
  } else if (has(/text-\[36px\]/) && has(/leading-none/)) {
    token = "text-step-number";
    c = c.replace(/text-\[36px\]\s*/g, "").replace(/leading-none\s*/g, "");
  } else if (has(/text-\[30px\]/) && has(/tracking-\[-0\.23px\]/)) {
    token = "text-title-1-tracked";
    c = c
      .replace(/text-\[30px\]\s*/g, "")
      .replace(/leading-\[30\.13px\]\s*/g, "")
      .replace(/tracking-\[-0\.23px\]\s*/g, "");
  } else if (has(/text-\[30px\]/)) {
    token = "text-title-1";
    c = c.replace(/text-\[30px\]\s*/g, "").replace(/leading-none\s*/g, "");
  } else if (
    has(/text-\[20px\]/) &&
    has(/leading-\[1\.3\]/) &&
    !has(/text-\[#4d3933\]/) &&
    !has(/text-black/)
  ) {
    token = "text-title-2";
    c = c.replace(/text-\[20px\]\s*/g, "").replace(/leading-\[1\.3\]\s*/g, "");
  } else if (has(/text-\[20px\]/) && has(/leading-\[1\.3\]/)) {
    token = "text-body-1";
    c = c.replace(/text-\[20px\]\s*/g, "").replace(/leading-\[1\.3\]\s*/g, "");
  } else if (has(/text-\[20px\]/) && has(/tracking-\[1px\]/)) {
    token = "text-label-trusted";
    c = c
      .replace(/text-\[20px\]\s*/g, "")
      .replace(/leading-\[20px\]\s*/g, "")
      .replace(/tracking-\[1px\]\s*/g, "");
  } else if (has(/text-\[22px\]/) && has(/leading-\[1\.2\]/)) {
    token = "text-card-title";
    c = c.replace(/text-\[22px\]\s*/g, "").replace(/leading-\[1\.2\]\s*/g, "");
  } else if (has(/text-\[22px\]/) && has(/leading-\[1\.3\]/)) {
    token = "text-quote";
    c = c.replace(/text-\[22px\]\s*/g, "").replace(/leading-\[1\.3\]\s*/g, "");
  } else if (has(/text-\[18px\]/) && has(/leading-\[1\.2\]/)) {
    token = "text-title-2";
    c = c.replace(/text-\[18px\]\s*/g, "").replace(/leading-\[1\.2\]\s*/g, "");
  } else if (has(/text-\[16px\]/) && has(/tracking-\[0\.32px\]/)) {
    token = "text-nav";
    c = c
      .replace(/text-\[16px\]\s*/g, "")
      .replace(/tracking-\[0\.32px\]\s*/g, "")
      .replace(/leading-none\s*/g, "");
  } else if (has(/text-\[14px\]/) && has(/tracking-\[0\.28px\]/)) {
    token = "text-btn";
    c = c
      .replace(/text-\[14px\]\s*/g, "")
      .replace(/tracking-\[0\.28px\]\s*/g, "")
      .replace(/leading-\[0\.8\]\s*/g, "");
  } else if (has(/text-\[16px\]/) && has(/leading-\[1\.3\]/)) {
    token = "text-body-2";
    c = c.replace(/text-\[16px\]\s*/g, "").replace(/leading-\[1\.3\]\s*/g, "");
  } else if (has(/text-\[16px\]/) && has(/leading-\[20\.96px\]/)) {
    token = "text-body-2";
    c = c.replace(/text-\[16px\]\s*/g, "").replace(/leading-\[20\.96px\]\s*/g, "");
  } else if (has(/text-\[16px\]/)) {
    token = "text-body-2";
    c = c.replace(/text-\[16px\]\s*/g, "");
  } else if (has(/text-\[20px\]/)) {
    token = "text-body-1";
    c = c.replace(/text-\[20px\]\s*/g, "");
  }

  if (token && !c.includes(token)) {
    c = `${token} ${c}`;
  }

  return c.replace(/\s+/g, " ").trim();
}

function migrateContent(content) {
  const hadFigma = FIGMA_FONT.test(content);
  FIGMA_FONT.lastIndex = 0;
  if (!hadFigma) return content;

  return content.replace(/className="([^"]*)"/g, (match, cls) => {
    if (!cls.includes("font-['Clash") && !cls.includes("font-['Manrope")) {
      return match;
    }
    return `className="${migrateClassList(cls)}"`;
  });
}

for (const rel of FILES) {
  const filePath = path.join(ROOT, rel);
  const original = fs.readFileSync(filePath, "utf8");
  const migrated = migrateContent(original);
  if (migrated !== original) {
    fs.writeFileSync(filePath, migrated);
    console.log(`Migrated: ${rel}`);
  }
}

// Inter 14px / 16px in monolith → text-body-2 (Manrope per brand)
const monolithPath = path.join(ROOT, FILES[0]);
let mono = fs.readFileSync(monolithPath, "utf8");
const interBody2 =
  /font-\['Inter:Regular',sans-serif\]\s*font-normal\s*(?=.*text-\[(?:14|16)px\])/g;
let interCount = 0;
mono = mono.replace(/className="([^"]*)"/g, (match, cls) => {
  if (!cls.includes("Inter:Regular")) return match;
  if (!/text-\[(14|16)px\]/.test(cls) || !/leading-\[1\.3\]/.test(cls)) return match;
  interCount++;
  let c = cls.replace(/font-\['Inter:Regular',sans-serif\]\s*/g, "");
  c = c.replace(/\bfont-normal\b\s*/g, "");
  c = c.replace(/text-\[(14|16)px\]\s*/g, "");
  c = c.replace(/leading-\[1\.3\]\s*/g, "");
  if (!c.includes("text-body-2")) c = `text-body-2 ${c}`;
  return `className="${c.replace(/\s+/g, " ").trim()}"`;
});
fs.writeFileSync(monolithPath, mono);
console.log(`Inter→body-2 replacements: ${interCount}`);
