# Three fixes for the homepage & consent

## 1. Homepage blog section — real posts, thumbnails, clickable

Currently `src/pages/Home.tsx` renders a hardcoded `blogPosts` array of 3 fake titles with a placeholder `BookOpen` icon and no link. Replace with the first 3 real posts from `src/content/blog/index.ts`:

- Import `posts` and pick `posts.slice(0, 3)` (Featured first).
- Wrap each card in `<Link to={`/blog/${p.slug}`}>` so the whole card is clickable.
- Render `p.thumbnail` (the real hero image) as the card's top image with proper `alt={p.thumbnailAlt}`, `loading="lazy"`, and `aspect-[16/9]` cover.
- Show real `p.category` chip, `p.author`, `p.date`, `p.readTime`.
- Keep the existing motion/hover styling so it matches the rest of the page.

## 2. Mobile distortion on the "Crossword Solver" feature card

The four feature cards (Scrabble, Crossword, Word Finder, AI Move Engine) sit in a grid. On some mobile Chrome builds the Crossword card paints a zigzag artifact bleeding into the neighbouring Scrabble card. This is caused by the current double wrapper in `src/pages/Home.tsx`:

```text
<div class="isolate h-full overflow-hidden rounded-3xl">
  <Link class="... overflow-hidden rounded-3xl border ...">
```

Stacking `isolate` + nested `overflow-hidden` + `rounded-3xl` + an inner gradient icon + `md:hover:-translate-y-1` is a known Chrome-mobile paint bug. Fix:

- Collapse to a single element: remove the outer wrapper `<div>` and apply layout directly on the `<Link>`.
- Drop the redundant inner `overflow-hidden` (the icon doesn't need clipping); keep `rounded-3xl` only on the Link.
- Add `transform-gpu will-change-transform` to the hover translate so the compositor promotes the card to its own layer and stops the paint bleed.
- Add `bg-clip-padding` on the card to prevent the border-radius/gradient fringe artifact.
- No layout/order change — Crossword stays in position 2.

This is a CSS-only fix; no functional change.

## 3. Cookie consent — verify "show once" behaviour

`useConsent` already persists the decision in `localStorage` under `lex_consent_v1` with `decided: true`, and `CookieConsent` only renders when `bannerOpen` is true (set only when `!decided` on mount). So a returning visitor on the same browser/profile should NOT see the banner again. The reported re-appearance is almost certainly:

- Incognito / private window (localStorage wiped on close), or
- Different browser/device, or
- "Clear cookies on exit" enabled, or
- The preview iframe domain differing from the published domain.

Hardening to make persistence as durable as possible:

- Also write a long-lived first-party cookie `lex_consent_v1=1; max-age=31536000; path=/; samesite=lax` as a fallback when localStorage is unavailable or cleared by the browser between visits.
- On mount, treat **either** a valid localStorage entry **or** the cookie as "already decided" and skip the banner.
- Keep the existing `reopen()` path (footer "Cookie preferences" link) so users can change their mind.

No UI change to the banner itself.

## Files touched

- `src/pages/Home.tsx` — swap blog section to real posts + thumbnails + Links; simplify feature card markup.
- `src/hooks/useConsent.tsx` — add cookie fallback for persistence + read.

## Out of scope

- No changes to the Scrabble/Crossword solver pages themselves.
- No changes to the blog index/article pages.
- No new analytics or admin work.
