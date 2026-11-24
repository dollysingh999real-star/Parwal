import { CSSProperties, useEffect, useState } from 'react';

interface IntroOverlayProps {
  skipIntro?: boolean;
  onComplete?: () => void;
}

const INTRO_LETTERS = [
  { char: 'P', ix: '-18vw', iy: '-42vh', ir: '-22deg', is: '1.25' },
  { char: 'A', ix: '-6vw', iy: '-60vh', ir: '16deg', is: '1.3' },
  { char: 'R', ix: '10vw', iy: '-34vh', ir: '-14deg', is: '1.15' },
  { char: 'W', ix: '22vw', iy: '-56vh', ir: '20deg', is: '1.25' },
  { char: 'A', ix: '34vw', iy: '-26vh', ir: '-18deg', is: '1.2' },
  { char: 'L', ix: '44vw', iy: '-48vh', ir: '14deg', is: '1.3' },
] as const;

export default function IntroOverlay({ skipIntro = false, onComplete }: IntroOverlayProps) {
  const [done, setDone] = useState<boolean>(() => skipIntro);

  useEffect(() => {
    if (skipIntro) {
      onComplete?.();
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDone(true);
      onComplete?.();
      return;
    }

    const doneTimer = window.setTimeout(() => {
      setDone(true);
      onComplete?.();
    }, 2050);

    return () => {
      window.clearTimeout(doneTimer);
    };
  }, [skipIntro, onComplete]);

  if (done) {
    return null;
  }

  return (
    <div
      data-testid="intro-overlay"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden pointer-events-none bg-[#0F2A43] animate-intro-overlay"
    >
      <div className="w-full px-6 md:px-12 pb-[38px]">
        <div
          className="flex items-baseline font-extrabold uppercase text-[#FFFFFF] select-none tracking-[-0.04em] leading-[0.82]"
          style={{ fontSize: 'clamp(3.75rem, 12.2vw, 13.75rem)' }}
        >
          {INTRO_LETTERS.map((item, idx) => {
            const letterStyle = {
              '--ix': item.ix,
              '--iy': item.iy,
              '--ir': item.ir,
              '--is': item.is,
              animationDelay: `${idx * 45}ms`,
            } as CSSProperties;

            return (
              <span
                key={`${item.char}-${idx}`}
                className="inline-block will-change-transform animate-intro-letter"
                style={letterStyle}
              >
                {item.char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
