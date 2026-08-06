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
import { AdSlot } from "@/components/AdSlot";
import { ToolFAQ } from "@/components/ToolFAQ";
import { RelatedTools } from "@/components/RelatedTools";
import { absoluteUrl, faqPageSchema, softwareApplicationSchema, howToSchema, speakableSchema, resultsItemListSchema, type FAQItem } from "@/lib/seo";

import { solveAnagram, warmDictionaries, type SolverResult } from "@/lib/dictionary";

const FAQS: FAQItem[] = [
  { q: "What is the best word unscrambler?", a: "Lexora unscrambles against the full TWL tournament word list, returns both full anagrams and every shorter sub-word, and filters by exact length for Wordle — free, instant, and running entirely in your browser." },
  { q: "How many words can I make from my letters?", a: "It depends on the letters, but a typical 7-letter rack yields between 50 and 300 valid words. Lexora shows the exact count above the results along with each word's Scrabble score." },
  { q: "How do I unscramble letters?", a: "Type the letters you have in any order, then tap Find Words. The Word Finder returns every valid dictionary word that can be made from your letters." },
  { q: "What's the difference between Word Finder and Scrabble Solver?", a: "Word Finder shows every legal word from your letters in any order. Scrabble Solver does the same but ranks results by tile score and supports both US and UK Scrabble dictionaries." },
  { q: "Can I find words of a specific length?", a: "Yes. Use the length filter (2 through 7) to show only words of that exact length, which is perfect for Wordle, crosswords, and word puzzles." },
  { q: "Do you support blank tiles?", a: "Yes — use ? for each blank or wildcard letter. The finder treats each ? as any letter A–Z." },
  { q: "Is the Word Finder accurate?", a: "Results are validated against the standard TWL word list used in competitive Scrabble. Some game-specific dictionaries (Words With Friends, Wordle) differ slightly." },
  { q: "Can Word Finder solve Wordle?", a: "Yes. Enter the letters you're testing and set the length filter to 5. You'll see every valid 5-letter word that can be made — narrow further using your green and yellow hints." },
  { q: "How is Word Finder different from an anagram solver?", a: "A strict anagram solver only returns words that use every letter. Word Finder returns those plus every shorter sub-word — much more useful for Scrabble racks and puzzle apps." },
  { q: "Does it show word definitions?", a: "Each result links through to the Scrabble Solver, where you can see the score, letter breakdown, and validity in both US and UK tournament dictionaries." },
  { q: "Can I use it for Boggle or Scrabble Go?", a: "Yes. Boggle players can enter the letters visible in a chain, and Scrabble Go players can paste their full rack — the same word list underpins both games." },
  { q: "How fast is the search?", a: "The dictionary runs entirely in your browser after the first load, so results appear in under a second — no network round-trip and no waiting on a server." },
];

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
        <title>Word Unscrambler & Anagram Solver — Any Letters | Lexora</title>
        <meta name="description" content="Free word unscrambler and anagram solver. Enter your letters to see every valid word you can make, sorted by score and length, with a 5-letter filter for Wordle." />
        <link rel="canonical" href={absoluteUrl("/word-finder")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Word Unscrambler & Anagram Solver — Any Letters | Lexora" />
        <meta property="og:description" content="Unscramble letters and find every possible word in seconds. Free anagram solver for Scrabble, Wordle, crosswords and more." />
        <meta property="og:url" content={absoluteUrl("/word-finder")} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(softwareApplicationSchema({
          name: "Lexora Word Finder",
          description: "Free anagram solver and word finder. Unscramble letters into every valid dictionary word.",
          url: absoluteUrl("/word-finder"),
          category: "GameApplication",
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema(FAQS))}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema({
          name: "How to unscramble letters with Lexora Word Finder",
          description: "Turn any set of letters into every valid dictionary word in seconds.",
          totalTimeIso: "PT15S",
          steps: [
            { name: "Enter your letters", text: "Type the letters you have in any order. Use ? for a wildcard or blank tile." },
            { name: "Filter by length (optional)", text: "Tap a length button (2 to 7) to show only words of that exact length — useful for Wordle and crosswords." },
            { name: "Find words", text: "Tap Find Words. Every valid anagram from your letters appears, scored and sorted." },
          ],
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema([".speakable-h1", ".speakable-intro"]))}</script>
        {submitted && results.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(resultsItemListSchema({
            query: submitted,
            pageUrl: absoluteUrl("/word-finder"),
            results: results.slice(0, 20).map((r) => ({ word: r.word, score: r.score, length: r.word.length })),
          }))}</script>
        )}
        {submitted && <meta name="robots" content="noindex,follow" />}
      </Helmet>


      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Search className="h-3.5 w-3.5 text-primary" /> Word Finder
        </div>
        <h1 className="speakable-h1 mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
          Word unscrambler — turn any letters into <span className="text-gradient">every valid word</span>
        </h1>
        <p className="speakable-intro mt-2 max-w-2xl rounded-2xl border border-border bg-card p-4 text-sm sm:text-base">
          <strong>Quick answer:</strong> Type your letters in any order and Lexora unscrambles them into every valid dictionary word, including all shorter sub-words, sorted by length and Scrabble score. Filter to an exact length between 2 and 7 for Wordle and crosswords, and use <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">?</kbd> for a blank or wildcard letter.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          A word finder unscrambles a set of letters into every valid dictionary word you can make from them. Lexora checks your letters against the TWL Scrabble word list and returns every anagram, ranked by score and length. Type your letters, tap <strong>Find Words</strong>, and see every possible word — sorted, scored and ready to play.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <HowItWorks />

        <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
          <SmartInput label="Your letters" value={letters} onChange={setLetters} onSubmit={handleSearch} placeholder="e.g. LISTENING" helper="Enter the letters you have. We'll find every word that fits." examples={EXAMPLES} max={20} allow={/[^a-zA-Z?]/g} toolName="unscramble_letters" toolDescription="Unscramble letters into every valid anagram and shorter sub-word, scored and sortable. Set a length filter for Wordle." fieldName="letters" />

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
            <section aria-labelledby="finder-results-heading">
              <h2 id="finder-results-heading" className="mb-3 font-display text-xl font-bold sm:text-2xl">
                Words from "{submitted.toUpperCase()}" — {results.length} results
              </h2>
              <AdSlot zoneKey="wordfinder-results-top" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (<WordCard key={r.word} {...r} />))}
              </div>
            </section>
          )}

          {!loading && submitted && results.length === 0 && (
            <EmptyState title="No words for those letters" description="Try clearing the length filter or different letters." />
          )}
        </div>

        <ToolFAQ
          faqs={FAQS}
          related={[
            { to: "/blog/words-from-letters", label: "How to find every word from your letters", desc: "Systematic method for any letter set." },
            { to: "/blog/2-letter-scrabble-words", label: "All 107 two-letter Scrabble words", desc: "Memorize these to score everywhere." },
            { to: "/blog/scrabble-bingo-strategy", label: "Score 50-point Scrabble bingos", desc: "Stem theory and rack management." },
          ]}
        />

        <RelatedTools
          heading="Related word tools to explore"
          keys={["scrabble", "crossword", "hub", "endingIng"]}
          excludePath="/word-finder"
        />

      </div>
    </div>
  );
}
