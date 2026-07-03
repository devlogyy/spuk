# Phase D — Topical Authority & Result-Page SEO

Builds on Phases A–C. Four focused additions, all in frontend/presentation.

## 1. Internal linking blocks ("Related tools")

New component `src/components/RelatedTools.tsx` — a compact card grid linking Scrabble Solver, Crossword Solver, Word Finder, Anagram (Word Finder w/ preset), Words Hub, plus 2–3 contextual programmatic links (e.g. "Words ending in ING", "5-letter words with A"). Each card: icon, title, one-line description, semantic `<a>` with descriptive anchor text.

Mount on:
- `src/pages/ScrabbleSolver.tsx`
- `src/pages/CrosswordSolver.tsx`
- `src/pages/WordFinder.tsx`
- `src/pages/WordsHub.tsx`
- `src/components/ProgrammaticPageShell.tsx` (all `/words/*` pages)

Each mount excludes the current page and picks 4–6 contextually relevant siblings. Anchor text varies per host page (avoid duplicate anchor patterns) to strengthen topical clustering without looking templated.

## 2. Blog preview section — Article schema + premium card SEO

Target: the blog list on `src/pages/Blog.tsx` and the "Latest from the blog" preview on `src/pages/Home.tsx`.

Changes:
- Add `articleSchema()` and `itemListSchema()` helpers to `src/lib/seo.ts`.
- Emit one `ItemList` of `Article` items in `Blog.tsx` `<Helmet>` (headline, description, url, datePublished, author, image if available).
- Rewrite blog card markup: `<article>` wrapper, single `<h2>` per card (was likely `<h3>`/`<div>`), `<time datetime>` for date, `<p>` excerpt trimmed to ~160 chars, descriptive `aria-label` on the read-more link ("Read: {title}"), `rel="bookmark"` on the title link.
- On `Home.tsx` preview: same card treatment + `itemListSchema` of the featured 3.
- No visual redesign — keep current premium card styling; only adjust HTML tags and text.

## 3. Results UI — SEO-ready markup + structured data

Applies to result blocks in `ScrabbleSolver.tsx`, `CrosswordSolver.tsx`, `WordFinder.tsx`, and the four `src/pages/programmatic/*` pages via `ProgrammaticPageShell`.

Changes:
- Wrap the result grid in `<section aria-labelledby="results-heading">` with a visible `<h2 id="results-heading">Results for "{query}" ({n} words)</h2>` (screen-reader-visible; can be `sr-only` if design forbids it, but preference is visible for SEO).
- Emit `ItemList` JSON-LD of the top 20 results per query (word + score + length) inside `<Helmet>` when `submitted && results.length > 0`. Extract a shared `resultsItemListSchema()` helper in `seo.ts`.
- Add `<meta name="robots" content="noindex,follow">` on solver/finder pages **only when a query is submitted** — search-result pages shouldn't be indexed, but their outbound links should still flow authority. Programmatic `/words/*` pages stay indexable (they're the canonical result targets).
- Each `WordCard` becomes `<article>` with a single `<h3>` for the word and `data-*` attributes for score/length so crawlers can parse structure.

## 4. Answer-first intro + HowTo/Speakable on search interface

Target: `src/pages/Home.tsx` (the main search entry / hero).

Changes:
- Rewrite the hero intro to answer-first: one bold sentence directly defining what Lexora does + who it's for, then a two-sentence expansion. Class `speakable-h1` on the H1 and `speakable-intro` on the paragraph (matches the pattern set in Phase C).
- Add `howToSchema()` block: "How to find any word with Lexora" — 3 steps (choose tool, enter letters/pattern, get ranked results).
- Add `speakableSchema([".speakable-h1", ".speakable-intro"])` block.
- Both JSON-LD blocks emitted via `<Helmet>` alongside the existing schemas.

## Files

**New**
- `src/components/RelatedTools.tsx`

**Edited**
- `src/lib/seo.ts` — add `articleSchema`, `itemListSchema`, `resultsItemListSchema` helpers
- `src/pages/Home.tsx` — answer-first hero, HowTo + Speakable JSON-LD, ItemList of featured posts, RelatedTools not needed (it *is* the hub)
- `src/pages/Blog.tsx` — Article/ItemList schema, semantic card markup
- `src/pages/ScrabbleSolver.tsx` — RelatedTools, results section semantics, conditional noindex, ItemList of results
- `src/pages/CrosswordSolver.tsx` — same
- `src/pages/WordFinder.tsx` — same
- `src/pages/WordsHub.tsx` — RelatedTools
- `src/components/ProgrammaticPageShell.tsx` — RelatedTools + results section semantics + ItemList (already has DefinedTermSet from Phase C; ItemList is additive)
- `src/components/WordCard.tsx` — swap wrapper to `<article>`, promote word to `<h3>`

## Out of scope (defer)
- Per-post `author` / `lastReviewed` schema on individual blog posts (Phase E)
- `sameAs` entity links, citation formatting
- SSR/prerender, public JSON API
