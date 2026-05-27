// Dictionary engine: anagram solver + crossword pattern matcher.
// Word lists live in /public/dict and are fetched lazily, then cached in
// memory + localStorage so the second visit is instant and works offline.

import { scoreWord, rarityOf } from "./words";

export type DictName = "US" | "UK";

const URLS: Record<DictName, string> = {
  US: "/dict/twl06.txt",
  UK: "/dict/sowpods.txt",
};

const cache: Partial<Record<DictName, string[]>> = {};
const loading: Partial<Record<DictName, Promise<string[]>>> = {};

const STORAGE_KEY = (d: DictName) => `lexora-dict-${d}-v1`;

async function loadDictionary(dict: DictName): Promise<string[]> {
  if (cache[dict]) return cache[dict]!;
  if (loading[dict]) return loading[dict]!;

  loading[dict] = (async () => {
    // Try localStorage cache first (very fast, no network).
    try {
      const stored = localStorage.getItem(STORAGE_KEY(dict));
      if (stored) {
        const arr = stored.split("\n").filter(Boolean);
        if (arr.length > 10000) {
          cache[dict] = arr;
          return arr;
        }
      }
    } catch {
      // ignore quota / privacy errors
    }

    const res = await fetch(URLS[dict]);
    if (!res.ok) throw new Error(`Failed to load ${dict} dictionary`);
    const text = await res.text();
    const words = text.toUpperCase().split(/\r?\n/).filter((w) => w.length >= 2);
    cache[dict] = words;
    try {
      localStorage.setItem(STORAGE_KEY(dict), words.join("\n"));
    } catch {
      // 5MB quota may reject; fine, in-memory cache still works
    }
    return words;
  })();

  return loading[dict]!;
}

export interface SolverResult {
  word: string;
  score: number;
  rarity: "common" | "uncommon" | "rare" | "epic";
  validIn: { us: boolean; uk: boolean };
}

interface AnagramOpts {
  dict?: DictName;
  starts?: string;
  ends?: string;
  contains?: string;
  minLen?: number;
  exactLen?: number;
  max?: number;
}

function letterCounts(s: string): Record<string, number> {
  const m: Record<string, number> = {};
  for (const c of s) m[c] = (m[c] ?? 0) + 1;
  return m;
}

function canMake(word: string, rack: Record<string, number>, blanks: number): boolean {
  const need: Record<string, number> = {};
  for (const c of word) need[c] = (need[c] ?? 0) + 1;
  let blanksLeft = blanks;
  for (const c in need) {
    const have = rack[c] ?? 0;
    const short = need[c] - have;
    if (short > 0) {
      blanksLeft -= short;
      if (blanksLeft < 0) return false;
    }
  }
  return true;
}

export async function solveAnagram(rack: string, opts: AnagramOpts = {}): Promise<SolverResult[]> {
  const dict = opts.dict ?? "US";
  const words = await loadDictionary(dict);
  const rackUpper = rack.toUpperCase().replace(/[^A-Z?*]/g, "");
  const blanks = (rackUpper.match(/[?*]/g) ?? []).length;
  const letters = rackUpper.replace(/[?*]/g, "");
  const counts = letterCounts(letters);
  const maxLen = letters.length + blanks;
  const minLen = opts.minLen ?? 2;
  const starts = opts.starts?.toUpperCase() ?? "";
  const ends = opts.ends?.toUpperCase() ?? "";
  const contains = opts.contains?.toUpperCase() ?? "";

  // Cross-validate against the other dictionary for the badge.
  const other = dict === "US" ? "UK" : "US";
  const otherSet = new Set(cache[other] ?? []);

  const out: SolverResult[] = [];
  for (const w of words) {
    if (w.length < minLen || w.length > maxLen) continue;
    if (opts.exactLen && w.length !== opts.exactLen) continue;
    if (starts && !w.startsWith(starts)) continue;
    if (ends && !w.endsWith(ends)) continue;
    if (contains && !w.includes(contains)) continue;
    if (!canMake(w, counts, blanks)) continue;
    const score = scoreWord(w);
    out.push({
      word: w,
      score,
      rarity: rarityOf(score),
      validIn: {
        us: dict === "US" ? true : otherSet.has(w),
        uk: dict === "UK" ? true : otherSet.has(w),
      },
    });
  }
  out.sort((a, b) => b.score - a.score || b.word.length - a.word.length || a.word.localeCompare(b.word));
  return out.slice(0, opts.max ?? 200);
}

export async function matchPattern(pattern: string, dict: DictName = "US", max = 200): Promise<SolverResult[]> {
  const words = await loadDictionary(dict);
  const pat = pattern.toUpperCase().replace(/[_\s]/g, "?").replace(/[^A-Z?]/g, "");
  if (!pat) return [];
  const other = dict === "US" ? "UK" : "US";
  const otherSet = new Set(cache[other] ?? []);
  const out: SolverResult[] = [];
  for (const w of words) {
    if (w.length !== pat.length) continue;
    let ok = true;
    for (let i = 0; i < pat.length; i++) {
      if (pat[i] !== "?" && pat[i] !== w[i]) { ok = false; break; }
    }
    if (!ok) continue;
    const score = scoreWord(w);
    out.push({
      word: w,
      score,
      rarity: rarityOf(score),
      validIn: {
        us: dict === "US" ? true : otherSet.has(w),
        uk: dict === "UK" ? true : otherSet.has(w),
      },
    });
    if (out.length >= max * 2) break;
  }
  out.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
  return out.slice(0, max);
}

// Warm both dictionaries in the background so cross-validation badges are accurate.
export function warmDictionaries() {
  loadDictionary("US").catch(() => {});
  loadDictionary("UK").catch(() => {});
}
