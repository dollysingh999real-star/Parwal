import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { STORY_MILESTONES, StoryMilestone } from '../data/firmData';
import { computeStoryMilestoneIndex, stepSpotlightIndex } from '../utils/editorialMath';
import RevealBlock from './RevealBlock';
import RollingNumber from './RollingNumber';
import SectionLabel from './SectionLabel';

export default function StorySection() {
  const [activeId, setActiveId] = useState<string>(STORY_MILESTONES[0].id);
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastScrollIdxRef = useRef<number>(0);

  const activeIndex = Math.max(
    0,
    STORY_MILESTONES.findIndex((m) => m.id === activeId)
  );
  const activeMilestone: StoryMilestone = STORY_MILESTONES[activeIndex];
  const isNumericYear = activeMilestone.id === '1983' || activeMilestone.id === '2003';

  useEffect(() => {
    const updateOnScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only update automatically when section is near/inside the viewport
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const nextIdx = computeStoryMilestoneIndex(
        rect.top,
        window.innerHeight,
        STORY_MILESTONES.length
      );
      if (nextIdx !== lastScrollIdxRef.current) {
        lastScrollIdxRef.current = nextIdx;
        setActiveId(STORY_MILESTONES[nextIdx].id);
      }
    };

    window.addEventListener('scroll', updateOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateOnScroll);
  }, []);

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = stepSpotlightIndex(activeIndex, STORY_MILESTONES.length, 1);
      setActiveId(STORY_MILESTONES[nextIdx].id);
      tabRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = stepSpotlightIndex(activeIndex, STORY_MILESTONES.length, -1);
      setActiveId(STORY_MILESTONES[prevIdx].id);
      tabRefs.current[prevIdx]?.focus();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="story"
      className="w-full bg-[#FFFFFF] text-[#020202] pt-10 pb-24 md:pb-32 px-6 md:px-12"
    >
      <div className="w-full">
        <SectionLabel label="OUR STORY" textColorClass="text-[#020202]" className="mb-14 md:mb-20" />

        <RevealBlock>
          {/* Years row (1983 / 2003 / TODAY) */}
          <div
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 md:gap-24 mb-6"
            role="tablist"
            aria-label="Firm milestones"
            onKeyDown={handleTabKeyDown}
          >
            {STORY_MILESTONES.map((milestone, idx) => {
              const isActive = milestone.id === activeMilestone.id;
              return (
                <button
                  key={milestone.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  data-testid={`story-tab-${milestone.id}`}
                  aria-selected={isActive}
                  onClick={() => setActiveId(milestone.id)}
                  className={`min-h-[48px] px-2 font-extrabold uppercase tracking-[-0.02em] tabular-nums cursor-pointer transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A43] ${
                    isActive ? 'text-[#020202]' : 'text-[#9A9A9A] hover:text-[#020202]'
                  }`}
                  style={{ fontSize: 'clamp(1.75rem, 2.8vw, 3.125rem)' }}
                >
                  {milestone.yearLabel}
                </button>
              );
            })}
          </div>
        </RevealBlock>

        {/* 3 small progress dots under the years row */}
        <div
          data-testid="story-progress-dots"
          className="flex items-center justify-center gap-4 mb-16 md:mb-24"
          aria-hidden="true"
        >
          {STORY_MILESTONES.map((milestone) => {
            const isActive = milestone.id === activeMilestone.id;
            return (
              <span
                key={milestone.id}
                data-active={isActive ? 'true' : 'false'}
                className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  isActive ? 'bg-[#C9A227]' : 'bg-[#5C5C5C]/40'
                }`}
              />
            );
          })}
        </div>

        <RevealBlock delayMs={80}>
          {/* Selected giant year (rolling odometer 1983 <-> 2003, cross-fade TODAY) + right text block */}
          <div
            data-testid="story-display"
            aria-live="polite"
            className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16 pt-4"
          >
            <div
              data-testid="story-active-year"
              className="font-extrabold uppercase text-[#020202] tracking-[-0.05em] leading-[0.84] tabular-nums select-none shrink-0 max-w-full text-[13.5vw] sm:text-[14vw] lg:text-[clamp(7rem,16.5vw,21.875rem)]"
            >
              {isNumericYear ? (
                <RollingNumber
                  testId="story-odometer"
                  value={activeMilestone.displayYear}
                  active={true}
                  initialZero={false}
                  durationMs={600}
                  staggerMs={100}
                  style={{
                    fontFamily: "'Archivo', system-ui, sans-serif",
                    fontSize: 'inherit',
                  }}
                />
              ) : (
                <span key="today" className="inline-block animate-editorial-fade">
                  {activeMilestone.displayYear}
                </span>
              )}
            </div>

            <div className="w-full lg:max-w-[540px] xl:max-w-[620px] pb-2">
              <h3
                key={activeMilestone.id}
                data-testid="story-active-lead"
                className="font-bold text-[#020202] tracking-[-0.02em] leading-[1.2] animate-editorial-fade"
                style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.5rem)' }}
              >
                {activeMilestone.lead}
              </h3>
            </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
