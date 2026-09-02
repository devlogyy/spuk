import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CircleAlert, ExternalLink, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  ADSENSE_PUBLISHER_PATTERN,
  adsenseTxtLine,
  clearAdsensePublisher,
  getAdsenseSettings,
  saveAdsensePublisher,
  type AdsenseSettings,
} from "@/lib/adsense";

type FileStatus = { checked: boolean; matches: boolean; detail: string };

async function checkAdsTxt(publisherId: string | null): Promise<FileStatus> {
  if (!publisherId) return { checked: false, matches: false, detail: "Save a publisher ID to generate the required line." };
  try {
    const response = await fetch(`/ads.txt?check=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return { checked: true, matches: false, detail: "The live /ads.txt file could not be reached." };
    const body = await response.text();
    const expected = adsenseTxtLine(publisherId);
    const matches = body.split(/\r?\n/).some((line) => line.trim() === expected);
    return {
      checked: true,
      matches,
      detail: matches ? "The live file contains the matching publisher line." : "The live file does not contain the matching publisher line yet.",
    };
  } catch {
    return { checked: true, matches: false, detail: "The live /ads.txt file could not be checked." };
  }
}

export function AdSenseTab() {
  const [settings, setSettings] = useState<AdsenseSettings | null>(null);
  const [publisherId, setPublisherId] = useState("");
  const [fileStatus, setFileStatus] = useState<FileStatus>({ checked: false, matches: false, detail: "Not checked yet." });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const saved = await getAdsenseSettings();
      setSettings(saved);
      setPublisherId(saved?.adsense_publisher_id ?? "");
      setFileStatus(await checkAdsTxt(saved?.adsense_publisher_id ?? null));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load AdSense settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const normalizedId = publisherId.trim();
  const valid = ADSENSE_PUBLISHER_PATTERN.test(normalizedId);
  const setupComplete = valid && fileStatus.matches;
  const generatedLine = useMemo(() => (valid ? adsenseTxtLine(normalizedId) : "google.com, pub-XXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"), [normalizedId, valid]);

  const save = async () => {
    if (!valid) {
      toast.error("Enter a valid AdSense publisher ID, such as ca-pub-1234567890123456.");
      return;
    }
    setSaving(true);
    try {
      const nextFileStatus = await checkAdsTxt(normalizedId);
      const saved = await saveAdsensePublisher(normalizedId, nextFileStatus.matches ? new Date().toISOString() : null);
      setSettings(saved);
      setFileStatus(nextFileStatus);
      toast.success(nextFileStatus.matches ? "Publisher saved and ads.txt verified" : "Publisher saved; finish ads.txt setup");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save publisher ID");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await clearAdsensePublisher();
      setSettings(null);
      setPublisherId("");
      setFileStatus({ checked: false, matches: false, detail: "Not checked yet." });
      toast.success("AdSense publisher removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove publisher ID");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading AdSense setup…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Google AdSense</h2>
          <p className="text-xs text-muted-foreground">Connect the publisher ID used to serve ads on Lexora.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading || saving}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Publisher setup</div>
            <div className="text-xs text-muted-foreground">Use the publisher ID from your AdSense account, not an ad unit slot ID.</div>
          </div>
          <Badge variant={setupComplete ? "default" : "secondary"}>{setupComplete ? "Ready" : "Needs setup"}</Badge>
        </div>

        <div className="space-y-2">
          <label htmlFor="adsense-publisher-id" className="text-xs font-medium">Publisher ID</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="adsense-publisher-id"
              value={publisherId}
              onChange={(event) => setPublisherId(event.target.value)}
              placeholder="ca-pub-1234567890123456"
              aria-invalid={publisherId.length > 0 && !valid}
              className="font-mono text-sm"
            />
            <Button onClick={() => void save()} disabled={saving || !valid}>
              {saving ? <Loader2 className="animate-spin" /> : null}
              Save publisher
            </Button>
          </div>
          {publisherId.length > 0 && !valid && <p className="text-xs text-destructive">Publisher IDs look like ca-pub- followed by 10–20 digits.</p>}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {valid ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
            <div>
              <div className="text-sm font-medium">Publisher ID saved</div>
              <div className="text-xs text-muted-foreground">{valid ? `Ads can use ${normalizedId}.` : "Enter and save your publisher ID first."}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            {fileStatus.matches ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
            <div className="min-w-0">
              <div className="text-sm font-medium">Live ads.txt verification</div>
              <div className="text-xs text-muted-foreground">{fileStatus.detail}</div>
            </div>
          </div>
        </div>

        {valid && !fileStatus.matches && (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="mb-1 text-xs font-semibold">Add this line to /ads.txt</div>
            <code className="block overflow-x-auto text-xs text-foreground">{generatedLine}</code>
            <p className="mt-2 text-xs text-muted-foreground">After the file is live, click Refresh to verify it. AdSense may take time to review a new site.</p>
          </div>
        )}

        {settings?.adsense_publisher_id && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">Last saved {new Date(settings.updated_at).toLocaleString()}</span>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => void remove()} disabled={saving}>
              <Trash2 /> Remove publisher
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-start gap-3">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="space-y-1">
            <div className="text-sm font-semibold">Revenue reporting</div>
            <p className="text-xs leading-relaxed text-muted-foreground">A publisher ID enables ad serving, but it does not grant access to AdSense earnings. The Ads dashboard continues to show Lexora's own impressions and clicks; AdSense earnings will appear only after Google reporting access is connected.</p>
            <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs">
              <a href="https://www.google.com/adsense/" target="_blank" rel="noreferrer">Open AdSense <ExternalLink /></a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
