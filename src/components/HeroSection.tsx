import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MANIFESTO_LINES, SPOTLIGHT_PARTNERS } from '../data/firmData';
import {
  computeParallaxOffset,
  computeSpotlightTilt,
  computeWordmarkParallaxOpacity,
  stepSpotlightIndex,
  tokenizeManifestoLines,
} from '../utils/editorialMath';
import SiteHeader from './SiteHeader';

interface HeroSectionProps {
  introDone?: boolean;
}

const HERO_WORDMARK_LETTERS = ['P', 'A', 'R', 'W', 'A', 'L'] as const;

export default function HeroSection({ introDone = true }: HeroSectionProps) {
  const { tokensByLine, totalWords } = useMemo(
    () => tokenizeManifestoLines(MANIFESTO_LINES),
    []
  );

  const [revealedWords, setRevealedWords] = useState<number>(0);
  const [highlightSwept, setHighlightSwept] = useState<boolean>(false);
  const [wordmarkEntered, setWordmarkEntered] = useState<boolean>(false);
  const [underlineSwept, setUnderlineSwept] = useState<boolean>(false);
  const [wordmarkParallax, setWordmarkParallax] = useState<number>(0);
  const [wordmarkOpacity, setWordmarkOpacity] = useState<number>(1);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [isPausedIndicator, setIsPausedIndicator] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({
    rotateX: 0,
    rotateY: 0,
  });

  const isHoveredRef = useRef<boolean>(false);
  const manualPauseUntilRef = useRef<number>(0);
  const pauseIndicatorTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    prefersReducedMotionRef.current =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Post-intro hero wordmark masked letter rise + gold underline sweep, plus manifesto reveal + gold highlight sweep
  useEffect(() => {
    if (!introDone) return;

    if (prefersReducedMotionRef.current) {
      setWordmarkEntered(true);
      setUnderlineSwept(true);
      setRevealedWords(totalWords);
      setHighlightSwept(true);
      return;
    }

    setWordmarkEntered(true);

    const underlineTimer = window.setTimeout(() => {
      setUnderlineSwept(true);
    }, 850);

    let count = 0;
    let highlightTimer: number | null = null;
    const intervalId = window.setInterval(() => {
      count += 1;
      setRevealedWords(count);
      if (count >= totalWords) {
        window.clearInterval(intervalId);
        highlightTimer = window.setTimeout(() => {
          setHighlightSwept(true);
        }, 180);
      }
    }, 80);

    return () => {
      window.clearTimeout(underlineTimer);
      window.clearInterval(intervalId);
      if (highlightTimer !== null) {
        window.clearTimeout(highlightTimer);
      }
    };
  }, [introDone, totalWords]);

  // Visible 0.5x scroll parallax on the hero PARWAL wordmark
  useEffect(() => {
    const updateOnScroll = () => {
      const scrollY = window.scrollY;
      setWordmarkParallax(computeParallaxOffset(scrollY, 0.5, 0, 320));
      setWordmarkOpacity(computeWordmarkParallaxOpacity(scrollY));
    };

    updateOnScroll();
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateOnScroll);
  }, []);

  // Single persistent 4000ms auto-rotation timer created once on mount
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (isHoveredRef.current) return;
      if (Date.now() < manualPauseUntilRef.current) return;
      setSpotlightIndex((prev) => stepSpotlightIndex(prev, SPOTLIGHT_PARTNERS.length, 1));
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
      if (pauseIndicatorTimeoutRef.current !== null) {
        window.clearTimeout(pauseIndicatorTimeoutRef.current);
      }
    };
  }, []);

  const triggerManualPause = useCallback(() => {
    manualPauseUntilRef.current = Date.now() + 10000;
    setIsPausedIndicator(true);
    if (pauseIndicatorTimeoutRef.current !== null) {
      window.clearTimeout(pauseIndicatorTimeoutRef.current);
    }
    pauseIndicatorTimeoutRef.current = window.setTimeout(() => {
      setIsPausedIndicator(isHoveredRef.current);
      pauseIndicatorTimeoutRef.current = null;
    }, 10000);
  }, []);

  const handleSelectSpotlight = useCallback(
    (idx: number) => {
      setSpotlightIndex(idx);
      triggerManualPause();
    },
    [triggerManualPause]
  );

  const handleStepSpotlight = useCallback(
    (delta: number) => {
      setSpotlightIndex((prev) => stepSpotlightIndex(prev, SPOTLIGHT_PARTNERS.length, delta));
      triggerManualPause();
    },
    [triggerManualPause]
  );

  const handleMouseEnterPanel = useCallback(() => {
    isHoveredRef.current = true;
    setIsPausedIndicator(true);
  }, []);

  const handleMouseMovePanel = useCallback((e: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotionRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nextTilt = computeSpotlightTilt(
      e.clientX - rect.left,
      e.clientY - rect.top,
      rect.width,
      rect.height,
      8
    );
    setTilt(nextTilt);
  }, []);

  const handleMouseLeavePanel = useCallback(() => {
    isHoveredRef.current = false;
    setIsPausedIndicator(Date.now() < manualPauseUntilRef.current);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleImageError = useCallback((id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  const activePartner = SPOTLIGHT_PARTNERS[spotlightIndex];

  return (
    <section
      id="top"
      className="relative z-20 w-full min-h-[100svh] bg-[#020202] text-[#FFFFFF] flex flex-col justify-between overflow-x-clip"
    >
      <SiteHeader />

      {/* Main Hero Architectural Grid: balanced asymmetric left & right composition inside 100svh */}
      <div className="w-full flex-1 px-6 md:px-12 pt-3 md:pt-5 pb-6 md:pb-7 xl:pb-9 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] gap-y-5 lg:gap-y-4 lg:gap-x-6 items-start">
        {/* Row 1 Left: Verified Jaipur firm credentials + architectural crosshair */}
        <div
          data-testid="hero-credentials"
          className="order-1 lg:col-start-1 lg:col-span-5 lg:row-start-1 flex flex-col gap-1.5 max-w-[360px] pt-1"
        >
          <span className="text-[11px] sm:text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.24em] text-[#FFFFFF]">
            CHARTERED ACCOUNTANTS
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            C-SCHEME, JAIPUR · EST. 1983
          </span>
          <div className="relative w-full h-px bg-[#FFFFFF]/25 my-1" aria-hidden="true">
            <span className="absolute left-0 -top-1.5 w-px h-3 bg-[#C9A227]" />
            <span className="absolute right-0 -top-1.5 w-px h-3 bg-[#FFFFFF]/60" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFFFFF]/75 tabular-nums">
            43 YEARS · 4 PARTNERS · 6 PRACTICES
          </span>
        </div>

        {/* Row 1 Right: Manifesto block + permanent gold highlight sweep */}
        <div className="order-3 lg:order-none lg:col-start-6 lg:col-span-7 lg:row-start-1 flex lg:justify-end">
          <div
            data-testid="hero-manifesto"
            data-revealed-words={revealedWords}
            data-highlighted={highlightSwept ? 'true' : 'false'}
            className="w-full max-w-[820px] text-left lg:text-right font-bold tracking-[-0.02em]"
            style={{
              fontSize: 'clamp(1.25rem, 1.72vw, 2.25rem)',
              lineHeight: 1.22,
            }}
          >
            {tokensByLine.map((lineTokens, lineIdx) => {
              const isPunchline = lineIdx === tokensByLine.length - 1;

              if (isPunchline) {
                return (
                  <p key={lineIdx} className="m-0 mt-1">
                    <span
                      data-testid="manifesto-punchline"
                      className="inline px-2 py-0.5"
                      style={{
                        backgroundImage: 'linear-gradient(#C9A227, #C9A227)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left center',
                        backgroundSize: highlightSwept ? '100% 100%' : '0% 100%',
                        boxDecorationBreak: 'clone',
                        WebkitBoxDecorationBreak: 'clone',
                        transition:
                          'background-size 800ms cubic-bezier(0.16, 1, 0.3, 1), color 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {lineTokens.map((token, wordIdx) => {
                        const isRevealed = token.globalIndex < revealedWords;
                        const color = highlightSwept
                          ? '#0A1622'
                          : isRevealed
                            ? '#FFFFFF'
                            : '#5C5C5C';
                        return (
                          <span key={token.globalIndex}>
                            <span
                              className="transition-colors duration-300 ease-editorial"
                              style={{ color }}
                            >
                              {token.word}
                            </span>
                            {wordIdx < lineTokens.length - 1 ? ' ' : ''}
                          </span>
                        );
                      })}
                    </span>
                  </p>
                );
              }

              return (
                <p key={lineIdx} className="m-0">
                  {lineTokens.map((token, wordIdx) => {
                    const isRevealed = token.globalIndex < revealedWords;
                    return (
                      <span key={token.globalIndex}>
                        <span
                          className="transition-colors duration-300 ease-editorial"
                          style={{ color: isRevealed ? '#FFFFFF' : '#5C5C5C' }}
                        >
                          {token.word}
                        </span>
                        {wordIdx < lineTokens.length - 1 ? ' ' : ''}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        </div>

        {/* Row 2 Left (centered in mid-left void): Rotating circular seal + firm founding line + practices anchor */}
        <div
          data-testid="hero-left-anchor"
          className="order-2 lg:order-none lg:col-start-1 lg:col-span-6 lg:row-start-2 lg:self-center flex items-center gap-5 sm:gap-7 py-1 lg:py-4"
        >
          <div
            data-testid="rotating-seal"
            aria-hidden="true"
            className="relative w-[84px] h-[84px] sm:w-[104px] sm:h-[104px] lg:w-[clamp(96px,12.5vh,140px)] lg:h-[clamp(96px,12.5vh,140px)] shrink-0 flex items-center justify-center select-none pointer-events-none"
          >
            <svg
              viewBox="0 0 140 140"
              className="w-full h-full animate-spin-20s will-change-transform"
            >
              <defs>
                <path
                  id="parwalBadgeRing"
                  d="M 70, 70 m -52, 0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
                />
              </defs>
              <text
                fill="#FFFFFF"
                fontSize="11.5"
                fontWeight="700"
                letterSpacing="3.4"
                className="uppercase"
              >
                <textPath href="#parwalBadgeRing" startOffset="0%">
                  PARWAL • SINCE 1983 • TRUSTED •
                </textPath>
              </text>
            </svg>
            <span className="absolute w-[12px] h-[12px] rounded-full bg-[#C9A227]" />
          </div>

          <div className="flex flex-col items-start gap-2.5 max-w-[380px]">
            <p className="text-[14px] sm:text-[16px] xl:text-[18px] font-medium text-[#FFFFFF]/90 leading-[1.4] m-0">
              Founded in 1983 by CA (Dr.) Kailash Chandra Parwal as K. C. Parwal &amp; Co.
            </p>
            <a
              href="#services"
              className="group relative inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#C9A227] hover:text-[#FFFFFF] transition-colors duration-300 ease-editorial py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#C9A227] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
            >
              <span>[ SIX PRACTICES</span>
              <span className="inline-block transition-transform duration-300 ease-editorial group-hover:translate-y-[3px]">
                ↓
              </span>
              <span>]</span>
            </a>
          </div>
        </div>

        {/* Row 3 Left: Giant PARWAL wordmark (0.5x scroll parallax + masked letter rise + gold underline) */}
        <div className="order-4 lg:order-none lg:col-start-1 lg:col-span-7 lg:row-start-3 lg:self-end relative z-[5] w-full lg:w-auto lg:min-w-0 shrink-0 pointer-events-none">
          <h1
            data-testid="hero-wordmark"
            data-entered={wordmarkEntered ? 'true' : 'false'}
            className="inline-block font-extrabold uppercase text-[#FFFFFF] tracking-[-0.04em] leading-[0.82] select-none m-0 will-change-transform text-[15.2vw] sm:text-[13.5vw] lg:text-[11.2vw] xl:text-[12.5vw] 2xl:text-[240px]"
            style={{
              transform: `translate3d(0, ${wordmarkParallax}px, 0)`,
              opacity: wordmarkOpacity,
            }}
          >
            <span className="inline-flex items-baseline overflow-hidden">
              {HERO_WORDMARK_LETTERS.map((letter, idx) => (
                <span
                  key={`${letter}-${idx}`}
                  className="inline-block will-change-transform"
                  style={{
                    transform: wordmarkEntered ? 'translateY(0%)' : 'translateY(105%)',
                    transition: `transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 90}ms`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
            <span
              data-testid="hero-wordmark-underline"
              data-swept={underlineSwept ? 'true' : 'false'}
              aria-hidden="true"
              className="block h-[3px] bg-[#C9A227] mt-3 md:mt-4 origin-left"
              style={{
                transform: underlineSwept ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </h1>
        </div>

        {/* Row 2-3 Right: True vertical 4:5 portrait frame + 3D cursor tilt */}
        <aside
          aria-label="Partner spotlight"
          data-testid="hero-spotlight"
          data-paused={isPausedIndicator ? 'true' : 'false'}
          onMouseEnter={handleMouseEnterPanel}
          onMouseMove={handleMouseMovePanel}
          onMouseLeave={handleMouseLeavePanel}
          className="order-5 lg:order-none lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:row-span-2 lg:self-end lg:justify-self-end relative z-10 w-full max-w-[342px] sm:max-w-[380px] lg:max-w-none lg:w-auto lg:h-[clamp(370px,54vh,575px)] aspect-[4/5] mx-auto lg:mx-0 bg-[#0F2A43] border-2 border-[#C9A227] overflow-hidden flex flex-col justify-between shrink-0 will-change-transform"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Full-bleed portrait photo stack with 600ms cross-fade + 4s Ken Burns zoom (1.0 -> 1.15) */}
          {SPOTLIGHT_PARTNERS.map((partner, idx) => {
            const isActive = idx === spotlightIndex;
            const hasFailed = Boolean(failedImages[partner.id]);

            return (
              <div
                key={partner.id}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-600 ease-editorial ${
                  isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {hasFailed ? (
                  <div className="w-full h-full bg-[#0F2A43] flex items-center justify-center">
                    <span
                      className="font-extrabold uppercase text-[#C9A227] tracking-[-0.04em] select-none"
                      style={{ fontSize: 'clamp(4.5rem, 9vw, 8.5rem)' }}
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
                      isActive ? 'animate-ken-burns-4s' : ''
                    }`}
                  />
                )}
              </div>
            );
          })}

          {/* Subtle top navy gradient for control contrast */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0A1622]/85 via-[#0A1622]/35 to-transparent z-[2] pointer-events-none"
          />

          {/* Bottom navy gradient holding full-opacity white typography cleanly below face */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#0A1622] via-[#0F2A43]/90 to-transparent z-[2] pointer-events-none"
          />

          {/* Top control strip: gold counter + prev/01-04/next buttons */}
          <div className="relative z-10 p-3 sm:p-4 xl:p-5 flex items-center justify-between gap-2">
            <span
              data-testid="spotlight-counter"
              className="text-[11px] xl:text-[13px] font-bold uppercase tracking-[0.14em] xl:tracking-[0.18em] text-[#C9A227] tabular-nums whitespace-nowrap shrink-0 bg-[#0A1622]/85 px-2 xl:px-2.5 py-1 xl:py-1.5"
            >
              0{spotlightIndex + 1} / 0{SPOTLIGHT_PARTNERS.length}
            </span>

            <div
              className="flex items-center gap-0.5 shrink-0 bg-[#0A1622]/85 p-0.5 xl:p-1"
              role="group"
              aria-label="Spotlight partner selector"
            >
              <button
                type="button"
                data-testid="spotlight-prev"
                onClick={() => handleStepSpotlight(-1)}
                aria-label="Previous partner"
                className="min-w-[24px] xl:min-w-[30px] min-h-[30px] xl:min-h-[34px] px-1 text-[13px] font-extrabold text-[#FFFFFF] hover:bg-[#C9A227]/25 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
              >
                ←
              </button>

              {SPOTLIGHT_PARTNERS.map((partner, idx) => {
                const isCurrent = idx === spotlightIndex;
                return (
                  <button
                    key={partner.id}
                    type="button"
                    data-testid={`spotlight-btn-0${idx + 1}`}
                    onClick={() => handleSelectSpotlight(idx)}
                    aria-label={`Show ${partner.name}`}
                    aria-pressed={isCurrent}
                    className={`min-w-[24px] xl:min-w-[30px] min-h-[30px] xl:min-h-[34px] px-1 text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.04em] tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227] ${
                      isCurrent
                        ? 'bg-[#C9A227] text-[#0A1622]'
                        : 'bg-transparent text-[#FFFFFF] hover:bg-[#C9A227]/25'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                );
              })}

              <button
                type="button"
                data-testid="spotlight-next"
                onClick={() => handleStepSpotlight(1)}
                aria-label="Next partner"
                className="min-w-[24px] xl:min-w-[30px] min-h-[30px] xl:min-h-[34px] px-1 text-[13px] font-extrabold text-[#FFFFFF] hover:bg-[#C9A227]/25 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
              >
                →
              </button>
            </div>
          </div>

          {/* Partner copy rendered at full opacity (1) from the very first frame */}
          <div className="relative z-10 p-4 sm:p-5 xl:p-6 pt-2 opacity-100">
            <p
              data-testid="spotlight-partner-role"
              className="text-[11px] xl:text-[13px] font-bold uppercase tracking-[0.18em] text-[#FFFFFF] mb-1 opacity-100"
            >
              {activePartner.role}
            </p>
            <h2
              data-testid="spotlight-partner-name"
              className="font-extrabold uppercase text-[#FFFFFF] tracking-[-0.025em] leading-[1.04] mb-1.5 opacity-100"
              style={{ fontSize: 'clamp(1.25rem, 1.85vw, 2.25rem)' }}
            >
              {activePartner.name}
            </h2>
            <p
              data-testid="spotlight-partner-tenure"
              className="text-[12px] xl:text-[14px] font-bold uppercase tracking-[0.2em] text-[#C9A227] tabular-nums opacity-100"
            >
              {activePartner.tenure}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
