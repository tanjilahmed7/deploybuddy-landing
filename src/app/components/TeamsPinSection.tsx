import type { ReactNode } from "react";

type TeamsPinSectionProps = {
  header: ReactNode;
  card1: ReactNode;
  card2: ReactNode;
};

export default function TeamsPinSection({
  header,
  card1,
  card2,
}: TeamsPinSectionProps) {
  return (
    <section
      id="use-cases"
      className="teams-pin-section bg-[#030813] flex flex-col gap-[80px] items-start px-[240px] py-[140px] relative shrink-0 w-full max-w-[1920px] mx-auto scroll-mt-[78px]"
      data-node-id="76:540"
    >
      <div className="relative z-10 w-full max-w-[1440px] shrink-0">{header}</div>

      <div className="relative w-full max-w-[1440px] flex flex-col gap-[24px]">
        <div className="relative w-full shrink-0">{card1}</div>
        <div className="relative w-full shrink-0">{card2}</div>
      </div>
    </section>
  );
}
