# Mobile polish, real solver functionality, and AI roadmap

## 1. Mobile "distortion" glitch

The most likely culprit is the **"Word of the day" section** on Home (`src/pages/Home.tsx`, lines 162-197):

- It uses a dark charcoal gradient background plus a giant 60×60 absolutely-positioned blur orb (`-right-10 -top-10 opacity-40 blur-3xl`).
- Inside it renders a 5xl→7xl gradient-clipped headline `QUARTZ` and a row of 12×12 "tile" squares.
- On narrow phones the headline + score badge + tile row overflow horizontally, the blur orb bleeds outside the rounded card, and `background-clip: text` on top of a translucent gradient produces the smeared/glitchy look the user is describing.

Fix:
- Add `overflow-hidden` is already there, but also wrap inner flex rows with `flex-wrap` and `min-w-0`.
- Cap headline at `text-4xl sm:text-6xl lg:text-7xl` (drop the 5xl baseline) and remove `text-gradient` on a dark surface — use a solid gold color instead so backdrop-clip doesn't fight the dark gradient.
- Shrink tile row to `h-9 w-9` on mobile, `sm:h-12 sm:w-12`.
- Shrink the score badge to `h-10 w-10` on mobile.
- Audit the same pattern on the hero (`text-gradient` headline) — keep it, but ensure the parent has `overflow-hidden`.

Also re-check `WordCard` rarity gradient overlay (`absolute inset-0 -z-0`) — on some Android Chromes a `-z-0` sibling under `relative z-10` content combined with `overflow-hidden` and `transition-shadow` can flicker. Switch the overlay to `pointer-events-none absolute inset-0` without negative z and put content in a normal flow div.

## 2. Buttons, menus, side-search and logo on mobile

Touch-target audit across Navbar, MobileNav, Home hero, Scrabble/WordFinder/Crossword pages:

- **Navbar logo**: shrink to `h-8 w-8` mark + tighter text on `<sm`; right-side cluster currently overflows because Search + Theme + "Try Solver" + Menu all render simultaneously. Hide the standalone Search button under `sm:` (it doesn't actually open anything yet) and hide "Try Solver" under `md:`.
- **Navbar buttons**: bump `h-9 w-9` → `h-10 w-10` and use `rounded-2xl` for consistency. Add `aria-label`s already present — good.
- **MobileNav center primary FAB**: it currently lifts `-mt-6` outside its glass container, which on small viewports clips and looks lopsided. Wrap container with `pb-2 pt-1` and give the FAB a defined background ring so it reads as a button, not a floating circle.
- **Hero search bar (Home)**: the "Find words now" button is squeezed on phones. On `<sm` stack the button below the input, full-width.
- **Solver chips** (Dictionary US/UK, Sort, Length): they use `min-h-11` already but their parent `flex` doesn't wrap consistently — wrap with `gap-2` and `flex-wrap`, and switch to equal-flex children on `<sm` so each row is balanced.
- **Score badge inside WordCard**: keep 14×14 on desktop, drop to 12×12 on mobile so the card height matches the text column.

## 3. Real solver functionality (dictionary-powered)

Today `src/lib/words.ts` only filters a 12-word demo array. Replace with a real word engine that the user controls in-browser (no server cost, works on Vercel static build):

- Add **two dictionary word lists** as static assets under `public/dict/`:
  - `twl06.txt` (~178k words, US tournament list — public domain).
  - `sowpods.txt` (~267k words, UK/international — public domain).
  - Both are plain text, one word per line. Total ≈ 4 MB; we'll gzip them on Vercel automatically.
- Add `src/lib/dictionary.ts`:
  - Lazy-fetches the chosen list on first use, caches in memory + IndexedDB (via a tiny helper) so subsequent visits are instant and offline-friendly.
  - Exposes `solveAnagram(rack, opts)` (returns all words formable from the rack incl. blanks `?`), `matchPattern(pattern)` for crossword (e.g. `C_A__T`), and `containsFilter(starts, ends, contains, minLen)`.
- Update `src/lib/words.ts`:
  - Keep `TILE_VALUES` / `scoreWord` / `rarityOf`.
  - Replace `generateResults` with a real implementation backed by `dictionary.ts`, sorted by score, capped at e.g. 200 results in UI.
- Wire pages:
  - **ScrabbleSolver**: anagram solve using selected dictionary (US/UK), apply starts/ends/contains/minLen filters, sort by score/length/rarity.
  - **WordFinder**: anagram solve from rack, optional exact-length filter.
  - **CrosswordSolver**: pattern match against dictionary (`?` or `_` = unknown). Add a dictionary toggle here too.
- Add a tiny loading state on first dictionary fetch (skeleton already exists via `LoadingResults`).

Definitions: TWL/SOWPODS don't ship definitions. For now, surface definitions only for hovered/selected words via a free dictionary API (e.g. `https://api.dictionaryapi.dev`) lazily on demand — no key required, no cost. If unavailable, hide the definition line silently.

## 4. AI assist — what's needed (for next iteration, not now)

To turn the "AI Move Engine" / clue-interpretation features on we need server-side inference (browser-only doesn't cut it for natural-language clues or board evaluation). Lowest-cost path inside Lovable:

- **Lovable Cloud + Lovable AI Gateway** — one click, no external account, no separate API key from the user. Gives you a backend edge function and a managed model endpoint (Gemini/Claude routed) with usage included in the Lovable plan.
- One edge function `ai-assist` with two actions:
  - `interpretClue({ clue, pattern })` → returns ranked candidate answers matching the crossword pattern.
  - `suggestMove({ rack, board })` → returns top plays with reasoning.
- Frontend calls it from Scrabble/Crossword pages behind an "Ask AI" button.

When you're ready next round, just say "enable AI assist" and I'll provision Cloud + the gateway and wire the button. Nothing to do today.

## Technical summary

- **Files edited**: `src/pages/Home.tsx`, `src/pages/ScrabbleSolver.tsx`, `src/pages/WordFinder.tsx`, `src/pages/CrosswordSolver.tsx`, `src/components/Navbar.tsx`, `src/components/MobileNav.tsx`, `src/components/WordCard.tsx`, `src/lib/words.ts`.
- **Files created**: `src/lib/dictionary.ts`, `public/dict/twl06.txt`, `public/dict/sowpods.txt`.
- **No new deps**, no backend, no credits spent on AI — keeps your 5 credits free for the AI step later.
- Tested at 360px, 390px, 414px viewports plus desktop after the edits.

## Open question (only one)

Word lists are ~4 MB combined gzipped. Two options:

1. **Bundle both** in `public/dict/` (recommended) — works offline after first load, no third-party dependency, deploys cleanly on Vercel/GitHub.
2. **Fetch on demand** from a CDN (jsDelivr/GitHub raw) — keeps repo small but adds an external dependency and slower first load.

I'll default to **option 1** unless you say otherwise.
