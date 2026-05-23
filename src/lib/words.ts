// Letter point values (Scrabble standard)
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

// Demo word bank for UI preview
export const DEMO_WORDS = [
  { word: "QUARTZ", definition: "A hard mineral consisting of silica." },
  { word: "JINX", definition: "A person or thing that brings bad luck." },
  { word: "ZEPHYR", definition: "A soft gentle breeze." },
  { word: "MAZE", definition: "A network of paths and hedges designed as a puzzle." },
  { word: "PIXEL", definition: "Smallest unit of a digital image." },
  { word: "BLAZE", definition: "A very large or fiercely burning fire." },
  { word: "JOKER", definition: "A playing card with a figure of a jester." },
  { word: "VEXED", definition: "Annoyed, frustrated, or worried." },
  { word: "FJORD", definition: "A long, narrow, deep inlet of the sea." },
  { word: "GLYPH", definition: "A hieroglyphic character or symbol." },
  { word: "OXIDE", definition: "A binary compound of oxygen with another element." },
  { word: "WALTZ", definition: "A ballroom dance in triple time." },
];

export function generateResults(query: string, limit = 12) {
  const q = query.trim().toUpperCase();
  const pool = q
    ? DEMO_WORDS.filter((w) => {
        const chars = q.split("");
        const wordChars = w.word.split("");
        return wordChars.every((c) => chars.includes(c) || chars.includes("?") || chars.includes("*"));
      })
    : DEMO_WORDS;
  const results = (pool.length ? pool : DEMO_WORDS).slice(0, limit).map((w) => ({
    ...w,
    score: scoreWord(w.word),
    rarity: rarityOf(scoreWord(w.word)),
    validIn: { us: true, uk: w.word.length !== 5 || true },
  }));
  return results.sort((a, b) => b.score - a.score);
}
