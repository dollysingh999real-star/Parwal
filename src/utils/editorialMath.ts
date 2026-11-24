/**
 * Pure deterministic editorial & scroll math helpers for Parwal & Associates.
 */

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Computes normalized page scroll progress in [0, 1] for the reading hairline.
 */
export function computeScrollProgress(
  scrollY: number,
  scrollHeight: number,
  innerHeight: number
): number {
  const maxScroll = scrollHeight - innerHeight;
  if (maxScroll <= 0) return 0;
  return clampNumber(scrollY / maxScroll, 0, 1);
}

/**
 * Computes subtle vertical parallax translation (px) so giant wordmarks move up
 * slower than page scroll without overlapping adjacent content.
 */
export function computeParallaxOffset(
  deltaPx: number,
  factor = 0.3,
  minPx = -40,
  maxPx = 90
): number {
  return clampNumber(deltaPx * factor, minPx, maxPx);
}

/**
 * Computes active story milestone index (0, 1, 2) from #story section top offset.
 * Landing at #story (sectionTop = 0) starts at 1983, then advances 2003 -> TODAY as the user scrolls down.
 */
export function computeStoryMilestoneIndex(
  sectionTop: number,
  _viewportHeight: number,
  totalMilestones = 3
): number {
  if (totalMilestones <= 1) return 0;
  if (sectionTop > -40) return 0;
  if (sectionTop > -220) return Math.min(1, totalMilestones - 1);
  return totalMilestones - 1;
}

/**
 * Computes how many words in the manifesto are revealed (white) at a given scrollY.
 * Starts with `initialLitWords` revealed at scrollY <= 0 so the first phrase reads immediately,
 * and progressively reveals the remaining words up to `totalWords` by `scrollRangePx`.
 */
export function computeRevealedWordCount(
  scrollY: number,
  totalWords: number,
  scrollRangePx = 380,
  initialLitWords = 3
): number {
  if (totalWords <= 0) return 0;
  const safeInitial = clampNumber(initialLitWords, 0, totalWords);
  if (scrollRangePx <= 0) return totalWords;
  const progress = clampNumber(scrollY / scrollRangePx, 0, 1);
  const remaining = totalWords - safeInitial;
  return Math.min(totalWords, safeInitial + Math.floor(progress * remaining + 0.0001));
}

/**
 * Cubic ease-out curve for architectural scroll counters.
 */
export function easeOutCubic(t: number): number {
  const clamped = clampNumber(t, 0, 1);
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Computes an integer counter value at normalized progress t in [0, 1].
 */
export function computeCounterValue(target: number, progress: number): number {
  if (target <= 0) return 0;
  const eased = easeOutCubic(progress);
  return Math.round(eased * target);
}

/**
 * Cycles index cleanly forward or backward.
 */
export function stepSpotlightIndex(
  currentIndex: number,
  totalItems: number,
  delta = 1
): number {
  if (totalItems <= 0) return 0;
  return (((currentIndex + delta) % totalItems) + totalItems) % totalItems;
}

/**
 * Splits manifesto lines into flat indexed word tokens preserving line breaks.
 */
export interface ManifestoWordToken {
  word: string;
  lineIndex: number;
  globalIndex: number;
}

export function tokenizeManifestoLines(lines: readonly string[]): {
  tokensByLine: ManifestoWordToken[][];
  totalWords: number;
} {
  let globalIndex = 0;
  const tokensByLine = lines.map((line, lineIndex) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    return words.map((word) => {
      const token: ManifestoWordToken = {
        word,
        lineIndex,
        globalIndex,
      };
      globalIndex += 1;
      return token;
    });
  });

  return {
    tokensByLine,
    totalWords: globalIndex,
  };
}

/**
 * Computes bounded 3D perspective tilt angles (deg) from cursor position inside a rect.
 */
export function computeSpotlightTilt(
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  maxDeg = 8
): { rotateX: number; rotateY: number } {
  if (width <= 0 || height <= 0) {
    return { rotateX: 0, rotateY: 0 };
  }
  const nx = clampNumber((offsetX / width) * 2 - 1, -1, 1);
  const ny = clampNumber((offsetY / height) * 2 - 1, -1, 1);
  return {
    rotateX: Number((-ny * maxDeg).toFixed(2)),
    rotateY: Number((nx * maxDeg).toFixed(2)),
  };
}

/**
 * Keeps the hero parallax wordmark 100% opaque through the 500px scroll test range,
 * then gently fades it out before colliding with deeper About content.
 */
export function computeWordmarkParallaxOpacity(
  scrollY: number,
  fadeStartPx = 540,
  fadeEndPx = 760
): number {
  if (scrollY <= fadeStartPx) return 1;
  if (scrollY >= fadeEndPx || fadeEndPx <= fadeStartPx) return 0;
  return Number((1 - (scrollY - fadeStartPx) / (fadeEndPx - fadeStartPx)).toFixed(3));
}
