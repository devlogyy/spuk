import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProgrammaticPageShell } from "@/components/ProgrammaticPageShell";
import { unscramble } from "@/lib/programmatic";
import type { SolverResult } from "@/lib/dictionary";
import type { WordEntry } from "@/lib/programmatic";
import NotFound from "@/pages/NotFound";

export default function Unscramble() {
  const { letters = "" } = useParams();
  const clean = letters.toLowerCase().replace(/[^a-z]/g, "");
  const valid = clean.length >= 2 && clean.length <= 12;

  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!valid) return;
    setLoading(true);
    unscramble(clean, 200).then((r: SolverResult[]) => {
      setWords(r);
      setLoading(false);
    });
  }, [clean, valid]);

  if (!valid) return <NotFound />;

  const upper = clean.toUpperCase();
  const sorted = [...clean].sort().join("");

  return (
    <ProgrammaticPageShell
      metaTitle={`Unscramble ${upper} — All Possible Words | Lexora`}
      metaDescription={`Unscramble the letters "${upper}" into every valid word. Sorted by Scrabble score with US (TWL) and UK (SOWPODS) validity. Free anagram solver.`}
      canonicalPath={`/unscramble/${clean}`}
      title={`Unscramble ${upper}`}
      h1={`Unscramble "${upper}"`}
      intro={`We unscrambled the letters ${upper} into every valid Scrabble and dictionary word. The list below shows ${words.length} possibilities sorted by score, grouped by length, with US (TWL) and UK (SOWPODS) validity badges. Click any word to look it up in the Scrabble Solver for plays and definitions.`}
      loading={loading}
      words={words}
      faqs={[
        { q: `How many words can you make from ${upper}?`, a: `From the letters ${upper}, our solver found ${words.length} valid words in the TWL06 dictionary. This includes anagrams (using all letters) and sub-words (using some letters).` },
        { q: `Is the full anagram included?`, a: `Yes — if "${upper}" itself or a rearrangement using all ${clean.length} letters is a valid word, it appears in the longest-length group. The Top 10 above always shows the highest-scoring finds first.` },
        { q: `Can I use this for Scrabble?`, a: `Absolutely. This is the same engine behind the Lexora Scrabble Solver. For positional plays (where the word has to connect to the board), use the Scrabble Solver with starts-with / ends-with / contains filters.` },
        { q: `What's the difference between US and UK valid?`, a: `US validity uses TWL06 (North American tournament Scrabble). UK uses SOWPODS (international tournament Scrabble). SOWPODS is the larger list — it includes most of TWL plus thousands of additional words.` },
      ]}
      related={[
        { to: `/unscramble/${sorted}`, label: `Unscramble ${sorted.toUpperCase()} (sorted)` },
        { to: "/word-finder", label: "Open the full Word Finder", desc: "Anagrams + advanced filters." },
        { to: "/scrabble-solver", label: "Open the Scrabble Solver", desc: "Plays with board position." },
        { to: "/blog/words-from-letters", label: "Guide: finding words from any letters" },
      ]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Unscramble", path: "/unscramble" },
        { name: upper, path: `/unscramble/${clean}` },
      ]}
      toolLink={{ to: "/scrabble-solver", label: "Open Scrabble Solver" }}
    />
  );
}
