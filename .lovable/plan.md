## Goal
Expand the FAQ blocks on the three solver pages (Scrabble Solver, Crossword Solver, Word Finder) with additional unique, SEO-friendly questions and concise answers. The programmatic `/words/*` and `/unscramble/*` pages already ship per-page FAQ blocks with FAQPage JSON-LD via `ProgrammaticPageShell`; those stay as-is.

## What's already in place (no changes)
- `ProgrammaticPageShell` renders visible FAQ + injects `faqPageSchema` JSON-LD.
- Each programmatic template (`WordsStartingWith`, `WordsEndingIn`, `NLetterWordsWith`, `Unscramble`) supplies 4 unique FAQs interpolated with the page's letter / length / letters.
- Solver pages already render `ToolFAQ` + emit `faqPageSchema`, but each only has 5 FAQs and doesn't cover several long-tail queries (dictionary differences, safety, mobile use, offline, tips per tool).

## Changes (frontend copy only)

### 1) `src/pages/ScrabbleSolver.tsx`
Extend the `FAQS` array from 5 → 10 unique entries. Add:
- "What dictionary does the Scrabble Solver use?" (TWL06 vs SOWPODS)
- "Can I filter by starts-with, ends-with or contains?" (yes, describe filter UI)
- "How do I find bingo (7-letter) plays?" (min-length filter + rack strategy)
- "Does the solver work on mobile?" (yes, PWA-friendly, no install)
- "Are proper nouns and abbreviations included?" (no, standard rule)

### 2) `src/pages/CrosswordSolver.tsx`
Extend `FAQS` from 5 → 10. Add:
- "How long can my pattern be?" (up to 15 letters, standard grid max)
- "Can I use it for cryptic vs quick crosswords?" (works for both once you have letters)
- "What if my clue has a hyphen or space?" (treat each word separately, describe)
- "Does it help with themed puzzles (NYT, Guardian)?" (yes, pattern-agnostic)
- "How do I share a solved pattern?" (URL is stateful / copy pattern)

### 3) `src/pages/WordFinder.tsx`
Extend `FAQS` from 5 → 10. Add:
- "Can Word Finder solve Wordle?" (yes, use exact-length 5 filter)
- "How is Word Finder different from an anagram solver?" (subset vs full-anagram)
- "Does it show word definitions?" (link out to solver / word info)
- "Can I use it for Boggle or Scrabble Go?" (yes, adapt to game dictionary)
- "How fast is the search?" (client-side, sub-second, no network round-trip)

Each new question is:
- Unique across the three pages (no cross-page duplication).
- Answered in 1–2 concise sentences (≈40–90 chars question, ≈120–220 chars answer) — ideal for Google's People Also Ask + FAQ rich result eligibility.
- Written to target long-tail search intents ("scrabble solver mobile", "crossword solver cryptic", "wordle word finder").

## Technical notes
- No schema, JSON-LD, or component changes needed — `faqPageSchema(FAQS)` and `<ToolFAQ faqs={FAQS} />` automatically pick up the new items.
- No changes to `ProgrammaticPageShell`, `ToolFAQ`, `seo.ts`, or programmatic templates.
- No routing, backend, or dictionary logic touched. Pure copy expansion in three files.

## Files edited
- `src/pages/ScrabbleSolver.tsx` (FAQS array only)
- `src/pages/CrosswordSolver.tsx` (FAQS array only)
- `src/pages/WordFinder.tsx` (FAQS array only)
