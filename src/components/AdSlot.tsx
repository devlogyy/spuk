import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export function AdSlot({ zoneKey, className }: Props) {
  const [zone, setZone] = useState<{ id: string; enabled: boolean; ad_slot_id: string | null } | null>(null);

  useEffect(() => {
    supabase
      .from("ad_zones")
      .select("id, enabled, ad_slot_id")
      .eq("key", zoneKey)
      .maybeSingle()
      .then(({ data }) => setZone(data));
  }, [zoneKey]);

  useEffect(() => {
    if (!zone?.enabled) return;
    const sid = getSessionId();
    supabase.from("ad_events").insert({
      zone_id: zone.id,
      zone_key: zoneKey,
      session_id: sid,
      event_type: "impression",
    });
    if (ADSENSE_CLIENT && zone.ad_slot_id) {
      try {
        // @ts-expect-error adsbygoogle global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [zone, zoneKey]);

  if (!zone?.enabled) return null;

  const trackClick = () => {
    const sid = getSessionId();
    supabase.from("ad_events").insert({
      zone_id: zone.id,
      zone_key: zoneKey,
      session_id: sid,
      event_type: "click",
    });
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
