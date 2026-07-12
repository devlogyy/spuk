import { ChartCard } from "@/components/admin/ChartCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RangeBundle } from "./types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrafficTab({ data }: { data: RangeBundle }) {
  const { series, topReferrers, topCountries, topDevices } = data;
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const byDow = dow.map((d) => ({ day: d, views: 0 }));
  for (const p of series) {
    const wd = new Date(p.day).getDay();
    byDow[wd].views += p.views;
  }
  return (
    <div className="space-y-4">
      <ChartCard title="Daily views vs sessions">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d: string) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="sessions" stroke="hsl(var(--accent-foreground))" fill="hsl(var(--accent-foreground) / 0.15)" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Views by day of week" height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byDow} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <TableCard title="Devices" rows={topDevices} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TableCard title="Top referrers" rows={topReferrers.slice(0, 15)} />
        <TableCard title="Top countries" rows={topCountries.slice(0, 15)} />
      </div>
    </div>
  );
}

function TableCard({ title, rows }: { title: string; rows: { key: string; count: number }[] }) {
  return (
    <Card className="p-4">
      <div className="text-sm font-semibold mb-3">{title}</div>
      {!rows.length ? (
        <div className="text-xs text-muted-foreground">No data yet</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-8">Name</TableHead>
              <TableHead className="h-8 text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.key}>
                <TableCell className="py-1.5 font-mono text-xs truncate max-w-[240px]">{r.key}</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
