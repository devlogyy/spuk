import { useMemo } from "react";
import { TILE_VALUES } from "@/lib/words";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  max?: number;
}

export function TileInput({ value, onChange, placeholder = "Enter your letters", max = 15 }: Props) {
  const tiles = useMemo(() => value.toUpperCase().split("").slice(0, max), [value, max]);
  return (
    <div className="space-y-3">
      <div className="glass-strong flex items-center gap-2 rounded-2xl p-2 shadow-soft">
        <input
          aria-label={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z?*]/g, "").slice(0, max))}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-base font-medium outline-none placeholder:text-muted-foreground"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          aria-label="Clear letters"
          onClick={() => onChange("")}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-accent"
        >
          Clear
        </button>
      </div>
      {tiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tiles.map((t, i) => (
            <div key={i} className="tile relative grid h-12 w-12 place-items-center text-xl">
              {t === "?" || t === "*" ? "★" : t}
              <span className="absolute bottom-0.5 right-1 text-[9px] font-semibold opacity-70">
                {TILE_VALUES[t] ?? 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
