import { ReactNode, useEffect, useRef, useState } from 'react';

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export default function RevealBlock({
  children,
  className = '',
  delayMs = 0,
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      data-revealed={visible ? 'true' : 'false'}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0px, 0)' : 'translate3d(0, 40px, 0)',
        transition: `opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
