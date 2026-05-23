import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Clock, User } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Word Game Blog — Strategies, Tips & Guides | Lexora" },
      { name: "description", content: "Premium guides on Scrabble strategy, crossword tips, vocabulary building and high-scoring word play. Learn from word game pros." },
      { property: "og:title", content: "Lexora Blog — Word Game Strategies" },
      { property: "og:description", content: "Scrabble strategy, crossword tips, vocabulary building. Master every word game." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const categories = ["All", "Scrabble Strategies", "Crossword Tips", "Vocabulary Building", "Puzzle News", "Tutorials", "High Scoring"];

const posts = [
  { tag: "Strategy", title: "10 highest-scoring Scrabble words pros actually use", excerpt: "The Q without U, the rare Z plays and the bingo setups that turn games around.", author: "Mia Chen", read: "6 min", date: "Jun 12, 2026", featured: true },
  { tag: "Tutorial", title: "Crossword patterns: master the C_A__T method", excerpt: "How elite solvers narrow down ambiguous patterns in under 8 seconds.", author: "Daniel Park", read: "8 min", date: "Jun 8, 2026" },
  { tag: "Vocabulary", title: "Build a 10,000-word vocabulary in 30 days", excerpt: "The spaced-repetition system that actually sticks — backed by cognitive science.", author: "Sofia Almeida", read: "12 min", date: "Jun 4, 2026" },
  { tag: "News", title: "World Scrabble Championship 2026 — what changed", excerpt: "New dictionary updates, tournament format and the rising stars to watch.", author: "Marcus King", read: "5 min", date: "May 30, 2026" },
  { tag: "Strategy", title: "Bingo math: when to hold and when to dump tiles", excerpt: "A statistical look at rack management for 7-letter plays.", author: "Mia Chen", read: "9 min", date: "May 24, 2026" },
  { tag: "High Scoring", title: "Every Q-without-U word, ranked by usefulness", excerpt: "QI, QAT, QOPH — and a dozen more that pros memorize day one.", author: "Daniel Park", read: "7 min", date: "May 18, 2026" },
];

function Blog() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5 text-primary" /> The Lexora Blog
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Strategies for the <span className="text-gradient">word obsessed</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Guides, tips and deep dives written by competitive word game players.
        </p>
      </motion.header>

      <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
        {categories.map((c, i) => (
          <button key={c} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      <article className="mt-8 grid overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-2">
        <div className="relative min-h-64 lg:min-h-full" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-wrap justify-center gap-2 p-6">
              {"QUARTZ".split("").map((l, i) => (
                <div key={i} className="tile grid h-14 w-14 place-items-center text-2xl">{l}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 lg:p-10">
          <div className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">Featured · {posts[0].tag}</div>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{posts[0].title}</h2>
          <p className="mt-3 text-muted-foreground">{posts[0].excerpt}</p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {posts[0].author}</span>
            <span>·</span>
            <span>{posts[0].date}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {posts[0].read}</span>
          </div>
          <button className="mt-6 rounded-full bg-gradient-to-r from-primary to-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">Read article</button>
        </div>
      </article>

      {/* Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(1).map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="relative h-44 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
              <div className="absolute inset-0 grid place-items-center">
                <BookOpen className="h-9 w-9 text-primary/60" />
              </div>
              <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">{p.tag}</div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold leading-snug transition group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.author}</span>
                <span>{p.read} · {p.date}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
