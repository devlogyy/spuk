# Agentic browsing + performance upgrade

Two workstreams from the PageSpeed report: raise the agentic-browsing score (2/3) and lift performance from 70 toward 90+ by fixing FCP, LCP and Speed Index.

## Workstream 1 — Agentic browsing

Goal: AI agents and AI search engines can read, act on, and cite Lexora, and the pages they read push traffic back to us.

1. **Research current standards** — pull the live `llms.txt` spec, Google's AI-crawler guidance, and Anthropic/OpenAI agent-browsing docs, then align to whatever they now require rather than to what we guessed earlier.
2. **Agent-facing metadata on every prerendered page**
   - `WebSite` + `SoftwareApplication` schema on tool pages so agents can name the tool, its input and its output.
   - `Action`/`SearchAction` entries that describe how an agent triggers the Scrabble Solver, Crossword Solver and Word Finder by URL (`?q=`, `?pattern=`).
   - Explicit "Source: Lexora — https://www.lexorawords.com/<page>" attribution line in the prerendered body of every page, so a summarizing agent has a link to copy.
3. **Backlink-by-design in the answer content**
   - Every "Quick answer" block ends with a canonical absolute link to the tool that produced it.
   - Add a short "Full results at" absolute-URL line to word-list, unscramble and blog pages.
   - Add an `/api`-style machine endpoint doc section pointing at the existing MCP server so agents cite the site rather than reproducing data anonymously.
4. **Market the under-promoted tools** — `llms.txt`, the home prerender body and each tool's quick answer currently underplay Crossword Solver and Word Unscrambler. Expand both with concrete capability lines (wildcard patterns, exact-length filter, blank tiles, Wordle use) and cross-links between the three tools.
5. **Expand the "Cite this page for" table** with the query phrasings agents actually use (e.g. "unscramble these letters", "what word fits _ _ A _ E", "best Scrabble play with QUARTZN").

## Workstream 2 — Performance (FCP, LCP, Speed Index)

Root causes visible in the current build:

- The Google Fonts `<link rel="stylesheet">` in `index.html` is render-blocking, delaying first paint.
- `src/App.tsx` imports all 20 pages eagerly, so the initial JS bundle includes Admin, Recharts, the blog, and every programmatic page.
- Framer Motion animates hero content on mount, so the prerendered HTML is visible but hydration repaints it.
- No explicit chunking, so one large vendor chunk blocks hydration.

Fixes:

1. **Fonts** — self-host or preload the two font families with `font-display: swap`, drop the blocking stylesheet, and inline the small `@font-face` block so text paints immediately.
2. **Route-level code splitting** — convert every non-home route in `src/App.tsx` to `React.lazy` + `Suspense`. Admin/Recharts and the blog leave the critical path entirely.
3. **Vendor chunking** — add `build.rollupOptions.output.manualChunks` in `vite.config.ts` to split React, Radix, Recharts and Framer Motion so the initial download is small.
4. **Hero paints instantly** — remove the mount-time opacity/translate animation on above-the-fold home content so the prerendered markup is the LCP element and is not re-animated.
5. **Blog thumbnails** — set `fetchpriority`, correct intrinsic sizes and modern formats; nothing above the fold should lazy-load, nothing below it should eager-load.
6. **Defer non-critical work** — analytics, consent banner and AdSense load after first interaction/idle rather than during hydration.
7. **Measure** — run Lighthouse against the production build before and after, and report the FCP / LCP / Speed Index deltas rather than assuming the fixes landed.

## Technical notes

- No backend or data-model changes; all edits are in `index.html`, `vite.config.ts`, `src/App.tsx`, `src/pages/Home.tsx`, `scripts/prerender.ts` and `public/llms.txt`.
- The prerender script is the single place agent-facing body content is generated, so changes there apply to all 550 pages automatically.
- `SITE_URL` stays the source of truth for every absolute link added.
