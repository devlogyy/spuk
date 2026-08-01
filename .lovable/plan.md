## Goal
Switch every site reference from the old `spuk.lovable.app` domain to the new custom domain `lexorawords.com`, regenerate the sitemap, and give the user the exact URL to submit to Google Search Console.

## What I found
The sitemap exists (`public/sitemap.xml`) but every `<loc>` currently uses `https://spuk.lovable.app`. The same old domain is hardcoded in SEO constants, `index.html`, `robots.txt`, `llms.txt`, page metadata, contact emails, and MCP fallbacks.

## Files to update
1. `src/lib/seo.ts` — change `SITE_URL` to `https://lexorawords.com`.
2. `scripts/generate-sitemap.ts` — change `BASE_URL` to `https://lexorawords.com`.
3. `public/robots.txt` — change `Sitemap:` directive to `https://lexorawords.com/sitemap.xml`.
4. `index.html` — update `og:url`, Organization JSON-LD `url`, WebSite JSON-LD `url`, and SearchAction `target`.
5. `public/llms.txt` — replace all internal links with `https://lexorawords.com` equivalents.
6. `src/pages/Home.tsx` — update canonical `<link>` and `og:url` meta tag.
7. `src/pages/Privacy.tsx` and `src/pages/Contact.tsx` — update placeholder contact email from `hello@spuk.lovable.app` to `hello@lexorawords.com`.
8. `src/lib/mcp/dict.ts` — update fallback URL.
9. `supabase/functions/mcp/index.ts` — update fallback URL.
10. Regenerate `public/sitemap.xml` by running the existing `predev`/`prebuild` generator so every `<loc>` uses `https://lexorawords.com`.

## Verification
- Confirm `public/sitemap.xml` opens at `/sitemap.xml` and every `<loc>` begins with `https://lexorawords.com`.
- Confirm `robots.txt` references the new sitemap URL.
- Run the existing `seo:check` script to ensure no canonical/structured-data regressions are introduced.

## Deliverable to the user
The exact sitemap URL to paste into Google Search Console:
`https://lexorawords.com/sitemap.xml`

## Notes
- No page routes or content will change; only the domain string is being swapped.
- After the build, I will also remind you to request indexing in Search Console once the live site is serving from the custom domain.