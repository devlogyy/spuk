import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type ConsentState = {
  analytics: boolean;
  ads: boolean;
  decided: boolean;
};

const STORAGE_KEY = "lex_consent_v1";
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

function load(): ConsentState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return {
      analytics: !!parsed.analytics,
      ads: !!parsed.ads,
      decided: !!parsed.decided,
    };
  } catch {
    return DEFAULT;
  }
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
