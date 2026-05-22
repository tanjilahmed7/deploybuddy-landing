import type { ReactNode } from "react";

type FooterLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export default function FooterLink({
  href,
  children,
  className = "",
  external,
}: FooterLinkProps) {
  const isExternal =
    external ?? (href.startsWith("http") || href.startsWith("mailto:"));

  return (
    <a
      href={href}
      className={`text-nav [word-break:break-word] capitalize leading-[1.2] relative shrink-0 text-[#e6e6e6] hover:text-white transition-colors ${className}`.trim()}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
