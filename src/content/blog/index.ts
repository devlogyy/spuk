import { ComponentType } from "react";

import qNoU from "@/assets/blog/words-with-q-no-u.jpg";
import twoLetter from "@/assets/blog/2-letter-scrabble-words.jpg";
import highScoring from "@/assets/blog/high-scoring-scrabble-words.jpg";
import howToSolve from "@/assets/blog/how-to-solve-crossword-clues.jpg";
import patterns from "@/assets/blog/crossword-clue-patterns.jpg";
import fromLetters from "@/assets/blog/words-from-letters.jpg";
import bingo from "@/assets/blog/scrabble-bingo-strategy.jpg";
import vocab from "@/assets/blog/build-vocabulary-word-games.jpg";

import QNoUBody from "./posts/words-with-q-no-u";
import TwoLetterBody from "./posts/2-letter-scrabble-words";
import HighScoringBody from "./posts/high-scoring-scrabble-words";
import HowToSolveBody from "./posts/how-to-solve-crossword-clues";
import PatternsBody from "./posts/crossword-clue-patterns";
import FromLettersBody from "./posts/words-from-letters";
import BingoBody from "./posts/scrabble-bingo-strategy";
import VocabBody from "./posts/build-vocabulary-word-games";

export type Category =
  | "Scrabble Strategies"
  | "Crossword Tips"
  | "Vocabulary Building"
  | "Tutorials"
  | "High Scoring";

export interface FAQ {
  q: string;
  a: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: Category;
  author: string;
  readTime: string;
  date: string;
  /** ISO date used in Article JSON-LD (datePublished). */
  datePublished: string;
  /** ISO date used in Article JSON-LD (dateModified). Falls back to datePublished. */
  dateModified?: string;
  thumbnail: string;
  thumbnailAlt: string;
  related: string[];
  faqs: FAQ[];
  Body: ComponentType;
}

const PUBLISHED = "2026-06-01";
const MODIFIED = "2026-06-05";

