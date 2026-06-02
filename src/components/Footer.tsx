import { Link } from "react-router-dom";
import { Sparkles, Twitter, Github, Instagram } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { useConsent } from "@/hooks/useConsent";

const cols = [
  {
    title: "Tools",
    links: [
      { to: "/scrabble-solver", label: "Scrabble Solver" },
      { to: "/crossword-solver", label: "Crossword Solver" },
      { to: "/word-finder", label: "Word Finder" },
      { to: "/word-finder", label: "Anagram Solver" },
    ],
  },
  {
    title: "Words by length",
    links: [
      { to: "/word-finder", label: "2 letter words" },
      { to: "/word-finder", label: "3 letter words" },
      { to: "/word-finder", label: "4 letter words" },
      { to: "/word-finder", label: "5 letter words" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/blog", label: "Blog" },
      { to: "/blog", label: "Scrabble Strategies" },
      { to: "/blog", label: "Crossword Tips" },
      { to: "/blog", label: "Vocabulary Building" },
    ],
  },
];

export function Footer() {
  const { reopen } = useConsent();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40 pb-24 pt-16 md:pb-12">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot zoneKey="footer" />
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold shadow-glow">
                <span className="font-display text-lg font-black text-primary-foreground">L</span>
              </div>
              <div>
                <div className="font-display text-xl font-bold">Lexora</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Word Intelligence</div>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI-powered word game platform for serious players. Scrabble, Crossword, Anagrams and the world's most beautiful dictionary explorer.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-foreground/80 transition hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lexora. Crafted for word lovers.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button onClick={reopen} className="transition hover:text-primary">
              Cookie settings
            </button>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-gold" /> Powered by AI Word Intelligence
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
