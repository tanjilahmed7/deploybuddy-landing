import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";

type NavPullLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  textClassName?: string;
};

/** Nav link — text roll on hover; underline hidden until hover (no scale-x artifact). */
export default function NavPullLink({
  href,
  children,
  className = "",
  textClassName = "text-body-2 leading-none text-[#17171b] whitespace-nowrap",
}: NavPullLinkProps) {
  const prefersReducedMotion = useReducedMotion();
  const label = typeof children === "string" ? children : String(children);

  if (prefersReducedMotion) {
    return (
      <a
        href={href}
        className={`inline-flex items-center px-2 py-3 text-[#17171b] hover:text-[#1447e6] transition-colors ${className}`}
      >
        <span className={textClassName}>{children}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`group inline-block px-2 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#1447e6]/35 focus-visible:ring-offset-2 rounded-md ${className}`}
    >
      <span
        className={`relative block overflow-hidden ${textClassName}`}
        style={{ height: "1.15em" }}
      >
        <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[50%]">
          <span className="block leading-none">{label}</span>
          <span className="block leading-none text-[#1447e6]">{label}</span>
        </span>
      </span>
      {/* Width 0 at rest — avoids scale-x-0 subpixel “dash” under each item */}
      <span
        className="mt-1 block h-[2px] w-0 bg-[#1447e6] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
        aria-hidden
      />
    </a>
  );
}
