import { CSSProperties, useEffect, useRef, useState } from 'react';

interface RollingNumberProps {
  value: string | number;
  active?: boolean;
  replayTrigger?: number;
  initialZero?: boolean;
  durationMs?: number;
  staggerMs?: number;
  className?: string;
  style?: CSSProperties;
  testId?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default function RollingNumber({
  value,
  active = true,
  replayTrigger = 0,
  initialZero = true,
  durationMs = 600,
  staggerMs = 120,
  className = '',
  style,
  testId,
}: RollingNumberProps) {
  const stringValue = String(value);
  const characters = stringValue.split('');

  const [zeroReset, setZeroReset] = useState<boolean>(false);
  const [skipTransition, setSkipTransition] = useState<boolean>(false);
  const lastReplayRef = useRef<number>(replayTrigger);

  useEffect(() => {
    if (replayTrigger === lastReplayRef.current) return;
    lastReplayRef.current = replayTrigger;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !active) return;

    setSkipTransition(true);
    setZeroReset(true);

    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setSkipTransition(false);
        setZeroReset(false);
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [replayTrigger, active]);

  return (
    <span
      data-testid={testId}
      data-value={stringValue}
      data-rolled={active && !zeroReset ? 'true' : 'false'}
      aria-label={stringValue}
      className={`inline-flex items-baseline tabular-nums leading-none ${className}`}
      style={{
        fontFamily: "'Inter', 'Archivo', sans-serif",
        fontWeight: 800,
        fontStyle: 'normal',
        fontSynthesis: 'none',
        ...style,
      }}
    >
      <span className="sr-only">{stringValue}</span>
      {characters.map((char, idx) => {
        const numericDigit = Number(char);
        if (Number.isNaN(numericDigit)) {
          return (
            <span key={`char-${idx}`} aria-hidden="true" className="inline-block">
              {char}
            </span>
          );
        }

        const displayDigit =
          zeroReset || (!active && initialZero) ? 0 : numericDigit;

        return (
          <span
            key={`digit-slot-${idx}`}
            aria-hidden="true"
            className="inline-block overflow-hidden align-top"
            style={{ height: '1em', lineHeight: 1 }}
          >
            <span
              className="flex flex-col will-change-transform"
              style={{
                transform: `translate3d(0, -${displayDigit * 10}%, 0)`,
                transition: skipTransition
                  ? 'none'
                  : `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * staggerMs}ms`,
              }}
            >
              {DIGITS.map((d) => (
                <span
                  key={d}
                  className="block text-center select-none"
                  style={{ height: '1em', lineHeight: 1 }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
