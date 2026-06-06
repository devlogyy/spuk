import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ProgrammaticPageShell } from "@/components/ProgrammaticPageShell";
import { nLetterWordsContaining, type WordEntry, LETTERS } from "@/lib/programmatic";
import NotFound from "@/pages/NotFound";

// Slug shape: `<n>-letter-words-with-<letter>` e.g. "5-letter-words-with-a"
const SLUG_RE = /^(\d+)-letter-words-with-([a-z])$/;

export default function NLetterWordsWith() {
  const { slug = "" } = useParams();
  const parsed = useMemo(() => {
    const m = slug.toLowerCase().match(SLUG_RE);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    const letter = m[2];
    if (n < 2 || n > 15 || !LETTERS.includes(letter)) return null;
    return { n, letter };
  }, [slug]);

  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parsed) return;
    setLoading(true);
    nLetterWordsContaining(parsed.n, parsed.letter).then((r) => {
      setWords(r);
      setLoading(false);
    });
  }, [parsed]);

  if (!parsed) return <NotFound />;

  const { n, letter } = parsed;
  const upper = letter.toUpperCase();
  const path = `/words/${n}-letter-words-with-${letter}`;
  const prevN = Math.max(2, n - 1);
  const nextN = Math.min(15, n + 1);

  return (
    <ProgrammaticPageShell
      metaTitle={`${n} Letter Words With ${upper} — Wordle & Scrabble List | Lexora`}
      metaDescription={`Every ${n}-letter word containing the letter ${upper}, sorted by Scrabble score. Perfect for Wordle, Scrabble, Words With Friends and crosswords.`}
      canonicalPath={path}
      title={`${n}-letter words with ${upper}`}
      h1={`${n} Letter Words With ${upper}`}
      intro={`Every ${n}-letter word that contains the letter ${upper}, sorted from highest Scrabble score down. Use this list for Wordle (when you know ${upper} is somewhere in the answer), Scrabble racks, Words With Friends, and crossword pattern matching.`}
      loading={loading}
      words={words}
      faqs={[
        { q: `How many ${n}-letter words contain ${upper}?`, a: `${words.length} ${n}-letter words in the TWL06 tournament dictionary contain the letter ${upper}. Different game dictionaries (SOWPODS, ENABLE) will vary slightly.` },
        { q: `How do I use this for Wordle?`, a: `If your guess revealed a yellow ${upper}, this list shows every ${n}-letter possibility. Cross-reference with letters you've already ruled out to narrow it down.` },
        { q: `Are these all valid in Scrabble?`, a: `Yes — every word on this page is valid in tournament Scrabble (TWL06). UK/international players using SOWPODS will see most of these plus a handful more.` },
        { q: `What's the highest-scoring ${n}-letter word with ${upper}?`, a: `Check the "Top 10" callout above — usually it's a word combining ${upper} with Q, Z, J or X on tiles that make best use of premium board squares.` },
      ]}
      related={[
        { to: `/words/${prevN}-letter-words-with-${letter}`, label: `${prevN}-letter words with ${upper}` },
        { to: `/words/${nextN}-letter-words-with-${letter}`, label: `${nextN}-letter words with ${upper}` },
        { to: `/words/starting-with/${letter}`, label: `Words starting with ${upper}` },
        { to: "/word-finder", label: "Try the Word Finder", desc: "Build any word from your letters." },
      ]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Words", path: "/words" },
        { name: `${n} letters with ${upper}`, path },
      ]}
      toolLink={{ to: "/word-finder", label: "Open Word Finder" }}
    />
  );
}
