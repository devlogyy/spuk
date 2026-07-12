import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  height = 260,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  height?: number;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={{ height }}>{children}</div>
    </Card>
  );
}
