import { motion } from "framer-motion";
import { Copy, Star, Bookmark, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Props {
  word: string;
  score: number;
  definition?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic";
  validIn?: { us: boolean; uk: boolean };
}

const rarityStyles = {
  common: "from-muted to-muted text-muted-foreground",
  uncommon: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
  rare: "from-primary/15 to-gold/10 text-primary",
  epic: "from-gold/30 to-primary/20 text-foreground",
};

export function WordCard({ word, score, definition, rarity = "common", validIn = { us: true, uk: true } }: Props) {
  const [copied, setCopied] = useState(false);
  const [fav, setFav] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(word);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-glow"
    >
      <div className={`absolute inset-0 -z-0 bg-gradient-to-br opacity-60 ${rarityStyles[rarity]}`} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">{word}</h3>
            <span className="text-xs text-muted-foreground">{word.length} letters</span>
          </div>
          {definition && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{definition}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {validIn.us && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">US ✓</span>}
            {validIn.uk && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">UK ✓</span>}
            <span className="rounded-full border border-border bg-background/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider capitalize">{rarity}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-glow">
            <div className="text-center leading-none">
              <div className="font-display text-xl font-black">{score}</div>
              <div className="text-[8px] uppercase tracking-widest opacity-80">pts</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={copy} aria-label="Copy" className="grid h-7 w-7 place-items-center rounded-full bg-background/70 text-muted-foreground transition hover:text-primary">
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => setFav((v) => !v)} aria-label="Favorite" className="grid h-7 w-7 place-items-center rounded-full bg-background/70 text-muted-foreground transition hover:text-gold">
              <Star className={`h-3.5 w-3.5 ${fav ? "fill-gold text-gold" : ""}`} />
            </button>
            <button aria-label="Save" className="grid h-7 w-7 place-items-center rounded-full bg-background/70 text-muted-foreground transition hover:text-primary">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
