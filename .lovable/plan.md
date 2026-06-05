## SEO audit — what's already strong vs what's missing

**Already in place (no work needed):**
- `react-helmet-async` wired up; per-route titles, descriptions, canonicals on tool pages and blog
- Blog posts ship `Article`, `BreadcrumbList`, and `FAQPage` JSON-LD with OG/Twitter tags
- Real thumbnails, alt text, lazy loading, semantic `<h1>`, breadcrumbs
- `sitemap.xml` lists all current public routes; `robots.txt` allows crawling
- Mobile viewport, fast Vite build, no JS-blocked content (every page renders meaningful HTML in `index.html` shell + hydrated content)
- Cookie consent + AdSense gated correctly (won't hurt Core Web Vitals before consent)

**Gaps that block strong ranking — fixing these is the work:**

### 1. Sitewide head in `index.html` is thin
- No `<link rel="canonical">`, no `og:url`, no `og:image`, no Twitter title/description
- No `Organization` or `WebSite` JSON-LD (sitewide entity Google uses for sitelinks + brand SERP)
- No `WebSite` + `SearchAction` schema (enables sitelinks search box)

### 2. Tool pages (Scrabble / Crossword / Word Finder) use *relative* canonicals
- `<link rel="canonical" href="/scrabble-solver" />` — Google treats this as same-page, effectively no canonical signal. Must be absolute (`https://spuk.lovable.app/scrabble-solver`)
- No `og:url`, `og:image`, `og:type`, no Twitter card
- No `SoftwareApplication` / `WebApplication` JSON-LD (these tools deserve rich result eligibility)
- No on-page FAQ section + `FAQPage` schema — easy wins for "is QI a word", "scrabble word finder", "how to solve crossword clues" long-tail
- No internal links from tool pages → blog (one-way linking right now)

### 3. Blog `Article` schema missing required fields
- No `datePublished` / `dateModified` (Google flags this). Posts say `date: "Evergreen"` — needs an ISO date alongside the display label
- Missing `inLanguage`, `wordCount`, `keywords` (nice-to-have, but cheap)

### 4. `robots.txt` doesn't reference sitemap
- Add `Sitemap: https://spuk.lovable.app/sitemap.xml` so every crawler discovers it on first hit

### 5. Sitemap is hand-edited and hard-codes the domain
- Replace with `scripts/generate-sitemap.ts` driven by the route list and `posts` array, sourcing `BASE_URL` from `src/lib/seo.ts`. One file changes when the real domain ships, sitemap regenerates on `predev` / `prebuild`. Also adds `<lastmod>` from build time

### 6. The single biggest traffic lever is missing: programmatic SEO pages
This is what every site that wins this niche (yourdictionary, wordfinder.com, thewordfinder, wordtips) does — they own thousands of long-tail pages like:
- `/words/starting-with/q`
- `/words/ending-in/ing`
- `/words/5-letter-words-with-a`
- `/words/unscramble/listening`
- `/anagrams/quartz`

Each one ranks for hundreds of zero-effort queries. Without them, 10–20k pageviews/month in 30 days is **not realistic** off 8 blog posts + 3 tool pages alone, even with a great domain. With ~200–500 programmatic pages generated from the existing dictionary, it's achievable.

**This is a scope decision** — see "Question" at the bottom.

### 7. Smaller items
- Preload the LCP image (blog hero, home hero) — minor LCP win
- Home page `<link rel="canonical">` should be absolute
- Add `lang` correctly (already `en`, good)
- Add a 404 page with `noindex` meta so soft-404s don't pollute the index
- Make sure `Auth` and `Admin` routes are `noindex` (currently allowed by `robots.txt` and not in sitemap — fine, but explicit `noindex` is safer)

---

## Proposed plan

### Phase A — fix what's broken (high-priority, ~no risk)

1. **`index.html` sitewide head**
   - Add absolute `<link rel="canonical">`, `og:url`, Twitter title/description
   - Add `Organization` + `WebSite` (with `SearchAction` for `/word-finder?q=`) JSON-LD blocks
   - Keep all values driven by `SITE_URL` conceptually (literal strings here since it's static HTML)

2. **Tool pages (Scrabble, Crossword, Word Finder)**
   - Switch canonicals to `absoluteUrl(...)` from `src/lib/seo.ts`
   - Add `og:type`, `og:url`, `og:image` (reuse a generated brand hero per tool — cheap to create), Twitter card
   - Add `SoftwareApplication` JSON-LD (name, applicationCategory: "UtilityApplication", offers free)
   - Add a 4–6 question FAQ section at the bottom of each tool page + `FAQPage` JSON-LD (these double as helpful content and rank for "is X a scrabble word" / "how to solve crossword clues" type queries)
   - Add an internal-link section "Related guides" linking 3 relevant blog posts

3. **Blog Article schema hardening**
   - Add `datePublished` (ISO) + `dateModified` to every post in `src/content/blog/index.ts`. Keep `date: "Evergreen"` as display label
   - Wire both into the `Article` JSON-LD in `BlogPost.tsx`
   - Add `inLanguage: "en"` and `keywords` (from category + title) to the schema

4. **robots.txt + sitemap automation**
   - Add `Sitemap:` line to `public/robots.txt`
   - Create `scripts/generate-sitemap.ts` driven by tool routes + `posts` array + `SITE_URL`, with `<lastmod>` from `new Date()`
   - Wire `predev` / `prebuild` in `package.json`
   - Delete hand-edited `public/sitemap.xml` (script writes it)

5. **404 page noindex + Home canonical**
   - `NotFound.tsx` gets `<meta name="robots" content="noindex">`
   - `Auth.tsx` and `Admin.tsx` get `noindex`
   - `Home.tsx` canonical switched to `absoluteUrl("/")`

6. **LCP/CWV polish**
   - Add `<link rel="preload" as="image">` for the hero image on the home + each blog post (in the route's `<Helmet>`)

### Phase B — the actual traffic lever (programmatic SEO)

Generate evergreen pages from the dictionary, each ~600–900 words of templated-but-genuinely-useful content + the actual word lists. Three patterns to start:

| Pattern | Example URL | Est. pages | Search intent |
|---|---|---|---|
| Words starting with letter X | `/words/starting-with/q` | 26 | "words that start with q" |
| N-letter words with letter X | `/words/5-letter-words-with-a` | ~130 | wordle / scrabble lookups |
| Unscramble specific letter set | `/unscramble/listening` (top 500 popular racks) | ~500 | "unscramble [letters]" |

Each page would have:
- Real H1 + intro paragraph (templated but specific to the query)
- Actual word list grouped by length, with scores
- "How these were generated" + dictionary attribution
- Links to the related tool page + relevant blog post
- Proper canonical, FAQ schema, ItemList schema

All routes registered in the sitemap generator automatically.

This is meaningful additional work (1 dedicated build cycle). The audit honestly: **without Phase B you'll get a few hundred to low thousands of pageviews/month from the blog + tools. With Phase B you have a realistic shot at the 10–20k target within 1–3 months of indexing.**

---

## Technical notes

- All schema generation centralizes in `src/lib/seo.ts` (add helpers: `organizationSchema()`, `websiteSchema()`, `softwareApplicationSchema(name, url)`, `articleSchema(post)`)
- Tool-page hero images: 1 each via the imagegen tool, stored in `src/assets/og/`
- `datePublished` for existing posts: backfill with today's date in ISO; future posts get a date when authored
- No changes to dictionary logic, solver code, AdSense wiring, auth, or admin
- No backend/database changes

---

## Question before I build

**Phase A alone, or A + B?**

- **A only**: ~30–60 min of work, fixes all SEO correctness issues, gets you ranking for blog terms and tool brand searches. Realistic 1-month traffic: 500–3,000 pageviews.
- **A + B**: A, then Phase B over the next build cycle (~2–3 hours), generating 150–700 programmatic pages. Realistic 1-month traffic: 3,000–15,000 (and growing fast after that as indexing catches up).

If you want the 10–20k/mo target you mentioned, you want both. I'd recommend approving this plan as **Phase A now**, then a separate plan for Phase B once you see A merged and indexed. Tell me which way to go.
