import { ReactNode, useEffect, useRef, useState } from 'react';

interface CurtainWipeProps {
  bgColor: string;
  children: ReactNode;
  className?: string;
  testId?: string;
}

export default function CurtainWipe({
  bgColor,
  children,
  className = '',
  testId,
}: CurtainWipeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [wiped, setWiped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || wiped) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setWiped(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setWiped(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [wiped]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <div
        data-testid={testId}
        data-wiped={wiped ? 'true' : 'false'}
        aria-hidden="true"
        className="absolute inset-0 z-30 pointer-events-none will-change-transform"
        style={{
          backgroundColor: bgColor,
          transform: wiped ? 'translate3d(102%, 0, 0)' : 'translate3d(0%, 0, 0)',
          transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  );
}
