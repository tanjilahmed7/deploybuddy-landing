type NavCTAButtonProps = {
  href: string;
  children: string;
};

export default function NavCTAButton({ href, children }: NavCTAButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-[500px] bg-[#17171b] px-[28px] py-[16px] text-nav capitalize text-[#e6e6e6] whitespace-nowrap outline-none transition-[transform,box-shadow,opacity] duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(20,71,230,0.25)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1447e6] focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}
