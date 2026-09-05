import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Grid3X3,
  Lightbulb,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { RelatedTools } from "@/components/RelatedTools";
import {
  absoluteUrl,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  itemListSchema,
  speakableSchema,
  type FAQItem,
} from "@/lib/seo";
import { LETTERS } from "@/lib/programmatic";
import { POPULAR_RACKS_UNIQUE } from "@/content/popular-racks";
import { scoreWord, TILE_VALUES } from "@/lib/words";

const FAQS: FAQItem[] = [
  {
    q: "What is the best Scrabble word finder?",
    a: "Lexora's free Scrabble word finder checks your rack against TWL06 for US play and SOWPODS for UK play, then ranks every playable word by standard tile score. Blank tiles are supported with ?.",
  },
  {
    q: "How many points is each Scrabble tile worth?",
    a: "A, E, I, L, N, O, R, S, T and U are worth 1 point. D and G are worth 2; B, C, M and P are worth 3; F, H, V, W and Y are worth 4; K is worth 5; J and X are worth 8; Q and Z are worth 10.",
  },
  {
    q: "Is QI a valid Scrabble word?",
    a: "Yes. QI is valid in both the US TWL06 and UK SOWPODS tournament dictionaries and is one of the most useful Q-without-U words to learn.",
  },
  {
    q: "How do I use a blank tile in Scrabble?",
    a: "Type a question mark for each blank tile in the Scrabble Solver. For example, AERST? finds words made from those letters plus one wildcard.",
  },
  {
    q: "What is a Scrabble bingo?",
    a: "A bingo uses all seven tiles on your rack and earns a 50-point bonus in addition to the word's tile score. Use the solver with a full rack and set the minimum length to 7 to find bingo plays.",
  },
];

const WORD_LISTS = [
  {
    title: "2-letter Scrabble words",
    description: "Learn the short words that create hooks, parallel plays, and flexible endgames.",
    to: "/blog/2-letter-scrabble-words",
    action: "Study the full list",
  },
  {
    title: "Q words without U",
    description: "Find Q words that do not need a U, including high-value options such as QI.",
    to: "/blog/words-with-q-no-u",
    action: "Browse Q words",
  },
  {
    title: "High-scoring Scrabble words",
    description: "Review practical high-value plays and the rack setups that make them possible.",
    to: "/blog/high-scoring-scrabble-words",
    action: "See high scores",
  },
  {
    title: "Scrabble bingo strategy",
    description: "Improve rack balance, spot bingo stems, and turn seven tiles into a 50-point bonus.",
    to: "/blog/scrabble-bingo-strategy",
    action: "Read the strategy",
  },
];

const LETTER_GROUPS = [
  { label: "Start with a letter", prefix: "/words/starting-with/" },
  { label: "End with a letter", prefix: "/words/ending-in/" },
];

const TILE_ROWS = [
  ["A", "E", "I", "L", "N", "O", "R", "S", "T", "U"],
  ["D", "G"],
  ["B", "C", "M", "P"],
  ["F", "H", "V", "W", "Y"],
  ["K"],
  ["J", "X"],
  ["Q", "Z"],
];

const FEATURED_WORDS = ["QUIZ", "JINX", "ZEPHYR", "QUARTZ", "OXYPHENBUTAZONE"];

