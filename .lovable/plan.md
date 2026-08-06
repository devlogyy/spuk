# Get agentic browsing to 3/3 and performance past 90

I pulled Google's current Lighthouse "Agentic browsing" docs and measured the live pages. The category is not a 0-100 score — it is a fraction of deterministic checks: **llms.txt**, **accessibility for agents**, **layout stability (CLS)**, plus informational **WebMCP tools / form** checks. We dropped to 1/3 because layout stability now fails.

Measured on mobile just now:

- Home: CLS **0.16** — one big shift, and the shifting nodes are the hero H1, the `.speakable-intro` paragraph and the search bar. That is the Google Fonts swap: the page paints in the fallback font, then Plus Jakarta / Space Grotesk arrive and re-flow the hero.
- Crossword Solver: CLS **0.097** — the footer jumps when the lazily-loaded route chunk replaces the `min-h-[60vh]` placeholder.

## Workstream 1 — Layout stability (unlocks the agentic check and helps performance)

1. **Self-host the two fonts** as woff2 in the app bundle, with `font-display: swap` and — critically — `size-adjust` / `ascent-override` on a local fallback `@font-face` so the fallback metrics match the real font and the hero does not re-flow. Preload only the weights used above the fold; drop the third-party `fonts.googleapis.com` round-trip entirely (also removes two preconnects from the critical path).
2. **Reserve the hero box**: give the H1, intro paragraph and search bar fixed min-heights per breakpoint so nothing above the fold can change size after paint.
3. **Fix the lazy-route placeholder**: instead of a blank `min-h-[60vh]` fallback that the real page then replaces, keep the prerendered markup visible during hydration and size the fallback to the typical tool-page height, so the footer does not move.
4. **Ad slots reserve space**: `AdSlot` currently renders `null` and then a block once the zone loads — reserve the slot height up front so injected ads never shift content.
5. Re-measure CLS on Home, Scrabble Solver, Crossword Solver, Word Finder and a word-list page; target < 0.1 (ideally < 0.05) on all.

## Workstream 2 — The other agentic checks

6. **Accessibility for agents**: sweep every interactive element on the three tool pages, navbar, mobile nav and footer for a discernible accessible name (button labels, icon-only buttons, links, inputs, selects) so the a11y-tree audit passes cleanly.
7. **WebMCP (per Google's docs)**: the tool inputs become real `<form>` elements carrying declarative `toolname` / `tooldescription` attributes (`find_scrabble_words`, `solve_crossword_pattern`, `unscramble_letters`), plus a feature-detected `document.modelContext.registerTool` registration reusing the existing `src/lib/mcp` tool implementations. This satisfies the "registered tools" and "forms missing declarative WebMCP" audits and makes the site directly actionable by in-browser agents.
8. **llms.txt**: verify it returns 200 with the right content type from `www.lexorawords.com` (a server error fails the audit; the content itself is already in spec).

## Workstream 3 — Performance 89 → 90+

9. Killing the render-blocking Google Fonts request is the single biggest FCP/LCP win; it also removes the swap repaint.
10. Make the hero heading the clear LCP element: no late-loading font, no animation, no image competing for priority.
11. Trim remaining main-thread work at hydration (TBT was 340 ms): prefetch route chunks on idle rather than at load, and confirm analytics/consent/AdSense all stay off the critical path.
12. Re-run Lighthouse mobile on the production build and report the before/after FCP, LCP, Speed Index, TBT, CLS and the agentic fraction — no "should be fixed" claims without the numbers.

## Technical notes

- Files touched: `index.html`, `src/styles.css` (font faces), new font assets, `src/App.tsx` (Suspense fallback), `src/pages/Home.tsx`, the three tool pages, `src/components/AdSlot.tsx`, and `scripts/prerender.ts` so the prerendered HTML carries the same reserved heights and form attributes.
- No backend, schema or content changes.
- WebMCP is an experimental Chrome origin-trial API; the registration is feature-detected so nothing breaks in other browsers.
