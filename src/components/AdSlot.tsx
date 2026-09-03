import { useEffect, useState } from "react";
/** Loaded lazily so the database client stays off the critical rendering path. */
const loadSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);
import { useConsent } from "@/hooks/useConsent";

interface Props {
  zoneKey: string;
  className?: string;
}

function getSessionId(): string {
  let id = sessionStorage.getItem("lex_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("lex_sid", id);
  }
  return id;
}

let publisherIdPromise: Promise<string | null> | null = null;

type PublicQuery = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
    };
  };
};

function loadPublisherId(): Promise<string | null> {
  if (!publisherIdPromise) {
    publisherIdPromise = loadSupabase()
      .then(async (supabase) => {
        const query = (supabase as unknown as {
          from: (table: string) => PublicQuery;
        }).from("site_settings");
        const { data } = await query
          .select("adsense_publisher_id")
          .eq("id", "default")
          .maybeSingle();
        return (data as { adsense_publisher_id?: string | null } | null)?.adsense_publisher_id ?? null;
      })
      .then((publisherId) => {
        if (!publisherId) publisherIdPromise = null;
        return publisherId;
      })
      .catch(() => {
        publisherIdPromise = null;
        return null;
      });
  }
  return publisherIdPromise;
}

function ensureAdsenseScript(publisherId: string) {
  if (document.querySelector("script[data-adsense]")) return;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
  s.setAttribute("data-adsense", "1");
  document.head.appendChild(s);
}

export function AdSlot({ zoneKey, className }: Props) {
  const { consent } = useConsent();
  const [zone, setZone] = useState<{ id: string; enabled: boolean; ad_slot_id: string | null } | null>(null);
  const [publisherId, setPublisherId] = useState<string | null>(null);

  useEffect(() => {
    // Without ads consent no ad can render, so skip the zone lookup entirely
    // and keep the database client off the main thread.
    if (!consent.ads) return;
    let cancelled = false;
    const load = async () => {
      const [supabase, savedPublisherId] = await Promise.all([loadSupabase(), loadPublisherId()]);
      const query = (supabase as unknown as {
        from: (table: string) => PublicQuery;
      }).from("ad_zones");
      const { data } = await query
        .select("id, enabled, ad_slot_id")
        .eq("key", zoneKey)
        .maybeSingle();
      if (!cancelled) {
        setZone(data as { id: string; enabled: boolean; ad_slot_id: string | null } | null);
        setPublisherId(savedPublisherId);
      }
    };
    const w = window as unknown as { requestIdleCallback?: (c: () => void, o?: object) => number };
    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(() => void load(), { timeout: 3000 });
    else setTimeout(() => void load(), 400);
    return () => {
      cancelled = true;
    };
  }, [zoneKey, consent.ads]);

  useEffect(() => {
    if (!zone?.enabled || !consent.ads) return;
    const sid = getSessionId();
    void loadSupabase().then((supabase) =>
      supabase.from("ad_events").insert({
        zone_id: zone.id,
        zone_key: zoneKey,
        session_id: sid,
        event_type: "impression",
      }),
    );
  }, [zone, zoneKey, consent.ads]);

  useEffect(() => {
    if (!zone?.enabled || !publisherId || !zone.ad_slot_id || !consent.ads) return;
    if (publisherId && zone.ad_slot_id) {
      ensureAdsenseScript(publisherId);
      try {
        // @ts-expect-error adsbygoogle global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [zone, publisherId, consent.ads]);

  // Reserve the slot height for consenting users while the zone resolves, so
  // an ad appearing later never pushes content down (CLS / agentic layout
  // stability). Non-consenting users get nothing at all, so nothing shifts.
  if (!zone) {
    return consent.ads ? <div className={`my-4 min-h-[100px] ${className ?? ""}`} aria-hidden="true" /> : null;
  }
  if (!zone.enabled) return null;
  if (!consent.ads) return null;

  const trackClick = () => {
    const sid = getSessionId();
    void loadSupabase().then((supabase) =>
      supabase.from("ad_events").insert({
        zone_id: zone.id,
        zone_key: zoneKey,
        session_id: sid,
        event_type: "click",
      }),
    );
  };

  if (!publisherId || !zone.ad_slot_id) {
    return (
      <div
        className={`my-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground ${className ?? ""}`}
      >
        Ad zone · {zoneKey}
      </div>
    );
  }

  return (
    <div onClick={trackClick} className={`my-4 ${className ?? ""}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={zone.ad_slot_id}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
