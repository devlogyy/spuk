import { supabase } from "@/integrations/supabase/client";

export const ADSENSE_PUBLISHER_PATTERN = /^ca-pub-\d{10,20}$/;
export const ADSENSE_SETTINGS_ID = "default";

export interface AdsenseSettings {
  adsense_publisher_id: string | null;
  adsense_verified_at: string | null;
  updated_at: string;
}

type SettingsRow = AdsenseSettings;

function settingsQuery() {
  return (supabase as unknown as {
    from: (table: string) => ReturnType<typeof supabase.from>;
  }).from("site_settings");
}

export async function getAdsenseSettings(): Promise<AdsenseSettings | null> {
  const { data, error } = await settingsQuery()
    .select("adsense_publisher_id, adsense_verified_at, updated_at")
    .eq("id", ADSENSE_SETTINGS_ID)
    .maybeSingle();
  if (error) throw error;
  return (data as SettingsRow | null) ?? null;
}

export async function saveAdsensePublisher(publisherId: string, verifiedAt: string | null) {
  const { data, error } = await settingsQuery()
    .upsert(
      {
        id: ADSENSE_SETTINGS_ID,
        adsense_publisher_id: publisherId,
        adsense_verified_at: verifiedAt,
      },
      { onConflict: "id" },
    )
    .select("adsense_publisher_id, adsense_verified_at, updated_at")
    .single();
  if (error) throw error;
  return data as SettingsRow;
}

export async function clearAdsensePublisher() {
  const { error } = await settingsQuery()
    .update({ adsense_publisher_id: null, adsense_verified_at: null })
    .eq("id", ADSENSE_SETTINGS_ID);
  if (error) throw error;
}

export function adsenseTxtLine(publisherId: string) {
  return `google.com, ${publisherId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
}
