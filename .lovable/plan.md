# Phase C — AI Search Engine Optimization

Make Lexora legible to AI crawlers (ChatGPT, Perplexity, Claude, Google AI Overviews, Bing Copilot) so it gets cited in AI answers, not just ranked in blue links.

## What changes

### 1. `/llms.txt` (new file: `public/llms.txt`)
Markdown index at site root that AI crawlers read instead of parsing our JS shell. Structure:
- H1: `# Lexora`
- Blockquote summary
- Sections: **Tools** (Scrabble Solver, Crossword Solver, Word Finder), **Word Lists** (hub + representative programmatic pages), **Blog** (all 8 posts), **Optional** (Home, About-style links)
- Excludes `/admin`, `/auth`

### 2. Explicit AI crawler allow-list (`public/robots.txt`)
Add named `User-agent` blocks for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-Web`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Bytespider`, `Amazonbot` — each with `Allow: /` and the same `Disallow: /admin`, `/auth` rules. Keeps the existing `User-agent: *` block.

### 3. Answer-first content rewrites (tool pages)
Rewrite the opening paragraph under each tool's H1 so the first 1–2 sentences directly answer the primary intent question (e.g. "A Scrabble word finder returns every valid word you can play from a rack of letters. Lexora's solver…"). Affects: `Home.tsx`, `ScrabbleSolver.tsx`, `CrosswordSolver.tsx`, `WordFinder.tsx`. Keep existing visual layout.

### 4. `HowTo` + `Speakable` schema on tool pages
Add two JSON-LD blocks per tool page:
- `HowTo` — 3–4 numbered steps (enter letters → pick length → tap Find). Makes the page eligible for AI "how to use" citations.
- `SpeakableSpecification` — CSS selectors for H1 + first paragraph, so voice assistants can read them aloud.

Extend `src/lib/seo.ts` with `howToSchema()` and `speakableSchema()` helpers.

### 5. `DefinedTermSet` schema on programmatic word pages
Add a third JSON-LD block in `ProgrammaticPageShell.tsx` describing the word list as a `DefinedTermSet` (each word = `DefinedTerm`). This is what LLMs prefer over generic `ItemList` when they cite dictionary-style content. Cap at 50 terms per page to keep payload sane.

## Files touched

**New:**
- `public/llms.txt`

**Edited:**
- `public/robots.txt` — add AI crawler blocks
- `src/lib/seo.ts` — add `howToSchema`, `speakableSchema`, `definedTermSetSchema` helpers
- `src/pages/Home.tsx` — answer-first intro
- `src/pages/ScrabbleSolver.tsx` — answer-first intro + HowTo + Speakable JSON-LD
- `src/pages/CrosswordSolver.tsx` — same
- `src/pages/WordFinder.tsx` — same
- `src/components/ProgrammaticPageShell.tsx` — add DefinedTermSet JSON-LD

## Out of scope (deferred, previously items 6–10)

Citation formatting polish, `sameAs` entity links, per-post `lastReviewed`/`author` schema, SSR/prerender, public JSON API. Say the word if you want any of these next.

## Expected impact

Within 4–8 weeks: appearances in Perplexity/ChatGPT answers for "unscramble …", "words starting with …", "scrabble solver" queries; eligibility for Google AI Overviews on tool intents; voice assistant read-aloud support.