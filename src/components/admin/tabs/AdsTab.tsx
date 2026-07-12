import { useState } from "react";
import { KpiCard } from "@/components/admin/KpiCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RangeBundle } from "./types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdsTab({ data }: { data: RangeBundle }) {
  const [rpm, setRpm] = useState(2); // $ per 1000 impressions estimate
  const { kpis, ads } = data;
  const estRevenue = (kpis.adImpressions / 1000) * rpm;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Impressions" value={kpis.adImpressions.toLocaleString()} />
        <KpiCard label="Clicks" value={kpis.adClicks.toLocaleString()} />
        <KpiCard label="CTR" value={`${kpis.adCtr.toFixed(2)}%`} deltaPct={kpis.ctrDelta} />
        <KpiCard label={`Est. revenue @ $${rpm} RPM`} value={`$${estRevenue.toFixed(2)}`} hint="Approximate — replace with actual AdSense earnings" />
      </div>

      <ChartCard title="Daily impressions & clicks">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ads.impressionsByDay} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d: string) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="clicks" stroke="hsl(var(--accent-foreground))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="CTR by zone" height={240}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ads.byZone} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="zone" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={0} angle={-25} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Bar dataKey="ctr" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Per-zone performance</div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            RPM ($):
            <Input type="number" step="0.1" value={rpm} onChange={(e) => setRpm(Number(e.target.value) || 0)} className="h-7 w-20" />
          </label>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">Zone</TableHead>
              <TableHead className="h-9 text-right">Impressions</TableHead>
              <TableHead className="h-9 text-right">Clicks</TableHead>
              <TableHead className="h-9 text-right">CTR</TableHead>
              <TableHead className="h-9 text-right">Est. $</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.byZone.map((z) => (
              <TableRow key={z.zone}>
                <TableCell className="py-1.5 font-mono text-xs">{z.zone}</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{z.impressions}</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{z.clicks}</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{z.ctr.toFixed(2)}%</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">${((z.impressions / 1000) * rpm).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {!ads.byZone.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-xs">
                  No ad events recorded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
