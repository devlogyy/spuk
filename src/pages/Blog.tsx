import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BookOpen, Clock, User } from "lucide-react";
import { posts, type Category } from "@/content/blog";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

const categories: ("All" | Category)[] = [
  "All",
  "Scrabble Strategies",
  "Crossword Tips",
  "Vocabulary Building",
  "Tutorials",
  "High Scoring",
];

export default function Blog() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.category === active)),
    [active],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`Word Game Blog — Scrabble, Crossword & Vocabulary Guides | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="In-depth, evergreen guides on Scrabble strategy, crossword solving, vocabulary building and high-scoring word play. Written by competitive word game players."
        />
        <link rel="canonical" href={absoluteUrl("/blog")} />
        <meta property="og:title" content={`Word Game Blog | ${SITE_NAME}`} />
        <meta property="og:description" content="Evergreen guides for Scrabble, crossword and word-game players." />
        <meta property="og:url" content={absoluteUrl("/blog")} />
        <meta property="og:type" content="website" />
      </Helmet>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5 text-primary" /> The {SITE_NAME} Blog
        </div>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Strategies for the <span className="text-gradient">word obsessed</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Evergreen guides, tips and deep dives written by competitive word game players.
        </p>
      </motion.header>

      <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
              active === c
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {featured && (
        <Link to={`/blog/${featured.slug}`} className="mt-8 block">
          <article className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-glow lg:grid-cols-2">
            <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto">
              <img
                src={featured.thumbnail}
                alt={featured.thumbnailAlt}
                width={1280}
                height={704}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-10">
              <div className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Featured · {featured.category}
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{featured.title}</h2>
              <p className="mt-3 text-muted-foreground">{featured.description}</p>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {featured.author}</span>
                <span>·</span><span>{featured.date}</span><span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.readTime}</span>
              </div>
              <span className="mt-6 inline-block rounded-full bg-gradient-to-r from-primary to-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                Read article
              </span>
            </div>
          </article>
        </Link>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
          >
            <Link to={`/blog/${p.slug}`} className="block">
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
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.author}</span><span>{p.readTime} · {p.date}</span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
