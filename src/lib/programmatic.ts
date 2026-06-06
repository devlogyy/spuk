// Pure query helpers for programmatic SEO pages. Wraps the same dictionary
// loader used by the solver — no extra network, all in-memory + localStorage.

import { scoreWord, rarityOf } from "./words";
import { solveAnagram, type DictName, type SolverResult } from "./dictionary";

const URLS: Record<DictName, string> = {
  US: "/dict/twl06.txt",
  UK: "/dict/sowpods.txt",
};

const cache: Partial<Record<DictName, string[]>> = {};
const loading: Partial<Record<DictName, Promise<string[]>>> = {};
const STORAGE_KEY = (d: DictName) => `lexora-dict-${d}-v1`;

async function loadDict(dict: DictName): Promise<string[]> {
  if (cache[dict]) return cache[dict]!;
  if (loading[dict]) return loading[dict]!;
  loading[dict] = (async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY(dict));
      if (stored) {
        const arr = stored.split("\n").filter(Boolean);
        if (arr.length > 10000) {
          cache[dict] = arr;
          return arr;
        }
      }
    } catch {}
    const res = await fetch(URLS[dict]);
    const text = await res.text();
    const words = text.toUpperCase().split(/\r?\n/).filter((w) => w.length >= 2);
    cache[dict] = words;
    try {
      localStorage.setItem(STORAGE_KEY(dict), words.join("\n"));
    } catch {}
    return words;
  })();
  return loading[dict]!;
}

export interface WordEntry {
  word: string;
  score: number;
  rarity: "common" | "uncommon" | "rare" | "epic";
  validIn: { us: boolean; uk: boolean };
}

function toEntries(words: string[], dict: DictName, otherSet: Set<string>): WordEntry[] {
  return words.map((w) => {
    const score = scoreWord(w);
    return {
      word: w,
      score,
      rarity: rarityOf(score),
      validIn: {
        us: dict === "US" ? true : otherSet.has(w),
        uk: dict === "UK" ? true : otherSet.has(w),
      },
    };
  });
}

async function warmBoth(): Promise<{ primary: string[]; otherSet: Set<string> }> {
  const [us, uk] = await Promise.all([loadDict("US"), loadDict("UK")]);
  return { primary: us, otherSet: new Set(uk) };
}

export async function wordsStartingWith(letter: string, max = 500): Promise<WordEntry[]> {
  const L = letter.toUpperCase();
  const { primary, otherSet } = await warmBoth();
  const filtered = primary.filter((w) => w.startsWith(L));
  const sorted = filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
  return toEntries(sorted.slice(0, max), "US", otherSet);
}

export async function wordsEndingIn(letter: string, max = 500): Promise<WordEntry[]> {
  const L = letter.toUpperCase();
  const { primary, otherSet } = await warmBoth();
  const filtered = primary.filter((w) => w.endsWith(L));
  const sorted = filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
  return toEntries(sorted.slice(0, max), "US", otherSet);
}

export async function nLetterWordsContaining(n: number, letter: string, max = 500): Promise<WordEntry[]> {
  const L = letter.toUpperCase();
  const { primary, otherSet } = await warmBoth();
  const filtered = primary.filter((w) => w.length === n && w.includes(L));
  const sorted = filtered.sort((a, b) => scoreWord(b) - scoreWord(a) || a.localeCompare(b));
  return toEntries(sorted.slice(0, max), "US", otherSet);
}

export async function unscramble(letters: string, max = 200): Promise<SolverResult[]> {
  return solveAnagram(letters, { dict: "US", max });
}

export function groupByLength<T extends { word: string }>(words: T[]): Record<number, T[]> {
  const out: Record<number, T[]> = {};
  for (const w of words) {
    const n = w.word.length;
    if (!out[n]) out[n] = [];
    out[n].push(w);
  }
  return out;
}

export function topByScore<T extends { score: number }>(words: T[], n: number): T[] {
  return [...words].sort((a, b) => b.score - a.score).slice(0, n);
}

export const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
