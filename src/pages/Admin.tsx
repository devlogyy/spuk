import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Zone {
  id: string;
  key: string;
  page_path: string;
  position: string;
  enabled: boolean;
  ad_slot_id: string | null;
}

interface Recommendation {
  key: string;
  page_path: string;
  position: string;
  enabled: boolean;
  avg_duration_ms: number;
  avg_scroll_pct: number;
  views: number;
  engagement_score: number;
}

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [stats, setStats] = useState({ views: 0, sessions: 0, avgDuration: 0 });
  const [topPages, setTopPages] = useState<{ path: string; views: number }[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [adEvents, setAdEvents] = useState<Record<string, { impressions: number; clicks: number }>>({});

  useEffect(() => {
    if (!isAdmin) return;
    void loadAll();
  }, [isAdmin]);

  async function loadAll() {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();

    const [{ count: vc }, { data: ss }, { data: pv }, { data: zs }, { data: rs }, { data: ae }] = await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("page_sessions").select("session_id, duration_ms").gte("entered_at", since),
      supabase.from("page_views").select("path").gte("created_at", since),
      supabase.from("ad_zones").select("*").order("key"),
      supabase.from("v_zone_recommendations").select("*").order("engagement_score", { ascending: false }),
      supabase.from("ad_events").select("zone_key, event_type").gte("created_at", since),
    ]);

    const uniq = new Set((ss ?? []).map((r: any) => r.session_id));
    const durs = (ss ?? []).map((r: any) => r.duration_ms).filter(Boolean);
    const avg = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
    setStats({ views: vc ?? 0, sessions: uniq.size, avgDuration: avg });

    const counts: Record<string, number> = {};
    (pv ?? []).forEach((r: any) => (counts[r.path] = (counts[r.path] || 0) + 1));
    setTopPages(
      Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, views]) => ({ path, views })),
    );

    setZones((zs as Zone[]) ?? []);
    setRecs((rs as Recommendation[]) ?? []);

    const agg: Record<string, { impressions: number; clicks: number }> = {};
    (ae ?? []).forEach((r: any) => {
      if (!agg[r.zone_key]) agg[r.zone_key] = { impressions: 0, clicks: 0 };
      if (r.event_type === "impression") agg[r.zone_key].impressions++;
      else if (r.event_type === "click") agg[r.zone_key].clicks++;
    });
    setAdEvents(agg);
  }

  async function toggleZone(z: Zone) {
    const { error } = await supabase.from("ad_zones").update({ enabled: !z.enabled }).eq("id", z.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`${z.key} ${!z.enabled ? "enabled" : "disabled"}`);
      void loadAll();
    }
  }

  async function updateSlotId(z: Zone, slotId: string) {
    const { error } = await supabase.from("ad_zones").update({ ad_slot_id: slotId || null }).eq("id", z.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  if (loading) return <div className="container py-16">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin)
    return (
      <div className="container mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold mb-2">Not authorized</h1>
        <p className="text-muted-foreground mb-4">
          Your account doesn't have admin access. Ask an existing admin to promote you, or run this SQL once with your user id:
        </p>
        <pre className="rounded bg-muted p-3 text-xs overflow-auto">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${user.id}', 'admin');`}
        </pre>
        <Button variant="outline" className="mt-4" onClick={signOut}>Sign out</Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin</h1>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="zones">Ad Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle>Page views (30d)</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats.views}</CardContent></Card>
            <Card><CardHeader><CardTitle>Unique sessions</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats.sessions}</CardContent></Card>
            <Card><CardHeader><CardTitle>Avg duration</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{(stats.avgDuration / 1000).toFixed(1)}s</CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Top pages</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Path</TableHead><TableHead className="text-right">Views</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topPages.map((p) => (
                    <TableRow key={p.path}><TableCell>{p.path}</TableCell><TableCell className="text-right">{p.views}</TableCell></TableRow>
                  ))}
                  {!topPages.length && <TableRow><TableCell colSpan={2} className="text-muted-foreground">No data yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Engagement-ranked zones</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Zones are ranked by avg time × avg scroll depth on the page they live on. Enable top zones first for best ad performance.
              </p>
              <Table>
                <TableHeader><TableRow><TableHead>Zone</TableHead><TableHead>Page</TableHead><TableHead className="text-right">Views</TableHead><TableHead className="text-right">Avg time</TableHead><TableHead className="text-right">Avg scroll</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                <TableBody>
                  {recs.map((r) => (
                    <TableRow key={r.key}>
                      <TableCell className="font-mono text-xs">{r.key}</TableCell>
                      <TableCell>{r.page_path}</TableCell>
                      <TableCell className="text-right">{r.views}</TableCell>
                      <TableCell className="text-right">{(r.avg_duration_ms / 1000).toFixed(1)}s</TableCell>
                      <TableCell className="text-right">{r.avg_scroll_pct}%</TableCell>
                      <TableCell className="text-right">{r.engagement_score.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Ad zones</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Key</TableHead><TableHead>Page</TableHead><TableHead>AdSense slot ID</TableHead><TableHead className="text-right">Impr.</TableHead><TableHead className="text-right">Clicks</TableHead><TableHead className="text-right">CTR</TableHead><TableHead className="text-right">Enabled</TableHead></TableRow></TableHeader>
                <TableBody>
                  {zones.map((z) => {
                    const ev = adEvents[z.key] || { impressions: 0, clicks: 0 };
                    const ctr = ev.impressions ? ((ev.clicks / ev.impressions) * 100).toFixed(2) : "0.00";
                    return (
                      <TableRow key={z.id}>
                        <TableCell className="font-mono text-xs">{z.key}</TableCell>
                        <TableCell>{z.page_path}</TableCell>
                        <TableCell>
                          <Input
                            defaultValue={z.ad_slot_id ?? ""}
                            placeholder="e.g. 1234567890"
                            onBlur={(e) => e.target.value !== (z.ad_slot_id ?? "") && updateSlotId(z, e.target.value)}
                            className="h-8 w-40"
                          />
                        </TableCell>
                        <TableCell className="text-right">{ev.impressions}</TableCell>
                        <TableCell className="text-right">{ev.clicks}</TableCell>
                        <TableCell className="text-right">{ctr}%</TableCell>
                        <TableCell className="text-right">
                          <Switch checked={z.enabled} onCheckedChange={() => toggleZone(z)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
