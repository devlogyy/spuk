import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useConsent } from "@/hooks/useConsent";

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

    supabase.from("page_views").insert({
      path: pathname,
      session_id: sid,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    });

    supabase
      .from("page_sessions")
      .insert({ session_id: sid, path: pathname })
      .select("id")
      .single()
      .then(({ data }) => {
        if (data) sessionRowId.current = data.id;
      });

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop + window.innerHeight;
      const total = h.scrollHeight || 1;
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      if (pct > maxScroll.current) maxScroll.current = pct;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const flush = () => {
      if (!sessionRowId.current) return;
      const duration = Date.now() - enteredAt.current;
      supabase
        .from("page_sessions")
        .update({
          left_at: new Date().toISOString(),
          duration_ms: duration,
          max_scroll_pct: maxScroll.current,
        })
        .eq("id", sessionRowId.current);
    };

    window.addEventListener("pagehide", flush);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [pathname, consent.analytics]);
}
