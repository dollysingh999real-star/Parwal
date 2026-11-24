import { NAV_LINKS } from '../data/firmData';

export default function SiteHeader() {
  return (
    <header className="relative z-30 w-full bg-transparent">
      <div className="w-full min-h-[88px] md:min-h-[96px] px-6 md:px-12 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <a
          href="#top"
          className="inline-flex flex-col w-fit shrink-0 text-[#FFFFFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
        >
          <span className="text-[26px] md:text-[35px] font-extrabold uppercase tracking-[0.22em] leading-none whitespace-nowrap">
            PARWAL
          </span>
          <span className="block w-full h-px bg-[#FFFFFF]/65 my-2" aria-hidden="true" />
          <span className="text-[11px] md:text-[13px] font-semibold uppercase tracking-[0.38em] leading-none text-[#FFFFFF]/90 whitespace-nowrap">
            SINCE 1983
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-10"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[15px] sm:text-[18px] md:text-[22px] font-normal text-[#FFFFFF] hover:text-[#C9A227] transition-colors duration-300 ease-editorial whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#C9A227] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block w-[180px] shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}
