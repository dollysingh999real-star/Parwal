import { useEffect, useState } from 'react';
import { computeScrollProgress } from '../utils/editorialMath';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const next = computeScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
      setProgress(next);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      data-testid="reading-progress-bar"
      data-progress={progress.toFixed(3)}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none bg-transparent"
    >
      <div
        className="h-full w-full bg-[#C9A227] origin-left will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
