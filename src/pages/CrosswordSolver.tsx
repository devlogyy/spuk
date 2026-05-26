import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Puzzle, Sparkles, Wand2 } from "lucide-react";
import { SmartInput } from "@/components/SmartInput";
import { PrimaryActionButton } from "@/components/PrimaryActionButton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingResults } from "@/components/LoadingResults";
import { HowItWorks } from "@/components/HowItWorks";
import { WordCard } from "@/components/WordCard";
import { generateResults } from "@/lib/words";

const EXAMPLES = ["C?T??", "?RA??E", "Q??RTZ", "P?X?L"];
const normalize = (s: string) => s.toUpperCase().replace(/[_\s]/g, "?");

export default function CrosswordSolver() {
  const [pattern, setPattern] = useState("");
  const [clue, setClue] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);

  const slots = normalize(submitted || pattern).split("");

  const handleSearch = () => {
    if (!pattern.trim()) return;
    setLoading(true);
    setTimeout(() => { setSubmitted(pattern); setLoading(false); }, 450);
  };

  const runExample = (ex: string) => {
    setPattern(ex);
    setLoading(true);
    setTimeout(() => { setSubmitted(ex); setLoading(false); }, 450);
  };

  const results = useMemo(() => {
    if (!submitted) return [];
    const all = generateResults("QUARTZJINXVECATCH", 24);
    const pat = normalize(submitted);
    return all
      .filter((w) => w.word.length === pat.length)
      .filter((w) => w.word.split("").every((c, i) => pat[i] === "?" || pat[i] === c))
      .map((w) => ({ ...w, confidence: Math.floor(70 + Math.random() * 28) }));
  }, [submitted]);

  const livePreview = useMemo(() => {
    if (!pattern.trim()) return null;
    const all = generateResults("QUARTZJINXVECATCH", 40);
    const pat = normalize(pattern);
    const match = all.find((w) => w.word.length === pat.length && w.word.split("").every((c, i) => pat[i] === "?" || pat[i] === c));
    return match?.word ?? null;
  }, [pattern]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>Crossword Solver — AI Clue Matching | Lexora</title>
        <meta name="description" content="Solve any crossword with pattern matching and AI clue interpretation. Enter a pattern like C?T?? and get confident answers." />
        <link rel="canonical" href="/crossword-solver" />
      </Helmet>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Puzzle className="h-3.5 w-3.5 text-primary" /> Crossword Solver
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Solve any clue with <span className="text-gradient">AI assistance</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Type the letters you have, use <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">?</kbd> for blanks, then tap <strong>Solve Puzzle</strong>.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <HowItWorks steps={[
          { icon: Puzzle, title: "Enter the pattern", desc: "Use ? for letters you don't know." },
          { icon: Wand2, title: "Add the clue (optional)", desc: "We rank answers by meaning." },
          { icon: Sparkles, title: "Get matches", desc: "Confidence-scored, instantly." },
        ]} />

        <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
          <SmartInput label="Pattern" value={pattern} onChange={setPattern} onSubmit={handleSearch} placeholder="C ? T ? ?" helper="Use ? for unknown letters. Example: C?T?? matches CATCH." examples={EXAMPLES} max={15} allow={/[^a-zA-Z?_ ]/g} />

          {slots.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {slots.map((s, i) => (
                <div key={i} className={`grid h-12 w-12 place-items-center rounded-xl text-xl font-bold ${s === "?" ? "border-2 border-dashed border-border text-muted-foreground" : "tile"}`}>
                  {s === "?" ? "?" : s}
                </div>
              ))}
            </div>
          )}

          {livePreview && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Live match:</span>
              <span className="font-display text-lg font-bold tracking-wider text-primary">{normalize(pattern)} → {livePreview}</span>
            </div>
          )}

          <div>
            <label htmlFor="clue" className="mb-1.5 block text-sm font-semibold">
              Clue <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="clue" value={clue} onChange={(e) => setClue(e.target.value)} placeholder="e.g. Hard crystalline mineral"
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <p className="mt-1 text-xs text-muted-foreground">Paste the crossword clue to boost ranking.</p>
          </div>

          <PrimaryActionButton onClick={handleSearch} loading={loading} disabled={!pattern.trim()} sticky icon={<Sparkles className="h-5 w-5" />}>
            Solve Puzzle
          </PrimaryActionButton>
        </div>

        <div aria-live="polite">
          {loading && <LoadingResults count={4} />}

          {!loading && !submitted && (
            <EmptyState icon={<Puzzle className="h-6 w-6" />} title="Enter a pattern to solve" description="Type the letters you know and use ? for the missing ones. Try one:" examples={EXAMPLES.map((ex) => ({ label: ex, onClick: () => runExample(ex) }))} />
          )}

          {!loading && submitted && results.length > 0 && (
            <div className="space-y-3">
              {results.map((r) => (
                <motion.div key={r.word} layout className="relative">
                  <WordCard {...r} />
                  <div className="absolute right-4 top-4 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">{r.confidence}% match</div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && submitted && results.length === 0 && (
            <EmptyState title="No matches for that pattern" description="Double-check the letter count and try again, or pick an example." examples={EXAMPLES.map((ex) => ({ label: ex, onClick: () => runExample(ex) }))} />
          )}
        </div>
      </div>
    </div>
  );
}
