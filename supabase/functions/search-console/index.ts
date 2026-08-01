import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const CONNECTION_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function gwHeaders() {
  return {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": CONNECTION_KEY!,
    "Content-Type": "application/json",
  };
}

async function gw(path: string, init?: RequestInit) {
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: { ...gwHeaders(), ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Search Console request failed [${res.status}] ${path}: ${text}`);
    throw new Response(
      JSON.stringify({ error: "Google Search Console request failed", status: res.status, details: text }),
      { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  return text ? JSON.parse(text) : {};
}

interface SiteEntry {
  siteUrl: string;
  permissionLevel?: string;
}

async function listVerifiedSites(): Promise<SiteEntry[]> {
  const data = await gw("/webmasters/v3/sites");
  return (data.siteEntry ?? []).filter((e: SiteEntry) => e.permissionLevel !== "siteUnverifiedUser");
}

async function assertVerified(siteUrl: string) {
  const sites = await listVerifiedSites();
  const match = sites.find((s) => s.siteUrl === siteUrl);
  if (!match) {
    throw new Response(
      JSON.stringify({ error: "That Search Console property is not verified for the connected Google account." }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  return match.siteUrl;
}

function enc(v: string) {
  return encodeURIComponent(v);
}

async function query(siteUrl: string, body: Record<string, unknown>) {
  return gw(`/webmasters/v3/sites/${enc(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY || !CONNECTION_KEY) {
      return json({ error: "Google Search Console is not connected for this project." }, 503);
    }

    // --- auth: signed-in admin only ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const userId = claimsData.claims.sub as string;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    const payload = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = String(payload.action ?? "");
    const siteUrl = payload.siteUrl ? String(payload.siteUrl) : "";
    const startDate = payload.startDate ? String(payload.startDate) : "";
    const endDate = payload.endDate ? String(payload.endDate) : "";

    if (action === "list-sites") {
      const sites = await listVerifiedSites();
      return json({ sites });
    }

    if (!siteUrl) return json({ error: "siteUrl is required" }, 400);
    const site = await assertVerified(siteUrl);

    if (action === "performance") {
      if (!startDate || !endDate) return json({ error: "startDate and endDate are required" }, 400);
      const data = await query(site, { startDate, endDate, dimensions: ["date"], rowLimit: 500 });
      return json({ rows: data.rows ?? [] });
    }

    if (action === "totals") {
      if (!startDate || !endDate) return json({ error: "startDate and endDate are required" }, 400);
      const data = await query(site, { startDate, endDate, rowLimit: 1 });
      return json({ row: data.rows?.[0] ?? null });
    }

    if (action === "queries" || action === "pages") {
      if (!startDate || !endDate) return json({ error: "startDate and endDate are required" }, 400);
      const dimension = action === "queries" ? "query" : "page";
      const data = await query(site, { startDate, endDate, dimensions: [dimension], rowLimit: 50 });
      return json({ rows: data.rows ?? [] });
    }

    if (action === "sitemaps") {
      const data = await gw(`/webmasters/v3/sites/${enc(site)}/sitemaps`);
      return json({ sitemaps: data.sitemap ?? [] });
    }

    if (action === "submit-sitemap") {
      const sitemapUrl = String(payload.sitemapUrl ?? "");
      if (!sitemapUrl) return json({ error: "sitemapUrl is required" }, 400);
      await gw(`/webmasters/v3/sites/${enc(site)}/sitemaps/${enc(sitemapUrl)}`, { method: "PUT" });
      return json({ ok: true });
    }

    if (action === "inspect-url") {
      const inspectionUrl = String(payload.inspectionUrl ?? "");
      if (!inspectionUrl) return json({ error: "inspectionUrl is required" }, 400);
      const data = await gw("/v1/urlInspection/index:inspect", {
        method: "POST",
        body: JSON.stringify({ inspectionUrl, siteUrl: site }),
      });
      return json({ result: data.inspectionResult ?? null });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("search-console error:", err);
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});
