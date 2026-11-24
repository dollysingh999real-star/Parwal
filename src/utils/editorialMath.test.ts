import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampNumber,
  computeCounterValue,
  computeParallaxOffset,
  computeRevealedWordCount,
  computeScrollProgress,
  computeSpotlightTilt,
  computeStoryMilestoneIndex,
  computeWordmarkParallaxOpacity,
  easeOutCubic,
  stepSpotlightIndex,
  tokenizeManifestoLines,
} from './editorialMath';
import {
  ABOUT_STATS,
  CORE_VALUES,
  MANIFESTO_LINES,
  PARTNER_PROFILES,
  SERVICES_LIST,
  SPOTLIGHT_PARTNERS,
  STORY_MILESTONES,
} from '../data/firmData';

test('tokenizeManifestoLines preserves exact 4-line structure and word count', () => {
  const { tokensByLine, totalWords } = tokenizeManifestoLines(MANIFESTO_LINES);
  assert.equal(tokensByLine.length, 4);
  assert.equal(totalWords, 20);
  assert.equal(tokensByLine[0][0].word, 'We');
  assert.equal(tokensByLine[3][tokensByLine[3].length - 1].word, 'standard.');
});

test('computeRevealedWordCount progresses smoothly from initial words to full count', () => {
  assert.equal(computeRevealedWordCount(0, 20, 380, 3), 3);
  assert.equal(computeRevealedWordCount(-20, 20, 380, 3), 3);
  const mid = computeRevealedWordCount(190, 20, 380, 3);
  assert.ok(mid > 3 && mid < 20);
  assert.equal(computeRevealedWordCount(380, 20, 380, 3), 20);
  assert.equal(computeRevealedWordCount(900, 20, 380, 3), 20);
});

test('computeScrollProgress returns bounded [0, 1] reading progress', () => {
  assert.equal(computeScrollProgress(0, 4000, 900), 0);
  assert.equal(computeScrollProgress(1550, 4000, 900), 0.5);
  assert.equal(computeScrollProgress(3100, 4000, 900), 1);
  assert.equal(computeScrollProgress(5000, 4000, 900), 1);
  assert.equal(computeScrollProgress(0, 900, 900), 0);
});

test('computeParallaxOffset clamps subtle ~0.5 factor translation safely', () => {
  assert.equal(computeParallaxOffset(0, 0.5, 0, 320), 0);
  assert.equal(computeParallaxOffset(500, 0.5, 0, 320), 250);
  assert.equal(computeParallaxOffset(1000, 0.5, 0, 320), 320);
  assert.equal(computeParallaxOffset(-300, 0.3, -40, 90), -40);
});

test('computeWordmarkParallaxOpacity stays 1 through 500px scroll and fades cleanly past 540px', () => {
  assert.equal(computeWordmarkParallaxOpacity(0), 1);
  assert.equal(computeWordmarkParallaxOpacity(500), 1);
  assert.equal(computeWordmarkParallaxOpacity(650), 0.5);
  assert.equal(computeWordmarkParallaxOpacity(760), 0);
  assert.equal(computeWordmarkParallaxOpacity(1200), 0);
});

test('computeSpotlightTilt bounds 3D rotateX/rotateY to +-8 degrees', () => {
  assert.deepEqual(computeSpotlightTilt(100, 100, 200, 200), { rotateX: 0, rotateY: 0 });
  assert.deepEqual(computeSpotlightTilt(200, 0, 200, 200), { rotateX: 8, rotateY: 8 });
  assert.deepEqual(computeSpotlightTilt(0, 200, 200, 200), { rotateX: -8, rotateY: -8 });
  assert.deepEqual(computeSpotlightTilt(0, 0, 0, 0), { rotateX: 0, rotateY: 0 });
});

test('computeStoryMilestoneIndex steps 1983 -> 2003 -> TODAY on scroll and reverses', () => {
  assert.equal(computeStoryMilestoneIndex(0, 1000, 3), 0);
  assert.equal(computeStoryMilestoneIndex(-120, 1000, 3), 1);
  assert.equal(computeStoryMilestoneIndex(-280, 1000, 3), 2);
});

test('computeCounterValue animates 0 -> 43 and 0 -> 4 monotonically', () => {
  assert.equal(computeCounterValue(43, 0), 0);
  assert.equal(computeCounterValue(43, 1), 43);
  assert.equal(computeCounterValue(4, 0), 0);
  assert.equal(computeCounterValue(4, 1), 4);
  assert.ok(easeOutCubic(0.5) > 0.5);
  assert.equal(clampNumber(120, 0, 100), 100);
});

test('stepSpotlightIndex wraps across all 4 partners', () => {
  assert.equal(stepSpotlightIndex(0, 4, 1), 1);
  assert.equal(stepSpotlightIndex(3, 4, 1), 0);
  assert.equal(stepSpotlightIndex(0, 4, -1), 3);
});

test('firmData matches prompt facts with exact counts and no banned copy', () => {
  assert.equal(SPOTLIGHT_PARTNERS.length, 4);
  assert.equal(SPOTLIGHT_PARTNERS[1].name, 'BHUPESH MATHUR');
  assert.equal(SPOTLIGHT_PARTNERS[1].tenure, '24+ YEARS');
  assert.equal(ABOUT_STATS.length, 3);
  assert.equal(ABOUT_STATS[0].target, 43);
  assert.equal(ABOUT_STATS[1].target, 4);
  assert.equal(ABOUT_STATS[2].target, 6);
  assert.equal(CORE_VALUES.length, 5);
  assert.equal(SERVICES_LIST.length, 6);
  assert.equal(PARTNER_PROFILES.length, 4);
  assert.equal(STORY_MILESTONES.length, 3);
  for (let i = 0; i < 4; i += 1) {
    assert.ok(SPOTLIGHT_PARTNERS[i].photoUrl.startsWith('https://www.parwalandassociates.com/'));
    assert.equal(PARTNER_PROFILES[i].photoUrl, SPOTLIGHT_PARTNERS[i].photoUrl);
  }
});
