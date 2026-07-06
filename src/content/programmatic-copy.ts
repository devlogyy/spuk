// Copy blocks for the four programmatic template families.
// Keeps each family visibly distinct so /words/* pages aren't judged as thin/duplicated content.

export type TemplateKey = "starting-with" | "ending-in" | "n-letter" | "unscramble";

export function detectTemplate(canonicalPath: string): TemplateKey | null {
  if (canonicalPath.startsWith("/words/starting-with/")) return "starting-with";
  if (canonicalPath.startsWith("/words/ending-in/")) return "ending-in";
  if (canonicalPath.startsWith("/unscramble/")) return "unscramble";
  if (canonicalPath.startsWith("/words/")) return "n-letter";
  return null;
}

export interface TemplateCopy {
  howToTitle: string;
  howToBullets: string[];
  strategyTitle: string;
  strategyBody: string;
}

export const templateCopy: Record<TemplateKey, TemplateCopy> = {
  "starting-with": {
    howToTitle: "How to use this list",
    howToBullets: [
      "Scan the length groups first — 2 and 3-letter words are your parallel-play arsenal in Scrabble.",
      "Click any word to open it in the Scrabble Solver and see every extension or hook it enables.",
      "Filter by score in your head: J, Q, X and Z at the start of a word rarely land on premium squares, so weigh placement carefully.",
    ],
    strategyTitle: "Strategy tip",
    strategyBody:
      "Openers matter less than what follows. When your rack forces a first letter, look for a follow-up vowel that keeps balance on your rack — leaving all consonants after a big play usually costs you the next turn. Bingo hunters: memorize 7-letter stems like SATIRE, RETINA and RETAIL that spell many high-value words when combined with a fresh tile.",
  },
  "ending-in": {
    howToTitle: "How to use this list",
    howToBullets: [
      "Endings are the strongest hook family in Scrabble — every -ING, -ED, -ER and -Y here can extend an opponent's play for a full second score.",
      "Cross-reference with the crossword solver: pattern-matching known endings is the fastest path through hard clues.",
      "For Words With Friends, note that some tournament endings (like -QI or -ZA) may not validate — the in-game checker is authoritative.",
    ],
    strategyTitle: "Strategy tip",
    strategyBody:
      "Ending-focused play unlocks the highest board scores. Watch the board for triple-letter squares one tile before an existing word and hook a high-value ending across it — that single tile can trigger two premium words at once. The best Scrabble players plan two turns ahead specifically around endings.",
  },
  "n-letter": {
    howToTitle: "How to use this list",
    howToBullets: [
      "Length-locked lists are perfect for Wordle, Waffle, Quordle and other guess-the-word games where you know the exact letter count.",
      "For crosswords with one or two known letters, use the Crossword Solver instead — it pattern-matches faster than scanning by eye.",
      "In Scrabble, 7- and 8-letter words are bingo territory: use every tile from your rack for the +50 bonus.",
    ],
    strategyTitle: "Strategy tip",
    strategyBody:
      "Length is a puzzle constraint, not a scoring rule. In Wordle-style games, prefer words rich in common consonants (R, S, T, L, N) and two vowels for your first guess — they eliminate the most possibilities per turn. In Scrabble, the same length list plays very differently depending on which premium squares are open.",
  },
  unscramble: {
    howToTitle: "How to use this list",
    howToBullets: [
      "Results are sorted by length and Scrabble score — the longest anagrams are usually what puzzle apps are asking for.",
      "Blank tiles (?) are supported by the Scrabble Solver; use it if you have wildcards in your rack.",
      "Every word links out to the solver so you can verify it against the US and UK tournament dictionaries.",
    ],
    strategyTitle: "Strategy tip",
    strategyBody:
      "Anagram speed comes from pattern chunks, not brute force. Train your eye on common prefixes (UN-, RE-, DIS-, PRE-) and suffixes (-ING, -TION, -ABLE) — most 7 and 8-letter anagrams contain one. Rearranging the remaining letters around a familiar chunk is far faster than trying every permutation.",
  },
};
