import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProgrammaticPageShell } from "@/components/ProgrammaticPageShell";
import { wordsEndingIn, type WordEntry, LETTERS } from "@/lib/programmatic";
import NotFound from "@/pages/NotFound";

export default function WordsEndingIn() {
  const { letter = "" } = useParams();
  const L = letter.toLowerCase();
  const valid = L.length === 1 && LETTERS.includes(L);

  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!valid) return;
    setLoading(true);
    wordsEndingIn(L).then((r) => {
      setWords(r);
      setLoading(false);
    });
  }, [L, valid]);

  if (!valid) return <NotFound />;

  const upper = L.toUpperCase();
  const idx = LETTERS.indexOf(L);
  const prev = LETTERS[(idx + 25) % 26];
  const next = LETTERS[(idx + 1) % 26];

  return (
    <ProgrammaticPageShell
      metaTitle={`Words That End In ${upper} — Full Scrabble & Word List | Lexora`}
      metaDescription={`Every word that ends in ${upper}, sorted by length with Scrabble scores and US/UK validity. Perfect for hooks, crossword tails, and word-finder puzzles.`}
      canonicalPath={`/words/ending-in/${L}`}
      title={`Words ending in ${upper}`}
      h1={`Words That End In ${upper}`}
      intro={`Need words that end in ${upper}? This page lists every Scrabble-valid word ending with the letter ${upper}, organized by length and ranked with point values. Use it for crossword tails, Scrabble hook plays, Wordle endings, and anagram solving.`}
      loading={loading}
      words={words}
      faqs={[
        { q: `How many words end in ${upper}?`, a: `This list shows ${words.length} valid TWL06 tournament Scrabble words ending in ${upper}. Common endings (E, S, Y, D) have thousands; rarer endings have only a handful.` },
        { q: `Why are "ending in" lists useful in Scrabble?`, a: `They're how you spot hook plays — adding one letter to the end of an existing board word to make a brand new word, usually for big multipliers.` },
        { q: `What's the most common letter ending in English?`, a: `E is the most common ending letter, followed by S, D, Y and T. These five letters end roughly 60% of all English words.` },
        { q: `Are these valid for crosswords?`, a: `Yes — crossword answers are drawn from the same general English vocabulary. For pattern-based clue solving, use Lexora's Crossword Solver with the ${upper} locked at the end.` },
      ]}
      related={[
        { to: `/words/ending-in/${prev}`, label: `Words ending in ${prev.toUpperCase()}` },
        { to: `/words/ending-in/${next}`, label: `Words ending in ${next.toUpperCase()}` },
        { to: `/words/starting-with/${L}`, label: `Words starting with ${upper}` },
        { to: "/crossword-solver", label: "Try the Crossword Solver", desc: "Match patterns with wildcards." },
      ]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Words", path: "/words" },
        { name: `Ending in ${upper}`, path: `/words/ending-in/${L}` },
      ]}
      toolLink={{ to: "/crossword-solver", label: "Open Crossword Solver" }}
    />
  );
}
