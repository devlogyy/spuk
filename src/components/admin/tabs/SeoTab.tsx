import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SearchConsolePanel } from "@/components/admin/searchconsole/SearchConsolePanel";
import type { RangeKey } from "@/lib/admin-analytics";

interface FileCheck {
  name: string;
  path: string;
  present: boolean;
  size?: number;
  detail?: string;
}

async function checkFile(path: string): Promise<FileCheck> {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) return { name: path, path, present: false };
    const txt = await res.text();
    return { name: path, path, present: true, size: txt.length, detail: txt.slice(0, 0) };
  } catch {
    return { name: path, path, present: false };
  }
}

async function checkSitemap(): Promise<{ urls: number; ok: boolean }> {
  try {
    const res = await fetch("/sitemap.xml", { cache: "no-cache" });
    if (!res.ok) return { urls: 0, ok: false };
    const txt = await res.text();
    const urls = (txt.match(/<loc>/g) ?? []).length;
    return { urls, ok: urls > 0 };
  } catch {
    return { urls: 0, ok: false };
  }
}

async function checkRobots(): Promise<{ ok: boolean; sitemap: boolean; disallowRoot: boolean }> {
  try {
    const res = await fetch("/robots.txt", { cache: "no-cache" });
    if (!res.ok) return { ok: false, sitemap: false, disallowRoot: false };
    const txt = await res.text();
    return {
      ok: true,
      sitemap: /^\s*sitemap:/im.test(txt),
      disallowRoot: /user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*$/im.test(txt),
    };
  } catch {
    return { ok: false, sitemap: false, disallowRoot: false };
  }
}

export function SeoTab({ range }: { range: RangeKey }) {
  const [files, setFiles] = useState<FileCheck[]>([]);
  const [sitemap, setSitemap] = useState<{ urls: number; ok: boolean } | null>(null);
  const [robots, setRobots] = useState<{ ok: boolean; sitemap: boolean; disallowRoot: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const [r, s, ll, ad] = await Promise.all([
      checkRobots(),
      checkSitemap(),
      checkFile("/llms.txt"),
      checkFile("/ads.txt"),
    ]);
    setRobots(r);
    setSitemap(s);
    setFiles([
      { ...ll, name: "llms.txt (AI crawlers)" },
      { ...ad, name: "ads.txt (AdSense)" },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    void run();
  }, []);

  const items = [
    {
      label: "robots.txt reachable",
      state: robots?.ok ? "ok" : "err",
      detail: robots?.ok ? "OK" : "Missing or unreachable",
    },
    {
      label: "robots.txt references sitemap",
      state: robots?.sitemap ? "ok" : "warn",
      detail: robots?.sitemap ? "Sitemap directive present" : "Add `Sitemap: https://.../sitemap.xml`",
    },
    {
      label: "robots.txt not blocking all crawlers",
      state: robots?.disallowRoot ? "err" : "ok",
      detail: robots?.disallowRoot ? "Global Disallow: / detected — this hides your site from Google" : "Site is crawlable",
    },
    {
      label: "sitemap.xml served",
      state: sitemap?.ok ? "ok" : "err",
      detail: sitemap?.ok ? `${sitemap.urls} URLs listed` : "Missing — run `bun run predev` to generate",
    },
    ...files.map((f) => ({
      label: f.name,
      state: f.present ? "ok" : "warn",
      detail: f.present ? `${f.size} bytes` : "Not found",
    })),
  ] as const;

  return (
    <div className="space-y-6">
      <SearchConsolePanel range={range} />

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">SEO health</h2>
          <p className="text-xs text-muted-foreground">Live checks against the deployed site's crawler surface.</p>
        </div>
        <Button size="sm" variant="outline" onClick={run} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
          Re-scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((it) => {
          const Icon = it.state === "ok" ? CheckCircle2 : it.state === "warn" ? AlertCircle : XCircle;
          const color = it.state === "ok" ? "text-emerald-500" : it.state === "warn" ? "text-amber-500" : "text-rose-500";
          return (
            <Card key={it.label} className="p-3 flex items-start gap-3">
              <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${color}`} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{it.label}</div>
                <div className="text-xs text-muted-foreground">{it.detail}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="text-sm font-semibold mb-2">Manual per-page audit</div>
        <p className="text-xs text-muted-foreground">
          For per-page title / meta / FAQ JSON-LD validation, run <code className="rounded bg-muted px-1">bun run seo:check</code> in the
          project — the same check runs automatically before every production build via <code className="rounded bg-muted px-1">prebuild</code>.
        </p>
      </Card>
    </div>
  );
}
