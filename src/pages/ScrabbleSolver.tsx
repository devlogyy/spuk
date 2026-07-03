import { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Grid3x3, Trophy, Zap, Sparkles, SlidersHorizontal } from "lucide-react";
import { SmartInput } from "@/components/SmartInput";
import { PrimaryActionButton } from "@/components/PrimaryActionButton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingResults } from "@/components/LoadingResults";
import { HowItWorks } from "@/components/HowItWorks";
import { AdvancedFiltersAccordion } from "@/components/AdvancedFiltersAccordion";
import { WordCard } from "@/components/WordCard";
import { AdSlot } from "@/components/AdSlot";
import { ToolFAQ } from "@/components/ToolFAQ";
import { RelatedTools } from "@/components/RelatedTools";
import { absoluteUrl, faqPageSchema, softwareApplicationSchema, howToSchema, speakableSchema, resultsItemListSchema, type FAQItem } from "@/lib/seo";

import { solveAnagram, warmDictionaries, type SolverResult, type DictName } from "@/lib/dictionary";

const FAQS: FAQItem[] = [
  { q: "Is the Lexora Scrabble Solver free to use?", a: "Yes. The Scrabble Solver is completely free, supports both the US (TWL) and UK (SOWPODS) dictionaries, and has no sign-up." },
  { q: "How do I use a blank tile?", a: "Type ? for each blank tile in your rack. For example, AERST? returns every word that can be formed using those six letters plus one wildcard." },
  { q: "Is QI a valid Scrabble word?", a: "Yes. QI is valid in both TWL and SOWPODS dictionaries and is one of the most-played Q-without-U words at the competitive level." },
  { q: "Why are some words scored differently?", a: "Tile values follow the official Scrabble distribution: A/E/I/L/N/O/R/S/T/U are 1 point, while J/X = 8 and Q/Z = 10. Premium board squares are not factored in — the solver shows raw tile score." },
  { q: "Does the solver work for Words With Friends?", a: "Most words will be valid, but Words With Friends uses a slightly different dictionary and tile values. Use the US dictionary for the closest match." },
];

type Sort = "score" | "length" | "rarity";

const EXAMPLES = ["AERST?", "QUARTZN", "LISTENING"];

