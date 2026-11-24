import { useEffect, useRef, useState } from 'react';
import {
  CONTACT_INFO,
  FOOTER_META,
  NAV_LINKS,
  SERVICES_LIST,
} from '../data/firmData';
import CurtainWipe from './CurtainWipe';
import RevealBlock from './RevealBlock';

interface ContactFooterSectionProps {
  onSelectServiceFromFooter: (serviceId: string) => void;
}

const FOOTER_LETTERS = ['P', 'A', 'R', 'W', 'A', 'L'] as const;

export default function ContactFooterSection({
  onSelectServiceFromFooter,
}: ContactFooterSectionProps) {
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const [wordmarkEntered, setWordmarkEntered] = useState(false);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el || wordmarkEntered) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setWordmarkEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setWordmarkEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [wordmarkEntered]);

  return (
    <div className="w-full bg-[#C9A227] text-[#0F2A43] overflow-hidden">
      {/* CONTACT BLOCK with left-to-right gold curtain wipe */}
      <CurtainWipe bgColor="#C9A227" testId="curtain-contact">
        <section id="contact" className="w-full pt-24 md:pt-32 pb-10 px-6 md:px-12">
          <div className="w-full">
            <RevealBlock>
              <div className="w-full flex justify-end mb-20 md:mb-28">
                <h2
                  className="text-right font-extrabold text-[#0F2A43] tracking-[-0.03em] leading-[1.08] max-w-[900px]"
                  style={{ fontSize: 'clamp(2.5rem, 4.8vw, 5.3125rem)' }}
                >
                  {CONTACT_INFO.heading}
                </h2>
              </div>
            </RevealBlock>

            <RevealBlock delayMs={80}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10 mb-14 md:mb-16">
                <div className="space-y-4">
                  <p className="text-[14px] md:text-[16px] font-bold uppercase tracking-[0.24em] text-[#0F2A43]">
                    {CONTACT_INFO.addressLabel}
                  </p>
                  <p
                    className="font-normal text-[#0F2A43] leading-[1.35]"
                    style={{ fontSize: 'clamp(1.25rem, 1.55vw, 1.75rem)' }}
                  >
                    {CONTACT_INFO.addressValue}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[14px] md:text-[16px] font-bold uppercase tracking-[0.24em] text-[#0F2A43]">
                    {CONTACT_INFO.phoneLabel}
                  </p>
                  <div
                    className="font-normal text-[#0F2A43] leading-[1.35] space-y-1"
                    style={{ fontSize: 'clamp(1.25rem, 1.55vw, 1.75rem)' }}
                  >
                    <p>
                      <a
                        href={CONTACT_INFO.phoneHref}
                        className="hover:text-[#0A1622] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43]"
                      >
                        {CONTACT_INFO.phoneValue}
                      </a>
                    </p>
                    <p>{CONTACT_INFO.phoneHours}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[14px] md:text-[16px] font-bold uppercase tracking-[0.24em] text-[#0F2A43]">
                    {CONTACT_INFO.emailLabel}
                  </p>
                  <p
                    className="font-normal text-[#0F2A43] leading-[1.35] break-all sm:break-normal"
                    style={{ fontSize: 'clamp(1.25rem, 1.55vw, 1.75rem)' }}
                  >
                    <a
                      href={CONTACT_INFO.emailHref}
                      className="hover:text-[#0A1622] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43]"
                    >
                      {CONTACT_INFO.emailValue}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <a
                  href={CONTACT_INFO.emailHref}
                  data-testid="send-mail-cta"
                  className="group relative inline-flex items-center gap-1.5 font-extrabold uppercase text-[#0F2A43] hover:text-[#0A1622] tracking-[0.04em] transition-colors duration-300 ease-editorial py-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2.5px] after:w-full after:bg-[#0A1622] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43]"
                  style={{ fontSize: 'clamp(1.25rem, 1.65vw, 1.75rem)' }}
                >
                  <span>[ SEND MAIL</span>
                  <span className="inline-block transition-transform duration-300 ease-editorial group-hover:translate-x-[8px]">
                    ↗
                  </span>
                  <span>]</span>
                </a>
              </div>
            </RevealBlock>
          </div>
        </section>
      </CurtainWipe>

      {/* FOOTER */}
      <footer className="w-full pt-0 pb-10">
        <div className="px-6 md:px-12 pb-16 md:pb-24 border-t border-[#0F2A43]/20 pt-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.22em] text-[#0F2A43] mb-6">
              Navigation
            </p>
            <ul className="space-y-3 text-[18px] md:text-[20px] font-medium">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="relative inline-block py-0.5 text-[#0F2A43] hover:text-[#0A1622] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0A1622] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.22em] text-[#0F2A43] mb-6">
              Services
            </p>
            <ul className="space-y-3 text-[18px] md:text-[20px] font-medium">
              {SERVICES_LIST.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    onClick={() => onSelectServiceFromFooter(service.id)}
                    className="relative inline-block py-0.5 text-[#0F2A43] hover:text-[#0A1622] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0A1622] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43]"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.22em] text-[#0F2A43] mb-6">
              Contact
            </p>
            <div className="space-y-3 text-[18px] md:text-[20px] font-normal leading-[1.45] text-[#0F2A43]">
              <p>{CONTACT_INFO.addressValue}</p>
              <p>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="relative inline-block py-0.5 text-[#0F2A43] hover:text-[#0A1622] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0A1622] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial"
                >
                  {CONTACT_INFO.phoneValue}
                </a>
              </p>
              <p className="break-all sm:break-normal">
                <a
                  href={CONTACT_INFO.emailHref}
                  className="relative inline-block py-0.5 text-[#0F2A43] hover:text-[#0A1622] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0A1622] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial"
                >
                  {CONTACT_INFO.emailValue}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Giant white PARWAL footer wordmark — full 6 letters uncropped inside viewport on desktop & mobile, 120ms staggered letter rise */}
        <div
          ref={wordmarkRef}
          className="w-full overflow-hidden px-6 md:px-12 pb-8 md:pb-12 select-none"
          aria-hidden="true"
        >
          <div
            data-testid="footer-wordmark"
            data-entered={wordmarkEntered ? 'true' : 'false'}
            className="inline-flex w-fit font-extrabold uppercase text-[#FFFFFF] leading-[0.82] whitespace-nowrap text-[17.5vw] tracking-[-0.04em] md:text-[18.5vw] md:tracking-[-0.03em]"
          >
            {FOOTER_LETTERS.map((letter, idx) => (
              <span
                key={`${letter}-${idx}`}
                data-testid={idx === FOOTER_LETTERS.length - 1 ? 'footer-wordmark-last-letter' : undefined}
                className="inline-block will-change-transform"
                style={{
                  opacity: wordmarkEntered ? 1 : 0,
                  transform: wordmarkEntered ? 'translateY(0%)' : 'translateY(100%)',
                  transition: `transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms, opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar with copyright, ICAI disclaimer, and preview credit */}
        <div className="px-6 md:px-12 pt-6 border-t border-[#0F2A43]/20 flex flex-col gap-4 text-[14px] md:text-[15px] text-[#0F2A43] leading-[1.5]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 font-medium">
            <p>{FOOTER_META.copyright}</p>
            <p>{FOOTER_META.credit}</p>
          </div>
          <p className="text-[12px] md:text-[13px] text-[#0F2A43]/85 max-w-[1100px]">
            {FOOTER_META.icaiDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
