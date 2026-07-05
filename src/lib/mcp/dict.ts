// Shared dictionary loader for MCP tools (Deno edge runtime).
// Fetches the published word lists from the app's own public /dict path.

export type DictName = "US" | "UK";

const PATHS: Record<DictName, string> = {
  US: "/dict/twl06.txt",
  UK: "/dict/sowpods.txt",
};

const cache: Partial<Record<DictName, string[]>> = {};
const loading: Partial<Record<DictName, Promise<string[]>>> = {};

function siteBaseUrl(): string {
  // Prefer explicit override, then fall back to the published Lovable URL.
  const env = (globalThis as any).process?.env ?? {};
  return (
    env.PUBLIC_SITE_URL ||
    env.SITE_URL ||
    "https://spuk.lovable.app"
  ).replace(/\/$/, "");
}

export async function loadDictionary(dict: DictName): Promise<string[]> {
  if (cache[dict]) return cache[dict]!;
  if (loading[dict]) return loading[dict]!;
  loading[dict] = (async () => {
    const url = siteBaseUrl() + PATHS[dict];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${dict} dictionary (${res.status})`);
    const text = await res.text();
    const words = text.toUpperCase().split(/\r?\n/).filter((w) => w.length >= 2);
    cache[dict] = words;
    return words;
  })();
  return loading[dict]!;
}

const TILE_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

export function scoreWord(word: string): number {
  return word.toUpperCase().split("").reduce((s, c) => s + (TILE_VALUES[c] ?? 0), 0);
}

export function canMakeFromRack(word: string, rack: string): boolean {
  const have: Record<string, number> = {};
  let blanks = 0;
  for (const c of rack.toUpperCase()) {
    if (c === "?" || c === "*") blanks++;
    else if (/[A-Z]/.test(c)) have[c] = (have[c] ?? 0) + 1;
  }
  const need: Record<string, number> = {};
  for (const c of word) need[c] = (need[c] ?? 0) + 1;
  for (const c in need) {
    const short = need[c] - (have[c] ?? 0);
    if (short > 0) {
      blanks -= short;
      if (blanks < 0) return false;
    }
  }
  return true;
}

export function matchesPattern(word: string, pattern: string): boolean {
  const p = pattern.toUpperCase();
  if (word.length !== p.length) return false;
  for (let i = 0; i < p.length; i++) {
    const ch = p[i];
    if (ch === "?" || ch === "_" || ch === ".") continue;
    if (ch !== word[i]) return false;
  }
  return true;
}
