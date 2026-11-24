import { KeyboardEvent, useRef, useState } from 'react';
import { SERVICES_LIST, ServiceItem } from '../data/firmData';
import { stepSpotlightIndex } from '../utils/editorialMath';
import RevealBlock from './RevealBlock';
import SectionLabel from './SectionLabel';

interface ServicesSectionProps {
  activeServiceId: string;
  onSelectService: (id: string) => void;
}

export default function ServicesSection({
  activeServiceId,
  onSelectService,
}: ServicesSectionProps) {
  const [pinnedServiceId, setPinnedServiceId] = useState<string | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeService: ServiceItem =
    SERVICES_LIST.find((s) => s.id === activeServiceId) ?? SERVICES_LIST[0];

  const handleMouseEnterService = (id: string) => {
    if (pinnedServiceId && pinnedServiceId !== id) {
      setPinnedServiceId(null);
    }
    onSelectService(id);
  };

  const handleClickService = (id: string) => {
    setPinnedServiceId(id);
    onSelectService(id);
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const currentIndex = SERVICES_LIST.findIndex((s) => s.id === activeService.id);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = stepSpotlightIndex(currentIndex, SERVICES_LIST.length, 1);
      const nextService = SERVICES_LIST[nextIdx];
      setPinnedServiceId(null);
      onSelectService(nextService.id);
      buttonRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = stepSpotlightIndex(currentIndex, SERVICES_LIST.length, -1);
      const prevService = SERVICES_LIST[prevIdx];
      setPinnedServiceId(null);
      onSelectService(prevService.id);
      buttonRefs.current[prevIdx]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setPinnedServiceId(activeService.id);
    }
  };

  return (
    <section
      id="services"
      className="w-full bg-[#020202] text-[#FFFFFF] pt-10 pb-10 md:pb-12 px-6 md:px-12"
    >
      <div className="w-full">
        <SectionLabel label="SERVICES" />

        <RevealBlock>
          <h2
            className="text-center font-extrabold text-[#FFFFFF] tracking-[-0.03em] leading-[1.15] max-w-[1100px] mx-auto mb-16 md:mb-24"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 5.9375rem)' }}
          >
            Six practices. One standard.
          </h2>
        </RevealBlock>

        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          {/* Left sticky white active service card */}
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 lg:sticky lg:top-16">
            <div
              data-testid="active-service-card"
              data-pinned={pinnedServiceId === activeService.id ? 'true' : 'false'}
              aria-live="polite"
              className="w-full lg:w-[310px] min-h-[280px] lg:min-h-[330px] bg-[#FFFFFF] text-[#020202] p-8 flex flex-col justify-between"
            >
              <div>
                <p className="text-[16px] font-extrabold text-[#0F2A43] tabular-nums tracking-[0.18em] mb-4">
                  {activeService.number}
                </p>
                <h3 className="text-[22px] md:text-[24px] font-extrabold uppercase text-[#020202] tracking-[-0.01em] leading-[1.15] mb-5">
                  {activeService.name}
                </h3>
              </div>

              <p className="text-[17px] md:text-[18px] font-normal text-[#020202] leading-[1.45]">
                {activeService.scope}
              </p>
            </div>
          </div>

          {/* Right hover/tap/keyboard list of 6 services with gold bar sweep on hover */}
          <div className="w-full flex-1">
            <RevealBlock delayMs={80}>
              <ul
                className="w-full divide-y divide-[#FFFFFF]/12"
                role="list"
                onKeyDown={handleListKeyDown}
              >
                {SERVICES_LIST.map((service, idx) => {
                  const isActive = service.id === activeService.id;
                  return (
                    <li key={service.id} className="w-full">
                      <button
                        ref={(el) => {
                          buttonRefs.current[idx] = el;
                        }}
                        type="button"
                        data-testid={`service-item-${service.id}`}
                        onMouseEnter={() => handleMouseEnterService(service.id)}
                        onFocus={() => onSelectService(service.id)}
                        onClick={() => handleClickService(service.id)}
                        aria-pressed={isActive}
                        className="group relative w-full py-6 md:py-8 px-4 md:px-6 flex items-baseline justify-between gap-6 text-left cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
                      >
                        {/* Gold bar sweep from left behind hovered service row */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-[#C9A227] transition-all duration-300 ease-editorial z-0 pointer-events-none"
                        />

                        <div className="relative z-10 flex items-baseline gap-5 md:gap-8">
                          <span
                            className={`inline-block origin-left text-[18px] md:text-[24px] font-extrabold tabular-nums transition-all duration-300 ease-editorial group-hover:scale-[1.3] group-hover:text-[#0F2A43] ${
                              isActive ? 'text-[#C9A227]' : 'text-[#8A8A8A]'
                            }`}
                          >
                            {service.number}
                          </span>
                          <span
                            className={`font-extrabold uppercase tracking-[-0.02em] leading-[1.2] transition-colors duration-300 group-hover:text-[#0F2A43] ${
                              isActive ? 'text-[#FFFFFF]' : 'text-[#8A8A8A]'
                            }`}
                            style={{ fontSize: 'clamp(1.5rem, 2.7vw, 3.125rem)' }}
                          >
                            {service.name}
                          </span>
                        </div>

                        <span
                          aria-hidden="true"
                          className={`relative z-10 text-[28px] md:text-[42px] font-bold leading-none shrink-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-[#0F2A43] ${
                            isActive ? 'opacity-100 text-[#C9A227]' : 'opacity-0'
                          }`}
                        >
                          +
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
