/**
 * Static prerender pass. Runs after `vite build` (postbuild hook).
 *
 * Why: Lexora is a client-rendered SPA. Google can render JS but queues it,
 * and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
 * Bytespider) do not execute JS at all — they were seeing an empty
 * <div id="root"> on all 550 URLs.
 *
 * This writes a real HTML file per route into dist/<route>/index.html with:
 *   - the correct <title>, description, canonical, OG/Twitter tags
 *   - page-level JSON-LD (FAQPage / ItemList / Article / SoftwareApplication)
 *   - a crawlable body: H1, a 40-60 word "quick answer", real word data and
 *     internal links.
 *
 * React hydrates over it on load (createRoot clears the container), so users
 * still get the full interactive SPA — nothing about runtime behaviour changes.
 *
 * Route list is read from public/sitemap.xml, which prebuild has already
 * regenerated, so the two can never drift.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";

const SITE_URL = "https://www.lexorawords.com";
const DIST = resolve("dist");

/* ------------------------------------------------------------------ */
/* Dictionary (node-side, same word lists the browser fetches)         */
/* ------------------------------------------------------------------ */

const TILE: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};
const scoreWord = (w: string) =>
  w.toUpperCase().split("").reduce((s, c) => s + (TILE[c] ?? 0), 0);

function loadList(file: string): string[] {
  try {
    return readFileSync(resolve(file), "utf8")
      .toUpperCase()
      .split(/\r?\n/)
      .filter((w) => w.length >= 2);
  } catch {
    return [];
  }
}
const TWL = loadList("public/dict/twl06.txt");

