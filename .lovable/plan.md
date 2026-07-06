## Goal
Get Lexora AdSense-ready and stronger for organic growth. Focused on what an AdSense reviewer actually blocks on, plus the content-depth gaps that also hurt organic rankings.

## Scope — Phase E (this plan)

Three tracks, all frontend/content. No backend changes, no visual redesign.

---

### Track 1 — Legal & trust pages (AdSense hard-blockers)

Create four real, linkable pages and wire them into the footer.

**New routes & files:**
- `/privacy` → `src/pages/Privacy.tsx` — explicitly names Google AdSense, third-party cookies, DoubleClick DART, and links the consent manager. Mentions analytics, user-provided data (auth email), and how to opt out.
- `/terms` → `src/pages/Terms.tsx` — acceptable use, no warranty, IP ownership, dictionary attribution (TWL/SOWPODS are third-party), governing law placeholder.
- `/about` → `src/pages/About.tsx` — who runs Lexora, why it exists, editorial approach, dictionary sources, contact CTA.
- `/contact` → `src/pages/Contact.tsx` — mailto link + simple form (client-side only, submits to a `mailto:` for now — no backend needed).

**Edits:**
- `src/App.tsx` — register the 4 routes.
- `src/components/Footer.tsx` — add a "Legal" and "Company" column linking all four.
- Each page uses `<Helmet>` with proper title/description/canonical + BreadcrumbList JSON-LD.

**Placeholders you'll need to fill in:** business name, contact email, country of operation. I'll mark them clearly with `{{OWNER_NAME}}` / `{{CONTACT_EMAIL}}` / `{{COUNTRY}}` so it's obvious what to swap.

---

### Track 2 — Enrich programmatic `/words/*` pages (kills the "thin content" risk)

Target: `src/components/ProgrammaticPageShell.tsx` + the 4 programmatic templates in `src/pages/programmatic/`.

Each page currently leads with the result grid. Add above the results:
- **Answer-first intro** (80–140 words, unique per template type) — what these words are, when they're useful (Scrabble/Words With Friends/crosswords), scoring context.
- **"How to use this list"** — 3-bullet mini-guide.
- **Quick-stat strip** — total words, avg score, highest-scoring word (already computable from results).

Add below the results:
- **"Strategy tip"** block — 40–60 words, varies by template (ending vs starting vs unscramble vs n-letter).
- Existing `RelatedTools` stays.

Templates get distinct copy so the 4 families don't look duplicated. Copy lives in `src/content/programmatic-copy.ts` (new file) so it's editable in one place.

---

### Track 3 — Content depth signals

**Blog:**
- Add author byline + `datePublished` / `dateModified` to each existing post via the post frontmatter in `src/content/blog/posts/*.tsx` (fields already partly there — normalize + expose in `articleSchema`).
- Add a "Sources" footer to each post (2–3 authoritative links — Merriam-Webster, Collins, Hasbro rules PDF) — real editorial signal + AdSense reviewers like it.

**Home:**
- Add a small "Why trust Lexora" strip above the footer (3 icons: US+UK dictionaries, transparent scoring, no signup required). Pure presentation.

**Not in this plan** (defer):
- Writing 10 new blog posts (separate track, ask when you're ready)
- Buying the domain / connecting it (you do that in Project Settings)
- Google Search Console / Analytics setup (post-domain)
- Backlink outreach

---

## Files touched

**New**
- `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx`
- `src/content/programmatic-copy.ts`

**Edited**
- `src/App.tsx` (routes)
- `src/components/Footer.tsx` (legal + company columns)
- `src/components/ProgrammaticPageShell.tsx` (intro + strategy blocks)
- `src/pages/programmatic/*.tsx` (pass template-type key to shell)
- `src/pages/Home.tsx` (trust strip)
- `src/content/blog/posts/*.tsx` (author + dates normalization)
- `src/lib/seo.ts` (extend `articleSchema` to accept author/dates cleanly if not already)
- `public/sitemap.xml` via `scripts/generate-sitemap.ts` (add /about, /contact, /privacy, /terms)

## What I need from you before building
1. **Owner/business name** to put on legal pages (personal name or company).
2. **Contact email** (real or a Gmail placeholder — can change later).
3. **Country / jurisdiction** for Terms + Privacy (which country's law governs).

I can build with `{{PLACEHOLDER}}` tags if you'd rather fill them in yourself later — just say "use placeholders."
