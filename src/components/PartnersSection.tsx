import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { PARTNER_PROFILES, PartnerProfile } from '../data/firmData';
import { computeParallaxOffset, stepSpotlightIndex } from '../utils/editorialMath';
import CurtainWipe from './CurtainWipe';
import RevealBlock from './RevealBlock';
import SectionLabel from './SectionLabel';

export default function PartnersSection() {
  const [activePartnerId, setActivePartnerId] = useState<string>(PARTNER_PROFILES[0].id);
  const [autoStopped, setAutoStopped] = useState<boolean>(false);
  const [wordmarkParallax, setWordmarkParallax] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const introRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const autoStoppedRef = useRef<boolean>(false);

  const activeIndex = Math.max(
    0,
    PARTNER_PROFILES.findIndex((p) => p.id === activePartnerId)
  );
  const activePartner: PartnerProfile = PARTNER_PROFILES[activeIndex];

  // Single 6000ms auto-rotate interval created once on mount while explorer is idle
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (autoStoppedRef.current) return;
      setActivePartnerId((prevId) => {
        const currIdx = Math.max(
          0,
          PARTNER_PROFILES.findIndex((p) => p.id === prevId)
        );
        const nextIdx = stepSpotlightIndex(currIdx, PARTNER_PROFILES.length, 1);
        return PARTNER_PROFILES[nextIdx].id;
      });
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, []);

  // Gentle desktop-only parallax on PARTNERS wordmark (~5% kiss at bottom on desktop, 0% crop on mobile)
  useEffect(() => {
    const updateParallax = () => {
      if (window.innerWidth < 768) {
        setWordmarkParallax(0);
        return;
      }
      const el = introRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollProgressDelta = window.innerHeight * 0.45 - rect.top;
      setWordmarkParallax(computeParallaxOffset(scrollProgressDelta, 0.14, -8, 6));
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  const stopAutoAndSelect = useCallback((id: string) => {
    autoStoppedRef.current = true;
    setAutoStopped(true);
    setActivePartnerId(id);
  }, []);

  const handleExplorerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = stepSpotlightIndex(activeIndex, PARTNER_PROFILES.length, 1);
      stopAutoAndSelect(PARTNER_PROFILES[nextIdx].id);
      tileRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = stepSpotlightIndex(activeIndex, PARTNER_PROFILES.length, -1);
      stopAutoAndSelect(PARTNER_PROFILES[prevIdx].id);
      tileRefs.current[prevIdx]?.focus();
    }
  };

  const handleImageError = useCallback((id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  return (
    <section id="partners" className="w-full">
      {/* Black intro band with left-to-right curtain reveal & ~5% bottom-kissed PARTNERS wordmark */}
      <CurtainWipe bgColor="#020202" testId="curtain-partners">
        <div
          ref={introRef}
          className="w-full bg-[#020202] text-[#FFFFFF] pt-8 md:pt-10 px-6 md:px-12 overflow-hidden"
        >
          <SectionLabel label="PARTNERS" />

          <RevealBlock>
            <h2
              className="text-center font-extrabold text-[#FFFFFF] tracking-[-0.03em] leading-[1.15] max-w-[1100px] mx-auto mb-12 md:mb-20"
              style={{ fontSize: 'clamp(2.5rem, 5.2vw, 5.9375rem)' }}
            >
              The firm is its people.
            </h2>
          </RevealBlock>

          <div className="w-full pt-2 md:pt-4 pb-6 md:pb-0 select-none" aria-hidden="true">
            <div
              data-testid="partners-wordmark"
              className="font-extrabold uppercase text-[#FFFFFF] tracking-[-0.04em] md:tracking-[-0.045em] leading-[0.88] md:leading-[0.84] mb-0 md:-mb-[0.105em] whitespace-nowrap will-change-transform text-[13.2vw] md:text-[15.6vw]"
              style={{
                transform: `translate3d(0, ${wordmarkParallax}px, 0)`,
              }}
            >
              PARTNERS
            </div>
          </div>
        </div>
      </CurtainWipe>

      {/* White partner explorer band */}
      <div
        data-testid="partner-explorer"
        data-auto-stopped={autoStopped ? 'true' : 'false'}
        className="w-full bg-[#FFFFFF] text-[#020202] pt-16 md:pt-24 pb-10 px-6 md:px-12"
      >
        <div className="w-full flex flex-col lg:flex-row items-start justify-start gap-10 lg:gap-12">
          {/* Left: Featured partner portrait (~610x690px) with 400ms cross-fade + 6s Ken Burns zoom (1.0 -> 1.15) */}
          <div
            data-testid="featured-partner-panel"
            aria-live="off"
            className="relative w-full lg:w-[610px] h-[440px] sm:h-[560px] lg:h-[690px] bg-[#0F2A43] overflow-hidden shrink-0"
          >
            {PARTNER_PROFILES.map((partner) => {
              const isCurrent = partner.id === activePartner.id;
              const hasFailed = Boolean(failedImages[partner.id]);

              return (
                <div
                  key={partner.id}
                  aria-hidden={!isCurrent}
                  className={`absolute inset-0 transition-opacity duration-400 ease-editorial ${
                    isCurrent ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {hasFailed ? (
                    <div
                      data-testid="featured-partner-monogram"
                      className="w-full h-full bg-[#0F2A43] flex items-center justify-center p-10"
                    >
                      <span
                        className="font-extrabold uppercase text-[#C9A227] tracking-[-0.04em] leading-[0.84] select-none"
                        style={{ fontSize: 'clamp(4.75rem, 12vw, 13rem)' }}
                      >
                        {partner.monogram}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={partner.photoUrl}
                      alt={`${partner.name}, ${partner.role}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(partner.id)}
                      style={{ transformOrigin: 'center 22%' }}
                      className={`w-full h-full object-cover object-top will-change-transform ${
                        isCurrent ? 'animate-ken-burns-6s' : ''
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: White-background partner details + compact scattered 4 portrait thumbnails */}
          <div className="w-full flex-1 flex flex-col justify-between gap-8 lg:gap-10 lg:pt-1">
            {/* Active partner details on white with 400ms cross-fade */}
            <div
              key={activePartner.id}
              aria-live="polite"
              className="space-y-3.5 animate-editorial-fade"
            >
              <h3
                data-testid="featured-partner-name"
                className="font-extrabold uppercase text-[#0F2A43] tracking-[-0.03em] leading-[0.95]"
                style={{ fontSize: 'clamp(2.25rem, 4.7vw, 5.625rem)' }}
              >
                {activePartner.name}
              </h3>

              <p className="text-[18px] sm:text-[22px] md:text-[26px] font-bold text-[#0F2A43] leading-[1.3]">
                {activePartner.role} · {activePartner.tenure}
              </p>

              <p className="text-[17px] sm:text-[20px] md:text-[24px] font-normal text-[#0F2A43] leading-[1.45] max-w-[680px]">
                {activePartner.practice}
              </p>
            </div>

            {/* Compact irregular-stagger portrait thumbnail explorer */}
            <div>
              <p className="text-[15px] md:text-[18px] font-bold uppercase tracking-[0.22em] text-[#0F2A43] mb-4 lg:mb-5">
                SELECT PARTNER
              </p>

              <div
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-x-5 lg:gap-y-4 max-w-[330px] sm:max-w-none lg:max-w-[330px] items-start"
                role="group"
                aria-label="Partner portrait explorer"
                onKeyDown={handleExplorerKeyDown}
              >
                {PARTNER_PROFILES.map((partner, idx) => {
                  const isSelected = partner.id === activePartner.id;
                  const hasFailed = Boolean(failedImages[partner.id]);

                  return (
                    <button
                      key={partner.id}
                      ref={(el) => {
                        tileRefs.current[idx] = el;
                      }}
                      type="button"
                      data-testid={`partner-tile-${partner.id}`}
                      onMouseEnter={() => stopAutoAndSelect(partner.id)}
                      onFocus={() => setActivePartnerId(partner.id)}
                      onClick={() => stopAutoAndSelect(partner.id)}
                      aria-label={`${partner.name}, ${partner.role}`}
                      aria-pressed={isSelected}
                      className={`relative w-[125px] sm:w-[130px] h-[165px] sm:h-[185px] bg-[#0F2A43] overflow-hidden text-left cursor-pointer transition-all duration-300 ease-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43] ${
                        partner.offsetClass
                      } ${
                        isSelected
                          ? 'border-2 border-[#C9A227]'
                          : 'border-2 border-transparent opacity-90 hover:opacity-100'
                      }`}
                    >
                      {hasFailed ? (
                        <div className="w-full h-full bg-[#0F2A43] p-4 flex flex-col justify-between text-[#C9A227]">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                            {partner.tenure}
                          </span>
                          <span className="text-[36px] font-extrabold uppercase tracking-[-0.03em] leading-none">
                            {partner.monogram}
                          </span>
                        </div>
                      ) : (
                        <>
                          <img
                            src={partner.photoUrl}
                            alt={partner.name}
                            referrerPolicy="no-referrer"
                            onError={() => handleImageError(partner.id)}
                            className="w-full h-full object-cover object-top"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A1622] via-[#0A1622]/75 to-transparent"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-baseline justify-between gap-1.5 whitespace-nowrap">
                            <span className="text-[13px] font-extrabold uppercase tracking-[0.03em] text-[#FFFFFF]">
                              {partner.monogram}
                            </span>
                            <span
                              className={`text-[9.5px] font-bold uppercase tracking-[0.08em] tabular-nums ${
                                isSelected ? 'text-[#C9A227]' : 'text-[#FFFFFF]/85'
                              }`}
                            >
                              {partner.tenure}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
