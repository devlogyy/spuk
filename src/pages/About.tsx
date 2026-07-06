import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, ShieldCheck, Globe2 } from "lucide-react";
import { absoluteUrl, breadcrumbSchema, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export default function About() {
  const url = absoluteUrl("/about");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About {SITE_NAME} — the story behind our word tools</title>
        <meta name="description" content={`Who runs ${SITE_NAME}, why we built it, and how we source our dictionaries.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`About ${SITE_NAME}`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema([
          { name: "Home", path: "/" }, { name: "About", path: "/about" },
        ]))}</script>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-widest text-primary">About</div>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Serious word tools, built for people who actually play.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {SITE_DESCRIPTION} We started {SITE_NAME} because every other word solver we tried felt like it was designed in 2007 — slow, ad-choked, and missing the one thing serious players need: transparency about which dictionary a word came from.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {[
            { icon: BookOpen, title: "Two dictionaries, one answer", body: "Every result is checked against TWL (North America) and SOWPODS (international), with a visible badge so you know before you play." },
            { icon: Sparkles, title: "Answer-first, ad-second", body: "Tools give you the play in one click. Ads help keep the site free but never sit between you and the answer." },
            { icon: ShieldCheck, title: "No signup required", body: "Every solver, finder and word list is usable without an account. Sign in only if you want to save history." },
            { icon: Globe2, title: "Made for the whole board", body: "We cover Scrabble, Words With Friends, crosswords, Wordle-style puzzles and general anagram work." },
          ].map((f, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <f.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-3 font-display text-lg font-bold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Our editorial approach</h2>
          <p className="mt-3 leading-relaxed text-foreground/90">
            Guides on {SITE_NAME} are written by players and cross-checked against the official dictionaries and rule PDFs. When a rule differs between Scrabble (TWL/SOWPODS), Words With Friends (ENABLE) and casual online games, we say so. If we're wrong, we correct it — email us and we'll update the article and note the change.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Where our word lists come from</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-foreground/90">
            <li><strong>TWL06</strong> — the Tournament Word List used by SCRABBLE® tournaments in North America.</li>
            <li><strong>SOWPODS (Collins Scrabble Words)</strong> — the international tournament list used everywhere outside North America.</li>
            <li>Scoring values follow the standard SCRABBLE® tile set. Word validity is a reference, not an official ruling.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            {SITE_NAME} is not affiliated with Hasbro, Mattel, Zynga, Merriam-Webster or Collins.
          </p>
        </section>

        <section className="mt-14 rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-8 text-center">
          <h2 className="font-display text-2xl font-bold">Questions or feedback?</h2>
          <p className="mt-2 text-sm text-muted-foreground">We answer every email. Ideas for new tools especially welcome.</p>
          <Link to="/contact" className="mt-5 inline-block rounded-full bg-gradient-to-r from-primary to-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
            Get in touch →
          </Link>
        </section>
      </div>
    </div>
  );
}
