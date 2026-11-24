import { useEffect, useRef, useState } from 'react';

interface SectionLabelProps {
  label: string;
  textColorClass?: string;
  className?: string;
}

export default function SectionLabel({
  label,
  textColorClass = 'text-[#FFFFFF]',
  className = 'mb-8',
}: SectionLabelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasDrawn) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setHasDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasDrawn]);

  return (
    <div ref={containerRef} className={`flex flex-col items-center ${className}`}>
      <p
        className={`text-center text-[18px] md:text-[28px] font-semibold uppercase tracking-[0.28em] ${textColorClass}`}
      >
        {label}
      </p>
      <div className="w-[60px] h-[2px] mt-4 overflow-hidden" aria-hidden="true">
        <span
          data-testid={`section-rule-${label.toLowerCase().replace(/\s+/g, '-')}`}
          data-drawn={hasDrawn ? 'true' : 'false'}
          className="block h-[2px] bg-[#C9A227]"
          style={{
            width: hasDrawn ? '60px' : '0px',
            transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
}
