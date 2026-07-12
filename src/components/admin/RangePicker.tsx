import { Button } from "@/components/ui/button";
import type { RangeKey } from "@/lib/admin-analytics";

const OPTIONS: RangeKey[] = ["7d", "30d", "90d"];

export function RangePicker({ value, onChange }: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
      {OPTIONS.map((o) => (
        <Button
          key={o}
          size="sm"
          variant={o === value ? "default" : "ghost"}
          className="h-7 px-3 text-xs"
          onClick={() => onChange(o)}
        >
          {o.replace("d", " days")}
        </Button>
      ))}
    </div>
  );
}
