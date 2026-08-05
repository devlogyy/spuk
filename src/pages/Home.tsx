import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Grid3x3, Puzzle, Search, Sparkles, ArrowRight, Trophy, Zap,
  TrendingUp, Brain, Globe, Flame
} from "lucide-react";
import { useState } from "react";
import { WordCard } from "@/components/WordCard";
import { demoResults } from "@/lib/words";
import { posts } from "@/content/blog";
import { absoluteUrl, howToSchema, speakableSchema, itemListSchema, articleSchema } from "@/lib/seo";


const features = [
  { icon: Grid3x3, title: "Scrabble Solver", desc: "Highest scoring plays with US & UK dictionaries.", to: "/scrabble-solver", color: "from-primary to-gold" },
  { icon: Puzzle, title: "Crossword Solver", desc: "Pattern matching across 260k+ words.", to: "/crossword-solver", color: "from-gold to-primary" },
  { icon: Search, title: "Word Finder", desc: "Anagrams, unscramble & smart combinations.", to: "/word-finder", color: "from-primary to-orange-400" },
  { icon: Brain, title: "AI Move Engine", desc: "Coming soon — predicts the best move.", to: "/scrabble-solver", color: "from-orange-500 to-gold" },
];

const trending = ["quartz", "jinx", "fjord", "zephyr", "oxide", "waltz", "vexed", "blaze"];

const homeBlogPosts = posts.slice(0, 3);

