import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Shuffle, Sparkles } from "lucide-react";
import { SmartInput } from "@/components/SmartInput";
import { PrimaryActionButton } from "@/components/PrimaryActionButton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingResults } from "@/components/LoadingResults";
import { HowItWorks } from "@/components/HowItWorks";
import { WordCard } from "@/components/WordCard";
import { generateResults } from "@/lib/words";

const LENGTHS = [2, 3, 4, 5, 6, 7];
const EXAMPLES = ["LISTENING", "QUARTZN", "PYTHON"];

export default function WordFinder() {
  const [letters, setLetters] = useState("");
  const [length, setLength] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!letters.trim()) return;
    setLoading(true);
    setTimeout(() => { setSubmitted(letters); setLoading(false); }, 450);
  };

  const runExample = (ex: string) => {
    setLetters(ex);
    setLoading(true);
    setTimeout(() => { setSubmitted(ex); setLoading(false); }, 450);
  };

  const results = useMemo(() => {
    if (!submitted) return [];
    let r = generateResults(submitted, 24);
    if (length) r = r.filter((w) => w.word.length === length);
    return r;
  }, [submitted, length]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>Word Finder & Anagram Solver | Lexora</title>
        <meta name="description" content="Unscramble letters, find anagrams, and discover every possible word. Sort by score, length, popularity or alphabetical. Free and fast." />
        <link rel="canonical" href="/word-finder" />
      </Helmet>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Search className="h-3.5 w-3.5 text-primary" /> Word Finder
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Unscramble anything. <span className="text-gradient">Instantly.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Type your letters, tap <strong>Find Words</strong>, and see every possible word — sorted, scored and ready to play.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <HowItWorks />

        <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
          <SmartInput label="Your letters" value={letters} onChange={setLetters} onSubmit={handleSearch} placeholder="e.g. LISTENING" helper="Enter the letters you have. We'll find every word that fits." examples={EXAMPLES} max={20} allow={/[^a-zA-Z]/g} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Length:</span>
            <button onClick={() => setLength(null)} aria-pressed={length === null}
              className={`min-h-11 rounded-full border px-3 py-1 text-xs font-medium transition ${length === null ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>Any</button>
            {LENGTHS.map((l) => (
              <button key={l} onClick={() => setLength(l)} aria-pressed={length === l}
                className={`min-h-11 rounded-full border px-3 py-1 text-xs font-medium transition ${length === l ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{l}</button>
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

        <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-bold">Popular word lists</h2>
          <p className="mt-2 text-sm text-muted-foreground">Browse curated word lists indexed for crossword & Scrabble players.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "2 letter words", "3 letter words", "4 letter words", "5 letter words",
              "Words starting with Q", "Words ending in ING", "Words with X", "High-score Scrabble words",
              "Words with Z and Q", "UK-only Scrabble words", "US-only Scrabble words", "Bingo words (7 letters)",
            ].map((t) => (
              <a key={t} href="#" className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-sm font-medium transition hover:border-primary hover:text-primary">
                {t}
                <span className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary">→</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
