
# Evergreen Blog Content System

Goal: Replace the placeholder blog teasers with real, long-form, evergreen articles targeting high-intent Scrabble / crossword / word-game searchers — structured to satisfy Google's Helpful Content guidelines and meet the AdSense "valuable, original content" bar.

## 1. Target topics (evergreen, high search intent)

Picked based on what word-game players consistently search year-round (not news/seasonal). Each pairs with a tool on the site so we get strong internal-link signals.

| # | Slug | Title | Primary keyword | Links to tool |
|---|---|---|---|---|
| 1 | `words-with-q-no-u` | Every Q-Without-U Word Allowed in Scrabble (and How to Use Them) | "words with q no u" | Scrabble Solver |
| 2 | `2-letter-scrabble-words` | The Complete List of 2-Letter Scrabble Words (Memorize These First) | "2 letter scrabble words" | Scrabble Solver |
| 3 | `high-scoring-scrabble-words` | 50 Highest-Scoring Scrabble Words That Actually Get Played | "high scoring scrabble words" | Scrabble Solver |
| 4 | `how-to-solve-crossword-clues` | How to Solve Any Crossword Clue: A 7-Step Method | "how to solve crossword clues" | Crossword Solver |
| 5 | `crossword-clue-patterns` | Crossword Pattern Matching: Decode `C_A__T` in Seconds | "crossword pattern solver" | Crossword Solver |
| 6 | `words-from-letters` | How to Find Every Word From a Set of Letters | "words from letters" | Word Finder |
| 7 | `scrabble-bingo-strategy` | Scrabble Bingo Strategy: How Pros Score 50-Point Bonuses | "scrabble bingo" | Scrabble Solver |
| 8 | `build-vocabulary-word-games` | Build a 10,000-Word Vocabulary Using Word Games | "improve vocabulary word games" | Word Finder + Blog |

All eight are evergreen (timeless rules, dictionaries, methods) — no dates, no "2026 trends".

## 2. Information architecture

```
/blog                    → Blog index (filterable by category)
/blog/:slug              → Article page
```

Routes are relative — when the new domain ships, only the canonical base needs swapping (handled in one place via a `SITE_URL` constant). No content moves.

Each article: ~1,200–1,800 words, with:
- H1 (the title) + meta description
- Table of contents (anchor links)
- 3–6 H2 sections, H3 sub-sections
- A worked example using the relevant on-site tool (with a CTA: "Try this in the Scrabble Solver →")
- FAQ section (3–5 Q&As) → eligible for FAQ rich snippets
- "Related reading" block at bottom linking to 3 other articles
- Inline contextual links to 2–4 other articles within prose
- Author, read time, published date

## 3. SEO & schema

- `<Helmet>` per post: unique title, meta description, canonical (relative path), `og:title`, `og:description`, `og:type=article`, `og:image` (the thumbnail).
- JSON-LD: `Article` schema + `BreadcrumbList` + `FAQPage` (for posts with FAQ).
- Single H1 per page, semantic `<article>`, `<section>`, `<nav>` for breadcrumbs.
- Image `alt` text on every thumbnail.
- Internal linking: index → posts, post → related posts, post → solver tool, footer → top posts.
- Add `/blog` and each `/blog/:slug` to `public/sitemap.xml` (manually for now — 9 URLs).
- `robots.txt` already allows crawling.

## 4. Thumbnails

Generate 8 unique, on-brand hero images with the image generator (premium tier for the 3 most important; fast for the rest to save credits). Style: dark editorial background, glowing Scrabble tiles / crossword grid motif matching site palette. Stored as `.asset.json` pointers (CDN-hosted, keeps repo light).

## 5. AdSense placement (already wired)

Within each article, drop existing `<AdSlot>` components at:
- After the intro paragraph (`blog-inline` zone)
- Mid-article (after ~50% scroll point in the markup)
- End of article (before related-reading block)

Ads only render once consent is granted and the zone is enabled in `/admin` — already implemented.

## 6. Content quality bar (for Google + AdSense approval)

- Original prose — no scraped lists, no AI-obvious filler.
- First-person where helpful ("I've played 2,000 tournament games…").
- Concrete examples with real word lists, real point values, real grid patterns.
- Disclose dictionary used (TWL vs SOWPODS) where relevant.
- No thin content — every page > 1,200 words of substance.
- Author bylines kept consistent with the existing placeholder authors.

## 7. Files to create / edit

**Create:**
- `src/content/blog/index.ts` — typed array of all 8 post metadata (slug, title, description, thumbnail import, author, readTime, category, tags, related slugs)
- `src/content/blog/posts/` — one `.tsx` per article exporting its body as JSX (so we can use `<AdSlot>`, internal `<Link>`s, headings — no MDX dependency needed)
- `src/pages/BlogPost.tsx` — dynamic article page (reads slug, renders post body, schema, breadcrumbs, ads, related posts)
- `src/assets/blog/<slug>.jpg.asset.json` × 8 — generated thumbnails

**Edit:**
- `src/pages/Blog.tsx` — replace hardcoded `posts` array with the real index; wire category filter; link cards to `/blog/:slug`
- `src/App.tsx` — add `<Route path="/blog/:slug" element={<BlogPost />} />`
- `public/sitemap.xml` — add the 9 blog URLs
- `src/components/Footer.tsx` — add "Popular guides" column linking 3 top posts (extra internal linking)

## 8. Domain-swap readiness

A single `SITE_URL` constant in `src/lib/seo.ts` feeds canonical + og:url for every page. When the new domain arrives, that one value changes and all 9+ blog pages update. No content URLs change — slugs stay the same forever, which preserves Google ranking.

## 9. Out of scope (for later)

- CMS / database-backed posts (current JSX approach is faster + better for SEO since content is in initial HTML)
- Comments system
- Newsletter signup
- More than 8 articles (we'll add more in batches after these index)
