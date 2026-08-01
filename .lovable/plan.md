## Goal
Connect Google Search Console to your admin dashboard so SEO performance, top queries/pages, and indexing/sitemap status appear inside `/admin` — no need to log into Search Console separately. AdSense stays on the current estimated-revenue view until you're approved.

## How the connection works
Lovable has a built-in Google Search Console connector. You sign in with Google once through a connect card in chat; credentials stay server-side and are refreshed automatically. Your app never holds a Google token.

## What gets built

### 1. Connect Search Console
Link the Google Search Console connector to this project so the backend can call the API on your behalf.

### 2. Backend function (`supabase/functions/search-console`)
An admin-only edge function (verifies the caller's session and `admin` role) with these actions:
- `list-sites` — verified properties your Google account owns
- `performance` — clicks, impressions, CTR, average position by day for the selected range
- `queries` / `pages` — top search queries and top landing pages
- `sitemaps` — submitted sitemaps with last-read time, warnings, errors, indexed status
- `inspect-url` — URL Inspection for any page (this is what will tell us exactly why `sitemap.xml` hasn't been picked up yet)

### 3. Rebuilt SEO tab in the admin dashboard
The existing SEO tab keeps its on-site file checks and gains:
- **Property picker** — choose which verified property to view (saved per admin)
- **KPI row** — clicks, impressions, CTR, avg. position with period-over-period deltas, using your existing `KpiCard`
- **Performance chart** — daily clicks/impressions plus a position line, honoring the existing 7/30/90-day range picker
- **Top queries table** and **Top pages table** — sortable, with clicks/impressions/CTR/position
- **Indexing & sitemap card** — sitemap submission status, last crawl, errors, and a "Submit sitemap" button
- **URL inspector** — paste any URL, see Google's indexing verdict, coverage state, canonical, and last crawl date

### 4. Setup wizard
A guided panel that appears when Search Console isn't wired up yet: check connection → pick property → confirm sitemap submitted → run a first inspection on the homepage. Each step shows pass/fail and the fix.

### 5. Ads tab (unchanged for now)
Keeps the RPM estimator and zone CTR data. When you're approved for AdSense, we can add real earnings via a Google Cloud OAuth client — I'll flag this as the next step, not part of this build.

## Technical notes
- Calls route through the Lovable connector gateway from the edge function; no Google credentials in frontend code.
- Property resolution follows the required flow: list verified properties at runtime, match your domain, and prompt you to choose if more than one matches.
- Search Console data is cached briefly in the frontend query cache; no new database tables are needed.
- Errors from Google (permission, unverified property, no data yet) surface as readable messages instead of blank charts.

## Note on your sitemap
Search Console typically takes a few days to process a newly submitted sitemap, and it only reads it from the live published site. Once this is built, the URL inspector will tell us definitively whether Google fetched it, hit an error, or is still queued.
