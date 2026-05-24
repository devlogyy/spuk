# Lexora UX Clarity Pass

Goal: make every tool understandable in under 5 seconds, friendly to beginners while staying powerful for pros. No backend logic changes — UI/UX only.

## 1. Shared building blocks (new components)

- `src/components/SmartInput.tsx` — large input with: label, placeholder example, helper text under field ("Use ? for blanks"), example chip ("Try: AERST?"), inline syntax legend.
- `src/components/PrimaryActionButton.tsx` — bold gradient CTA, sticky on mobile (`fixed bottom-4 inset-x-4 sm:static`), shows loading spinner state.
- `src/components/EmptyState.tsx` — friendly illustration + suggestions + example chips (used when no search yet or no results).
- `src/components/LoadingResults.tsx` — animated skeleton word-cards + progress bar that fills during 400ms simulated "search".
- `src/components/HowItWorks.tsx` — 3-step mini walkthrough card (Enter letters → Tap Find → See best plays).
- `src/components/SyntaxHint.tsx` — small inline legend chip explaining `?` / `_` / `*`.
- `src/components/AdvancedFiltersAccordion.tsx` — wraps existing filters in shadcn `Collapsible`, collapsed by default.

## 2. Scrabble Solver (`src/routes/scrabble-solver.tsx`)

- Replace bare `TileInput` with `SmartInput`:
  - Label: "Your tiles"
  - Placeholder: `AERST?`
  - Helper: "Type your letters. Use `?` for blank tiles."
  - Example chips: `AERST?`, `QUARTZ`, `LISTENING` — click fills input.
- Add prominent **"Find Best Words"** PrimaryActionButton. Search now triggers on click (and Enter). Show LoadingResults briefly before results render.
- Move Starts/Ends/Contains/Min-length into `AdvancedFiltersAccordion` (collapsed by default). Dictionary toggle + sort stay visible.
- Empty state before first search: `EmptyState` with example racks + "Tap an example to try it".
- No-results state: friendly message + "Try removing a filter" + restore-defaults button.
- Add `HowItWorks` card above input on first visit.
- Result card: add small "Why this word?" tooltip explaining score breakdown.

## 3. Crossword Solver (`src/routes/crossword-solver.tsx`)

- `SmartInput` for pattern:
  - Placeholder: `C ? T ? ?`
  - Helper: "Use `?` for unknown letters. Spaces are ignored."
  - Example chips: `C?T??`, `_RA__E`, `Q__RTZ`.
  - Live preview line: `C ? T ? ? → CATCH` updates as user types.
- Accept both `?` and `_` (normalize internally) — current code only accepts `_`, confusing.
- Add **"Solve Puzzle"** PrimaryActionButton (sticky on mobile).
- Clue field gets clearer label: "Optional: paste the crossword clue for smarter ranking".
- Empty / no-match states with suggestions.

## 4. Word Finder (`src/routes/word-finder.tsx`)

- `SmartInput`:
  - Placeholder: `LISTENING`
  - Helper: "Enter your letters to find every possible word."
  - Example chips.
- **"Find Words"** PrimaryActionButton.
- Length filter stays visible (simple). Any extra filters go in accordion.
- Empty state with trending searches + "Try LISTENING" example.

## 5. Homepage (`src/routes/index.tsx`)

- Hero search: add helper text under input ("Type letters like `QUARTZN` — we'll find every word"), make CTA say **"Find words now"**, add 3 one-click example chips below.
- Add a "How Lexora works" 3-step section after the feature grid (Pick a tool → Enter letters/pattern → Get ranked answers).
- Trending searches already exist — keep, but make tappable chips bigger on mobile.

## 6. Mobile usability

- All primary inputs: `text-base` minimum, `h-14` on mobile, `inputMode="text"`, `autoCapitalize="characters"`, large clear (X) button.
- PrimaryActionButton on tool pages becomes a sticky bottom bar on `< sm` (safe-area inset padding), inline on desktop.
- Tap targets ≥ 44px. Filter chips: `min-h-11 px-4`.
- Increase result card spacing on mobile.

## 7. Accessibility & feedback

- Every input gets a real `<label>` (visible or `sr-only` + `aria-describedby` for helper text).
- Icon-only buttons get `aria-label`.
- Live region (`aria-live="polite"`) announces "N results found".
- Loading state announced.
- Use `text-foreground` / `text-muted-foreground` tokens — no arbitrary grays.

## 8. Out of scope (not touched)

- Backend / word generation logic stays as-is.
- SEO meta tags, routes, sitemap, dictionary data — unchanged.
- Brand colors, fonts, glass aesthetic — unchanged (only layout/clarity tweaks).

## Files touched
- New: `SmartInput.tsx`, `PrimaryActionButton.tsx`, `EmptyState.tsx`, `LoadingResults.tsx`, `HowItWorks.tsx`, `SyntaxHint.tsx`, `AdvancedFiltersAccordion.tsx`
- Edited: `routes/index.tsx`, `routes/scrabble-solver.tsx`, `routes/crossword-solver.tsx`, `routes/word-finder.tsx`, `components/TileInput.tsx` (mobile sizing)
