import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun, Sparkles, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/scrabble-solver", label: "Scrabble" },
  { to: "/crossword-solver", label: "Crossword" },
  { to: "/word-finder", label: "Word Finder" },
  { to: "/blog", label: "Blog" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem("lexora-theme");
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("lexora-theme", next ? "dark" : "light");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "border-b border-border bg-background shadow-soft md:glass-strong md:border-0" : "bg-transparent"}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold shadow-glow">
            <span className="font-display text-lg font-black text-primary-foreground">L</span>
            <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight sm:text-lg">Lexora</div>
            <div className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">Word Intelligence</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link key={l.to} to={l.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {active && <span className="absolute inset-0 -z-10 rounded-full bg-accent" />}
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button aria-label="Toggle theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-2xl text-muted-foreground transition hover:bg-accent hover:text-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/scrabble-solver" className="hidden rounded-full bg-gradient-to-r from-primary to-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03] md:inline-block">
            Try Solver
          </Link>
          <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-2xl text-muted-foreground transition hover:bg-accent md:hidden">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="overflow-hidden border-t border-border md:hidden">
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-medium hover:bg-accent ${pathname === l.to ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
                  {l.label}
                </Link>
              ))}
            </div>
        </div>
      )}
    </header>
  );
}
