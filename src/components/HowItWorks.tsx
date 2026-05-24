import { Keyboard, MousePointerClick, Trophy } from "lucide-react";

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const DEFAULT_STEPS: Step[] = [
  { icon: Keyboard, title: "Enter your letters", desc: "Type the tiles or pattern you have." },
  { icon: MousePointerClick, title: "Tap the button", desc: "We search every valid word instantly." },
  { icon: Trophy, title: "Pick the best play", desc: "Sorted by score, length and rarity." },
];

export function HowItWorks({ steps = DEFAULT_STEPS }: { steps?: Step[] }) {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-card sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-glow">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </div>
              <div className="font-display text-sm font-bold">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
