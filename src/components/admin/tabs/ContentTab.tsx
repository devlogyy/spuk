import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/admin/ChartCard";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import type { RangeBundle } from "./types";
import type { PathMetric } from "@/lib/admin-analytics";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SortKey = keyof Pick<PathMetric, "views" | "sessions" | "avgDurationMs" | "avgScrollPct" | "bounceRate" | "engagementScore">;

export function ContentTab({ data }: { data: RangeBundle }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("views");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    let r = data.pathMetrics.filter((m) => m.path.toLowerCase().includes(q.toLowerCase()));
    r = [...r].sort((a, b) => (dir === "desc" ? b[sort] - a[sort] : a[sort] - b[sort]));
    return r;
  }, [data.pathMetrics, q, sort, dir]);

  const blog = rows.filter((r) => r.path.startsWith("/blog/") && r.path !== "/blog");
  const topEng = [...data.pathMetrics].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 10);

  const clickSort = (k: SortKey) => {
    if (sort === k) setDir(dir === "desc" ? "asc" : "desc");
    else {
      setSort(k);
      setDir("desc");
    }
  };

  return (
    <div className="space-y-4">
      <ChartCard title="Top 10 pages by engagement" subtitle="views × avg time × avg scroll depth" height={280}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topEng} margin={{ top: 4, right: 8, bottom: 0, left: -8 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="path" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={180} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            <Bar dataKey="engagementScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="text-sm font-semibold">All pages ({rows.length})</div>
          <Input placeholder="Filter by path" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-9">Path</TableHead>
                <SortHead k="views" label="Views" sort={sort} dir={dir} onClick={clickSort} />
                <SortHead k="sessions" label="Sessions" sort={sort} dir={dir} onClick={clickSort} />
                <SortHead k="avgDurationMs" label="Avg time" sort={sort} dir={dir} onClick={clickSort} />
                <SortHead k="avgScrollPct" label="Scroll" sort={sort} dir={dir} onClick={clickSort} />
                <SortHead k="bounceRate" label="Bounce" sort={sort} dir={dir} onClick={clickSort} />
                <SortHead k="engagementScore" label="Score" sort={sort} dir={dir} onClick={clickSort} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.path}>
                  <TableCell className="py-1.5 font-mono text-xs truncate max-w-[260px]">{r.path}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.views}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.sessions}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{(r.avgDurationMs / 1000).toFixed(1)}s</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.avgScrollPct}%</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.bounceRate}%</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.engagementScore.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground text-xs">
                    No data yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-semibold mb-3">Blog posts only ({blog.length})</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">Post</TableHead>
              <TableHead className="h-9 text-right">Views</TableHead>
              <TableHead className="h-9 text-right">Avg time</TableHead>
              <TableHead className="h-9 text-right">Scroll</TableHead>
              <TableHead className="h-9 text-right">Bounce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blog.map((r) => (
              <TableRow key={r.path}>
                <TableCell className="py-1.5 font-mono text-xs truncate max-w-[280px]">{r.path.replace("/blog/", "")}</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.views}</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{(r.avgDurationMs / 1000).toFixed(1)}s</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.avgScrollPct}%</TableCell>
                <TableCell className="py-1.5 text-right tabular-nums text-xs">{r.bounceRate}%</TableCell>
              </TableRow>
            ))}
            {!blog.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-xs">
                  No blog traffic yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SortHead({
  k,
  label,
  sort,
  dir,
  onClick,
}: {
  k: SortKey;
  label: string;
  sort: SortKey;
  dir: "asc" | "desc";
  onClick: (k: SortKey) => void;
}) {
  const active = sort === k;
  return (
    <TableHead className="h-9 text-right">
      <button onClick={() => onClick(k)} className={`inline-flex items-center gap-1 text-xs ${active ? "text-foreground" : ""}`}>
        {label}
        <ArrowUpDown className="h-3 w-3" />
        {active && <span className="text-[10px]">{dir === "desc" ? "↓" : "↑"}</span>}
      </button>
    </TableHead>
  );
}
