// Scrabble tile values + scoring + rarity helpers.
// The actual solver lives in src/lib/dictionary.ts.

export const TILE_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

export function scoreWord(word: string): number {
  return word.toUpperCase().split("").reduce((sum, ch) => sum + (TILE_VALUES[ch] ?? 0), 0);
}

export function rarityOf(score: number): "common" | "uncommon" | "rare" | "epic" {
  if (score >= 24) return "epic";
  if (score >= 16) return "rare";
  if (score >= 9) return "uncommon";
  return "common";
}

// Static showcase words for the homepage hero preview (no dictionary load).
export const DEMO_WORDS = [
  { word: "QUARTZ", definition: "A hard mineral consisting of silica." },
  { word: "JINX", definition: "A person or thing that brings bad luck." },
  { word: "ZEPHYR", definition: "A soft gentle breeze." },
  { word: "MAZE", definition: "A network of paths designed as a puzzle." },
  { word: "PIXEL", definition: "Smallest unit of a digital image." },
  { word: "BLAZE", definition: "A very large or fiercely burning fire." },
];

export function demoResults(limit = 6) {
  return DEMO_WORDS.slice(0, limit).map((w) => ({
    ...w,
    score: scoreWord(w.word),
    rarity: rarityOf(scoreWord(w.word)),
    validIn: { us: true, uk: true },
  }));
}
