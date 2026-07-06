import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Sparkles, Trophy } from "lucide-react";
import { absoluteUrl, breadcrumbSchema, faqPageSchema, definedTermSetSchema, type FAQItem } from "@/lib/seo";
import type { WordEntry } from "@/lib/programmatic";
import { groupByLength, topByScore } from "@/lib/programmatic";
import { RelatedTools } from "@/components/RelatedTools";
import { detectTemplate, templateCopy } from "@/content/programmatic-copy";


interface RelatedLink {
  to: string;
  label: string;
  desc?: string;
}

interface Props {
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  h1: string;
  intro: string;
  loading: boolean;
  words: WordEntry[];
  faqs: FAQItem[];
  related: RelatedLink[];
  breadcrumbs: { name: string; path: string }[];
  toolLink: { to: string; label: string };
  dictionaryNote?: string;
}

export function ProgrammaticPageShell({
  metaTitle,
  metaDescription,
  canonicalPath,
  h1,
  intro,
  loading,
  words,
  faqs,
  related,
  breadcrumbs,
  toolLink,
  dictionaryNote,
}: Props) {
  const url = absoluteUrl(canonicalPath);
  const grouped = groupByLength(words);
  const top10 = topByScore(words, 10);
  const lengths = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    numberOfItems: words.length,
    itemListElement: words.slice(0, 50).map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: w.word,
    })),
  };

  const definedTermSet = definedTermSetSchema({
    name: h1,
    description: metaDescription,
    inDefinedTermSetUrl: url,
    terms: words.slice(0, 50).map((w) => ({
      term: w.word,
      description: `${w.word.length}-letter word${typeof w.score === "number" ? ` worth ${w.score} points in Scrabble` : ""}.`,
    })),
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema(breadcrumbs))}</script>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema(faqs))}</script>
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
        <script type="application/ld+json">{JSON.stringify(definedTermSet)}</script>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((c, i) => (
            <span key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{c.name}</span>
              ) : (
                <Link to={c.path} className="transition hover:text-primary">{c.name}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">{h1}</h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">{intro}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border bg-card px-3 py-1.5 font-semibold">
              {loading ? "Loading…" : `${words.length.toLocaleString()} words`}
            </span>
            <Link
              to={toolLink.to}
              className="rounded-full bg-gradient-to-r from-primary to-gold px-3 py-1.5 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              {toolLink.label} →
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Loading dictionary…
          </div>
        ) : words.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No words found for this combination.
          </div>
        ) : (
          <>
            {/* Top 10 callout */}
            <section className="mb-10 rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                <h2 className="font-display text-2xl font-bold">Top 10 highest-scoring</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {top10.map((w) => (
                  <Link
                    key={w.word}
                    to={`${toolLink.to}?q=${encodeURIComponent(w.word.toLowerCase())}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-3 py-2 transition hover:border-primary"
                  >
                    <span className="font-display font-bold uppercase tracking-wide">{w.word}</span>
                    <span className="text-xs font-semibold text-primary">{w.score}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Word lists grouped by length */}
            <section className="space-y-8">
              {lengths.map((n) => (
                <div key={n}>
                  <h2 className="mb-3 font-display text-xl font-bold">
                    {n}-letter words <span className="text-sm font-normal text-muted-foreground">({grouped[n].length})</span>
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {grouped[n].map((w) => (
                      <Link
                        key={w.word}
                        to={`${toolLink.to}?q=${encodeURIComponent(w.word.toLowerCase())}`}
                        className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm transition hover:border-primary hover:bg-card/80"
                        title={`${w.word} — ${w.score} pts`}
                      >
                        <span className="font-semibold uppercase tracking-wide">{w.word}</span>
                        <span className="text-[10px] font-bold text-primary">{w.score}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Dictionary note */}
        <section className="mt-12 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <div className="mb-1 flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold">How this list was generated</span>
          </div>
          <p>
            {dictionaryNote ??
              "Words are sourced from the TWL06 tournament Scrabble dictionary used in North America, cross-referenced against SOWPODS (the international list used in the UK, Australia and most other countries)."}
            {" "}Scores follow standard Scrabble tile values.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1.5 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">Continue exploring</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="block rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary"
                >
                  <div className="text-sm font-bold leading-snug">{r.label}</div>
                  {r.desc && <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedTools
          heading="Related word tools"
          keys={["scrabble", "crossword", "finder", "hub"]}
          excludePath={canonicalPath}
        />
      </div>

    </div>
  );
}