function canMake(word: string, rack: string): boolean {
  const pool: Record<string, number> = {};
  for (const c of rack.toUpperCase()) pool[c] = (pool[c] ?? 0) + 1;
  for (const c of word) {
    if (!pool[c]) return false;
    pool[c]--;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const article = (l: string) => ("AEFHILMNORSX".includes(l.toUpperCase()) ? "an" : "a");

const abs = (p: string) => `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;

interface FAQ { q: string; a: string }

interface Page {
  title: string;
  description: string;
  h1: string;
  /** 40-60 words. This is the block AI engines lift as the answer. */
  quickAnswer: string;
  bodyHtml?: string;
  faqs?: FAQ[];
  jsonLd?: unknown[];
}

const faqSchema = (faqs: FAQ[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

const appSchema = (name: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name,
  description,
  url,
  applicationCategory: "GameApplication",
  operatingSystem: "Any (Web)",
  inLanguage: "en",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: "Lexora", url: SITE_URL },
});

const listSchema = (name: string, url: string, words: string[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  url,
  numberOfItems: words.length,
  itemListElement: words.slice(0, 50).map((w, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: w,
    item: {
      "@type": "DefinedTerm",
      name: w,
      description: `${w.length}-letter word worth ${scoreWord(w)} points in Scrabble.`,
    },
  })),
});

function wordGrid(words: string[], limit = 300): string {
  if (!words.length) return "";
  return `<ul class="prerender-words">${words
    .slice(0, limit)
    .map((w) => `<li><a href="/scrabble-solver?q=${w.toLowerCase()}">${w}</a> — ${scoreWord(w)} pts</li>`)
    .join("")}</ul>`;
}

function faqHtml(faqs: FAQ[]): string {
  return `<section><h2>Frequently asked questions</h2>${faqs
    .map((f) => `<div><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`)
    .join("")}</section>`;
}

const TOOL_LINKS = `<nav aria-label="Lexora tools"><h2>More Lexora word tools</h2><ul>
<li><a href="/scrabble-solver">Scrabble Word Finder &amp; Solver</a></li>
<li><a href="/crossword-solver">Crossword Solver &amp; Clue Finder</a></li>
<li><a href="/word-finder">Word Unscrambler &amp; Anagram Solver</a></li>
<li><a href="/words">Word lists by letter and length</a></li>
<li><a href="/blog">Scrabble &amp; crossword strategy guides</a></li>
</ul></nav>`;

/* ------------------------------------------------------------------ */
/* Blog metadata (mirrors src/content/blog/index.ts)                   */
/* ------------------------------------------------------------------ */

const BLOG: Record<string, { title: string; description: string; published: string; modified: string; author: string }> = {
  "words-with-q-no-u": {
    title: "Q Words Without U in Scrabble — Full Legal List",
    description:
      "Every Scrabble-legal Q word that doesn't need a U — QI, QAT, QOPH, QADI and more — with tile scores and the rack setups that turn them into 40+ point plays.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "2-letter-scrabble-words": {
    title: "All 107 Two-Letter Scrabble Words (Complete List)",
    description:
      "The complete list of valid 2-letter Scrabble words, grouped for memorisation, with scores and the parallel plays that make them worth learning first.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "high-scoring-scrabble-words": {
    title: "50 Highest Scoring Scrabble Words That Actually Play",
    description:
      "Real high-scoring Scrabble words used in tournament play, with the rack and board setups needed to land them for 60+ points.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "how-to-solve-crossword-clues": {
    title: "How to Solve Crossword Clues Faster — 7-Step Method",
    description:
      "The 7-step method crossword editors and competitive solvers use to crack any clue, from anagram indicators to hidden-word tricks.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "crossword-clue-patterns": {
    title: "Crossword Pattern Matching — Decode C_A__T Style Clues",
    description:
      "How elite solvers read ambiguous crossword letter patterns like C_A__T, and how to narrow hundreds of candidates down to one answer.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "words-from-letters": {
    title: "How to Find Every Word From Your Letters",
    description:
      "A systematic method for turning any set of letters into every valid word — stems, prefixes, suffixes and the order to search in.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "scrabble-bingo-strategy": {
    title: "Scrabble Bingo Strategy — How to Score the +50 Bonus",
    description:
      "Stem theory, rack management and tile turnover: how strong players set up 7-letter Scrabble bingos and the 50-point bonus, turn after turn.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
  "build-vocabulary-word-games": {
    title: "Build Vocabulary With Word Games (That Actually Sticks)",
    description:
      "How Scrabble, crosswords and anagram puzzles build durable vocabulary, and the spaced-repetition routine that makes new words stay.",
    published: "2026-06-01", modified: "2026-06-05", author: "Lexora Editorial",
  },
};

/* ------------------------------------------------------------------ */
/* Page builders                                                       */
/* ------------------------------------------------------------------ */

const TOOL_FAQS: Record<string, FAQ[]> = {
  "/scrabble-solver": [
    { q: "What is the best Scrabble word finder?", a: "Lexora's Scrabble Word Finder ranks every legal play from your rack by real tile score and validates each word against both TWL (US) and SOWPODS (UK) tournament dictionaries. It is free, needs no sign-up, and supports blank tiles." },
    { q: "Is QI a valid Scrabble word?", a: "Yes. QI is valid in both TWL and SOWPODS, scores 11 points, and is the most-played Q-without-U word in competitive Scrabble." },
    { q: "How do I use a blank tile in the solver?", a: "Type ? for each blank tile. A rack of AERST? returns every word formable from those five letters plus any wildcard letter." },
    { q: "Does this work for Words With Friends?", a: "Most words carry over. Words With Friends uses a slightly different dictionary and tile values, so use the US dictionary setting for the closest match." },
    { q: "How do I find a 7-letter bingo?", a: "Enter your full 7-tile rack and set minimum length to 7. Every 7-letter play earns the +50 Scrabble bingo bonus." },
    { q: "Which dictionary does Lexora use?", a: "US mode uses TWL06, the North American tournament word list. UK mode uses SOWPODS, used everywhere else. You can switch at any time." },
  ],
  "/crossword-solver": [
    { q: "How does a crossword solver work?", a: "You enter the letters you already know and a ? or _ for each blank, for example C?T??. The solver pattern-matches that shape against a 260,000-word dictionary and returns every answer of the right length that fits your known letters." },
    { q: "Can I solve a crossword clue with only the letter count?", a: "Yes. Enter one ? per square — for example ????? for a five-letter answer — then add letters as crossing words confirm them to narrow the list." },
    { q: "What does the ? wildcard mean?", a: "Each ? stands for exactly one unknown letter. Use one ? per empty square so the answer length always matches the grid." },
    { q: "Is the crossword solver free?", a: "Yes, completely free with no sign-up and no limit on searches." },
    { q: "Does it work for cryptic crosswords?", a: "It solves the letter-pattern half of a cryptic clue. Once you have two or three crossing letters, pattern matching usually narrows a cryptic answer to a handful of candidates." },
  ],
  "/word-finder": [
    { q: "How do I unscramble letters?", a: "Type your letters in any order and Lexora's word unscrambler returns every valid dictionary word that can be made from them, sorted by length and Scrabble score. It handles 2 to 15 letters and supports ? as a wildcard." },
    { q: "What is the best word unscrambler?", a: "Lexora unscrambles against the full TWL tournament word list, returns both full anagrams and every shorter sub-word, and filters by exact length for Wordle — all free and instant in the browser." },
    { q: "Can it help me with Wordle?", a: "Yes. Enter the letters you are testing and set the length filter to 5 to see every valid five-letter word, then narrow using your green and yellow hints." },
    { q: "What is the difference between an anagram solver and a word finder?", a: "A strict anagram solver only returns words using every letter. A word finder also returns every shorter word you can build, which is far more useful for Scrabble racks and puzzle apps." },
    { q: "Are blank tiles supported?", a: "Yes. Use ? for each blank or wildcard letter and it is treated as any letter A to Z." },
  ],
};

function buildPage(path: string): Page {
  /* ---------------- Home ---------------- */
  if (path === "/") {
    const faqs: FAQ[] = [
      { q: "What is Lexora?", a: "Lexora is a free word-game toolkit: a Scrabble word finder, a crossword solver, and a word unscrambler, all validated against the TWL (US) and SOWPODS (UK) tournament dictionaries." },
      { q: "Is Lexora free?", a: "Yes. Every tool is free, unlimited, and works without an account." },
      { q: "Which dictionaries does Lexora use?", a: "TWL06 for US play and SOWPODS for UK and international play. You can switch between them on any tool." },
    ];
    return {
      title: "Scrabble Word Finder, Crossword Solver & Word Unscrambler | Lexora",
      description:
        "Free Scrabble word finder, crossword solver and word unscrambler. Enter your letters or clue pattern and get every valid word ranked by score — TWL (US) and SOWPODS (UK).",
      h1: "Scrabble word finder, crossword solver and word unscrambler",
      quickAnswer:
        "Lexora is a free word-game toolkit. Enter your Scrabble rack to get every legal play ranked by tile score, type a crossword pattern like C?T?? to find answers that fit, or unscramble any letters into every valid word. Every result is checked against the TWL (US) and SOWPODS (UK) tournament dictionaries.",
      bodyHtml: `<section><h2>What each tool does</h2><ul>
<li><a href="/scrabble-solver"><strong>Scrabble Word Finder</strong></a> — paste your rack (use ? for blanks) and see every legal play ranked by real tile score, with US/UK dictionary toggle and starts-with / ends-with / contains filters.</li>
<li><a href="/crossword-solver"><strong>Crossword Solver</strong></a> — enter a pattern such as <code>C?T??</code> and get every dictionary answer of that exact shape.</li>
<li><a href="/word-finder"><strong>Word Unscrambler</strong></a> — turn any jumble of letters into every anagram and sub-word, filterable to an exact length for Wordle.</li>
<li><a href="/words"><strong>Word lists</strong></a> — browse words by starting letter, ending letter and length.</li>
</ul></section>` + TOOL_LINKS,
      faqs,
      jsonLd: [appSchema("Lexora", "Free Scrabble word finder, crossword solver and word unscrambler.", abs("/")), faqSchema(faqs)],
    };
  }

  /* ---------------- Tool pages ---------------- */
  if (path === "/scrabble-solver") {
    const faqs = TOOL_FAQS[path];
    return {
      title: "Scrabble Word Finder & Solver — Every Play From Your Rack | Lexora",
      description:
        "Free Scrabble word finder. Enter your rack (blanks with ?) and get every legal play ranked by tile score, validated in TWL (US) and SOWPODS (UK). Filters for starts with, ends with and length.",
      h1: "Scrabble word finder — every legal play from your rack",
      quickAnswer:
        "Enter the tiles on your Scrabble rack and Lexora returns every legal word you can play, ranked by real tile score. Use ? for a blank tile. Each word is validated against TWL06 for US play and SOWPODS for UK play, and you can filter by starting letter, ending letter, contained letters or minimum length.",
      bodyHtml:
        `<section><h2>How to use the Scrabble word finder</h2><ol>
<li>Type the letters on your rack, in any order. Use <code>?</code> for each blank tile.</li>
<li>Choose the US (TWL) or UK (SOWPODS) dictionary.</li>
<li>Optionally set a starting letter, ending letter, required letters, or minimum length to build around a word already on the board.</li>
<li>Read the ranked results — highest tile score first. Set minimum length to 7 to hunt for a +50 bingo.</li>
</ol></section>
<section><h2>Scrabble tile values</h2><p>A, E, I, L, N, O, R, S, T and U score 1 point. D and G score 2. B, C, M and P score 3. F, H, V, W and Y score 4. K scores 5. J and X score 8. Q and Z score 10. Lexora shows raw tile score; premium board squares multiply it in real play.</p></section>` +
        TOOL_LINKS,
      faqs,
      jsonLd: [appSchema("Lexora Scrabble Word Finder", "Find every legal Scrabble play from your rack, ranked by tile score.", abs(path)), faqSchema(faqs)],
    };
  }

  if (path === "/crossword-solver") {
    const faqs = TOOL_FAQS[path];
    return {
      title: "Crossword Solver & Clue Finder — Answers by Letter Pattern | Lexora",
      description:
        "Free crossword solver. Enter the letters you know and ? for the blanks (e.g. C?T??) to get every crossword answer that fits, across 260,000+ dictionary words.",
      h1: "Crossword solver — find answers by letter pattern",
      quickAnswer:
        "Enter the letters you already have and a ? for every empty square — for example C?T?? — and Lexora returns every dictionary word of that exact shape. It matches across more than 260,000 words, so partial answers with only one or two known crossing letters still narrow down fast.",
      bodyHtml:
        `<section><h2>How to solve a crossword clue with a pattern</h2><ol>
<li>Count the squares in the answer and type one <code>?</code> for each.</li>
<li>Replace the squares you already know with their letters, keeping the position exact.</li>
<li>Search. Every dictionary word matching that shape appears.</li>
<li>Fill in a crossing word, add the new letter, and search again — each confirmed letter usually cuts the candidate list by more than half.</li>
</ol></section>
<section><h2>Pattern examples</h2><ul>
<li><code>C?T??</code> → CATCH, CITED, CUTUP and other five-letter words starting with C and with T in the third position.</li>
<li><code>?????</code> → every five-letter word, useful when you only know the length.</li>
<li><code>??ING</code> → five-letter words ending in ING.</li>
</ul></section>` +
        TOOL_LINKS,
      faqs,
      jsonLd: [appSchema("Lexora Crossword Solver", "Pattern-match crossword answers from the letters you already know.", abs(path)), faqSchema(faqs)],
    };
  }

  if (path === "/word-finder") {
    const faqs = TOOL_FAQS[path];
    return {
      title: "Word Unscrambler & Anagram Solver — Unscramble Any Letters | Lexora",
      description:
        "Free word unscrambler and anagram solver. Enter your letters to see every valid word you can make, sorted by score and length, with a filter for 5-letter Wordle answers.",
      h1: "Word unscrambler — turn any letters into every valid word",
      quickAnswer:
        "Type your letters in any order and Lexora unscrambles them into every valid dictionary word, including all shorter sub-words, sorted by length and Scrabble score. Filter to an exact length between 2 and 7 for Wordle and crosswords, and use ? for a blank or wildcard letter.",
      bodyHtml:
        `<section><h2>How to unscramble letters</h2><ol>
<li>Enter your letters — order does not matter, and <code>?</code> works as a wildcard.</li>
<li>Optionally pick an exact word length (set 5 for Wordle).</li>
<li>Search. Every anagram and sub-word appears, scored and sorted.</li>
</ol></section>
<section><h2>Popular unscrambles</h2><ul>
<li><a href="/unscramble/listening">Unscramble LISTENING</a></li>
<li><a href="/unscramble/stare">Unscramble STARE</a></li>
<li><a href="/unscramble/retains">Unscramble RETAINS</a></li>
<li><a href="/unscramble/silent">Unscramble SILENT</a></li>
</ul></section>` +
        TOOL_LINKS,
      faqs,
      jsonLd: [appSchema("Lexora Word Unscrambler", "Unscramble any letters into every valid dictionary word.", abs(path)), faqSchema(faqs)],
    };
  }

  /* ---------------- Words hub ---------------- */
  if (path === "/words") {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    return {
      title: "Word Lists by Letter and Length — Full Dictionary Index | Lexora",
      description:
        "Browse every word list on Lexora: words starting with each letter, words ending in each letter, and 3 to 7 letter words containing a given letter, all with Scrabble scores.",
      h1: "Word lists by starting letter, ending letter and length",
      quickAnswer:
        "This index links every browsable word list on Lexora. Pick a starting letter, an ending letter, or a length-plus-letter combination such as five-letter words with A. Each list is drawn from the TWL tournament dictionary and shows the Scrabble tile score for every word.",
      bodyHtml:
        `<section><h2>Words starting with</h2><ul>${letters.map((l) => `<li><a href="/words/starting-with/${l}">Words starting with ${l.toUpperCase()}</a></li>`).join("")}</ul></section>
<section><h2>Words ending in</h2><ul>${letters.map((l) => `<li><a href="/words/ending-in/${l}">Words ending in ${l.toUpperCase()}</a></li>`).join("")}</ul></section>
<section><h2>By length</h2><ul>${[3, 4, 5, 6, 7].flatMap((n) => letters.slice(0, 8).map((l) => `<li><a href="/words/${n}-letter-words-with-${l}">${n} letter words with ${l.toUpperCase()}</a></li>`)).join("")}</ul></section>` +
        TOOL_LINKS,
    };
  }

  /* ---------------- Programmatic: starting with ---------------- */
  let m = path.match(/^\/words\/starting-with\/([a-z])$/);
  if (m) {
    const L = m[1].toUpperCase();
    const words = TWL.filter((w) => w.startsWith(L)).sort((a, b) => a.length - b.length || a.localeCompare(b));
    const total = words.length;
    const faqs: FAQ[] = [
      { q: `How many words start with ${L}?`, a: `There are ${total.toLocaleString()} words beginning with ${L} in the TWL tournament dictionary used for Scrabble in North America.` },
      { q: `What is the shortest word starting with ${L}?`, a: `The shortest entries are ${words.slice(0, 5).join(", ")}. Short words starting with ${L} are the most useful for parallel plays.` },
      { q: `What is a high-scoring word starting with ${L}?`, a: `${[...words].sort((a, b) => scoreWord(b) - scoreWord(a))[0] ?? L} is among the highest-scoring ${L} words at ${scoreWord([...words].sort((a, b) => scoreWord(b) - scoreWord(a))[0] ?? "")} tile points.` },
    ];
    return {
      title: `Words Starting With ${L} — ${total.toLocaleString()} Scrabble-Valid Words | Lexora`,
      description: `Every word starting with ${L} that is valid in Scrabble, grouped by length with tile scores. ${total.toLocaleString()} words from the TWL dictionary, plus UK SOWPODS checking.`,
      h1: `Words starting with ${L}`,
      quickAnswer: `There are ${total.toLocaleString()} Scrabble-valid words starting with the letter ${L}. They range from ${words[0] ?? ""} upward and are listed below shortest first, each with its Scrabble tile score. Every word is validated against the TWL tournament dictionary, and you can open any of them in the Scrabble solver to see its hooks and extensions.`,
      bodyHtml: `<section><h2>All words starting with ${L}</h2>${wordGrid(words)}</section>` + TOOL_LINKS,
      faqs,
      jsonLd: [listSchema(`Words starting with ${L}`, abs(path), words), faqSchema(faqs)],
    };
  }

  /* ---------------- Programmatic: ending in ---------------- */
  m = path.match(/^\/words\/ending-in\/([a-z])$/);
  if (m) {
    const L = m[1].toUpperCase();
    const words = TWL.filter((w) => w.endsWith(L)).sort((a, b) => a.length - b.length || a.localeCompare(b));
    const total = words.length;
    const faqs: FAQ[] = [
      { q: `How many words end in ${L}?`, a: `${total.toLocaleString()} words in the TWL Scrabble dictionary end with the letter ${L}.` },
      { q: `Why are words ending in ${L} useful in Scrabble?`, a: `Endings are the strongest hook family in Scrabble. Adding a single ${L} to an existing board word can score that whole word again alongside your own play.` },
    ];
    return {
      title: `Words Ending In ${L} — ${total.toLocaleString()} Valid Words & Scores | Lexora`,
      description: `Every Scrabble-valid word ending in ${L}, sorted by length with tile scores. ${total.toLocaleString()} words from the TWL dictionary — ideal for hooks, crosswords and Wordle.`,
      h1: `Words ending in ${L}`,
      quickAnswer: `${total.toLocaleString()} Scrabble-valid words end in the letter ${L}. They are listed below shortest first with tile scores. Word endings are the most valuable hooks in Scrabble because a single added letter can rescore an opponent's whole word, so short ${L} endings are worth memorising first.`,
      bodyHtml: `<section><h2>All words ending in ${L}</h2>${wordGrid(words)}</section>` + TOOL_LINKS,
      faqs,
      jsonLd: [listSchema(`Words ending in ${L}`, abs(path), words), faqSchema(faqs)],
    };
  }

  /* ---------------- Programmatic: n-letter words with X ---------------- */
  m = path.match(/^\/words\/(\d+)-letter-words-with-([a-z])$/);
  if (m) {
    const n = parseInt(m[1], 10);
    const L = m[2].toUpperCase();
    const words = TWL.filter((w) => w.length === n && w.includes(L)).sort();
    const total = words.length;
    const top = [...words].sort((a, b) => scoreWord(b) - scoreWord(a)).slice(0, 10);
    const faqs: FAQ[] = [
      { q: `How many ${n} letter words contain ${L}?`, a: `${total.toLocaleString()} ${n}-letter words in the TWL Scrabble dictionary contain the letter ${L}.` },
      { q: `What is the highest scoring ${n} letter word with ${L}?`, a: top[0] ? `${top[0]} scores ${scoreWord(top[0])} tile points, the highest among ${n}-letter words containing ${L}.` : `No entry available.` },
      ...(n === 5 ? [{ q: `Can I use this list for Wordle?`, a: `Yes. Every answer here is exactly five letters and contains ${L}, so once Wordle confirms a ${L} you can work straight down this list.` }] : []),
    ];
    return {
      title: `${n} Letter Words With ${L} — All ${total.toLocaleString()} Words${n === 5 ? " (Wordle Help)" : ""} | Lexora`,
      description: `Complete list of ${n} letter words containing ${L}, with Scrabble scores.${n === 5 ? " Perfect for narrowing Wordle guesses." : ""} ${total.toLocaleString()} valid words from the TWL dictionary.`,
      h1: `${n} letter words with ${L}`,
      quickAnswer: `There are ${total.toLocaleString()} valid ${n}-letter words containing the letter ${L}. The highest scoring is ${top[0] ?? "—"} at ${top[0] ? scoreWord(top[0]) : 0} Scrabble points. ${n === 5 ? "Because every entry is exactly five letters, this list doubles as a Wordle shortlist once you know the puzzle contains " + article(L) + " " + L + "." : "All words are validated against the TWL tournament dictionary."}`,
      bodyHtml:
        `<section><h2>Highest scoring ${n} letter words with ${L}</h2>${wordGrid(top, 10)}</section>
<section><h2>All ${n} letter words with ${L}</h2>${wordGrid(words, 400)}</section>` + TOOL_LINKS,
      faqs,
      jsonLd: [listSchema(`${n} letter words with ${L}`, abs(path), words), faqSchema(faqs)],
    };
  }

  /* ---------------- Programmatic: unscramble ---------------- */
  m = path.match(/^\/unscramble\/([a-z]+)$/);
  if (m) {
    const rack = m[1].toUpperCase();
    const words = TWL.filter((w) => w.length <= rack.length && canMake(w, rack))
      .sort((a, b) => b.length - a.length || scoreWord(b) - scoreWord(a) || a.localeCompare(b));
    const total = words.length;
    const longest = words.filter((w) => w.length === (words[0]?.length ?? 0)).slice(0, 8);
    const faqs: FAQ[] = [
      { q: `How many words can you make from ${rack}?`, a: `${total.toLocaleString()} valid dictionary words can be made from the letters in ${rack}.` },
      { q: `What is the longest word using the letters ${rack}?`, a: longest.length ? `${longest.join(", ")} — ${longest[0].length} letters.` : `No full-length anagram exists for ${rack}.` },
      { q: `Is ${rack} itself a valid Scrabble word?`, a: TWL.includes(rack) ? `Yes. ${rack} is valid in the TWL Scrabble dictionary and scores ${scoreWord(rack)} points.` : `${rack} is not listed in the TWL Scrabble dictionary, but the letters still make ${total.toLocaleString()} other valid words.` },
    ];
    return {
      title: `Unscramble ${rack} — ${total.toLocaleString()} Words From These Letters | Lexora`,
      description: `Unscramble the letters ${rack} into all ${total.toLocaleString()} valid words, sorted longest first with Scrabble scores. Free anagram solver for Scrabble, Wordle and word puzzles.`,
      h1: `Unscramble ${rack}`,
      quickAnswer: `The letters ${rack} unscramble into ${total.toLocaleString()} valid dictionary words. The longest ${longest.length ? `is ${longest[0]} (${longest[0].length} letters)` : "words are listed below"}, and every result is checked against the TWL Scrabble dictionary with its tile score shown. Shorter sub-words are included because they are what most Scrabble racks actually play.`,
      bodyHtml:
        `<section><h2>Longest words from ${rack}</h2>${wordGrid(longest, 8)}</section>
<section><h2>All words from the letters ${rack}</h2>${wordGrid(words, 300)}</section>` + TOOL_LINKS,
      faqs,
      jsonLd: [listSchema(`Words from the letters ${rack}`, abs(path), words), faqSchema(faqs)],
    };
  }

  /* ---------------- Blog ---------------- */
  if (path === "/blog") {
    return {
      title: "Scrabble & Crossword Strategy Guides | Lexora Blog",
      description:
        "In-depth guides on Scrabble strategy, crossword solving methods, high-scoring words and vocabulary building — written for players who want to win more games.",
      h1: "Scrabble and crossword strategy guides",
      quickAnswer:
        "The Lexora blog covers Scrabble scoring strategy, crossword solving methods and vocabulary building. Each guide is a complete reference — the full two-letter word list, every Q-without-U word, the seven-step crossword clue method — written to be used mid-game rather than skimmed.",
      bodyHtml:
        `<section><h2>All articles</h2><ul>${Object.entries(BLOG)
          .map(([slug, p]) => `<li><a href="/blog/${slug}"><strong>${esc(p.title)}</strong></a><p>${esc(p.description)}</p></li>`)
          .join("")}</ul></section>` + TOOL_LINKS,
    };
  }

  m = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (m && BLOG[m[1]]) {
    const p = BLOG[m[1]];
    return {
      title: `${p.title} | Lexora`,
      description: p.description,
      h1: p.title,
      quickAnswer: p.description,
      bodyHtml:
        `<p>Read the full guide on Lexora, then put it to work in the <a href="/scrabble-solver">Scrabble word finder</a> or the <a href="/crossword-solver">crossword solver</a>.</p>` +
        TOOL_LINKS,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.description,
          mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
          url: abs(path),
          author: { "@type": "Organization", name: p.author },
          datePublished: p.published,
          dateModified: p.modified,
          publisher: { "@type": "Organization", name: "Lexora", url: SITE_URL },
        },
      ],
    };
  }

  /* ---------------- Static trust pages ---------------- */
  const STATIC: Record<string, Page> = {
    "/about": {
      title: "About Lexora — Who Builds These Word Tools",
      description: "Lexora builds free, fast, dictionary-accurate word tools for Scrabble, crossword and puzzle players. Here is who we are and how the tools work.",
      h1: "About Lexora",
      quickAnswer: "Lexora builds free word-game tools — a Scrabble word finder, crossword solver and word unscrambler — validated against the TWL (US) and SOWPODS (UK) tournament dictionaries. Everything runs in your browser, with no account and no limits on searches.",
      bodyHtml: TOOL_LINKS,
    },
    "/contact": {
      title: "Contact Lexora",
      description: "Get in touch with the Lexora team about word tools, dictionary corrections, partnerships or press.",
      h1: "Contact Lexora",
      quickAnswer: "Reach the Lexora team at hello@lexorawords.com for dictionary corrections, feature requests, partnership enquiries or press. We reply to most messages within two business days.",
      bodyHtml: TOOL_LINKS,
    },
    "/privacy": {
      title: "Privacy Policy | Lexora",
      description: "How Lexora handles analytics, cookies and advertising data, and the choices available to you.",
      h1: "Privacy policy",
      quickAnswer: "Lexora collects only anonymous page analytics and, with your consent, serves advertising. You control both through the cookie banner, and dictionary searches never leave your browser.",
      bodyHtml: "",
    },
    "/terms": {
      title: "Terms of Service | Lexora",
      description: "The terms that apply when you use Lexora's word tools and content.",
      h1: "Terms of service",
      quickAnswer: "These terms cover acceptable use of Lexora's free word tools, the accuracy of dictionary results, and the limits of our liability. Using the site means you accept them.",
      bodyHtml: "",
    },
  };
  if (STATIC[path]) return STATIC[path];

  /* ---------------- Fallback ---------------- */
  return {
    title: "Lexora — Scrabble Solver, Crossword & Word Finder",
    description: "Free Scrabble word finder, crossword solver and word unscrambler with US and UK dictionaries.",
    h1: "Lexora",
    quickAnswer: "Lexora is a free word-game toolkit for Scrabble, crosswords and anagram puzzles.",
    bodyHtml: TOOL_LINKS,
  };
}

