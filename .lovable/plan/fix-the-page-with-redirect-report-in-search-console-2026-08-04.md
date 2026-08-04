# Fix the "Page with redirect" report in Search Console

## What the report actually says

The URL you inspected is `http://lexorawords.com/` — the non-www, non-HTTPS version of the homepage. Live checks just now confirm:

- `http://lexorawords.com/` returns `308 Permanent Redirect` toward the HTTPS/www homepage.
- `https://www.lexorawords.com/` returns `200` with the correct prerendered HTML, `<title>`, and `<link rel="canonical" href="https://www.lexorawords.com/">`.

So "Page is not indexed: Page with redirect" is the correct and desired verdict for that URL. A redirecting URL is never indexed itself — the destination is. The `spuk.lovable.app` canonical shown next to it is from the last crawl on 31 Jul 2026, before the domain switch, so it is stale data, not the current state of the site.

The one real problem: the sitemap is registered in Search Console as `https://lexorawords.com/sitemap.xml`, which also 308-redirects to the www host. Google tolerates this poorly and it is likely why sitemap processing has been flaky.

## What to do

1. Submit `https://www.lexorawords.com/sitemap.xml` (plus the three child sitemaps) to Search Console for the correct property, and remove the non-www submission.
2. Inspect `https://www.lexorawords.com/` and a sample deep page such as `https://www.lexorawords.com/unscramble/floor` through the Search Console API to read the current indexing state on the canonical host, rather than judging by the stale non-www report.
3. Report back the real per-URL status: last crawl date, coverage state, Google-selected canonical, and whether the sitemap now processes without error.
4. If any page still reports a stale `spuk.lovable.app` canonical after a fresh crawl, only then treat it as a code issue — nothing in the current source emits that URL.

## Technical notes

- No source changes are planned. `src/lib/seo.ts`, `scripts/prerender.ts`, `scripts/generate-sitemap.ts`, and `public/robots.txt` all already point at `https://www.lexorawords.com`, and the live HTML confirms it.
- Search Console work happens through the connected Search Console API (sitemap submit/delete plus URL inspection reads).
- URL Inspection through the API reads Google's stored state only; it cannot force a re-crawl. Requesting indexing for individual URLs still has to be done by you in the Search Console UI.
- Indexing after a domain move typically takes days to a few weeks; the redirect verdict on the non-www URL should be left alone, not "fixed".
