import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Puzzle, Sparkles, Wand2 } from "lucide-react";
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

import { matchPattern, warmDictionaries, type SolverResult, type DictName } from "@/lib/dictionary";

const FAQS: FAQItem[] = [
  { q: "How does a crossword solver work?", a: "You enter the letters you already know and a ? for each blank square, for example C?T??. The solver pattern-matches that exact shape against a 260,000-word dictionary and returns every answer of the right length that fits your known letters." },
  { q: "Can I solve a crossword clue knowing only the letter count?", a: "Yes. Enter one ? per square — ????? for a five-letter answer — then add letters as crossing words confirm them. Each confirmed letter typically cuts the candidate list by more than half." },
  { q: "How does the Lexora Crossword Solver work?", a: "Enter the letters you already have and use ? for unknown squares. The solver matches your pattern against the full US (TWL) or UK (SOWPODS) dictionary in real time." },
  { q: "What does C?T?? mean?", a: "It's a pattern: C in position 1, any letter in position 2, T in position 3, then any two letters. Matches include CATCH, CITED, CUTUP and more." },
  { q: "Can I solve cryptic crossword clues?", a: "The pattern matcher works on letters you have. For cryptic wordplay (anagrams, hidden words, charades), pair it with our guide to solving any crossword clue." },
  { q: "Why are some answers missing?", a: "If a clue uses a proper noun, abbreviation or phrase, it may not be in the standard dictionary. Switch between US and UK dictionaries to broaden the candidate list." },
  { q: "Is using a crossword solver cheating?", a: "It's a study and learning aid. Tournament rules forbid external aids during play, but pattern matchers are standard tools for crossword constructors, editors and casual solvers." },
  { q: "How long can my pattern be?", a: "Any length from 2 up to 15 letters — the same maximum as a standard American crossword grid answer. Longer phrases work too if you treat each word separately." },
  { q: "Does it help with themed puzzles like NYT or the Guardian?", a: "Yes. The solver is pattern-agnostic — it doesn't care about the puzzle brand. Any letters you've filled in from crossing entries can drive a pattern search." },
  { q: "What if my clue has a hyphen or space?", a: "Solve each word segment on its own. Enter one word's pattern, note the candidates, then use the second word's crossings to confirm the answer." },
  { q: "Can I use both letters and wildcards together?", a: "Yes. Mix known letters with ? freely — for example ?RA??E returns every 6-letter word with R in position 2 and A in position 3, like BRAISE, CRAWLS or GRAZED." },
  { q: "Does the Crossword Solver work offline?", a: "The dictionary loads once and runs entirely in your browser, so repeat searches are instant and offline-friendly after the first page load." },
];

const EXAMPLES = ["C?T??", "?RA??E", "Q??RTZ", "P?X?L"];
const normalize = (s: string) => s.toUpperCase().replace(/[_\s]/g, "?");

