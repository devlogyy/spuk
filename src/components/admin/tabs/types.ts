import type { PathMetric } from "@/lib/admin-analytics";

export interface RangeSeriesPoint {
  day: string;
  views: number;
  sessions: number;
}

export interface RangeBundle {
  kpis: {
    views: number;
    viewsDelta: number;
    sessions: number;
    sessionsDelta: number;
    avgDurationMs: number;
    durationDelta: number;
    avgScrollPct: number;
    scrollDelta: number;
    adImpressions: number;
    adClicks: number;
    adCtr: number;
    ctrDelta: number;
  };
  series: RangeSeriesPoint[];
  topPages: { key: string; count: number }[];
  topReferrers: { key: string; count: number }[];
  topCountries: { key: string; count: number }[];
  topDevices: { key: string; count: number }[];
  pathMetrics: PathMetric[];
  ads: {
    impressionsByDay: { day: string; impressions: number; clicks: number }[];
    byZone: { zone: string; impressions: number; clicks: number; ctr: number }[];
  };
}