export default function ScrabbleSolver() {
  const [letters, setLetters] = useState("");
  const [dict, setDict] = useState<DictName>("US");
  const [sort, setSort] = useState<Sort>("score");
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [contains, setContains] = useState("");
  const [minLen, setMinLen] = useState(2);

  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SolverResult[]>([]);

  useEffect(() => { warmDictionaries(); }, []);

  const activeFilters = [starts, ends, contains].filter(Boolean).length + (minLen > 2 ? 1 : 0);

  const runSolve = async (rack: string) => {
    setLoading(true);
    setSubmitted(rack);
    try {
      const res = await solveAnagram(rack, { dict, starts, ends, contains, minLen, max: 200 });
      setResults(res);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (!letters.trim()) return;
    runSolve(letters);
  };

  // Re-solve when filters/dict change after first submit.
  useEffect(() => {
    if (submitted) runSolve(submitted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict, starts, ends, contains, minLen]);

  const sortedResults = useMemo(() => {
    if (sort === "length") return [...results].sort((a, b) => b.word.length - a.word.length);
    if (sort === "rarity") {
      const order = { epic: 3, rare: 2, uncommon: 1, common: 0 } as const;
      return [...results].sort((a, b) => order[b.rarity] - order[a.rarity]);
    }
    return results;
  }, [results, sort]);

  const runExample = (ex: string) => {
    setLetters(ex);
    runSolve(ex);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>Scrabble Solver — US & UK Dictionary | Lexora</title>
        <meta name="description" content="Free AI Scrabble Solver. Enter your tiles to find the highest scoring words with US (TWL) and UK (SOWPODS) dictionary support, blanks, and advanced filters." />
        <link rel="canonical" href={absoluteUrl("/scrabble-solver")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Scrabble Solver — US & UK Dictionary | Lexora" />
        <meta property="og:description" content="Find the highest scoring Scrabble plays from your tiles. Supports blanks, advanced filters and both US (TWL) and UK (SOWPODS) dictionaries." />
        <meta property="og:url" content={absoluteUrl("/scrabble-solver")} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(softwareApplicationSchema({
          name: "Lexora Scrabble Solver",
          description: "Free AI Scrabble Solver with US (TWL) and UK (SOWPODS) dictionaries, blank-tile support and advanced filtering.",
          url: absoluteUrl("/scrabble-solver"),
          category: "GameApplication",
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema(FAQS))}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema({
          name: "How to use the Lexora Scrabble Solver",
          description: "Find the highest-scoring Scrabble play from any rack of tiles in three steps.",
          totalTimeIso: "PT30S",
          steps: [
            { name: "Enter your tiles", text: "Type the letters on your Scrabble rack into the input. Use ? for a blank tile." },
            { name: "Pick a dictionary", text: "Choose US (TWL) for North American play or UK (SOWPODS) for international play." },
            { name: "Find best words", text: "Tap Find Best Words. Every legal play appears sorted by tile score, with rarity and length filters." },
          ],
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema([".speakable-h1", ".speakable-intro"]))}</script>
        {submitted && sortedResults.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(resultsItemListSchema({
            query: submitted,
            pageUrl: absoluteUrl("/scrabble-solver"),
            results: sortedResults.slice(0, 20).map((r) => ({ word: r.word, score: r.score, length: r.word.length })),
          }))}</script>
        )}
        {submitted && <meta name="robots" content="noindex,follow" />}
      </Helmet>


      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <Grid3x3 className="h-3.5 w-3.5 text-primary" /> Scrabble Solver
        </div>
        <h1 className="speakable-h1 mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
          Find the <span className="text-gradient">highest scoring</span> Scrabble plays
        </h1>
        <p className="speakable-intro mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          A Scrabble solver returns every legal word you can play from a rack of tiles, ranked by tile score. Lexora checks your letters against the official TWL (US) and SOWPODS (UK) tournament dictionaries and shows the best play in under a second. Type your tiles, tap <strong>Find Best Words</strong>, and get every legal play sorted by score.
        </p>
      </motion.header>

      <div className="mt-8 space-y-6">
        <HowItWorks />

        <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
          <SmartInput label="Your tiles" value={letters} onChange={setLetters} onSubmit={handleSearch} placeholder="e.g. AERST?" helper="Type up to 15 letters. Use ? for a blank tile." examples={EXAMPLES} max={15} allow={/[^a-zA-Z?]/g} />

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="glass flex w-full rounded-full p-1 sm:w-auto" role="tablist" aria-label="Dictionary">
              {(["US", "UK"] as const).map((d) => (
                <button key={d} onClick={() => setDict(d)} aria-pressed={dict === d}
                  className={`min-h-11 flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:flex-none ${dict === d ? "bg-gradient-to-r from-primary to-gold text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
                  {d} Dictionary
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Sort by</span>
              {(["score", "length", "rarity"] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)} aria-pressed={sort === s}
                  className={`min-h-11 rounded-full border px-3 py-1 font-medium capitalize transition ${sort === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <PrimaryActionButton onClick={handleSearch} loading={loading} disabled={!letters.trim()} sticky icon={<Sparkles className="h-5 w-5" />}>
            Find Best Words
          </PrimaryActionButton>
        </div>

        <AdvancedFiltersAccordion count={activeFilters}>
          <div className="grid gap-3 sm:grid-cols-2">
            <FilterInput label="Starts with" value={starts} onChange={setStarts} placeholder="e.g. ST" />
            <FilterInput label="Ends with" value={ends} onChange={setEnds} placeholder="e.g. ING" />
            <FilterInput label="Contains" value={contains} onChange={setContains} placeholder="e.g. Q" />
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Min length</span>
                <span className="font-bold text-foreground">{minLen}</span>
              </div>
              <input type="range" min={2} max={10} value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} className="w-full accent-[var(--primary)]" aria-label="Minimum word length" />
            </div>
          </div>
        </AdvancedFiltersAccordion>

        {submitted && !loading && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Results", value: sortedResults.length, icon: SlidersHorizontal },
              { label: "Top score", value: sortedResults[0]?.score ?? 0, icon: Trophy },
              { label: "Longest", value: sortedResults.reduce((m, r) => Math.max(m, r.word.length), 0), icon: Zap },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[10px]">{s.label}</div>
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-1 font-display text-xl font-black sm:text-2xl">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        <div aria-live="polite">
          {loading && <LoadingResults count={6} />}

          {!loading && !submitted && (
            <EmptyState icon={<Grid3x3 className="h-6 w-6" />} title="Enter your tiles to get started" description="Type the letters from your rack above, then tap Find Best Words. Or try one of these:" examples={EXAMPLES.map((ex) => ({ label: ex, onClick: () => runExample(ex) }))} />
          )}

          {!loading && submitted && sortedResults.length > 0 && (
            <section aria-labelledby="scrabble-results-heading">
              <h2 id="scrabble-results-heading" className="mb-3 font-display text-xl font-bold sm:text-2xl">
                Results for "{submitted.toUpperCase()}" — {sortedResults.length} words
              </h2>
              <AdSlot zoneKey="scrabble-results-top" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sortedResults.map((r, i) => (
                  <Fragment key={r.word}>
                    <WordCard {...r} />
                    {i === 5 && <AdSlot zoneKey="scrabble-results-inline" className="sm:col-span-2 lg:col-span-3" />}
                  </Fragment>
                ))}
              </div>
            </section>
          )}


          {!loading && submitted && sortedResults.length === 0 && (
            <EmptyState title="No words match those filters" description="Try removing a filter or different letters."
              action={<button onClick={() => { setStarts(""); setEnds(""); setContains(""); setMinLen(2); }} className="min-h-11 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Reset filters</button>} />
          )}
        </div>

        <ToolFAQ
          faqs={FAQS}
          related={[
            { to: "/blog/high-scoring-scrabble-words", label: "50 highest-scoring Scrabble words", desc: "Real plays pros use, not theoretical maxes." },
            { to: "/blog/2-letter-scrabble-words", label: "All 107 two-letter Scrabble words", desc: "The single highest-ROI study in Scrabble." },
            { to: "/blog/scrabble-bingo-strategy", label: "Scrabble bingo strategy", desc: "How pros score the 50-point bonus 1.5×/game." },
          ]}
        />

        <RelatedTools
          heading="More word tools to pair with the Scrabble Solver"
          keys={["crossword", "finder", "anagram", "hub"]}
          excludePath="/scrabble-solver"
        />

      </div>
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())} placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
