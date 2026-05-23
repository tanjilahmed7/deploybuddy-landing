export type HowItWorksThemeId = "dark" | "light";

export type HowItWorksTheme = {
  id: HowItWorksThemeId;
  heading: string;
  headingAccent: string;
  scrollRevealDarkBg: boolean;
  stepTitle: string;
  stepTitleActive: string;
  stepDescription: string;
  circleActive: string;
  circleInactive: string;
  stepNumberActive: string;
  stepNumberInactive: string;
  connectorTrack: string;
  connectorFill: string;
};

/** Default — Figma `76:449` solid white section. */
export const HOW_IT_WORKS_THEME_VARS: HowItWorksTheme = {
  id: "light",
  heading: "text-[#141414]",
  headingAccent: "text-[#1447e6]",
  scrollRevealDarkBg: false,
  stepTitle: "text-[#141414]",
  stepTitleActive: "text-[#1447e6]",
  stepDescription: "text-[#141414]",
  circleActive: "bg-[#17171b]",
  circleInactive: "bg-[#f1f3f4]",
  stepNumberActive: "text-white",
  stepNumberInactive: "text-[#141414]",
  connectorTrack: "#c6c9d0",
  connectorFill: "#1447e6",
};

/** Matches Features section gradient (`from-black` → `#03125d`). */
export const HOW_IT_WORKS_THEME_DARK: HowItWorksTheme = {
  id: "dark",
  heading: "text-white",
  headingAccent: "text-[#1447e6]",
  scrollRevealDarkBg: true,
  stepTitle: "text-white",
  stepTitleActive: "text-[#1447e6]",
  stepDescription: "text-[#aaa]",
  circleActive: "bg-white",
  circleInactive: "bg-white/15",
  stepNumberActive: "text-[#17171b]",
  stepNumberInactive: "text-white/80",
  connectorTrack: "#c6c9d0",
  connectorFill: "#1447e6",
};

export const HOW_IT_WORKS_THEME_LIGHT: HowItWorksTheme = {
  id: "light",
  heading: "text-[#141414]",
  headingAccent: "text-[#1447e6]",
  scrollRevealDarkBg: false,
  stepTitle: "text-[#141414]",
  stepTitleActive: "text-[#1447e6]",
  stepDescription: "text-[#141414]",
  circleActive: "bg-[#17171b]",
  circleInactive: "bg-[#f1f3f4]",
  stepNumberActive: "text-white",
  stepNumberInactive: "text-[#141414]",
  connectorTrack: "#c6c9d0",
  connectorFill: "#1447e6",
};

export const HOW_IT_WORKS_THEMES: Record<HowItWorksThemeId, HowItWorksTheme> = {
  dark: HOW_IT_WORKS_THEME_DARK,
  light: HOW_IT_WORKS_THEME_LIGHT,
};
