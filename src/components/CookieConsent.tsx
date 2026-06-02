import { useState } from "react";
import { useConsent } from "@/hooks/useConsent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function CookieConsent() {
  const { bannerOpen, acceptAll, rejectAll, setConsent } = useConsent();
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:p-5">
        {!customize ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex-1 text-sm">
              <p className="mb-1 font-semibold text-foreground">We value your privacy</p>
              <p className="text-muted-foreground">
                We use cookies to measure site engagement and to show relevant ads. You can accept all,
                reject non-essential, or choose what to allow.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="ghost" size="sm" onClick={() => setCustomize(true)}>
                Customize
              </Button>
              <Button variant="outline" size="sm" onClick={rejectAll}>
                Reject all
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1 text-sm font-semibold text-foreground">Cookie preferences</p>
              <p className="text-xs text-muted-foreground">
                Essential cookies are always on. Choose which optional categories you allow.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Essential</p>
                  <p className="text-xs text-muted-foreground">
                    Required for the site to work. Always active.
                  </p>
                </div>
                <Switch checked disabled aria-label="Essential cookies are always on" />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Anonymous page views, time on page, and scroll depth.
                  </p>
                </div>
                <Switch
                  checked={analytics}
                  onCheckedChange={setAnalytics}
                  aria-label="Toggle analytics cookies"
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Ads & personalization</p>
                  <p className="text-xs text-muted-foreground">
                    Allows personalized ads and ad performance tracking.
                  </p>
                </div>
                <Switch checked={ads} onCheckedChange={setAds} aria-label="Toggle advertising cookies" />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" size="sm" onClick={rejectAll}>
                Reject all
              </Button>
              <Button variant="outline" size="sm" onClick={acceptAll}>
                Accept all
              </Button>
              <Button size="sm" onClick={() => setConsent({ analytics, ads })}>
                Save preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
