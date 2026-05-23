import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Shuffle } from "lucide-react";
import { TileInput } from "@/components/TileInput";
import { WordCard } from "@/components/WordCard";
import { generateResults } from "@/lib/words";

export const Route = createFileRoute("/word-finder")({
  head: () => ({
    meta: [
      { title: "Word Finder & Anagram Solver | Lexora" },
      { name: "description", content: "Unscramble letters, find anagrams, and discover every possible word. Sort by score, length, popularity or alphabetical. Free and fast." },
      { property: "og:title", content: "Word Finder — Lexora" },
      { property: "og:description", content: "Unscramble letters and find every possible word with Lexora's AI Word Finder." },
      { property: "og:url", content: "/word-finder" },
    ],
    links: [{ rel: "canonical", href: "/word-finder" }],
  }),
  component: WordFinder,
});

const LENGTHS = [2, 3, 4, 5, 6, 7];

function WordFinder() {
  const [letters, setLetters] = useState("LISTENING");
  const [length, setLength] = useState<number | null>(null);

  const results = useMemo(() => {
    let r = generateResults(letters, 24);
    if (length) r = r.filter((w) => w.word.length === length);
    return r;
  }, [letters, length]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Search className="h-3.5 w-3.5 text-primary" /> Word Finder
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Unscramble anything. <span className="text-gradient">Instantly.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Anagrams, combinations, possible words — all sorted, scored and ready to play.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <TileInput value={letters} onChange={setLetters} max={20} />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Length:</span>
          <button onClick={() => setLength(null)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${length === null ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
            Any
          </button>
          {LENGTHS.map((l) => (
            <button key={l} onClick={() => setLength(l)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${length === l ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
              {l}
            </button>
          ))}
          <div className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Shuffle className="h-3.5 w-3.5" /> {results.length} results
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <WordCard key={r.word} {...r} />
          ))}
        </div>

        {/* SEO content block */}
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
