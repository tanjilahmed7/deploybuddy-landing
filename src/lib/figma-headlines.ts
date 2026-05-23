/** Explicit line breaks from DeployBuddy Figma (node 76:193). */

/** Figma 76:255 — Black + Deep Blue */
export const FIGMA_COLORS = {
  black: "#17171b",
  deepBlue: "#1447e6",
} as const;

export type HeadlinePart = {
  text: string;
  accent?: boolean;
};

export type HeadlineBlock = {
  lines: string[];
  /** Accent applies to the full line at this index (H2 blue span). */
  accentLineIndex?: number;
};

export const FIGMA_HEADLINES = {
  hero: {
    lines: ["Manage WordPress", "servers without SSH."],
    line2Parts: [
      { text: "servers" },
      { text: "without SSH.", accent: true },
    ] as HeadlinePart[],
    maxWidthClass: "max-w-[990px]",
  },
  features: {
    lines: ["Everything you need to run", "WordPress on your own cloud."],
    maxWidthClass: "max-w-[857px]",
  },
  howItWorks: {
    lines: ["Do token to live WordPress in", "under five minutes."],
    accentLineIndex: 1,
  },
  safety: {
    lines: ["Built with control and safety in mind."],
    maxWidthClass: "max-w-[522px]",
  },
  teamsSection: {
    lines: ["Designed for teams that", "deliver WordPress projects."],
    maxWidthClass: "max-w-[777px]",
  },
  teamsPin: {
    lines: ["Built for the teams that actually", "ship WordPress work."],
    maxWidthClass: "max-w-[916px]",
  },
  useCases: {
    lines: ["Managed hosting simplicity", "VPS-level control"],
    accentLineIndex: 1,
    maxWidthClass: "max-w-[884px]",
  },
  newsletter: {
    lines: ["Ready to manage", "WordPress servers?"],
    maxWidthClass: "max-w-[777px]",
  },
} as const satisfies Record<string, HeadlineBlock & { maxWidthClass?: string; line2Parts?: HeadlinePart[] }>;
