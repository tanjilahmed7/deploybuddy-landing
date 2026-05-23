import { FOOTER_LINKS } from "./footer-links";

export const NAV_LINKS = [
  { href: FOOTER_LINKS.features, label: "Features" },
  { href: FOOTER_LINKS.howItWorks, label: "How it Works" },
  { href: FOOTER_LINKS.useCases, label: "Use cases" },
  { href: FOOTER_LINKS.security, label: "Security" },
  { href: "#get-started", label: "FAQ" },
] as const;

export const NAV_LOGIN_HREF = "#get-started";
export const NAV_CTA_HREF = FOOTER_LINKS.getStarted;
