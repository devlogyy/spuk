import { Link } from "react-router-dom";
import { ArrowUpRight, Grid3x3, Puzzle, Search, Shuffle, BookOpen, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

export interface RelatedToolItem {
  to: string;
  title: string;
  desc: string;
  icon?: ComponentType<{ className?: string }>;
}

const DEFAULTS: Record<string, RelatedToolItem> = {
  scrabble: { to: "/scrabble-solver", title: "Scrabble Solver", desc: "Rank every legal play by tile score across TWL & SOWPODS.", icon: Grid3x3 },
  crossword: { to: "/crossword-solver", title: "Crossword Solver", desc: "Match partial patterns like C?T?? to every dictionary answer.", icon: Puzzle },
  finder: { to: "/word-finder", title: "Word Finder", desc: "Unscramble any letters into every valid anagram, sorted and scored.", icon: Search },
  anagram: { to: "/word-finder?q=LISTENING", title: "Anagram Solver", desc: "Full anagram engine — enter your letters and get every combination.", icon: Shuffle },
  hub: { to: "/words", title: "Word Lists Hub", desc: "Browse words by starting letter, ending letter, length or theme.", icon: BookOpen },
  endingIng: { to: "/words/ending-in/ing", title: "Words ending in ING", desc: "The complete list of dictionary words ending in -ING.", icon: Sparkles },
  startingS: { to: "/words/starting-with/s", title: "Words starting with S", desc: "Every dictionary word beginning with the letter S.", icon: Sparkles },
  fiveLetterA: { to: "/words/5-letter-words-with-a", title: "5-letter words with A", desc: "Perfect for Wordle openings and mid-game pattern work.", icon: Sparkles },
};

export type RelatedToolKey = keyof typeof DEFAULTS;

interface Props {
  heading?: string;
  keys?: RelatedToolKey[];
  items?: RelatedToolItem[];
  excludePath?: string;
}

export function RelatedTools({ heading = "Related word tools", keys, items, excludePath }: Props) {
  const list = (items ?? (keys ?? ["scrabble", "crossword", "finder", "hub"]).map((k) => DEFAULTS[k]))
    .filter((i) => i && i.to.split("?")[0] !== excludePath);

  if (list.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="mt-10">
      <h2 id="related-tools-heading" className="mb-4 font-display text-xl font-bold sm:text-2xl">
        {heading}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((item) => {
          const Icon = item.icon ?? Sparkles;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group block rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </div>
              <div className="font-display text-sm font-bold leading-snug">{item.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
