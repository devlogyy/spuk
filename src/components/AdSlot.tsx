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

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

function ensureAdsenseScript() {
  if (!ADSENSE_CLIENT) return;
  if (document.querySelector("script[data-adsense]")) return;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  s.setAttribute("data-adsense", "1");
  document.head.appendChild(s);
}

export function AdSlot({ zoneKey, className }: Props) {
  const { consent } = useConsent();
  const [zone, setZone] = useState<{ id: string; enabled: boolean; ad_slot_id: string | null } | null>(null);

  useEffect(() => {
    // Without ads consent no ad can render, so skip the zone lookup entirely
    // and keep the database client off the main thread.
    if (!consent.ads) return;
    let cancelled = false;
    const load = async () => {
      const supabase = await loadSupabase();
      const { data } = await supabase
        .from("ad_zones")
        .select("id, enabled, ad_slot_id")
        .eq("key", zoneKey)
        .maybeSingle();
      if (!cancelled) setZone(data);
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
    if (ADSENSE_CLIENT && zone.ad_slot_id) {
      ensureAdsenseScript();
      try {
        // @ts-expect-error adsbygoogle global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [zone, zoneKey, consent.ads]);

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

  if (!ADSENSE_CLIENT || !zone.ad_slot_id) {
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
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={zone.ad_slot_id}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
