import { Link, useLocation } from "react-router-dom";
import { Home, Grid3x3, Puzzle, Search, BookOpen } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scrabble", label: "Scrabble", icon: Grid3x3 },
  { to: "/word-finder", label: "Find", icon: Search, primary: true },
  { to: "/crossword-solver", label: "Cross", icon: Puzzle },
  { to: "/blog", label: "Blog", icon: BookOpen },
];

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-3xl border border-border bg-card px-2 pb-2 pt-3 shadow-soft">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <Link key={to} to={to} aria-label={label} aria-current={active ? "page" : undefined}
                className="-mt-7 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-glow ring-4 ring-background transition active:scale-95">
                <Icon className="h-6 w-6" />
              </Link>
            );
          }
          return (
            <Link key={to} to={to} aria-current={active ? "page" : undefined}
              className={`flex min-w-14 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-[10px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