/* ------------------------------------------------------------------ */
/* HTML assembly                                                       */
/* ------------------------------------------------------------------ */

function render(template: string, path: string, page: Page): string {
  const url = abs(path);
  const jsonLd = [...(page.jsonLd ?? [])];
  if (page.faqs?.length && !jsonLd.some((j: any) => j?.["@type"] === "FAQPage")) {
    jsonLd.push(faqSchema(page.faqs));
  }
  jsonLd.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: page.h1, item: url }]),
    ],
  });

  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${path.startsWith("/blog/") ? "article" : "website"}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="Lexora" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    ...jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`),
  ].join("\n    ");

  const body = [
    `<main class="prerender-shell">`,
    `<h1>${esc(page.h1)}</h1>`,
    `<p class="prerender-answer" data-quick-answer="true">${esc(page.quickAnswer)}</p>`,
    page.bodyHtml ?? "",
    page.faqs?.length ? faqHtml(page.faqs) : "",
    `</main>`,
  ].join("\n");

  let html = template;
  // Strip the template's own head metadata so there is exactly one of each tag.
  html = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/i, "")
    .replace(/<meta\s+property="og:(?:type|title|description|url|site_name)"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:(?:card|title|description)"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "");

  html = html.replace("</head>", `    ${head}\n    <style id="prerender-style">.prerender-shell{max-width:56rem;margin:0 auto;padding:2.5rem 1.25rem 4rem;font-family:system-ui,-apple-system,"Plus Jakarta Sans",sans-serif;color:#1c1917;line-height:1.6}.prerender-shell h1{font-size:1.9rem;line-height:1.2;margin:0 0 .75rem}.prerender-shell h2{font-size:1.25rem;margin:2rem 0 .5rem}.prerender-shell h3{font-size:1rem;margin:1rem 0 .25rem}.prerender-answer{font-size:1.05rem;color:#44403c}.prerender-shell a{color:#c2410c;text-decoration:none}.prerender-words{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(11rem,1fr));gap:.35rem}@media(prefers-color-scheme:dark){.prerender-shell{color:#fafaf9}.prerender-answer{color:#d6d3d1}}</style>\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

function routesFromSitemap(): string[] {
  const files = ["public/sitemap.xml", "public/sitemap-pages.xml", "public/sitemap-words.xml", "public/sitemap-blog.xml"];
  const out = new Set<string>();
  for (const f of files) {
    if (!existsSync(resolve(f))) continue;
    const xml = readFileSync(resolve(f), "utf8");
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const loc = match[1].trim();
      if (loc.endsWith(".xml")) continue;
      const path = loc.replace(SITE_URL, "") || "/";
      if (path.startsWith("/")) out.add(path);
    }
  }
  return Array.from(out);
}

function main() {
  const templatePath = join(DIST, "index.html");
  if (!existsSync(templatePath)) {
    console.log("prerender: dist/index.html not found — skipping");
    return;
  }
  const template = readFileSync(templatePath, "utf8");
  const routes = routesFromSitemap();
  if (!routes.length) {
    console.log("prerender: no routes found in sitemap — skipping");
    return;
  }
  if (!TWL.length) console.warn("prerender: TWL dictionary not found; word lists will be empty");

  let count = 0;
  for (const path of routes) {
    const page = buildPage(path);
    const html = render(template, path, page);
    if (path === "/") {
      writeFileSync(templatePath, html);
    } else {
      const dir = join(DIST, path.replace(/^\//, ""));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), html);
    }
    count++;
  }
  console.log(`prerender: wrote ${count} static HTML pages`);
}

main();
