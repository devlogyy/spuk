import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Grid3x3, Puzzle, Search, Sparkles, ArrowRight, Trophy, Zap, BookOpen,
  TrendingUp, Brain, Globe, Flame
} from "lucide-react";
import { WordCard } from "@/components/WordCard";
import { generateResults } from "@/lib/words";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lexora — AI Scrabble Solver, Crossword & Word Finder" },
      { name: "description", content: "Premium AI-powered word game platform. Scrabble solver, crossword solver, anagram generator and word finder with US & UK dictionaries." },
      { property: "og:title", content: "Lexora — AI Word Intelligence" },
      { property: "og:description", content: "Premium AI Scrabble, Crossword & Word Finder platform built for serious players." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const features = [
  { icon: Grid3x3, title: "Scrabble Solver", desc: "Highest scoring plays with US & UK dictionaries.", to: "/scrabble-solver", color: "from-primary to-gold" },
  { icon: Puzzle, title: "Crossword Solver", desc: "Pattern matching + AI clue interpretation.", to: "/crossword-solver", color: "from-gold to-primary" },
  { icon: Search, title: "Word Finder", desc: "Anagrams, unscramble & smart combinations.", to: "/word-finder", color: "from-primary to-orange-400" },
  { icon: Brain, title: "AI Move Engine", desc: "Predicts best move from board state.", to: "/scrabble-solver", color: "from-orange-500 to-gold" },
];

const trending = ["quartz", "jinx", "fjord", "zephyr", "oxide", "waltz", "vexed", "blaze"];

const blogPosts = [
  { tag: "Strategy", title: "10 highest-scoring Scrabble words pros actually use", read: "6 min", date: "Jun 2026" },
  { tag: "Tutorial", title: "Crossword patterns: master the C_A__T method", read: "8 min", date: "Jun 2026" },
  { tag: "Vocabulary", title: "Build a 10,000-word vocabulary in 30 days", read: "12 min", date: "May 2026" },
];

function Home() {
  const results = generateResults("QUARTZINGLE", 6);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-12 sm:pt-20">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-mesh)" }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>AI Word Intelligence · v1.0</span>
            </div>
            <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Dominate every <span className="text-gradient">word game</span> you play.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Lexora is the premium AI platform for Scrabble, Crosswords, Anagrams and Word Finder. Smarter suggestions, US & UK dictionaries, real scoring — built for serious players.
            </p>

            {/* Hero search */}
            <div className="mx-auto mt-8 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">Enter your letters</label>
              <div className="glass-strong flex items-center gap-2 rounded-2xl p-2 shadow-glow">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  id="hero-search"
                  placeholder="Type your letters, e.g. QUARTZN"
                  autoCapitalize="characters"
                  className="h-12 flex-1 bg-transparent px-2 text-base font-semibold tracking-wider outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground"
                />
                <Link
                  to="/word-finder"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-gold px-5 text-sm font-bold text-primary-foreground shadow-glow"
                >
                  Find words now
                </Link>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Use <kbd className="rounded bg-muted px-1.5 py-0.5">?</kbd> for blank tiles. We'll find every legal word.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-muted-foreground">Try:</span>
                {["QUARTZN", "LISTENING", "AERST?"].map((ex) => (
                  <Link
                    key={ex}
                    to="/word-finder"
                    className="min-h-9 rounded-full border border-border bg-background/60 px-3 py-1 font-semibold tracking-wider text-foreground transition hover:border-primary hover:text-primary"
                  >
                    {ex}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Trending:
                {trending.slice(0, 5).map((w) => (
                  <Link key={w} to="/word-finder" className="min-h-9 rounded-full border border-border bg-background/60 px-3 py-1 font-medium text-foreground transition hover:border-primary hover:text-primary">
                    {w}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-primary" /> US + UK dictionaries</div>
              <div className="hidden items-center gap-1.5 sm:flex"><Zap className="h-3.5 w-3.5 text-gold" /> Realtime scoring</div>
              <div className="flex items-center gap-1.5"><Brain className="h-3.5 w-3.5 text-primary" /> AI assisted</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={f.to} className="group block h-full rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow">
                <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-primary-foreground shadow-glow`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open tool <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
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
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold font-display text-lg font-black text-primary-foreground shadow-glow">
                {s.n}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Live results preview</div>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Top plays from your rack</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by score · US & UK validated</p>
          </div>
          <Link to="/scrabble-solver" className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary sm:inline-block">
            Open solver →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <WordCard key={r.word} {...r} />
          ))}
        </div>
      </section>

      {/* Word of the day + Daily challenge */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-charcoal to-charcoal p-8 text-primary-foreground" style={{ background: "linear-gradient(135deg, var(--charcoal), oklch(0.32 0.08 40))" }}>
            <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-mesh)" }} />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold">Word of the day</div>
              <div className="mt-4 flex items-end gap-4">
                <h3 className="font-display text-5xl font-black uppercase tracking-tight sm:text-7xl text-gradient">Quartz</h3>
                <div className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-glow">
                  <div className="text-center leading-none"><div className="text-xl font-black">24</div><div className="text-[8px] uppercase tracking-widest opacity-80">pts</div></div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm text-white/70">A hard crystalline mineral consisting of silica — and one of the highest-scoring 6-letter plays you can lay down.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {"QUARTZ".split("").map((l, i) => (
                  <div key={i} className="tile grid h-12 w-12 place-items-center text-xl">{l}</div>
                ))}
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
              {"AEINRST".split("").map((l, i) => (
                <div key={i} className="tile grid h-9 w-9 place-items-center text-sm">{l}</div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground"><Trophy className="h-3.5 w-3.5 text-gold" /> 12,840 playing</div>
              <button className="rounded-full bg-gradient-to-r from-primary to-gold px-3 py-1.5 font-semibold text-primary-foreground">Play</button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">From the blog</div>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Strategies, tips & guides</h2>
          </div>
          <Link to="/blog" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary">All posts →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="relative h-44 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
                <div className="absolute inset-0 grid place-items-center">
                  <BookOpen className="h-10 w-10 text-primary/60" />
                </div>
                <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">{p.tag}</div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold leading-snug transition group-hover:text-primary">{p.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{p.date}</span><span>·</span><span>{p.read} read</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center shadow-glow" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute -bottom-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full opacity-50 blur-3xl" style={{ background: "var(--gradient-mesh)" }} />
          <h2 className="relative font-display text-3xl font-black sm:text-4xl">Start scoring smarter today</h2>
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
