# AdSense + Smart Analytics Admin

Goal: stand up the admin side now so when Google AdSense is approved, slots are ready and placement is driven by real engagement data.

## What you'll get

1. **Admin dashboard** at `/admin`, protected by email/password + admin role
2. **Custom analytics** stored in Lovable Cloud (pageviews, time-on-page, scroll depth, clicks)
3. **Smart ad-slot system** — ad components that render based on which pages/zones get the most engagement
4. **AdSense placeholder** wired up (script tag + `ads.txt`) — disabled until you have a publisher ID

---

## Phase 1 — Enable Lovable Cloud + Auth

- Enable Lovable Cloud
- Email/password auth with sign-up / sign-in pages
- `profiles` table (id → auth.users) — minimal: id, email, created_at
- `user_roles` table + `app_role` enum (`admin`, `user`) + `has_role()` security-definer function
- First admin promoted via SQL (one-time insert)
- `/admin` route guard using `has_role(auth.uid(), 'admin')`

## Phase 2 — Analytics data model

Tables (all in `public`, RLS on, proper GRANTs):

- `page_views` — id, path, session_id, user_id (nullable), referrer, user_agent, country (nullable), created_at
- `page_sessions` — id, session_id, path, entered_at, left_at, duration_ms, max_scroll_pct
- `ad_zones` — id, key, page_path, position (e.g. `hero`, `inline-1`, `sidebar`, `footer`), enabled
- `ad_events` — id, zone_id, session_id, event_type (`impression` | `click`), created_at

RLS:
- Anonymous insert allowed for `page_views`, `page_sessions`, `ad_events` (tracking from any visitor)
- Select restricted to admin role only
- `ad_zones`: anyone can read enabled zones; only admin can write

## Phase 3 — Tracking layer

- `useAnalytics()` hook mounted in `App.tsx`:
  - On route change → insert `page_views` row, start a `page_sessions` row
  - Track scroll depth (throttled), update `max_scroll_pct` on unload
  - On unload / route change → write `left_at` + `duration_ms` via `sendBeacon`
- Session ID: UUID in `sessionStorage`
- No PII; user_id only when signed in

## Phase 4 — Admin dashboard

`/admin` with tabs:

- **Overview**: total views, unique sessions, avg session duration, top pages (last 7/30 days)
- **Engagement heatmap**: per-page avg time + avg scroll depth — this is what drives "smart" placement
- **Ad zones**: list of zones, impressions, clicks, CTR, toggle enabled/disabled
- **Users**: list of registered users + role management

Charts: lightweight (recharts, already common in shadcn projects).

## Phase 5 — Smart ad slot system

- `<AdSlot zoneKey="..." />` component:
  - Looks up the zone in `ad_zones`
  - If enabled AND AdSense is configured → renders `<ins class="adsbygoogle">`
  - Otherwise → renders nothing (or a dev-only placeholder)
  - Fires `impression` event on mount, `click` event on click
- "Smart" logic: a server-side view (`v_zone_recommendations`) ranks zones by avg time-on-page × scroll-depth-reached for the page they live on. The admin dashboard surfaces top recommended zones so you can enable the highest-engagement ones first.
- Initial zones seeded: `home-hero`, `home-inline`, `scrabble-results-top`, `scrabble-results-inline`, `crossword-results-top`, `crossword-results-inline`, `wordfinder-results-top`, `blog-inline`, `footer`

## Phase 6 — AdSense placeholder

- Add `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" crossorigin="anonymous">` to `index.html`, commented/guarded behind a `VITE_ADSENSE_CLIENT` env var so nothing loads until you set it
- Create `public/ads.txt` with a placeholder line
- `AdSlot` reads `VITE_ADSENSE_CLIENT` and `data-ad-slot` from the zone row — flip on by setting the env var + filling slot IDs in the admin UI later

---

## Technical notes

- All new public tables include explicit `GRANT` statements and RLS policies
- Roles live in `user_roles` (never on profiles) — uses the `has_role()` security definer pattern
- Tracking writes use `sendBeacon` for reliability on unload
- No external analytics SDK — all data stays in your Cloud DB
- Bot filtering: simple user-agent check on insert via a SQL trigger

## Out of scope (for later)

- Actually applying for AdSense / putting in real publisher ID
- A/B testing of ad placements
- Country-level GeoIP enrichment
- Cookie consent banner (recommended before going live with ads in EU)

Approve to start with Phase 1.