export const posts: Post[] = [
  {
    slug: "words-with-q-no-u",
    title: "Every Q-Without-U Word Allowed in Scrabble (and How to Use Them)",
    description:
      "The complete list of Scrabble-legal Q words that don't need a U — QI, QAT, QOPH and more — plus the rack setups that turn them into 40+ point plays.",
    category: "High Scoring",
    author: "Mia Chen",
    readTime: "7 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: qNoU,
    thumbnailAlt: "Glowing Scrabble tiles spelling QI and QAT on a dark background",
    related: ["high-scoring-scrabble-words", "2-letter-scrabble-words", "scrabble-bingo-strategy"],
    faqs: [
      {
        q: "How many Scrabble words use Q without U?",
        a: "There are roughly 30 commonly accepted Q-without-U words across the TWL and SOWPODS dictionaries. The most useful in tournament play are QI, QAT, QOPH, QADI and QANAT.",
      },
      {
        q: "Is QI a valid Scrabble word?",
        a: "Yes. QI was added to the official Scrabble dictionaries in 2006 and is one of the most-played short words at the competitive level because of how easily it scores 20+ points.",
      },
      {
        q: "Can I play QU words without the U tile?",
        a: "No. The standard Scrabble rule is that letters must come from your rack or the board. Q-without-U words exist precisely because they let you score the Q without holding the rare U tile.",
      },
    ],
    Body: QNoUBody,
  },
  {
    slug: "2-letter-scrabble-words",
    title: "The Complete List of 2-Letter Scrabble Words (Memorize These First)",
    description:
      "All 107 valid two-letter Scrabble words, organized so you can actually remember them. The single highest-ROI study you'll ever do as a Scrabble player.",
    category: "Scrabble Strategies",
    author: "Daniel Park",
    readTime: "9 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: twoLetter,
    thumbnailAlt: "Wooden Scrabble tiles arranged in two-letter pairs",
    related: ["high-scoring-scrabble-words", "words-with-q-no-u", "scrabble-bingo-strategy"],
    faqs: [
      {
        q: "How many 2-letter Scrabble words are there?",
        a: "The TWL dictionary lists 107 valid two-letter words. SOWPODS (the international list) includes 127, adding entries like CH, DA, FY, GI and ZO.",
      },
      {
        q: "Why are 2-letter words so important in Scrabble?",
        a: "They are the connective tissue of every parallel play. Most 40+ point plays in modern Scrabble depend on stacking a longer word against existing tiles using a 2-letter hook.",
      },
      {
        q: "Is OK a Scrabble word?",
        a: "Yes — OK was added to the official Scrabble dictionary in 2018 and is now valid in both TWL and SOWPODS play.",
      },
    ],
    Body: TwoLetterBody,
  },
  {
    slug: "high-scoring-scrabble-words",
    title: "50 Highest-Scoring Scrabble Words That Actually Get Played",
    description:
      "A curated list of high-scoring Scrabble words pros use in real games — sorted by likelihood, not theoretical maximum. With rack setups and board placements.",
    category: "High Scoring",
    author: "Mia Chen",
    readTime: "10 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: highScoring,
    thumbnailAlt: "Glowing Z Scrabble tile with gold sparks on a triple-word-score square",
    related: ["scrabble-bingo-strategy", "words-with-q-no-u", "2-letter-scrabble-words"],
    faqs: [
      {
        q: "What is the highest-scoring Scrabble word ever played?",
        a: "In documented tournament play, OXYPHENBUTAZONE has the theoretical record at 1,778 points, but it has never actually been played. The realistic single-turn record is around 365 points (QUIXOTRY by Michael Cresta, 2006).",
      },
      {
        q: "Are J, X, Q and Z always high-scoring?",
        a: "Their face values are high (J=8, X=8, Q=10, Z=10), but they only score big when you land them on premium squares or stack them in parallel plays. Holding a Z on a closed board is often a liability.",
      },
      {
        q: "Should I always play my highest-scoring word?",
        a: "No. Defensive board position, rack balance, and bingo setup often matter more than squeezing every last point from one turn. Pros think two turns ahead.",
      },
    ],
    Body: HighScoringBody,
  },
  {
    slug: "how-to-solve-crossword-clues",
    title: "How to Solve Any Crossword Clue: A 7-Step Method",
    description:
      "A repeatable framework for cracking tough crossword clues, from straight definitions to cryptic wordplay. Used by editors and competitive solvers.",
    category: "Crossword Tips",
    author: "Sofia Almeida",
    readTime: "8 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: howToSolve,
    thumbnailAlt: "Magnifying glass over a partially solved crossword puzzle in warm lamp light",
    related: ["crossword-clue-patterns", "words-from-letters", "build-vocabulary-word-games"],
    faqs: [
      {
        q: "What's the fastest way to solve crossword clues?",
        a: "Start with short fill (3-4 letter answers) and proper nouns. They lock in crossing letters and turn the harder clues into pattern-matching problems.",
      },
      {
        q: "Are crossword clues always literal?",
        a: "No. Standard American-style clues mix straight definitions, fill-in-the-blank, abbreviations, and misdirection. Cryptic crosswords add anagram, hidden-word, and homophone wordplay.",
      },
      {
        q: "What does (3,4) mean in a crossword clue?",
        a: "It's an enumeration showing the answer has two words of 3 and 4 letters. It's common in British and cryptic crosswords and not used in standard American puzzles.",
      },
    ],
    Body: HowToSolveBody,
  },
  {
    slug: "crossword-clue-patterns",
    title: "Crossword Pattern Matching: Decode C_A__T in Seconds",
    description:
      "Pattern matching is the single most powerful crossword skill. Here's how elite solvers narrow down ambiguous letter patterns from 1,000 candidates to one.",
    category: "Crossword Tips",
    author: "Daniel Park",
    readTime: "7 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: patterns,
    thumbnailAlt: "Neon pattern showing the letters C, A and T on a dark grid",
    related: ["how-to-solve-crossword-clues", "words-from-letters", "build-vocabulary-word-games"],
    faqs: [
      {
        q: "What is pattern matching in crosswords?",
        a: "It's the technique of using already-filled crossing letters to limit the possible answers for an unknown entry. With three correct letters, most 7-letter slots have fewer than 20 candidates.",
      },
      {
        q: "What tools help with crossword patterns?",
        a: "A crossword solver that accepts wildcards (use underscore or question mark for unknown letters) is the fastest tool. Lexora's Crossword Solver handles patterns like C_A__T in real time.",
      },
      {
        q: "What letters appear most often in crossword answers?",
        a: "E, A, R, I, O, T, N, S and L make up roughly 70% of all letters in standard puzzles. Guessing E for an unknown vowel is correct about 38% of the time.",
      },
    ],
    Body: PatternsBody,
  },
  {
    slug: "words-from-letters",
    title: "How to Find Every Word From a Set of Letters",
    description:
      "Whether you're stuck on Scrabble, Words With Friends, or an anagram puzzle, here's the systematic method to find every valid word your letters can make.",
    category: "Tutorials",
    author: "Sofia Almeida",
    readTime: "8 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: fromLetters,
    thumbnailAlt: "Scattered wooden letter tiles being rearranged into words",
    related: ["2-letter-scrabble-words", "scrabble-bingo-strategy", "crossword-clue-patterns"],
    faqs: [
      {
        q: "How do I find words from random letters?",
        a: "Sort your letters alphabetically, identify the consonant/vowel ratio, look for common suffixes (-ING, -ED, -ER, -S), then build outward from the highest-frequency consonants.",
      },
      {
        q: "What is the longest word from 7 random letters?",
        a: "Depending on the letter mix, you can often find a 7-letter bingo. The most common 7-letter rack patterns yield words like RETAINS, SATIRE, STEAMER and RAINEST.",
      },
      {
        q: "Are anagram solvers allowed in Scrabble tournaments?",
        a: "No. Official tournaments prohibit external aids. Anagram and word finder tools are for casual play, study, and improving pattern recognition between games.",
      },
    ],
    Body: FromLettersBody,
  },
  {
    slug: "scrabble-bingo-strategy",
    title: "Scrabble Bingo Strategy: How Pros Score 50-Point Bonuses",
    description:
      "Playing all seven tiles in one turn — a bingo — adds 50 points instantly. Here's the rack management, stem theory and probability work behind it.",
    category: "Scrabble Strategies",
    author: "Mia Chen",
    readTime: "11 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: bingo,
    thumbnailAlt: "Seven Scrabble tiles on a rack glowing with bingo bonus light",
    related: ["high-scoring-scrabble-words", "2-letter-scrabble-words", "words-with-q-no-u"],
    faqs: [
      {
        q: "What is a bingo in Scrabble?",
        a: "A bingo is when you play all seven tiles from your rack in a single turn. You score the word's normal value plus a 50-point bonus.",
      },
      {
        q: "How often should I bingo in a game?",
        a: "Top tournament players average 1.5 to 2 bingos per game. Beginners usually score one every 3-4 games. Closing that gap is the single biggest rating jump available.",
      },
      {
        q: "What are the best bingo stems?",
        a: "The classic 6-letter stems are SATIRE, RETINA, TISANE and SENIOR. They each combine with more than 10 different letters to form 7-letter words.",
      },
    ],
    Body: BingoBody,
  },
  {
    slug: "build-vocabulary-word-games",
    title: "Build a 10,000-Word Vocabulary Using Word Games",
    description:
      "Word games like Scrabble and crosswords are the most efficient vocabulary builders ever invented. Here's the spaced-repetition method to use them deliberately.",
    category: "Vocabulary Building",
    author: "Sofia Almeida",
    readTime: "9 min",
    date: "Evergreen",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    thumbnail: vocab,
    thumbnailAlt: "Open dictionary with golden words rising from the pages",
    related: ["how-to-solve-crossword-clues", "words-from-letters", "scrabble-bingo-strategy"],
    faqs: [
      {
        q: "Do word games actually improve vocabulary?",
        a: "Yes. Studies on Scrabble and crossword players consistently show larger working vocabularies and better verbal fluency than control groups, especially in older adults.",
      },
      {
        q: "How long does it take to learn 10,000 words?",
        a: "At 10 new words a day with spaced repetition, you can reach a 10,000-word working vocabulary in about three years. Word games accelerate that by giving each word repeated context.",
      },
      {
        q: "What's the best word game for vocabulary?",
        a: "Crosswords expose you to definitions; Scrabble builds your pattern memory for valid letter combinations. Doing both 15 minutes a day beats any vocabulary app we've tested.",
      },
    ],
    Body: VocabBody,
  },
];

export const getPost = (slug?: string) => posts.find((p) => p.slug === slug);
export const getRelated = (slug: string) =>
  (getPost(slug)?.related ?? []).map(getPost).filter(Boolean) as Post[];
