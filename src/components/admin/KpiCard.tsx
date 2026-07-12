import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface Props {
  label: string;
  value: string | number;
  deltaPct?: number;
  spark?: { d: string; v: number }[];
  hint?: string;
}

export function KpiCard({ label, value, deltaPct, spark, hint }: Props) {
  const dir = deltaPct === undefined ? null : deltaPct > 0.5 ? "up" : deltaPct < -0.5 ? "down" : "flat";
  const color = dir === "up" ? "text-emerald-500" : dir === "down" ? "text-rose-500" : "text-muted-foreground";
  const Icon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;

  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {dir && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
            <Icon className="h-3.5 w-3.5" />
            {Math.abs(deltaPct!).toFixed(1)}%
          </div>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      {spark && spark.length > 1 && (
        <div className="h-10 mt-3 -mx-4 -mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sp-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill={`url(#sp-${label})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
