import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, TrendingUp, FileText, Search, DollarSign, Sliders, Loader2 } from "lucide-react";
import {
  avgDurationMs,
  avgScrollPct,
  bucketCount,
  computePathMetrics,
  computeRange,
  dayKey,
  enumerateDays,
  fetchAdEvents,
  fetchSessions,
  fetchViews,
  normalizeReferrer,
  parseUA,
  pct,
  topN,
  uniqueSessions,
  type RangeKey,
} from "@/lib/admin-analytics";
import { RangePicker } from "@/components/admin/RangePicker";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { TrafficTab } from "@/components/admin/tabs/TrafficTab";
import { ContentTab } from "@/components/admin/tabs/ContentTab";
import { SeoTab } from "@/components/admin/tabs/SeoTab";
import { AdsTab } from "@/components/admin/tabs/AdsTab";
import { ZonesTab } from "@/components/admin/tabs/ZonesTab";
import type { RangeBundle } from "@/components/admin/tabs/types";

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [range, setRange] = useState<RangeKey>("30d");
  const [bundle, setBundle] = useState<RangeBundle | null>(null);
  const [busy, setBusy] = useState(false);

  const bounds = useMemo(() => computeRange(range), [range]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const [views, sessions, adEvents, priorViews, priorSessions, priorAds] = await Promise.all([
          fetchViews(bounds.from, bounds.to),
          fetchSessions(bounds.from, bounds.to),
          fetchAdEvents(bounds.from, bounds.to),
          fetchViews(bounds.priorFrom, bounds.priorTo),
          fetchSessions(bounds.priorFrom, bounds.priorTo),
          fetchAdEvents(bounds.priorFrom, bounds.priorTo),
        ]);
        if (cancelled) return;

        const days = enumerateDays(bounds.from, bounds.to);
        const viewsByDay = bucketCount(views, days, (r) => dayKey(r.created_at));
        const sessionsByDay: Record<string, Set<string>> = Object.fromEntries(days.map((d) => [d, new Set()]));
        for (const v of views) {
          const d = dayKey(v.created_at);
          sessionsByDay[d]?.add(v.session_id);
        }
        const series = days.map((d) => ({ day: d, views: viewsByDay[d] ?? 0, sessions: sessionsByDay[d]?.size ?? 0 }));

        const adImpressions = adEvents.filter((e) => e.event_type === "impression").length;
        const adClicks = adEvents.filter((e) => e.event_type === "click").length;
        const priorImpr = priorAds.filter((e) => e.event_type === "impression").length;
        const priorClicks = priorAds.filter((e) => e.event_type === "click").length;
        const priorCtr = priorImpr ? (priorClicks / priorImpr) * 100 : 0;
        const adCtr = adImpressions ? (adClicks / adImpressions) * 100 : 0;

        const impressionsByDay = days.map((d) => {
          const e = adEvents.filter((x) => dayKey(x.created_at) === d);
          return {
            day: d,
            impressions: e.filter((x) => x.event_type === "impression").length,
            clicks: e.filter((x) => x.event_type === "click").length,
          };
        });
        const zoneKeys = Array.from(new Set(adEvents.map((e) => e.zone_key)));
        const byZone = zoneKeys.map((z) => {
          const e = adEvents.filter((x) => x.zone_key === z);
          const impr = e.filter((x) => x.event_type === "impression").length;
          const clk = e.filter((x) => x.event_type === "click").length;
          return { zone: z, impressions: impr, clicks: clk, ctr: impr ? (clk / impr) * 100 : 0 };
        }).sort((a, b) => b.impressions - a.impressions);

        const b: RangeBundle = {
          kpis: {
            views: views.length,
            viewsDelta: pct(views.length, priorViews.length),
            sessions: uniqueSessions(views),
            sessionsDelta: pct(uniqueSessions(views), uniqueSessions(priorViews)),
            avgDurationMs: avgDurationMs(sessions),
            durationDelta: pct(avgDurationMs(sessions), avgDurationMs(priorSessions)),
            avgScrollPct: avgScrollPct(sessions),
            scrollDelta: pct(avgScrollPct(sessions), avgScrollPct(priorSessions)),
            adImpressions,
            adClicks,
            adCtr,
            ctrDelta: pct(adCtr, priorCtr),
          },
          series,
          topPages: topN(views, (v) => v.path, 20),
          topReferrers: topN(views, (v) => normalizeReferrer(v.referrer), 20),
          topCountries: topN(views, (v) => v.country ?? "Unknown", 20),
          topDevices: topN(views, (v) => parseUA(v.user_agent), 10),
          pathMetrics: computePathMetrics(views, sessions),
          ads: { impressionsByDay, byZone },
        };
        setBundle(b);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, bounds]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold mb-2">Not authorized</h1>
        <p className="text-muted-foreground mb-4">
          Your account doesn't have admin access. Ask an existing admin to promote you, or run this SQL once with your user id:
        </p>
        <pre className="rounded bg-muted p-3 text-xs overflow-auto">{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${user.id}', 'admin');`}</pre>
        <Button variant="outline" className="mt-4" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <Helmet>
        <title>Admin dashboard · Lexora</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Traffic, content and ad performance for the last {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <RangePicker value={range} onChange={setRange} />
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview" className="gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" />Overview</TabsTrigger>
          <TabsTrigger value="traffic" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Traffic</TabsTrigger>
          <TabsTrigger value="content" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Content</TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5"><Search className="h-3.5 w-3.5" />SEO</TabsTrigger>
          <TabsTrigger value="ads" className="gap-1.5"><DollarSign className="h-3.5 w-3.5" />Ads</TabsTrigger>
          <TabsTrigger value="zones" className="gap-1.5"><Sliders className="h-3.5 w-3.5" />Zones</TabsTrigger>
        </TabsList>

        {!bundle ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
            Crunching analytics…
          </div>
        ) : (
          <>
            <TabsContent value="overview"><OverviewTab data={bundle} /></TabsContent>
            <TabsContent value="traffic"><TrafficTab data={bundle} /></TabsContent>
            <TabsContent value="content"><ContentTab data={bundle} /></TabsContent>
            <TabsContent value="seo"><SeoTab /></TabsContent>
            <TabsContent value="ads"><AdsTab data={bundle} /></TabsContent>
            <TabsContent value="zones"><ZonesTab data={bundle} /></TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
