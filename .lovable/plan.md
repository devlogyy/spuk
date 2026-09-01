# Lexora monetization setup and search-traffic recovery

## Confirmed situation
- Search Console domain property `sc-domain:lexorawords.com` is verified.
- For 2026-01-01 through 2026-08-31, Search Console reports 8,350 impressions, 29 clicks, 0.347% CTR, and average position 46.1.
- The largest page opportunities are not primarily a tracking failure: `/crossword-solver` has 698 impressions at average position 68.8, `/blog/2-letter-scrabble-words` has 565 impressions at position 48.4, `/blog/words-with-q-no-u` has 558 impressions at position 45.6, and `/words` has 370 impressions at position 81.1. A smaller group of unscramble pages is already appearing around positions 4–10 but is receiving few clicks, so both visibility and search-result appeal need work.
- The app already has a consent-gated first-party analytics system and an admin Search Console wizard.
- No Google Analytics implementation exists. Google Analytics is available as a workspace connector, but there is no existing connection.
- No AdSense connector is available. The current publisher client is a missing build-time environment value, and `public/ads.txt` still contains a placeholder publisher ID.

## Five-credit implementation plan

### 1. Google Analytics 4 connection wizard and reporting (2 credits)
- Link the available Google Analytics connector through the normal connection card.
- Add an admin-only setup panel that lists accessible GA4 properties, lets the admin select one, and shows connection/property/data-flow status.
- Add a small Cloud function to call the GA4 reporting API server-side, keeping connector credentials out of browser code.
- Add a focused report with users/sessions, engagement rate, average engagement time, top landing pages, and traffic-source breakdown, reusing the existing date-range controls.
- Keep the existing consent-gated first-party analytics unchanged. GA4 reporting and first-party analytics remain separate so the current dashboard cannot regress.

### 2. AdSense publisher setup wizard (1 credit)
- Add an admin setup panel with validated `ca-pub-...` input, save/test status, and a generated `ads.txt` line.
- Store the publisher ID in a protected Cloud-backed settings row so AdSlot reads it at runtime without requiring a rebuild.
- Keep ad-zone slot IDs and enable/disable controls as they are.
- Replace the placeholder `ads.txt` during the setup change and show a clear live-file check. Google crawls `ads.txt` as a public static file, so the wizard will explicitly distinguish “publisher saved” from “matching file live” rather than falsely marking AdSense complete.
- Treat the publisher ID as configuration, not as an OAuth account connection; no AdSense connector is available in this workspace.

### 3. Search CTR and ranking recovery (2 credits)
- Add an admin “Search opportunities” view backed by Search Console that ranks pages/queries by impressions, position, and CTR, with separate buckets for:
  - high impressions / low position: pages needing stronger content and internal links;
  - positions 4–15 / low CTR: pages needing title and description improvements;
  - clicks already occurring: pages to use as internal-link hubs.
- Improve the highest-impact existing pages first: Crossword Solver, the two high-impression Scrabble blog posts, and the `/words` hub.
- Strengthen titles/descriptions and above-the-fold copy around the actual search intent, add contextual links to the Scrabble solver, Crossword solver, Word Finder, and unscrambler, and keep canonical/robots behavior unchanged.
- Extend the SEO check to cover generated word pages so near-duplicate or weak metadata is caught before deployment.

## Technical safeguards
- All new settings tables will include explicit grants, RLS, and admin-only writes.
- Google credentials will remain server-side; no private connector key will be placed in React or public files.
- GA scripts, if enabled for future event collection, will load only after analytics consent. This phase focuses on secure GA4 reporting first.
- Validate the admin flows, public `ads.txt`, consent behavior, Search Console queries, and production build before completion.

## Expected outcome
- A guided GA4 connection and usable reporting surface.
- A guided AdSense publisher setup that cannot silently fail because of a placeholder or missing static `ads.txt` line.
- A data-backed SEO queue focused on the pages most likely to turn existing impressions into clicks, without promising an immediate fixed click count while rankings are still developing.