export default function Home() {
  const results = demoResults(6);
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const goFind = (override?: string) => {
    const v = (override ?? q).trim();
    if (!v) return navigate("/word-finder");
    navigate(`/word-finder?q=${encodeURIComponent(v)}`);
  };

  return (
    <div className="relative">
      <Helmet>
        <title>Scrabble Word Finder, Crossword Solver & Unscrambler | Lexora</title>
        <meta name="description" content="Free Scrabble word finder, crossword solver and word unscrambler. Enter your letters or clue pattern and get every valid word ranked by score — TWL (US) and SOWPODS (UK)." />
        <link rel="canonical" href="https://www.lexorawords.com/" />
        <meta property="og:title" content="Scrabble Word Finder, Crossword Solver & Unscrambler | Lexora" />
        <meta property="og:description" content="Free Scrabble word finder, crossword solver and word unscrambler with US (TWL) and UK (SOWPODS) dictionaries." />
        <meta property="og:url" content="https://www.lexorawords.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(howToSchema({
          name: "How to find any word with Lexora",
          description: "Turn letters, patterns or clues into ranked, dictionary-valid word answers.",
          totalTimeIso: "PT20S",
          steps: [
            { name: "Pick a tool", text: "Choose Scrabble Solver, Crossword Solver or Word Finder from the hero." },
            { name: "Enter letters or a pattern", text: "Type your tiles, use ? for blanks, or enter a crossword pattern like C?T??." },
            { name: "Get ranked answers", text: "Every valid word appears sorted by score, length or rarity — validated against TWL and SOWPODS." },
          ],
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema([".speakable-h1", ".speakable-intro"]))}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema({
          name: "Featured articles from the Lexora blog",
          items: homeBlogPosts.map((p) => ({
            url: absoluteUrl(`/blog/${p.slug}`),
            name: p.title,
            description: p.description,
          })),
        }))}</script>
        {homeBlogPosts.map((p) => (
          <script key={p.slug} type="application/ld+json">{JSON.stringify(articleSchema({
            headline: p.title,
            description: p.description,
            url: absoluteUrl(`/blog/${p.slug}`),
            author: p.author,
            datePublished: p.datePublished,
            dateModified: p.dateModified,
          }))}</script>
        ))}
      </Helmet>


      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-10 sm:pt-20">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-mesh)" }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="mx-auto max-w-3xl text-center"
          >

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium shadow-soft">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Word Intelligence · v1.0</span>
            </div>
            <h1 className="speakable-h1 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Scrabble word finder, crossword solver &amp; <span className="text-gradient">word unscrambler</span>.
            </h1>
            <p className="speakable-intro mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Enter your Scrabble rack to get every legal play ranked by tile score, type a crossword pattern like <code>C?T??</code> to find answers that fit, or unscramble any letters into every valid word. Free, instant, and validated against the TWL (US) and SOWPODS (UK) tournament dictionaries.
            </p>


            <div className="mx-auto mt-8 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">Enter your letters</label>
              <div className="glass-strong flex flex-col gap-2 rounded-3xl p-2 shadow-glow sm:flex-row sm:items-center sm:rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="hero-search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goFind()}
                    placeholder="Type your letters, e.g. QUARTZN"
                    autoCapitalize="characters"
                    className="h-12 min-w-0 flex-1 bg-transparent px-2 text-base font-semibold tracking-wider outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  onClick={() => goFind()}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-gold px-5 text-sm font-bold text-primary-foreground shadow-glow sm:w-auto"
                >
                  Find words
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Use <kbd className="rounded bg-muted px-1.5 py-0.5">?</kbd> for blank tiles. We'll find every legal word.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-muted-foreground">Try:</span>
                {["QUARTZN", "LISTENING", "AERST?"].map((ex) => (
                  <button key={ex} onClick={() => goFind(ex)} className="min-h-9 rounded-full border border-border bg-background/60 px-3 py-1 font-semibold tracking-wider text-foreground transition hover:border-primary hover:text-primary">
                    {ex}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Trending:
                {trending.slice(0, 5).map((w) => (
                  <button key={w} onClick={() => goFind(w)} className="min-h-9 rounded-full border border-border bg-background/60 px-3 py-1 font-medium text-foreground transition hover:border-primary hover:text-primary">
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-primary" /> US + UK dictionaries</div>
              <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-gold" /> Realtime scoring</div>
              <div className="hidden items-center gap-1.5 sm:flex"><Brain className="h-3.5 w-3.5 text-primary" /> AI coming soon</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group flex h-full min-h-[160px] transform-gpu flex-col rounded-3xl border border-border bg-card bg-clip-padding p-6 will-change-transform md:shadow-card md:transition-transform md:duration-200 md:hover:-translate-y-1"
            >
              <div className={`mb-4 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-primary-foreground`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-primary">
                Open tool <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">How Lexora works</div>
          <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Three taps to the perfect word</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", title: "Pick a tool", desc: "Scrabble, Crossword or Word Finder." },
            { n: "2", title: "Enter letters or pattern", desc: "Use ? for unknown tiles." },
            { n: "3", title: "Get ranked answers", desc: "Sorted by score, length, rarity." },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold font-display text-lg font-black text-primary-foreground shadow-glow">{s.n}</div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="live-results-heading" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Live results preview</div>
            <h2 id="live-results-heading" className="mt-1 font-display text-2xl font-bold sm:text-4xl">Top plays from your rack</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by score · US & UK validated</p>
          </div>
          <Link to="/scrabble-solver" className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary sm:inline-block">Open solver →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (<WordCard key={r.word} {...r} />))}
        </div>
      </section>


      {/* Word of the day — rebuilt mobile-safe */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 relative isolate overflow-hidden rounded-3xl border border-border p-6 text-primary-foreground sm:p-8" style={{ background: "linear-gradient(135deg, var(--charcoal), oklch(0.32 0.08 40))" }}>
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl sm:h-60 sm:w-60" style={{ background: "var(--gradient-mesh)" }} />
            <div className="relative">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gold sm:text-xs">Word of the day</div>
              <div className="mt-3 flex flex-wrap items-end gap-3 sm:gap-4">
                <h3 className="min-w-0 font-display text-4xl font-black uppercase tracking-tight text-gold sm:text-6xl lg:text-7xl">
                  Quartz
                </h3>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-glow sm:h-12 sm:w-12">
                  <div className="text-center leading-none">
                    <div className="text-base font-black sm:text-xl">24</div>
                    <div className="text-[7px] uppercase tracking-widest opacity-80 sm:text-[8px]">pts</div>
                  </div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm text-white/70">A hard crystalline mineral consisting of silica — and one of the highest-scoring 6-letter plays you can lay down.</p>
              <div className="mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                {"QUARTZ".split("").map((l, i) => (<div key={i} className="tile grid h-9 w-9 place-items-center text-base sm:h-12 sm:w-12 sm:text-xl">{l}</div>))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Daily Challenge</div>
              <Flame className="h-5 w-5 text-gold" />
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold">7-letter Bingo</h3>
            <p className="mt-1 text-sm text-muted-foreground">Find every bingo word from today's rack and climb the leaderboard.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {"AEINRST".split("").map((l, i) => (<div key={i} className="tile grid h-9 w-9 place-items-center text-sm">{l}</div>))}
            </div>
            <div className="mt-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground"><Trophy className="h-3.5 w-3.5 text-gold" /> 12,840 playing</div>
              <Link to="/word-finder?q=AEINRST" className="rounded-full bg-gradient-to-r from-primary to-gold px-3 py-1.5 font-semibold text-primary-foreground">Play</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">From the blog</div>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">Strategies, tips & guides</h2>
          </div>
          <Link to="/blog" className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary">All posts →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {homeBlogPosts.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            >
              <Link to={`/blog/${p.slug}`} rel="bookmark" aria-label={`Read: ${p.title}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={p.thumbnail}
                    alt={p.thumbnailAlt}
                    loading="lazy"
                    width={1280}
                    height={704}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                    {p.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold leading-snug transition group-hover:text-primary">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{p.author}</span><span>·</span>
                    <time dateTime={p.datePublished}>{p.date}</time>
                    <span>·</span><span>{p.readTime}</span>
                  </div>
                </div>
              </Link>

            </motion.article>
          ))}
        </div>
      </section>

      <section aria-label="Why trust Lexora" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-card sm:grid-cols-3 sm:p-8">
          {[
            { title: "US + UK dictionaries", body: "Every word checked against TWL06 and SOWPODS, with a visible source badge." },
            { title: "Transparent scoring", body: "Standard Scrabble tile values, shown next to every word — no hidden ranking tricks." },
            { title: "No signup required", body: "All solvers, finders and word lists are free and usable without an account." },
          ].map((f, i) => (
            <div key={i}>
              <div className="font-display text-lg font-bold">{f.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border p-8 text-center shadow-glow sm:p-10" style={{ background: "var(--gradient-hero)" }}>
          <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full opacity-50 blur-3xl" style={{ background: "var(--gradient-mesh)" }} />
          <h2 className="relative font-display text-2xl font-black sm:text-4xl">Start scoring smarter today</h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">No signup needed. Open the solver, enter your tiles, win the game.</p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/scrabble-solver" className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">Open Scrabble Solver</Link>
            <Link to="/word-finder" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-primary">Word Finder</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
