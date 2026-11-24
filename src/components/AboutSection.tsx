import { useEffect, useRef, useState } from 'react';
import { ABOUT_STATS, ABOUT_STORY_LINES, CORE_VALUES } from '../data/firmData';
import RevealBlock from './RevealBlock';
import RollingNumber from './RollingNumber';
import SectionLabel from './SectionLabel';

export default function AboutSection() {
  const statsContainerRef = useRef<HTMLDivElement | null>(null);
  const [statsActive, setStatsActive] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replayNonces, setReplayNonces] = useState<Record<string, number>>({
    years: 0,
    partners: 0,
    practices: 0,
  });

  useEffect(() => {
    const el = statsContainerRef.current;
    if (!el || statsActive) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setStatsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [statsActive]);

  const handleCardHoverReplay = (id: string) => {
    setReplayNonces((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="about"
      className="relative z-10 w-full bg-[#020202] text-[#FFFFFF] pt-24 md:pt-36 pb-10 px-6 md:px-12"
    >
      <div className="w-full">
        <SectionLabel label="ABOUT US" />

        <RevealBlock>
          <h2
            className="text-center font-extrabold text-[#FFFFFF] tracking-[-0.03em] leading-[1.15] max-w-[1100px] mx-auto mb-16 md:mb-24"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 5.9375rem)' }}
          >
            Built on Trust
            <br />
            Since 1983
          </h2>
        </RevealBlock>

        {/* Three smaller interactive white stat cards in one centred row (~360x260px desktop, stacked mobile) */}
        <RevealBlock delayMs={80}>
          <div
            ref={statsContainerRef}
            data-testid="stat-cards-row"
            className="w-full flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 lg:gap-[40px] mb-20 md:mb-28"
          >
            {ABOUT_STATS.map((stat) => {
              const isExpanded = expandedId === stat.id;
              return (
                <button
                  key={stat.id}
                  type="button"
                  data-testid={`stat-card-${stat.id}`}
                  aria-expanded={isExpanded}
                  onMouseEnter={() => handleCardHoverReplay(stat.id)}
                  onClick={() => handleToggleExpand(stat.id)}
                  className="group relative w-full max-w-[360px] lg:w-[360px] min-h-[260px] bg-[#FFFFFF] text-[#020202] p-7 sm:p-8 flex flex-col justify-between text-left cursor-pointer border-t-2 border-transparent hover:border-[#C9A227] transition-all duration-400 ease-editorial lg:hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
                >
                  {/* Thin crosshair line above number */}
                  <div className="w-full pt-1 mb-5" aria-hidden="true">
                    <div className="relative w-full h-px bg-[#020202]/25">
                      <span className="absolute left-0 -top-2 w-px h-4 bg-[#020202]" />
                      <span className="absolute right-0 -top-2 w-px h-4 bg-[#020202]" />
                    </div>
                  </div>

                  {/* Rolling odometer ~120px upright numeral */}
                  <div className="my-2">
                    <RollingNumber
                      testId={`stat-value-${stat.id}`}
                      value={stat.target}
                      active={statsActive}
                      replayTrigger={replayNonces[stat.id]}
                      durationMs={650}
                      staggerMs={120}
                      className="text-[#020202] tracking-[-0.05em]"
                      style={{
                        fontSize: 'clamp(5.25rem, 6.25vw, 7.5rem)',
                      }}
                    />
                  </div>

                  <div className="w-full flex items-baseline justify-between gap-4 mt-3">
                    <p className="text-[20px] md:text-[24px] font-normal text-[#020202] leading-tight m-0">
                      {stat.caption}
                    </p>
                    <span
                      aria-hidden="true"
                      className="text-[20px] font-bold text-[#0F2A43] transition-transform duration-300 ease-editorial"
                    >
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>

                  {/* Smooth ~400ms downward expansion detail */}
                  <div
                    data-testid={`stat-detail-${stat.id}`}
                    className="grid transition-all duration-400 ease-editorial w-full"
                    style={{
                      gridTemplateRows: isExpanded ? '1fr' : '0fr',
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-4 mt-4 border-t border-[#020202]/15 space-y-1.5 text-[15px] leading-[1.45] text-[#0F2A43] font-medium">
                        {stat.details.map((line, lineIdx) => (
                          <p key={lineIdx} className="m-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </RevealBlock>

        {/* Two short lines of the story */}
        <RevealBlock>
          <div className="max-w-[1040px] mx-auto text-center space-y-5 mb-20 md:mb-28">
            {ABOUT_STORY_LINES.map((line, index) => (
              <p
                key={index}
                className="font-normal text-[#FFFFFF] leading-[1.45]"
                style={{ fontSize: 'clamp(1.25rem, 1.6vw, 1.75rem)' }}
              >
                {line}
              </p>
            ))}
          </div>
        </RevealBlock>

        {/* Five core values as a numbered list with smooth 300ms gold + shift hover */}
        <RevealBlock>
          <div className="max-w-[1160px] mx-auto">
            <ol className="divide-y divide-[#FFFFFF]/15">
              {CORE_VALUES.map((val) => (
                <li
                  key={val.number}
                  className="group py-7 md:py-9 flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10 transition-transform duration-300 ease-editorial hover:translate-x-[8px]"
                >
                  <span
                    className="font-extrabold text-[#C9A227] tabular-nums shrink-0 tracking-[0.06em] transition-colors duration-300"
                    style={{ fontSize: 'clamp(1.25rem, 1.6vw, 1.75rem)' }}
                  >
                    {val.number}
                  </span>
                  <span
                    className="font-extrabold uppercase text-[#FFFFFF] group-hover:text-[#C9A227] tracking-[0.04em] md:w-[320px] shrink-0 transition-colors duration-300"
                    style={{ fontSize: 'clamp(1.25rem, 1.6vw, 1.75rem)' }}
                  >
                    {val.name}
                  </span>
                  <span
                    className="font-normal text-[#FFFFFF]/90 leading-[1.4]"
                    style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.75rem)' }}
                  >
                    {val.description}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
