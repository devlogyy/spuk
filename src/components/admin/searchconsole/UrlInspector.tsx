import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import { callGsc, type GscInspection } from "@/lib/search-console";
import { SITE_URL } from "@/lib/seo";

function verdictTone(v?: string) {
  if (v === "PASS") return "text-emerald-500";
  if (v === "PARTIAL") return "text-amber-500";
  if (v === "FAIL") return "text-rose-500";
  return "text-muted-foreground";
}

export function UrlInspector({ siteUrl }: { siteUrl: string }) {
  const [url, setUrl] = useState(`${SITE_URL}/`);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GscInspection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const data = await callGsc<{ result: GscInspection | null }>({
        action: "inspect-url",
        siteUrl,
        inspectionUrl: url,
      });
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inspection failed");
    } finally {
      setBusy(false);
    }
  };

  const idx = result?.indexStatusResult;

  return (
    <Card className="p-4 space-y-3">
      <div>
        <div className="text-sm font-semibold">URL inspector</div>
        <div className="text-xs text-muted-foreground">Ask Google directly whether a page is indexed and when it was last crawled.</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} className="h-8 flex-1 min-w-[220px] text-xs" />
        <Button size="sm" className="h-8" onClick={run} disabled={busy || !url}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          <span className="ml-1">Inspect</span>
        </Button>
      </div>

      {error && <div className="text-xs text-rose-500">{error}</div>}

      {idx && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          <Row label="Verdict" value={<span className={verdictTone(idx.verdict)}>{idx.verdict ?? "—"}</span>} />
          <Row label="Coverage" value={idx.coverageState ?? "—"} />
          <Row label="Indexing" value={idx.indexingState ?? "—"} />
          <Row label="robots.txt" value={idx.robotsTxtState ?? "—"} />
          <Row label="Fetch state" value={idx.pageFetchState ?? "—"} />
          <Row
            label="Last crawled"
            value={idx.lastCrawlTime ? new Date(idx.lastCrawlTime).toLocaleString() : "Never crawled yet"}
          />
          <Row label="Google canonical" value={<span className="break-all">{idx.googleCanonical ?? "—"}</span>} />
          <Row label="Your canonical" value={<span className="break-all">{idx.userCanonical ?? "—"}</span>} />
          <Row
            label="Discovered via sitemap"
            value={idx.sitemap?.length ? <Badge variant="secondary" className="text-[10px]">Yes</Badge> : "Not yet"}
          />
          <Row
            label="Mobile usability"
            value={<span className={verdictTone(result?.mobileUsabilityResult?.verdict)}>{result?.mobileUsabilityResult?.verdict ?? "—"}</span>}
          />
        </div>
      )}

      {result && !idx && <div className="text-xs text-muted-foreground">Google returned no index data for this URL yet.</div>}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/50 py-1">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
