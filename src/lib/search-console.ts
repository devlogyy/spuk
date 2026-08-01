import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { RANGE_DAYS, type RangeKey } from "@/lib/admin-analytics";

export interface GscSite {
  siteUrl: string;
  permissionLevel?: string;
}

export interface GscRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscSitemap {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  warnings?: string;
  errors?: string;
  contents?: { type: string; submitted: string; indexed?: string }[];
}

export interface GscInspection {
  inspectionResultLink?: string;
  indexStatusResult?: {
    verdict?: string;
    coverageState?: string;
    robotsTxtState?: string;
    indexingState?: string;
    lastCrawlTime?: string;
    pageFetchState?: string;
    googleCanonical?: string;
    userCanonical?: string;
    sitemap?: string[];
  };
  mobileUsabilityResult?: { verdict?: string };
  richResultsResult?: { verdict?: string };
}

export class GscError extends Error {}

export async function callGsc<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("search-console", { body });
  if (error) {
    let details = error.message;
    if (error instanceof FunctionsHttpError) {
      const raw = await error.context.text();
      try {
        const parsed = JSON.parse(raw);
        details = parsed.error ?? raw;
      } catch {
        details = raw;
      }
    }
    throw new GscError(details);
  }
  return data as T;
}

/** Search Console data lags ~2 days; end the window there so charts aren't full of zeroes. */
export function gscDateRange(range: RangeKey) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (RANGE_DAYS[range] - 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

/** Previous, equal-length window for period-over-period deltas. */
export function gscPriorRange(range: RangeKey) {
  const { startDate } = gscDateRange(range);
  const end = new Date(`${startDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (RANGE_DAYS[range] - 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

const STORAGE_KEY = "lex_gsc_property";

export function getSavedProperty(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveProperty(siteUrl: string) {
  try {
    localStorage.setItem(STORAGE_KEY, siteUrl);
  } catch {
    /* ignore */
  }
}

export function prettyProperty(siteUrl: string) {
  return siteUrl.startsWith("sc-domain:") ? `${siteUrl.slice(10)} (domain)` : siteUrl;
}
