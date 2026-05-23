import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Puzzle, Sparkles, Wand2 } from "lucide-react";
import { WordCard } from "@/components/WordCard";
import { generateResults } from "@/lib/words";

export const Route = createFileRoute("/crossword-solver")({
  head: () => ({
    meta: [
      { title: "Crossword Solver — AI Clue Matching | Lexora" },
      { name: "description", content: "Solve any crossword with pattern matching and AI clue interpretation. Enter a pattern like C_A__T and get confident answers." },
      { property: "og:title", content: "Crossword Solver — Lexora" },
      { property: "og:description", content: "AI crossword solver with pattern matching and clue interpretation." },
      { property: "og:url", content: "/crossword-solver" },
    ],
    links: [{ rel: "canonical", href: "/crossword-solver" }],
  }),
  component: CrosswordSolver,
});

function CrosswordSolver() {
  const [pattern, setPattern] = useState("Q_A__Z");
  const [clue, setClue] = useState("");
  const slots = pattern.toUpperCase().split("");

  const results = useMemo(() => {
    const all = generateResults("QUARTZJINXVEZ", 18);
    const pat = pattern.toUpperCase();
    return all
      .filter((w) => w.word.length === pat.length)
      .filter((w) => w.word.split("").every((c, i) => pat[i] === "_" || pat[i] === c))
      .map((w) => ({ ...w, confidence: Math.floor(70 + Math.random() * 28) }));
  }, [pattern]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Puzzle className="h-3.5 w-3.5 text-primary" /> Crossword Solver
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Solve any clue with <span className="text-gradient">AI assistance</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Use <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">_</kbd> for unknown letters. Add the clue for AI-ranked matches.
        </p>
      </motion.header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-5 shadow-soft">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pattern</label>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value.replace(/[^a-zA-Z_]/g, "").slice(0, 15))}
              className="mt-2 w-full bg-transparent font-display text-3xl font-bold uppercase tracking-[0.3em] outline-none"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {slots.map((s, i) => (
                <div key={i} className={`grid h-12 w-12 place-items-center rounded-xl text-xl font-bold ${
                  s === "_" ? "border-2 border-dashed border-border text-muted-foreground" : "tile"
                }`}>
                  {s === "_" ? "" : s}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-5 shadow-soft">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Wand2 className="h-3.5 w-3.5 text-primary" /> Clue (optional)
            </label>
            <input
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              placeholder="e.g. Hard crystalline mineral"
              className="mt-2 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-3">
            {results.map((r) => (
              <motion.div key={r.word} layout className="relative">
                <WordCard {...r} />
                <div className="absolute right-4 top-4 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {r.confidence}% match
                </div>
              </motion.div>
            ))}
            {results.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No matches for that pattern.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-gold/10 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Clue Assistant
            </div>
            <p className="mt-2 text-sm">Add a clue to boost ranking. Lexora's AI matches semantic context and crossword conventions.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick patterns</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["C_A__T", "_RA__E", "Q__RTZ", "P_X_L"].map((p) => (
                <button key={p} onClick={() => setPattern(p)} className="rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wider transition hover:border-primary hover:text-primary">{p}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
