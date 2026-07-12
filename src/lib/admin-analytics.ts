import { supabase } from "@/integrations/supabase/client";

export type RangeKey = "7d" | "30d" | "90d";
export const RANGE_DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };

export interface RangeBounds {
  from: string;
  to: string;
  priorFrom: string;
  priorTo: string;
  days: number;
}

export function computeRange(range: RangeKey): RangeBounds {
  const days = RANGE_DAYS[range];
  const to = new Date();
  const from = new Date(to.getTime() - days * 86400000);
  const priorTo = new Date(from);
  const priorFrom = new Date(from.getTime() - days * 86400000);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    priorFrom: priorFrom.toISOString(),
    priorTo: priorTo.toISOString(),
    days,
  };
}

async function fetchAll<T>(builder: () => any): Promise<T[]> {
  const CHUNK = 1000;
  let out: T[] = [];
  for (let page = 0; page < 20; page++) {
    const { data, error } = await builder().range(page * CHUNK, page * CHUNK + CHUNK - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    out = out.concat(data as T[]);
    if (data.length < CHUNK) break;
  }
  return out;
}

export interface PageView {
  path: string;
  session_id: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  created_at: string;
}
export interface PageSession {
  session_id: string;
  path: string;
  entered_at: string;
  duration_ms: number | null;
  max_scroll_pct: number | null;
}
export interface AdEvent {
  zone_key: string;
  event_type: string;
  created_at: string;
}

export async function fetchViews(from: string, to: string) {
  return fetchAll<PageView>(() =>
    supabase
      .from("page_views")
      .select("path, session_id, referrer, user_agent, country, created_at")
      .gte("created_at", from)
      .lt("created_at", to)
      .order("created_at", { ascending: true }),
  );
}
export async function fetchSessions(from: string, to: string) {
  return fetchAll<PageSession>(() =>
    supabase
      .from("page_sessions")
      .select("session_id, path, entered_at, duration_ms, max_scroll_pct")
      .gte("entered_at", from)
      .lt("entered_at", to)
      .order("entered_at", { ascending: true }),
  );
}
export async function fetchAdEvents(from: string, to: string) {
  return fetchAll<AdEvent>(() =>
    supabase
      .from("ad_events")
      .select("zone_key, event_type, created_at")
      .gte("created_at", from)
      .lt("created_at", to)
      .order("created_at", { ascending: true }),
  );
}

// ---------- aggregation helpers ----------
export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}
export function enumerateDays(from: string, to: string): string[] {
  const start = new Date(from);
  const end = new Date(to);
  const out: string[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const stop = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (d <= stop) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
export function bucketCount<T extends { created_at?: string; entered_at?: string }>(
  rows: T[],
  days: string[],
  getKey: (r: T) => string,
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const d of days) map[d] = 0;
  for (const r of rows) {
    const k = getKey(r);
    if (k in map) map[k]++;
  }
  return map;
}

export function pct(a: number, b: number): number {
  if (!b) return a > 0 ? 100 : 0;
  return ((a - b) / b) * 100;
}

export function uniqueSessions(rows: { session_id: string }[]): number {
  return new Set(rows.map((r) => r.session_id)).size;
}

export function avgDurationMs(sessions: PageSession[]): number {
  const durs = sessions.map((s) => s.duration_ms ?? 0).filter((n) => n > 0);
  if (!durs.length) return 0;
  return Math.round(durs.reduce((a, b) => a + b, 0) / durs.length);
}

export function avgScrollPct(sessions: PageSession[]): number {
  const s = sessions.map((r) => r.max_scroll_pct ?? 0).filter((n) => n >= 0);
  if (!s.length) return 0;
  return Math.round(s.reduce((a, b) => a + b, 0) / s.length);
}

export function topN<T>(items: T[], key: (x: T) => string, n = 10): { key: string; count: number }[] {
  const map: Record<string, number> = {};
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    map[k] = (map[k] || 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

export function parseUA(ua: string | null): "mobile" | "tablet" | "desktop" | "bot" | "unknown" {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/bot|crawler|spider|slurp|bingpreview|gptbot|claudebot/.test(s)) return "bot";
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|iphone|android/.test(s)) return "mobile";
  return "desktop";
}

export function normalizeReferrer(r: string | null): string {
  if (!r) return "Direct";
  try {
    const u = new URL(r);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return r;
  }
}

// ---------- per-path content metrics ----------
export interface PathMetric {
  path: string;
  views: number;
  sessions: number;
  avgDurationMs: number;
  avgScrollPct: number;
  bounceRate: number;
  engagementScore: number;
}

export function computePathMetrics(views: PageView[], sessions: PageSession[]): PathMetric[] {
  const paths = new Set<string>([...views.map((v) => v.path), ...sessions.map((s) => s.path)]);
  const byPathViews: Record<string, PageView[]> = {};
  for (const v of views) (byPathViews[v.path] ||= []).push(v);
  const byPathSessions: Record<string, PageSession[]> = {};
  for (const s of sessions) (byPathSessions[s.path] ||= []).push(s);

  const out: PathMetric[] = [];
  for (const p of paths) {
    const vs = byPathViews[p] ?? [];
    const ss = byPathSessions[p] ?? [];
    const dur = avgDurationMs(ss);
    const scroll = avgScrollPct(ss);
    const bounces = ss.filter((s) => (s.duration_ms ?? 0) < 5000 && (s.max_scroll_pct ?? 0) < 25).length;
    out.push({
      path: p,
      views: vs.length,
      sessions: new Set(vs.map((v) => v.session_id)).size,
      avgDurationMs: dur,
      avgScrollPct: scroll,
      bounceRate: ss.length ? Math.round((bounces / ss.length) * 100) : 0,
      engagementScore: Math.round((dur / 1000) * (scroll / 100) * vs.length),
    });
  }
  return out.sort((a, b) => b.views - a.views);
}
