import { Link, useLocation } from "react-router-dom";
import { Home, Grid3x3, Puzzle, Search, BookOpen } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scrabble-solver", label: "Scrabble", icon: Grid3x3 },
  { to: "/word-finder", label: "Find", icon: Search, primary: true },
  { to: "/crossword-solver", label: "Cross", icon: Puzzle },
  { to: "/blog", label: "Blog", icon: BookOpen },
];

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <div className="glass-strong mx-auto flex max-w-md items-end justify-around rounded-3xl px-2 py-2 shadow-soft">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <Link key={to} to={to} aria-label={label}
                className="-mt-6 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-glow transition active:scale-95">
                <Icon className="h-6 w-6" />
              </Link>
            );
          }
          return (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
