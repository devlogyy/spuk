## What I found

"HTTPS not evaluated" is **not** a security problem. Your site is fully HTTPS:

- `http://lexorawords.com/` → 308 redirect to HTTPS (correct)
- HSTS header is present (`max-age=63072000`)

The message means Google simply has **no evaluated pages yet** in that report — it needs indexed pages with real data before it grades HTTPS.

But the reads did surface a real reason indexing is stalled:

```text
https://lexorawords.com/        → 308 → https://www.lexorawords.com/   (live)
sitemap.xml / canonicals / JSON-LD → https://lexorawords.com/...       (in code)
```

Every one of the 550 sitemap URLs points at the apex, which now redirects to `www`. Google sees 550 redirects instead of 550 pages, marks them "Page with redirect", and indexes slowly — so Page Experience has nothing to evaluate.

## The fix: pick one canonical host and use it everywhere

Recommended: adopt **`https://www.lexorawords.com`**, since that's what your hosting already redirects to (no DNS/hosting change needed).

1. Update `SITE_URL` in `src/lib/seo.ts` to `https://www.lexorawords.com`.
2. Update the sitemap generator base URL in `scripts/generate-sitemap.ts` and regenerate `public/sitemap.xml` (all 550 URLs).
3. Update hardcoded `lexorawords.com` references in `index.html` (og:url, Organization/WebSite JSON-LD, SearchAction target) and `public/robots.txt` (Sitemap: line) and `public/llms.txt`.
4. Verify canonical tags on all routes now match the URL that actually serves 200.

Alternative if you'd rather keep the short apex URL: flip the redirect in your domain settings so `www` → apex, and leave the code as-is. Tell me and I'll plan that instead.

## Search Console follow-up (after the change)

- Make sure the GSC property is a **Domain property** (`sc-domain:lexorawords.com`) so it covers both hosts; a URL-prefix property for the apex alone won't report www data.
- Resubmit `https://www.lexorawords.com/sitemap.xml` from the Sitemap card in your admin SEO tab.
- Use the URL Inspector on the homepage and request indexing.
- HTTPS status will populate on its own once pages are indexed — typically days to a few weeks. No further code work is needed for it.

## Technical notes

- No hosting/redirect edits are made by this plan; only source constants and generated static files change.
- `vercel.json` only has the SPA rewrite — no redirect rules to touch there.
- After the edits, `scripts/seo-check.ts` runs in prebuild and will validate the new canonical host.
