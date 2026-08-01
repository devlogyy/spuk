import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/admin/KpiCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { SitemapCard } from "./SitemapCard";
import { UrlInspector } from "./UrlInspector";
import type { RangeKey } from "@/lib/admin-analytics";
import {
  callGsc,
  gscDateRange,
  gscPriorRange,
  getSavedProperty,
  prettyProperty,
  saveProperty,
  type GscRow,
  type GscSite,
} from "@/lib/search-console";
import { SITE_URL } from "@/lib/seo";

function delta(a: number, b: number) {
  if (!b) return a ? 100 : 0;
  return ((a - b) / b) * 100;
}

export function SearchConsolePanel({ range }: { range: RangeKey }) {
  const [sites, setSites] = useState<GscSite[] | null>(null);
  const [property, setProperty] = useState<string>("");
  const [connError, setConnError] = useState<string | null>(null);
  const [loadingSites, setLoadingSites] = useState(true);

  const [totals, setTotals] = useState<GscRow | null>(null);
  const [priorTotals, setPriorTotals] = useState<GscRow | null>(null);
  const [series, setSeries] = useState<GscRow[]>([]);
  const [queries, setQueries] = useState<GscRow[]>([]);
  const [pages, setPages] = useState<GscRow[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { startDate, endDate } = useMemo(() => gscDateRange(range), [range]);

  const loadSites = async () => {
    setLoadingSites(true);
    setConnError(null);
    try {
      const data = await callGsc<{ sites: GscSite[] }>({ action: "list-sites" });
      setSites(data.sites);
      const saved = getSavedProperty();
      const host = new URL(SITE_URL).hostname;
      const auto =
        data.sites.find((s) => s.siteUrl === saved)?.siteUrl ??
        data.sites.find((s) => s.siteUrl === `sc-domain:${host}`)?.siteUrl ??
        data.sites.find((s) => s.siteUrl.includes(host))?.siteUrl ??
        (data.sites.length === 1 ? data.sites[0].siteUrl : "");
      if (auto) {
        setProperty(auto);
        saveProperty(auto);
      }
    } catch (e) {
      setConnError(e instanceof Error ? e.message : "Could not reach Search Console");
    } finally {
      setLoadingSites(false);
    }
  };

  useEffect(() => {
    void loadSites();
  }, []);

  const loadData = async () => {
    if (!property) return;
    setBusy(true);
    setDataError(null);
    try {
      const prior = gscPriorRange(range);
      const [t, p, s, q, pg] = await Promise.all([
        callGsc<{ row: GscRow | null }>({ action: "totals", siteUrl: property, startDate, endDate }),
        callGsc<{ row: GscRow | null }>({ action: "totals", siteUrl: property, ...prior }),
        callGsc<{ rows: GscRow[] }>({ action: "performance", siteUrl: property, startDate, endDate }),
        callGsc<{ rows: GscRow[] }>({ action: "queries", siteUrl: property, startDate, endDate }),
        callGsc<{ rows: GscRow[] }>({ action: "pages", siteUrl: property, startDate, endDate }),
      ]);
      setTotals(t.row);
      setPriorTotals(p.row);
      setSeries(s.rows);
      setQueries(q.rows);
      setPages(pg.rows);
    } catch (e) {
      setDataError(e instanceof Error ? e.message : "Could not load Search Console data");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property, startDate, endDate]);

  const chart = series.map((r) => ({
    day: r.keys?.[0] ?? "",
    clicks: r.clicks,
    impressions: r.impressions,
    position: Number(r.position.toFixed(1)),
  }));

  const hasData = (totals?.impressions ?? 0) > 0;

  // ---------- Setup wizard ----------
  const steps = [
    {
      label: "Google account connected",
      ok: !connError && !!sites,
      detail: connError ?? (sites ? `${sites.length} verified propert${sites.length === 1 ? "y" : "ies"} available` : "Checking…"),
    },
    {
      label: "Property selected",
      ok: !!property,
      detail: property
        ? prettyProperty(property)
        : sites?.length
          ? "Pick which verified property to report on"
          : `No verified property covers ${new URL(SITE_URL).hostname}. Verify it in Search Console first.`,
    },
    {
      label: "Search data flowing",
      ok: hasData,
      detail: hasData
        ? `${totals!.impressions.toLocaleString()} impressions in the last ${range.replace("d", " days")}`
        : "No impressions yet — normal for a new property. Check the sitemap card below.",
    },
  ];

  const setupDone = steps.every((s) => s.ok);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Google Search Console</h2>
          <p className="text-xs text-muted-foreground">
            Live search performance for {startDate} → {endDate} (Google data lags ~2 days).
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sites && sites.length > 0 && (
            <Select
              value={property}
              onValueChange={(v) => {
                setProperty(v);
                saveProperty(v);
              }}
            >
              <SelectTrigger className="h-8 w-[240px] text-xs">
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((s) => (
                  <SelectItem key={s.siteUrl} value={s.siteUrl} className="text-xs">
                    {prettyProperty(s.siteUrl)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => (property ? loadData() : loadSites())}
            disabled={busy || loadingSites}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${busy || loadingSites ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {!setupDone && (
        <Card className="p-4 space-y-2">
          <div className="text-sm font-semibold">Setup wizard</div>
          <p className="text-xs text-muted-foreground">Finish these steps to get live Search Console data in this dashboard.</p>
          <ol className="space-y-2 mt-2">
            {steps.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                {s.ok ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {i + 1}. {s.label}
                  </div>
                  <div className="text-xs text-muted-foreground break-words">{s.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {dataError && (
        <Card className="p-3 text-xs text-rose-500">{dataError}</Card>
      )}

      {property && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
              label="Clicks"
              value={(totals?.clicks ?? 0).toLocaleString()}
              deltaPct={delta(totals?.clicks ?? 0, priorTotals?.clicks ?? 0)}
            />
            <KpiCard
              label="Impressions"
              value={(totals?.impressions ?? 0).toLocaleString()}
              deltaPct={delta(totals?.impressions ?? 0, priorTotals?.impressions ?? 0)}
            />
            <KpiCard
              label="CTR"
              value={`${((totals?.ctr ?? 0) * 100).toFixed(2)}%`}
              deltaPct={delta(totals?.ctr ?? 0, priorTotals?.ctr ?? 0)}
            />
            <KpiCard
              label="Avg. position"
              value={(totals?.position ?? 0).toFixed(1)}
              deltaPct={delta(priorTotals?.position ?? 0, totals?.position ?? 0)}
              hint="Lower is better"
            />
          </div>

          <ChartCard title="Clicks & impressions" subtitle="Daily, from Google Search">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d: string) => d.slice(5)} />
                <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={36} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={36} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Line yAxisId="l" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="r" type="monotone" dataKey="impressions" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Average position" subtitle="Lower means you rank higher" height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d: string) => d.slice(5)} />
                <YAxis reversed tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Line type="monotone" dataKey="position" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <RowsTable title="Top queries" rows={queries} label="Query" />
            <RowsTable title="Top pages" rows={pages} label="Page" strip />
          </div>

          <SitemapCard siteUrl={property} />
          <UrlInspector siteUrl={property} />
        </>
      )}

      {loadingSites && (
        <div className="py-8 text-center text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          Contacting Search Console…
        </div>
      )}
    </div>
  );
}

type SortKey = "clicks" | "impressions" | "ctr" | "position";

function RowsTable({ title, rows, label, strip }: { title: string; rows: GscRow[]; label: string; strip?: boolean }) {
  const [sort, setSort] = useState<SortKey>("clicks");
  const sorted = [...rows].sort((a, b) => (sort === "position" ? a.position - b.position : b[sort] - a[sort])).slice(0, 25);

  const head = (k: SortKey, text: string) => (
    <TableHead className="h-9 text-right cursor-pointer select-none" onClick={() => setSort(k)}>
      <span className={sort === k ? "text-foreground font-semibold" : ""}>{text}</span>
    </TableHead>
  );

  return (
    <Card className="p-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="max-h-[420px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">{label}</TableHead>
              {head("clicks", "Clicks")}
              {head("impressions", "Impr.")}
              {head("ctr", "CTR")}
              {head("position", "Pos.")}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => {
              const key = r.keys?.[0] ?? "";
              return (
                <TableRow key={key}>
                  <TableCell className="py-1.5 text-xs max-w-[220px] truncate" title={key}>
                    {strip ? key.replace(/^https?:\/\/[^/]+/, "") || "/" : key}
                  </TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.clicks}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.impressions}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{(r.ctr * 100).toFixed(1)}%</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.position.toFixed(1)}</TableCell>
                </TableRow>
              );
            })}
            {!sorted.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-xs">
                  No data for this period yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