export default function CrosswordSolver() {
  const [pattern, setPattern] = useState("");
  const [clue, setClue] = useState("");
  const [dict, setDict] = useState<DictName>("US");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SolverResult[]>([]);

  useEffect(() => { warmDictionaries(); }, []);

  const slots = normalize(submitted || pattern).split("");

  const runSolve = async (pat: string) => {
    setLoading(true);
    setSubmitted(pat);
    try {
      const res = await matchPattern(pat, dict, 100);
      setResults(res);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (!pattern.trim()) return;
    runSolve(pattern);
  };

  useEffect(() => {
    if (submitted) runSolve(submitted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict]);

  const runExample = (ex: string) => {
    setPattern(ex);
    runSolve(ex);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>Crossword Solver & Clue Finder — Answers by Pattern | Lexora</title>
        <meta name="description" content="Free crossword solver and clue finder. Enter the letters you know and ? for the blanks (e.g. C?T??) to get every crossword answer that fits, across 260,000+ words." />
        <link rel="canonical" href={absoluteUrl("/crossword-solver")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Crossword Solver & Clue Finder — Answers by Pattern | Lexora" />
        <meta property="og:description" content="Crack any crossword clue with real-time pattern matching across the full US (TWL) and UK (SOWPODS) dictionaries." />
        <meta property="og:url" content={absoluteUrl("/crossword-solver")} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(softwareApplicationSchema({
          name: "Lexora Crossword Solver",
          description: "Free crossword pattern matcher with US (TWL) and UK (SOWPODS) dictionary support.",
          url: absoluteUrl("/crossword-solver"),
          category: "GameApplication",
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema(FAQS))}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema({
          name: "How to solve a crossword clue with Lexora",
          description: "Match a partial crossword answer against the full dictionary using wildcards.",
          totalTimeIso: "PT20S",
          steps: [
            { name: "Enter the pattern", text: "Type the letters you already have and use ? for each unknown square. Example: C?T?? for a five-letter answer starting with C and containing T in position three." },
            { name: "Pick a dictionary", text: "Choose US (TWL) or UK (SOWPODS) depending on the puzzle's origin." },
            { name: "Solve puzzle", text: "Tap Solve Puzzle to see every dictionary word that matches your pattern." },
          ],
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema([".speakable-h1", ".speakable-intro"]))}</script>
        {submitted && results.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(resultsItemListSchema({
            query: submitted,
            pageUrl: absoluteUrl("/crossword-solver"),
            results: results.slice(0, 20).map((r) => ({ word: r.word, score: r.score, length: r.word.length })),
          }))}</script>
        )}
        {submitted && <meta name="robots" content="noindex,follow" />}
      </Helmet>


      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Puzzle className="h-3.5 w-3.5 text-primary" /> Crossword Solver
        </div>
        <h1 className="speakable-h1 mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
          Crossword solver — find <span className="text-gradient">answers by letter pattern</span>
        </h1>
        <p className="speakable-intro mt-2 max-w-2xl rounded-2xl border border-border bg-card p-4 text-sm sm:text-base">
          <strong>Quick answer:</strong> Enter the letters you already have and a <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">?</kbd> for every empty square — for example <code>C?T??</code> — and Lexora returns every dictionary word of that exact shape. It matches across more than 260,000 words, so partial answers with one or two known crossing letters still narrow down fast.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          A crossword solver takes the letters you already have plus wildcards for the empty squares and returns every dictionary word that fits. Lexora pattern-matches against both the TWL and SOWPODS dictionaries in real time. Type your letters, use <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">?</kbd> for blanks, then tap <strong>Solve Puzzle</strong>.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <HowItWorks steps={[
          { icon: Puzzle, title: "Enter the pattern", desc: "Use ? for letters you don't know." },
          { icon: Wand2, title: "Pick a dictionary", desc: "US (TWL) or UK (SOWPODS)." },
          { icon: Sparkles, title: "Get matches", desc: "Every legal word, instantly." },
        ]} />

        <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
          <SmartInput label="Pattern" value={pattern} onChange={setPattern} onSubmit={handleSearch} placeholder="C?T??" helper="Use ? for unknown letters. Example: C?T?? matches CATCH." examples={EXAMPLES} max={15} allow={/[^a-zA-Z?_ ]/g} />

          {slots.length > 0 && slots.length <= 15 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {slots.map((s, i) => (
                <div key={i} className={`grid h-9 w-9 place-items-center rounded-lg text-base font-bold sm:h-12 sm:w-12 sm:rounded-xl sm:text-xl ${s === "?" ? "border-2 border-dashed border-border text-muted-foreground" : "tile"}`}>
                  {s === "?" ? "?" : s}
                </div>
              ))}
            </div>
          )}

          <div className="glass flex w-full rounded-full p-1 sm:w-auto" role="tablist" aria-label="Dictionary">
            {(["US", "UK"] as const).map((d) => (
              <button key={d} onClick={() => setDict(d)} aria-pressed={dict === d}
                className={`min-h-11 flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:flex-none ${dict === d ? "bg-gradient-to-r from-primary to-gold text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
                {d} Dictionary
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="clue" className="mb-1.5 block text-sm font-semibold">
              Clue <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="clue" value={clue} onChange={(e) => setClue(e.target.value)} placeholder="e.g. Hard crystalline mineral"
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <p className="mt-1 text-xs text-muted-foreground">Clue-aware ranking is coming with the AI assist update.</p>
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
            <section aria-labelledby="crossword-results-heading">
              <h2 id="crossword-results-heading" className="mb-3 font-display text-xl font-bold sm:text-2xl">
                Answers matching "{submitted.toUpperCase()}" — {results.length} words
              </h2>
              <AdSlot zoneKey="crossword-results-top" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (<WordCard key={r.word} {...r} />))}
              </div>
              <AdSlot zoneKey="crossword-results-inline" />
            </section>
          )}

          {!loading && submitted && results.length === 0 && (
            <EmptyState title="No matches for that pattern" description="Double-check the letter count and try again, or pick an example." examples={EXAMPLES.map((ex) => ({ label: ex, onClick: () => runExample(ex) }))} />
          )}
        </div>

        <ToolFAQ
          faqs={FAQS}
          related={[
            { to: "/blog/how-to-solve-crossword-clues", label: "How to solve any crossword clue", desc: "A 7-step method used by editors." },
            { to: "/blog/crossword-clue-patterns", label: "Decode C_A__T in seconds", desc: "Pattern-matching technique for elite solvers." },
            { to: "/blog/build-vocabulary-word-games", label: "Build a 10,000-word vocabulary", desc: "Spaced repetition with word games." },
          ]}
        />

        <RelatedTools
          heading="Pair the Crossword Solver with…"
          keys={["scrabble", "finder", "anagram", "hub"]}
          excludePath="/crossword-solver"
        />

      </div>
    </div>
  );
}
