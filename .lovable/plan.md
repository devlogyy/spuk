# Phase B — Programmatic SEO Pages

Goal: ship ~650 evergreen, indexable pages built from the existing TWL/SOWPODS dictionaries so Lexora can compete with wordfinder.com / yourdictionary on long-tail "words …" queries. Each page is real content (real word lists, real scores, real H1/intro/FAQ), not thin templates.

## Page patterns

| Pattern | Route | Count | Example query it targets |
|---|---|---|---|
| Words starting with a letter | `/words/starting-with/:letter` | 26 | "words that start with q" |
| Words ending in a letter | `/words/ending-in/:letter` | 26 | "words ending in y" |
| N-letter words containing a letter | `/words/:n-letter-words-with-:letter` | ~100 (n=3–7, a–z, minus thin combos) | "5 letter words with a" |
| Unscramble specific letters | `/unscramble/:letters` | ~500 popular racks | "unscramble listening" |

Total: ~650 pages, all in the sitemap, all internally linked.

## Page anatomy (shared)

Every generated page renders:

1. Breadcrumbs (`Home › Words › …`)
2. H1 specific to the query (e.g. "5-Letter Words With A")
3. 80–120 word intro paragraph (templated but query-specific: counts, top score, sample uses)
4. Word list grouped by length, each word linking to a search on the relevant tool (`/scrabble-solver?q=…`) and showing Scrabble score + US/UK validity badges
5. "Top 10 highest-scoring" callout
6. "How we generated this list" + dictionary attribution (TWL06 / SOWPODS)
7. 3–5 question FAQ section with `FAQPage` JSON-LD
8. "Related" internal links: 2 sibling pages + 1 relevant tool + 1 relevant blog post
9. Per-route `<Helmet>`: absolute canonical, og:url, og:type=article, Twitter card, `CollectionPage` + `ItemList` JSON-LD

Same design language as existing tool pages — no new components from scratch; reuse `WordCard`, breadcrumbs, `ToolFAQ`.

## Architecture

- **Dictionary access**: reuse `src/lib/dictionary.ts` (already lazy-loads + caches in localStorage). Add a thin `src/lib/programmatic.ts` with pure query helpers: `wordsStartingWith(letter)`, `wordsEndingIn(letter)`, `nLetterWordsContaining(n, letter)`, `unscramble(letters)`. These wrap `loadDictionary` and filter — no new fetch logic.
- **Route registration**: 4 new routes in `src/App.tsx`, all dynamic params:
  - `/words/starting-with/:letter`
  - `/words/ending-in/:letter`
  - `/words/:variant` (handles `5-letter-words-with-a` shape via param parsing)
  - `/unscramble/:letters`
- **Page components** in `src/pages/programmatic/`:
  - `WordsStartingWith.tsx`
  - `WordsEndingIn.tsx`
  - `NLetterWordsWith.tsx`
  - `Unscramble.tsx`
- **Hub page** at `/words` (`src/pages/WordsHub.tsx`) — index of all 4 patterns with A–Z grids and length pickers. This is the internal-link backbone and the page that distributes PageRank to all 650 leaves.
- **Popular racks list**: `src/content/popular-racks.ts` — curated list of ~500 high-volume "unscramble X" queries (common 5–8 letter anagrams: LISTENING, SILENT, INTEGRAL, etc.). Sourced from common-word frequency + known popular searches.
- **Param validation**: invalid params (e.g. `/words/starting-with/zz`) render `<NotFound />` with noindex so Google doesn't index junk.

## Sitemap automation

Extend `scripts/generate-sitemap.ts`:
- Add 26 starting-with + 26 ending-in entries (static enumeration)
- Add ~100 N-letter-with entries (enumerate n=3..7 × a..z, skip combos with zero results — precomputed at build time by loading dict from `/public/dict`)
- Import popular racks list, add 500 unscramble entries
- Add `/words` hub
- Result: sitemap grows from 13 → ~670 entries, all with `<lastmod>` and `<changefreq>monthly</changefreq>`

The script runs in Node, so it'll read dict files from `public/dict/` via `fs` (not `fetch`) and precompute counts. Adds ~2s to predev/prebuild — acceptable.

## Internal linking

- Navbar: no change (don't clutter)
- Footer: add a "Browse Words" column linking to `/words` hub
- Tool pages: existing "Related guides" section gets one extra link to the most relevant hub category
- Each programmatic page links to 2 siblings + 1 tool + 1 blog post — creates a dense link graph that helps Google crawl + rank the whole cluster

## What this does NOT change

- No backend, no DB, no auth, no admin
- No solver logic changes
- No new dictionary files (uses existing twl06.txt + sowpods.txt)
- No AdSense changes
- No design system changes — reuses existing tokens + components

## Files to create

- `src/lib/programmatic.ts` — query helpers
- `src/pages/WordsHub.tsx`
- `src/pages/programmatic/WordsStartingWith.tsx`
- `src/pages/programmatic/WordsEndingIn.tsx`
- `src/pages/programmatic/NLetterWordsWith.tsx`
- `src/pages/programmatic/Unscramble.tsx`
- `src/content/popular-racks.ts` — curated ~500 anagram seeds
- `src/components/ProgrammaticPageShell.tsx` — shared layout (breadcrumbs, intro, list, FAQ, related)

## Files to edit

- `src/App.tsx` — register 5 new routes
- `src/components/Footer.tsx` — add "Browse Words" column
- `scripts/generate-sitemap.ts` — enumerate all programmatic routes
- `.lovable/plan.md` — record Phase B completion

## Realistic outcome

650 indexable pages, each targeting 5–50 long-tail queries. Indexing takes 2–6 weeks for the bulk of them. Realistic 1–3 month traffic: 3,000–15,000 sessions/month, growing with indexing. This is the lever that gets Lexora to the 10–20k target.

## Build sequence (when approved)

1. Query helpers + popular racks list
2. Shared page shell + the 4 page components
3. Hub page + footer link + routes
4. Sitemap generator extension
5. Smoke test: `/words`, one route per pattern, sitemap entry count
