import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Grid3x3,
  Lightbulb,
  Puzzle,
  Search,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { RelatedTools } from "@/components/RelatedTools";
import { absoluteUrl, breadcrumbSchema, itemListSchema } from "@/lib/seo";

const toolGroups = [
  {
    eyebrow: "Make words from letters",
    title: "Word finders & unscramblers",
    description: "Turn a rack, jumble, or set of letters into playable words in seconds.",
    tools: [
      {
        icon: Search,
        name: "Word Finder",
        description: "Find every word you can make from your letters, including shorter words.",
        to: "/word-finder",
        action: "Find words",
      },
      {
        icon: Shuffle,
        name: "Word Unscrambler",
        description: "Unscramble mixed-up letters into valid anagrams ranked by score and length.",
        to: "/word-finder",
        action: "Unscramble letters",
      },
      {
        icon: Sparkles,
        name: "Anagram Solver",
        description: "Use every letter to reveal full anagrams for puzzles, games, and wordplay.",
        to: "/word-finder?q=LISTENING",
        action: "Solve anagrams",
      },
    ],
  },
  {
    eyebrow: "Score your best play",
    title: "Scrabble word solvers",
    description: "Build stronger plays with tournament dictionaries and real tile scoring.",
    tools: [
      {
        icon: Grid3x3,
        name: "Scrabble Solver",
        description: "Rank every legal word from your rack by tile score with blank-tile support.",
        to: "/scrabble-solver",
        action: "Open Scrabble Solver",
      },
      {
        icon: Lightbulb,
        name: "Scrabble Word Finder",
        description: "Browse Scrabble word lists, tile values, scoring examples, and a rack solver in one place.",
        to: "/scrabble",
        action: "Explore Scrabble words",
      },
    ],
  },
  {
    eyebrow: "Match the pattern",
    title: "Crossword solvers",
    description: "Use known letters and wildcards to narrow down answers that fit your grid.",
    tools: [
      {
        icon: Puzzle,
        name: "Crossword Solver",
        description: "Match patterns such as C?T?? against more than 260,000 dictionary words.",
        to: "/crossword-solver",
        action: "Solve a crossword",
      },
      {
        icon: BookOpen,
        name: "Word Pattern Finder",
        description: "Find answers by length and position when you know only some of the letters.",
        to: "/crossword-solver",
        action: "Match a pattern",
      },
    ],
  },
];

const allTools = toolGroups.flatMap((group) => group.tools);

export default function Tools() {
  const url = absoluteUrl("/tools");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Word Finder, Scrabble Solver & Unscrambler Tools | Lexora</title>
        <meta
          name="description"
          content="Explore Lexora's free word finder, Scrabble solver, crossword solver, anagram solver, and word unscrambler tools. Find the right tool and start solving."
        />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Word Finder, Scrabble Solver & Unscrambler Tools | Lexora" />
        <meta property="og:description" content="Find the right free Lexora word tool for Scrabble, crosswords, anagrams, and letter puzzles." />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Word tools", path: "/tools" }]))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            itemListSchema({
              name: "Lexora word finders, solvers, and unscramblers",
              items: allTools.map((tool) => ({
                url: absoluteUrl(tool.to),
                name: tool.name,
                description: tool.description,
              })),
            }),
          )}
        </script>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="transition hover:text-primary">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Word tools</span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 shadow-card sm:px-10 sm:py-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-accent/70 to-transparent sm:block" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Lexora word tools
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">
              Find the right tool for every word puzzle
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Search letters, solve crossword patterns, unscramble anagrams, or find the highest-scoring Scrabble play. Choose a tool below and get answers instantly with free tournament word lists.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/word-finder" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-gold px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">
                Start finding words <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/scrabble-solver" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">
                Solve Scrabble <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-14 space-y-14">
          {toolGroups.map((group) => (
            <section key={group.title} aria-labelledby={group.title.replaceAll(" ", "-").toLowerCase()}>
              <div className="mb-5 max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">{group.eyebrow}</div>
                <h2 id={group.title.replaceAll(" ", "-").toLowerCase()} className="mt-2 font-display text-2xl font-bold sm:text-3xl">{group.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{group.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.name} to={tool.to} className="group flex min-h-52 flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
                      </div>
                      <h3 className="mt-5 font-display text-xl font-bold">{tool.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-primary">
                        {tool.action} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 border-y border-border py-10" aria-labelledby="browse-heading">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 id="browse-heading" className="font-display text-2xl font-bold">Browse words by letter or length</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Looking for a word list instead? Explore starting letters, endings, word lengths, and popular anagram racks.</p>
            </div>
            <Link to="/words" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary">
              Browse the word hub <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <RelatedTools heading="More ways to solve" keys={["scrabble", "crossword", "finder", "hub"]} excludePath="/tools" />
      </div>
    </div>
  );
}