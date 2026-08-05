import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useConsent } from "@/hooks/useConsent";

/** Loaded lazily so analytics never blocks first paint or hydration. */
const loadSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

function getSessionId(): string {
  let id = sessionStorage.getItem("lex_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("lex_sid", id);
  }
  return id;
}

export function useAnalytics() {
  const { pathname } = useLocation();
  const { consent } = useConsent();
  const sessionRowId = useRef<string | null>(null);
  const enteredAt = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);

  useEffect(() => {
    if (!consent.analytics) return;

    const sid = getSessionId();
    enteredAt.current = Date.now();
    maxScroll.current = 0;
    sessionRowId.current = null;
    let cancelled = false;

    const track = async () => {
      const supabase = await loadSupabase();
      if (cancelled) return;

      supabase.from("page_views").insert({
        path: pathname,
        session_id: sid,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });

      const { data } = await supabase
        .from("page_sessions")
        .insert({ session_id: sid, path: pathname })
        .select("id")
        .single();
      if (data && !cancelled) sessionRowId.current = data.id;
    };

    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as unknown as { requestIdleCallback: (c: () => void, o?: object) => number }).requestIdleCallback(cb, { timeout: 3000 })
        : window.setTimeout(cb, 400);
    idle(() => void track());

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop + window.innerHeight;
      const total = h.scrollHeight || 1;
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      if (pct > maxScroll.current) maxScroll.current = pct;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const flush = () => {
      const rowId = sessionRowId.current;
      if (!rowId) return;
      const duration = Date.now() - enteredAt.current;
      const scroll = maxScroll.current;
      void loadSupabase().then((supabase) =>
        supabase
          .from("page_sessions")
          .update({
            left_at: new Date().toISOString(),
            duration_ms: duration,
            max_scroll_pct: scroll,
          })
          .eq("id", rowId),
      );
    };

    window.addEventListener("pagehide", flush);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [pathname, consent.analytics]);
}
