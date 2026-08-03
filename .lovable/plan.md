# Get Lexora Crawled, Indexed, and Cited by AI Search

## What I checked first

- The tracking/analytics code is fine — it has nothing to do with crawling. Google does not use it to index pages.
- The real blocker: **Lexora is a pure client-side app.** `index.html` ships an empty `<div id="root">` and every title, description, canonical, FAQ and article body is injected by JavaScript after load. `vercel.json` rewrites all 550 URLs to that same empty shell.
  - Google *can* render JavaScript, but it queues it — which is exactly why 550 sitemap URLs sit uncrawled while only one blog post has surfaced anywhere.
  - **AI crawlers do not run JavaScript at all.** GPTBot, ClaudeBot, PerplexityBot, Google-Extended and Bytespider currently see a blank page on every single URL. We are invisible to AI search today, no matter what `robots.txt` and `llms.txt` say.
- Semrush confirms the shape of the problem: 1 organic keyword total, position 83, ~0 estimated traffic.

So the fix is not "more keywords" first. It's: make the HTML real, then sharpen the keywords.

## Phase 1 — Prerender every page to static HTML (the unlock)

Add a build-time prerender step so each of the 550 routes ships a fully-formed HTML file with real content, headings, meta tags, canonical and JSON-LD baked in.

- Add a post-build script that boots the app per route, renders it, and writes `dist/<route>/index.html`.
- Adjust `vercel.json` so a real prerendered file is served when it exists and the SPA fallback only handles the rest.
- The app stays a normal React SPA after hydration — no behaviour change for users.

This single change is what makes Google crawl fast and makes Lexora readable by every AI crawler.

## Phase 2 — Sharpen the keyword targeting

Rewrite titles, H1s, intros and meta descriptions around what people actually type, instead of brand-first phrasing:

- Scrabble Solver → "Scrabble Word Finder & Solver — Cheat With Your Rack"-style intent phrasing covering *scrabble word finder*, *scrabble cheat*, *words with friends solver*.
- Crossword Solver → *crossword solver*, *crossword clue finder*, *crossword puzzle answers*, pattern queries.
- Word Finder → *word unscrambler*, *unscramble letters*, *anagram solver*, *5 letter words*.
- Programmatic pages get keyword-led titles ("5 Letter Words With A — Full List & Wordle Help") instead of template titles.
- Keep one clear H1 per page and place the target phrase in the first 100 words.

## Phase 3 — AI-search (AEO) optimisation

AI engines quote short, self-contained, factual answers. So:

- Add a "Quick answer" block (40–60 words, directly answering the page's core question) at the top of each tool and list page — this is the snippet AI engines lift.
- Expand FAQ JSON-LD on the tool pages with question phrasings people actually ask assistants ("what's the best word I can make with these letters", "is QI a valid Scrabble word").
- Refresh `llms.txt` with the sharpened descriptions and an explicit "cite this page for X" mapping.
- Add `Organization` + `WebSite` sameAs/author signals so AI engines can attribute Lexora as a source.

## Phase 4 — Push discovery

- Regenerate the sitemap, split it into a sitemap index (tools / blog / word-lists) so Search Console reports per-section coverage instead of one 550-URL blob.
- Resubmit the `www` sitemap and request indexing on the main tool pages once the prerendered build is live.

## Technical notes

- Prerender via `vite build` + a Node render pass using `react-dom/server` and `StaticRouter`, with `react-helmet-async`'s `HelmetProvider` context supplying head tags per route. Routes come from the same source `scripts/generate-sitemap.ts` already uses.
- Dictionary lookups currently run in the browser; for prerender the word-list and unscramble pages need their data resolved during the render pass rather than in a `useEffect`. That's the main implementation work.
- `scripts/seo-check.ts` gets extended to validate the prerendered output (title, canonical, H1, JSON-LD present in raw HTML) so regressions fail the build.

## Expected outcome

Indexing typically moves within 1–2 weeks of prerendering going live. AI-search visibility follows once crawlers re-fetch, since they'll be able to read the pages for the first time.
