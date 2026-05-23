import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Grid3x3, SlidersHorizontal, Trophy, Zap } from "lucide-react";
import { TileInput } from "@/components/TileInput";
import { WordCard } from "@/components/WordCard";
import { generateResults } from "@/lib/words";

export const Route = createFileRoute("/scrabble-solver")({
  head: () => ({
    meta: [
      { title: "Scrabble Solver — US & UK Dictionary | Lexora" },
      { name: "description", content: "Free AI Scrabble Solver. Enter your tiles to find the highest scoring words with US (TWL) and UK (SOWPODS) dictionary support, blanks, and advanced filters." },
      { property: "og:title", content: "Scrabble Solver — Lexora" },
      { property: "og:description", content: "AI-powered Scrabble cheat with US & UK dictionaries, blanks, scoring and rarity ratings." },
      { property: "og:url", content: "/scrabble-solver" },
    ],
    links: [{ rel: "canonical", href: "/scrabble-solver" }],
  }),
  component: ScrabbleSolver,
});

type Dict = "US" | "UK";
type Sort = "score" | "length" | "rarity";

function ScrabbleSolver() {
  const [letters, setLetters] = useState("AEINRSTL");
  const [dict, setDict] = useState<Dict>("US");
  const [sort, setSort] = useState<Sort>("score");
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [contains, setContains] = useState("");
  const [minLen, setMinLen] = useState(2);

  const results = useMemo(() => {
    let r = generateResults(letters, 24).filter((w) => w.word.length >= minLen);
    if (starts) r = r.filter((w) => w.word.startsWith(starts.toUpperCase()));
    if (ends) r = r.filter((w) => w.word.endsWith(ends.toUpperCase()));
    if (contains) r = r.filter((w) => w.word.includes(contains.toUpperCase()));
    if (sort === "length") r = [...r].sort((a, b) => b.word.length - a.word.length);
    if (sort === "rarity") {
      const order = { epic: 3, rare: 2, uncommon: 1, common: 0 };
      r = [...r].sort((a, b) => order[b.rarity] - order[a.rarity]);
    }
    return r;
  }, [letters, sort, starts, ends, contains, minLen]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Grid3x3 className="h-3.5 w-3.5 text-primary" /> Scrabble Solver
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Find the <span className="text-gradient">highest scoring</span> Scrabble plays
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Type up to 15 letters. Use <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">?</kbd> for blanks. Switch between US (TWL) and UK (SOWPODS) dictionaries.
        </p>
      </motion.header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <TileInput value={letters} onChange={setLetters} />

          {/* Dict toggle + sort */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass flex rounded-full p-1">
              {(["US", "UK"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDict(d)}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    dict === d ? "bg-gradient-to-r from-primary to-gold text-primary-foreground shadow-glow" : "text-muted-foreground"
                  }`}
                >
                  {d} Dictionary
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Sort by</span>
              {(["score", "length", "rarity"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`rounded-full border px-3 py-1 font-medium capitalize transition ${
                    sort === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Results", value: results.length, icon: SlidersHorizontal },
              { label: "Top score", value: results[0]?.score ?? 0, icon: Trophy },
              { label: "Longest", value: results.reduce((m, r) => Math.max(m, r.word.length), 0), icon: Zap },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-1 font-display text-2xl font-black">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r) => (
              <WordCard key={r.word} {...r} />
            ))}
            {results.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No matches. Adjust filters or letters.
              </div>
            )}
          </div>
        </div>

        {/* Filters sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-primary" /> Advanced filters
            </div>
            <div className="space-y-3">
              <FilterInput label="Starts with" value={starts} onChange={setStarts} placeholder="e.g. ST" />
              <FilterInput label="Ends with" value={ends} onChange={setEnds} placeholder="e.g. ING" />
              <FilterInput label="Contains" value={contains} onChange={setContains} placeholder="e.g. Q" />
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Min length</span>
                  <span className="font-bold text-foreground">{minLen}</span>
                </div>
                <input
                  type="range" min={2} max={10} value={minLen}
                  onChange={(e) => setMinLen(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-gold/10 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Pro tip</div>
            <p className="mt-2 text-sm">Save high-scoring plays as favorites and build your personal opening book.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