export default function Scrabble() {
  const [letterQuery, setLetterQuery] = useState("");
  const url = absoluteUrl("/scrabble");
  const filteredLetters = useMemo(
    () => LETTERS.filter((letter) => letter.includes(letterQuery.trim().toLowerCase())),
    [letterQuery],
  );
  const wordListItems = [
    ...WORD_LISTS.map((item) => ({
      url: absoluteUrl(item.to),
      name: item.title,
      description: item.description,
    })),
    ...LETTER_GROUPS.flatMap((group) =>
      LETTERS.slice(0, 6).map((letter) => ({
        url: absoluteUrl(`${group.prefix}${letter}`),
        name: `${group.label}: ${letter.toUpperCase()}`,
      })),
    ),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Scrabble Words, Tile Values & Word Finder | Lexora</title>
        <meta
          name="description"
          content="Find Scrabble words, learn tile point values, browse word lists, and use a free Scrabble solver with TWL06 and SOWPODS dictionaries."
        />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Scrabble Words, Tile Values & Word Finder | Lexora" />
        <meta property="og:description" content="Scrabble word lists, tile values, bingo tips, and a free word finder for your rack." />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Scrabble", path: "/scrabble" }]))}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema({ name: "Scrabble word lists", items: wordListItems }))}</script>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema(FAQS))}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema({
          name: "How to find Scrabble words from your rack",
          description: "Use Lexora to find valid Scrabble plays and compare their tile scores.",
          totalTimeIso: "PT30S",
          steps: [
            { name: "Enter your tiles", text: "Type the letters on your rack into the Scrabble Solver and use ? for blank tiles." },
            { name: "Choose a dictionary", text: "Select US TWL06 or UK SOWPODS depending on the rules you are playing." },
            { name: "Compare plays", text: "Review valid words ranked by tile score, length, and rarity." },
          ],
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema([".scrabble-h1", ".scrabble-intro"]))}</script>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Scrabble</span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 shadow-card sm:px-10 sm:py-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-accent/70 to-transparent sm:block" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Grid3X3 className="h-3.5 w-3.5" /> Scrabble word tools
            </div>
            <h1 className="scrabble-h1 font-display text-4xl font-black tracking-tight sm:text-6xl">Scrabble words, scores, and smarter plays</h1>
            <p className="scrabble-intro mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Find valid Scrabble words from your rack, check tile point values, and browse useful word lists for better plays. Lexora validates words against the US TWL06 and UK SOWPODS tournament dictionaries.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/scrabble-solver" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-gold px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">
                Open Scrabble Solver <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/words" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">
                Browse all word lists <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Scrabble resources">
          {[
            { icon: Trophy, title: "Rank every play", text: "Compare legal words by real tile score." },
            { icon: CheckCircle2, title: "Check validity", text: "Use US TWL06 or UK SOWPODS rules." },
            { icon: Lightbulb, title: "Build better racks", text: "Learn hooks, bingos, and Q words." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-display text-lg font-bold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-14" aria-labelledby="tile-values-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Quick reference</div>
              <h2 id="tile-values-heading" className="mt-2 font-display text-2xl font-bold sm:text-3xl">Scrabble tile values</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Use the standard English-language tile values below to estimate a word before checking premium board squares.</p>
            </div>
            <Link to="/scrabble-solver" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">Score your rack <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-2 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-3">
              <span>Tiles</span><span>Points each</span><span className="hidden sm:block">Example</span>
            </div>
            {TILE_ROWS.map((tiles) => {
              const points = TILE_VALUES[tiles[0]];
              return (
                <div key={tiles.join("")} className="grid grid-cols-2 items-center border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-3">
                  <div className="flex flex-wrap gap-1.5">
                    {tiles.map((tile) => <span key={tile} className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background font-display font-bold">{tile}</span>)}
                  </div>
                  <span className="font-display text-xl font-black text-primary">{points}</span>
                  <span className="hidden text-sm text-muted-foreground sm:block">{tiles.join("")} = {points} point{points === 1 ? "" : "s"} each</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The blank tile scores 0 points but can represent any letter. Board bonuses such as double-letter and triple-word squares are calculated separately during play.</p>
        </section>

        <section className="mt-14" aria-labelledby="word-lists-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Study and browse</div>
              <h2 id="word-lists-heading" className="mt-2 font-display text-2xl font-bold sm:text-3xl">Scrabble word lists</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Start with the lists players use most, or browse the dictionary by letter and length.</p>
            </div>
            <Link to="/words" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">Open the word hub <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WORD_LISTS.map((item) => (
              <Link key={item.title} to={item.to} className="group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow">
                <div className="flex items-start justify-between gap-3"><BookOpen className="h-5 w-5 text-primary" /><ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div>
                <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">{item.action} <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8" aria-labelledby="browse-letters-heading">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Dictionary explorer</div>
              <h2 id="browse-letters-heading" className="mt-2 font-display text-2xl font-bold sm:text-3xl">Browse Scrabble words by letter</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Open a crawlable list of words that start or end with any letter, with length groups and tile scores.</p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Filter letters</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={letterQuery} onChange={(event) => setLetterQuery(event.target.value.replace(/[^a-z]/gi, "").slice(0, 1))} placeholder="Filter by letter" className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {LETTER_GROUPS.map((group) => (
              <div key={group.label}>
                <h3 className="mb-3 font-display text-lg font-bold">{group.label}</h3>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                  {filteredLetters.map((letter) => <Link key={`${group.prefix}-${letter}`} to={`${group.prefix}${letter}`} className="grid h-11 place-items-center rounded-xl border border-border bg-background font-display text-lg font-bold uppercase transition hover:border-primary hover:text-primary">{letter}</Link>)}
                </div>
                {filteredLetters.length === 0 && <p className="text-sm text-muted-foreground">No matching letter.</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
            {[3, 4, 5, 6, 7].map((length) => <Link key={length} to={`/words/${length}-letter-words-with-a`} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary">{length}-letter words <ArrowRight className="h-3 w-3" /></Link>)}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="featured-scores-heading">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Point examples</div>
              <h2 id="featured-scores-heading" className="mt-2 font-display text-2xl font-bold sm:text-3xl">High-value Scrabble words</h2>
            </div>
            <Link to="/blog/high-scoring-scrabble-words" className="text-sm font-bold text-primary hover:underline">See the full guide</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {FEATURED_WORDS.map((word) => <div key={word} className="rounded-2xl border border-border bg-card p-4 text-center shadow-card"><div className="font-display text-xl font-black tracking-wide">{word}</div><div className="mt-2 text-sm text-muted-foreground">{scoreWord(word)} tile points</div></div>)}
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2" aria-labelledby="scrabble-tips-heading">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 id="scrabble-tips-heading" className="mt-3 font-display text-2xl font-bold">Three Scrabble tips that pay off</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Memorize 2-letter words.</strong> They create hooks and make parallel plays possible.</li>
              <li><strong className="text-foreground">Protect your rack balance.</strong> Keeping a mix of vowels and consonants can be worth more than a single flashy score.</li>
              <li><strong className="text-foreground">Look for bingo stems.</strong> Seven-tile plays add a 50-point bonus, so save useful combinations when the board allows it.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Grid3X3 className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-display text-2xl font-bold">Ready to find your best play?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Enter your rack, add a blank with ?, and compare every valid word by score. Switch between US and UK dictionaries whenever you need to.</p>
            <Link to="/scrabble-solver" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-gold px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">Find Scrabble words <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8" aria-labelledby="dictionary-heading">
          <h2 id="dictionary-heading" className="font-display text-2xl font-bold">Which Scrabble dictionary should you use?</h2>
          <div className="mt-4 grid gap-5 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p><strong className="text-foreground">US / TWL06:</strong> Use this dictionary for North American tournament Scrabble. It is the default in the solver and is useful for most US word games.</p>
            <p><strong className="text-foreground">UK / SOWPODS:</strong> Use this international word list for UK, Australia, and many other countries. It contains words that are not in the North American list.</p>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="scrabble-faq-heading">
          <h2 id="scrabble-faq-heading" className="font-display text-2xl font-bold sm:text-3xl">Scrabble questions answered</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
            {FAQS.map((faq) => <details key={faq.q} className="group p-5"><summary className="cursor-pointer list-none pr-6 font-display font-bold marker:hidden">{faq.q}</summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{faq.a}</p></details>)}
          </div>
        </section>

        <RelatedTools heading="More word tools" keys={["crossword", "finder", "anagram", "hub"]} excludePath="/scrabble" />
      </div>
    </div>
  );
}