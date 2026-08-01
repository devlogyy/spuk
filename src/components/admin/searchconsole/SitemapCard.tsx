import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, UploadCloud } from "lucide-react";
import { callGsc, type GscSitemap } from "@/lib/search-console";
import { SITE_URL } from "@/lib/seo";

const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

export function SitemapCard({ siteUrl }: { siteUrl: string }) {
  const [sitemaps, setSitemaps] = useState<GscSitemap[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = async () => {
    setBusy(true);
    setError(null);
    try {
      const data = await callGsc<{ sitemaps: GscSitemap[] }>({ action: "sitemaps", siteUrl });
      setSitemaps(data.sitemaps);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load sitemaps");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (siteUrl) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteUrl]);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setNote(null);
    try {
      await callGsc({ action: "submit-sitemap", siteUrl, sitemapUrl: SITEMAP_URL });
      setNote("Sitemap submitted. Google usually takes a few days to read it.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">Indexing &amp; sitemaps</div>
          <div className="text-xs text-muted-foreground">Submission status straight from Search Console.</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8" onClick={load} disabled={busy}>
            <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" className="h-8" onClick={submit} disabled={submitting}>
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
            <span className="ml-1">Submit sitemap</span>
          </Button>
        </div>
      </div>

      {error && <div className="text-xs text-rose-500">{error}</div>}
      {note && <div className="text-xs text-emerald-500">{note}</div>}

      {!sitemaps?.length && !busy && !error && (
        <div className="text-xs text-muted-foreground">
          No sitemap submitted for this property yet. Click “Submit sitemap” to send {SITEMAP_URL}.
        </div>
      )}

      <div className="space-y-2">
        {sitemaps?.map((s) => {
          const submitted = Number(s.contents?.[0]?.submitted ?? 0);
          const indexed = Number(s.contents?.[0]?.indexed ?? 0);
          return (
            <div key={s.path} className="rounded-lg border border-border p-3 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs break-all">{s.path}</span>
                {s.isPending ? (
                  <Badge variant="secondary" className="text-[10px]">Pending — not read yet</Badge>
                ) : (
                  <Badge className="text-[10px]">Processed</Badge>
                )}
                {Number(s.errors ?? 0) > 0 && (
                  <Badge variant="destructive" className="text-[10px]">{s.errors} errors</Badge>
                )}
                {Number(s.warnings ?? 0) > 0 && (
                  <Badge variant="outline" className="text-[10px]">{s.warnings} warnings</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                <span>Submitted: {s.lastSubmitted ? new Date(s.lastSubmitted).toLocaleDateString() : "—"}</span>
                <span>Last read: {s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleDateString() : "Not yet"}</span>
                <span>URLs listed: {submitted || "—"}</span>
                <span>Indexed: {indexed || "—"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
