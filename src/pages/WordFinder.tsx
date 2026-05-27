import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Shuffle, Sparkles } from "lucide-react";
import { SmartInput } from "@/components/SmartInput";
import { PrimaryActionButton } from "@/components/PrimaryActionButton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingResults } from "@/components/LoadingResults";
import { HowItWorks } from "@/components/HowItWorks";
import { WordCard } from "@/components/WordCard";
import { solveAnagram, warmDictionaries, type SolverResult } from "@/lib/dictionary";

const LENGTHS = [2, 3, 4, 5, 6, 7];
const EXAMPLES = ["LISTENING", "QUARTZN", "PYTHON"];

export default function WordFinder() {
  const [letters, setLetters] = useState("");
  const [length, setLength] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SolverResult[]>([]);
  const [params] = useSearchParams();

  useEffect(() => { warmDictionaries(); }, []);

  const runSolve = async (rack: string, exactLen: number | null) => {
    setLoading(true);
    setSubmitted(rack);
    try {
      const res = await solveAnagram(rack, { dict: "US", exactLen: exactLen ?? undefined, max: 200 });
      setResults(res);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (!letters.trim()) return;
    runSolve(letters, length);
  };

  useEffect(() => {
    const q = params.get("q");
    if (q && !submitted) {
      setLetters(q);
      runSolve(q, length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (submitted) runSolve(submitted, length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  const runExample = (ex: string) => {
    setLetters(ex);
    runSolve(ex, length);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>Word Finder & Anagram Solver | Lexora</title>
        <meta name="description" content="Unscramble letters, find anagrams, and discover every possible word. Sort by score, length, popularity or alphabetical. Free and fast." />
        <link rel="canonical" href="/word-finder" />
      </Helmet>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Search className="h-3.5 w-3.5 text-primary" /> Word Finder
        </div>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
          Unscramble anything. <span className="text-gradient">Instantly.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Type your letters, tap <strong>Find Words</strong>, and see every possible word — sorted, scored and ready to play.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <HowItWorks />

        <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
          <SmartInput label="Your letters" value={letters} onChange={setLetters} onSubmit={handleSearch} placeholder="e.g. LISTENING" helper="Enter the letters you have. We'll find every word that fits." examples={EXAMPLES} max={20} allow={/[^a-zA-Z?]/g} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Length:</span>
            <button onClick={() => setLength(null)} aria-pressed={length === null}
              className={`min-h-11 rounded-full border px-3 py-1 text-xs font-medium transition ${length === null ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>Any</button>
            {LENGTHS.map((l) => (
              <button key={l} onClick={() => setLength(l)} aria-pressed={length === l}
                className={`min-h-11 min-w-11 rounded-full border px-3 py-1 text-xs font-medium transition ${length === l ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{l}</button>
            ))}
            {submitted && (
              <div className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Shuffle className="h-3.5 w-3.5" /> {results.length} results
              </div>
            )}
          </div>

          <PrimaryActionButton onClick={handleSearch} loading={loading} disabled={!letters.trim()} sticky icon={<Sparkles className="h-5 w-5" />}>
            Find Words
          </PrimaryActionButton>
        </div>

        <div aria-live="polite">
          {loading && <LoadingResults count={6} />}

          {!loading && !submitted && (
            <EmptyState icon={<Search className="h-6 w-6" />} title="What letters do you have?" description="Type the letters above to unscramble them, or tap an example to see it in action." examples={EXAMPLES.map((ex) => ({ label: ex, onClick: () => runExample(ex) }))} />
          )}

          {!loading && submitted && results.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (<WordCard key={r.word} {...r} />))}
            </div>
          )}

          {!loading && submitted && results.length === 0 && (
            <EmptyState title="No words for those letters" description="Try clearing the length filter or different letters." />
          )}
        </div>
      </div>
    </div>
  );
}
