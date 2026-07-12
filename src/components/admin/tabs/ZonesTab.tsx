import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { RangeBundle } from "./types";

interface Zone {
  id: string;
  key: string;
  page_path: string;
  position: string;
  enabled: boolean;
  ad_slot_id: string | null;
}

export function ZonesTab({ data }: { data: RangeBundle }) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: zs } = await supabase.from("ad_zones").select("*").order("key");
    setZones((zs as Zone[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (z: Zone) => {
    const { error } = await supabase.from("ad_zones").update({ enabled: !z.enabled }).eq("id", z.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`${z.key} ${!z.enabled ? "enabled" : "disabled"}`);
      void load();
    }
  };

  const updateSlot = async (z: Zone, slot: string) => {
    const { error } = await supabase.from("ad_zones").update({ ad_slot_id: slot || null }).eq("id", z.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const zoneStats: Record<string, { impressions: number; clicks: number }> = {};
  for (const z of data.ads.byZone) zoneStats[z.zone] = { impressions: z.impressions, clicks: z.clicks };

  const enabled = zones.filter((z) => z.enabled).length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">Ad zones</div>
          <div className="text-xs text-muted-foreground">
            {enabled} of {zones.length} zones enabled
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">Key</TableHead>
              <TableHead className="h-9">Page</TableHead>
              <TableHead className="h-9">AdSense slot ID</TableHead>
              <TableHead className="h-9 text-right">Impr.</TableHead>
              <TableHead className="h-9 text-right">Clicks</TableHead>
              <TableHead className="h-9 text-right">CTR</TableHead>
              <TableHead className="h-9 text-right">Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((z) => {
              const s = zoneStats[z.key] || { impressions: 0, clicks: 0 };
              const ctr = s.impressions ? ((s.clicks / s.impressions) * 100).toFixed(2) : "0.00";
              return (
                <TableRow key={z.id}>
                  <TableCell className="py-1.5 font-mono text-xs">{z.key}</TableCell>
                  <TableCell className="py-1.5 text-xs">{z.page_path}</TableCell>
                  <TableCell className="py-1.5">
                    <Input
                      defaultValue={z.ad_slot_id ?? ""}
                      placeholder="1234567890"
                      onBlur={(e) => e.target.value !== (z.ad_slot_id ?? "") && updateSlot(z, e.target.value)}
                      className="h-7 w-36 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{s.impressions}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{s.clicks}</TableCell>
                  <TableCell className="py-1.5 text-right tabular-nums text-xs">{ctr}%</TableCell>
                  <TableCell className="py-1.5 text-right">
                    <Switch checked={z.enabled} onCheckedChange={() => toggle(z)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
