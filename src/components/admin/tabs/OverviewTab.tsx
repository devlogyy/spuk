import { KpiCard } from "@/components/admin/KpiCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { Card } from "@/components/ui/card";
import type { RangeBundle } from "./types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function fmtDuration(ms: number) {
  if (!ms) return "0s";
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s - m * 60)}s`;
}

export function OverviewTab({ data }: { data: RangeBundle }) {
  const { kpis, series, topPages, topReferrers, topCountries } = data;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Page views" value={kpis.views.toLocaleString()} deltaPct={kpis.viewsDelta} spark={series.map((s) => ({ d: s.day, v: s.views }))} />
        <KpiCard label="Sessions" value={kpis.sessions.toLocaleString()} deltaPct={kpis.sessionsDelta} spark={series.map((s) => ({ d: s.day, v: s.sessions }))} />
        <KpiCard label="Avg. time" value={fmtDuration(kpis.avgDurationMs)} deltaPct={kpis.durationDelta} />
        <KpiCard label="Avg. scroll" value={`${kpis.avgScrollPct}%`} deltaPct={kpis.scrollDelta} />
        <KpiCard label="Ad CTR" value={`${kpis.adCtr.toFixed(2)}%`} deltaPct={kpis.ctrDelta} hint={`${kpis.adImpressions} impr · ${kpis.adClicks} clicks`} />
      </div>

      <ChartCard title="Views & sessions over time" subtitle={`Daily · last ${series.length} days`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d: string) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#views)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="sessions" stroke="hsl(var(--accent-foreground))" fill="url(#sess)" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MiniList title="Top pages" rows={topPages.slice(0, 5).map((r) => ({ k: r.key, v: r.count }))} />
        <MiniList title="Top referrers" rows={topReferrers.slice(0, 5).map((r) => ({ k: r.key, v: r.count }))} />
        <MiniList title="Top countries" rows={topCountries.slice(0, 5).map((r) => ({ k: r.key, v: r.count }))} />
      </div>
    </div>
  );
}

function MiniList({ title, rows }: { title: string; rows: { k: string; v: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.v));
  return (
    <Card className="p-4">
      <div className="text-sm font-semibold mb-3">{title}</div>
      {!rows.length && <div className="text-xs text-muted-foreground">No data yet</div>}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.k} className="text-xs">
            <div className="flex justify-between gap-2 mb-1">
              <span className="truncate font-mono">{r.k}</span>
              <span className="text-muted-foreground tabular-nums">{r.v}</span>
            </div>
            <div className="h-1 rounded bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${(r.v / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
