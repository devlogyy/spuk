import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProgrammaticPageShell } from "@/components/ProgrammaticPageShell";
import { wordsStartingWith, type WordEntry, LETTERS } from "@/lib/programmatic";
import NotFound from "@/pages/NotFound";

export default function WordsStartingWith() {
  const { letter = "" } = useParams();
  const L = letter.toLowerCase();
  const valid = L.length === 1 && LETTERS.includes(L);

  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!valid) return;
    setLoading(true);
    wordsStartingWith(L).then((r) => {
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
      metaTitle={`Words That Start With ${upper} — Full Scrabble & Word List | Lexora`}
      metaDescription={`Every word that starts with the letter ${upper}, sorted by length with Scrabble scores and US/UK validity. Free word-finder reference.`}
      canonicalPath={`/words/starting-with/${L}`}
      title={`Words starting with ${upper}`}
      h1={`Words That Start With ${upper}`}
      intro={`Looking for words that start with the letter ${upper}? This page lists every valid Scrabble word beginning with ${upper}, grouped by length with point values and US (TWL) / UK (SOWPODS) validity badges. Use it for Scrabble, Words With Friends, crossword clues, or any anagram puzzle where the first letter is locked in.`}
      loading={loading}
      words={words}
      faqs={[
        { q: `How many Scrabble words start with ${upper}?`, a: `The TWL06 dictionary lists ${words.length} valid tournament Scrabble words starting with ${upper}. The international SOWPODS list contains slightly more.` },
        { q: `What's the highest-scoring word starting with ${upper}?`, a: `Scores depend on tile values — Q, Z, J and X words ending or starting with these letters tend to score highest. Check the "Top 10" section above for this letter's leaders.` },
        { q: `Are these words valid in Words With Friends?`, a: `Most are. Words With Friends uses the ENABLE dictionary, which overlaps heavily with TWL but not perfectly. When in doubt, check the in-game validator.` },
        { q: `How do I use this list to win at Scrabble?`, a: `Memorize the short (2–3 letter) words first — they unlock parallel plays and bingo extensions. The Lexora Scrabble Solver can build full plays from your rack.` },
      ]}
      related={[
        { to: `/words/starting-with/${prev}`, label: `Words starting with ${prev.toUpperCase()}` },
        { to: `/words/starting-with/${next}`, label: `Words starting with ${next.toUpperCase()}` },
        { to: `/words/ending-in/${L}`, label: `Words ending in ${upper}` },
        { to: "/scrabble-solver", label: "Try the Scrabble Solver", desc: "Find every play from your full rack." },
      ]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Words", path: "/words" },
        { name: `Starting with ${upper}`, path: `/words/starting-with/${L}` },
      ]}
      toolLink={{ to: "/scrabble-solver", label: "Open Scrabble Solver" }}
    />
  );
}
