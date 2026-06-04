import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type ConsentState = {
  analytics: boolean;
  ads: boolean;
  decided: boolean;
};

const STORAGE_KEY = "lex_consent_v1";
const COOKIE_KEY = "lex_consent_v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const DEFAULT: ConsentState = { analytics: false, ads: false, decided: false };

type Ctx = {
  consent: ConsentState;
  setConsent: (next: Omit<ConsentState, "decided">) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  reopen: () => void;
  bannerOpen: boolean;
};

const ConsentContext = createContext<Ctx | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
}

function load(): ConsentState {
  if (typeof window === "undefined") return DEFAULT;
  // Try localStorage first
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        analytics: !!parsed.analytics,
        ads: !!parsed.ads,
        decided: !!parsed.decided,
      };
    }
  } catch {}
  // Fallback to cookie (e.g. localStorage blocked or cleared)
  const cookie = readCookie(COOKIE_KEY);
  if (cookie) {
    try {
      const parsed = JSON.parse(cookie);
      return {
        analytics: !!parsed.analytics,
        ads: !!parsed.ads,
        decided: !!parsed.decided,
      };
    } catch {}
  }
  return DEFAULT;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(DEFAULT);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const loaded = load();
    setConsentState(loaded);
    if (!loaded.decided) setBannerOpen(true);
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setConsentState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    window.dispatchEvent(new CustomEvent("lex-consent-change", { detail: next }));
  }, []);

  const setConsent = useCallback(
    (next: Omit<ConsentState, "decided">) => {
      persist({ ...next, decided: true });
      setBannerOpen(false);
    },
    [persist],
  );

  const acceptAll = useCallback(() => {
    persist({ analytics: true, ads: true, decided: true });
    setBannerOpen(false);
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ analytics: false, ads: false, decided: true });
    setBannerOpen(false);
  }, [persist]);

  const reopen = useCallback(() => setBannerOpen(true), []);

  return (
    <ConsentContext.Provider value={{ consent, setConsent, acceptAll, rejectAll, reopen, bannerOpen }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}

// Sync, non-hook accessors for use outside React tree (e.g. main.tsx, AdSlot effects)
export function getConsentSync(): ConsentState {
  return load();
}
