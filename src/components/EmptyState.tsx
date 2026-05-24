import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  examples?: { label: string; onClick: () => void }[];
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, examples, action, icon }: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/40 p-8 text-center sm:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 text-primary">
        {icon ?? <Sparkles className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {examples && examples.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={ex.onClick}
              className="min-h-11 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold tracking-wider transition hover:border-primary hover:text-primary"
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
