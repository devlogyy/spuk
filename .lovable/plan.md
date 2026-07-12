## Goal
Turn `/admin` into a professional blog/tool operator dashboard: KPI cards with trend deltas, real charts, and richer tables across four areas — Traffic, Content, SEO health, Ads & revenue.

## Layout
Single-page tabbed dashboard (upgraded existing pattern).

```text
┌─ Admin ─────────────── [7d ▾ 30d ▾ 90d ▾]  [Refresh]  [Sign out] ┐
│ KPI row: Views · Sessions · Avg time · Avg scroll · Ad CTR       │
│ (each with Δ% vs prior period + sparkline)                        │
├──────────────────────────────────────────────────────────────────┤
│ Tabs:  Overview | Traffic | Content | SEO | Ads | Zones          │
└──────────────────────────────────────────────────────────────────┘
```

## Tabs

**Overview** — 5 KPI cards (with delta + sparkline), views-over-time area chart, top 5 pages, top 5 referrers, top countries mini-list.

**Traffic**
- Area chart: daily views + sessions over selected range
- Bar chart: views by day-of-week / hour-of-day heat strip
- Tables: top referrers, top countries, top user-agents (grouped desktop/mobile/tablet via UA parse)
- New/returning sessions split (donut)

**Content**
- Sortable table of every path: views, sessions, avg time, avg scroll %, bounce (session with <5s + <25% scroll)
- Highlight top 10 and bottom 10 (opportunity list)
- Separate mini-table: blog posts only (matches `/blog/*`) with the same metrics
- Bar chart: top 10 pages by engagement score (time × scroll)

**SEO health** (client-side computed, no new tables)
- Cards: total indexable routes (from sitemap fetch), sitemap last-modified, robots.txt allow/disallow summary, `llms.txt` present
- Table row per tool/blog route with checks: title present, meta description present/length, canonical present, FAQ JSON-LD present, noindex flag — pulled by fetching the built HTML for each route via `fetch()` on demand ("Run SEO scan" button)
- Reuses the same rules as `scripts/seo-check.ts` (extract shared helpers into `src/lib/seo-audit.ts`)

**Ads & revenue**
- KPI: impressions, clicks, CTR, filled zones vs total
- Line chart: daily impressions & clicks
- Bar chart: CTR by zone
- Table: per-zone impressions, clicks, CTR, revenue-proxy (impressions × placeholder RPM configurable in a small input)

**Zones** (existing tab, tidied)
- Same enable/slot-id editing, plus inline sparkline of last-30d impressions per zone

## Time range + deltas
Top-right selector: 7d / 30d / 90d. All queries fetch `[range]` and `[prior range of same length]` in parallel; each KPI shows `value` and `Δ%` vs prior. Sparkline uses daily buckets over the selected range.

## Data plumbing
- New `src/lib/admin-analytics.ts` with typed helpers:
  - `fetchRange(from, to)` → views, sessions (with duration/scroll), ad_events, joined by day
  - `bucketByDay(rows, from, to)` for chart series
  - `topN(rows, key, n)` for tables
  - `parseUA(ua)` → device class
- All queries paginate in 1000-row chunks (Supabase default cap) so 90-day windows don't truncate.
- Country enrichment: use existing `page_views.country` column if populated; otherwise show "Unknown". No new geo lookup added this round.

## Charts
Add `recharts` (already common in shadcn stack; install if missing). Wrap in a small `<ChartCard title>` component for consistent styling. Sparklines use `<ResponsiveContainer>` + `<AreaChart>` at 40px height.

## Components (new)
- `src/pages/Admin.tsx` — rewritten shell with range switcher + tabs
- `src/components/admin/KpiCard.tsx` — value, delta, sparkline
- `src/components/admin/ChartCard.tsx` — titled chart wrapper
- `src/components/admin/RangePicker.tsx` — 7/30/90 toggle
- `src/components/admin/tabs/OverviewTab.tsx`
- `src/components/admin/tabs/TrafficTab.tsx`
- `src/components/admin/tabs/ContentTab.tsx`
- `src/components/admin/tabs/SeoTab.tsx`
- `src/components/admin/tabs/AdsTab.tsx`
- `src/components/admin/tabs/ZonesTab.tsx` (extracted from current Admin)
- `src/lib/admin-analytics.ts` — query + aggregation helpers
- `src/lib/seo-audit.ts` — shared HTML checks (used by SeoTab and `scripts/seo-check.ts`)

## Non-goals (this round)
- No new database tables or migrations — everything computed from existing `page_views`, `page_sessions`, `ad_events`, `ad_zones`.
- No server-side aggregation view — client-side is fine at current volume; can move to a materialized view later.
- No auth/role changes — existing `isAdmin` gate stays.
- No changes to public-facing pages.

## Verification
- `bun run seo:check` still passes after extracting shared helpers.
- Build succeeds; `/admin` loads for admin user; each tab renders with empty-state copy when no data; range switcher refetches all tabs.
