import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { LETTERS } from "@/lib/programmatic";
import { POPULAR_RACKS_UNIQUE } from "@/content/popular-racks";

const LENGTHS = [3, 4, 5, 6, 7];

export default function WordsHub() {
  const url = absoluteUrl("/words");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Words by Letter, Length & Anagram — Word Reference Hub | Lexora</title>
        <meta
          name="description"
          content="Browse every English word by starting letter, ending letter, length, or anagram. Free reference for Scrabble, Wordle, crosswords and Words With Friends."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Words by Letter, Length & Anagram — Lexora" />
        <meta property="og:description" content="Browse every English word by starting letter, ending letter, length or anagram." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Words", path: "/words" },
            ]),
          )}
        </script>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Words</span>
        </nav>

        <header className="mb-12">
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            Browse Every Word
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
            Explore the full English dictionary by starting letter, ending letter, length, or unscramble specific letter combinations. Built on the TWL06 tournament Scrabble dictionary cross-referenced with SOWPODS — used by serious Scrabble, Wordle and crossword players.
          </p>
        </header>

        {/* Starting with */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold">Words starting with…</h2>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-13">
            {LETTERS.map((l) => (
              <Link
                key={`s-${l}`}
                to={`/words/starting-with/${l}`}
                className="grid place-items-center rounded-xl border border-border bg-card py-3 font-display text-lg font-bold uppercase transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {l}
              </Link>
            ))}
          </div>
        </section>

        {/* Ending in */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold">Words ending in…</h2>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-13">
            {LETTERS.map((l) => (
              <Link
                key={`e-${l}`}
                to={`/words/ending-in/${l}`}
                className="grid place-items-center rounded-xl border border-border bg-card py-3 font-display text-lg font-bold uppercase transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {l}
              </Link>
            ))}
          </div>
        </section>

        {/* N-letter words */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold">N-letter words containing…</h2>
          <div className="space-y-3">
            {LENGTHS.map((n) => (
              <div key={n} className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-2 text-sm font-semibold text-muted-foreground">{n}-letter words with:</div>
                <div className="flex flex-wrap gap-1.5">
                  {LETTERS.map((l) => (
                    <Link
                      key={`${n}-${l}`}
                      to={`/words/${n}-letter-words-with-${l}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background font-semibold uppercase transition hover:border-primary hover:text-primary"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular anagrams */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl font-bold">Popular anagrams to unscramble</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_RACKS_UNIQUE.slice(0, 80).map((r) => (
              <Link
                key={r}
                to={`/unscramble/${r}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary"
              >
                {r}
                <ArrowUpRight className="h-3 w-3 opacity-60" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Need to solve a specific puzzle?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These reference pages are great for browsing, but for live puzzle solving use the tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/scrabble-solver" className="rounded-full bg-gradient-to-r from-primary to-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Scrabble Solver</Link>
            <Link to="/crossword-solver" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">Crossword Solver</Link>
            <Link to="/word-finder" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">Word Finder</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
