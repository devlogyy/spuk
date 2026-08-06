import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CookieConsent } from "@/components/CookieConsent";
import { WebMcpTools } from "@/components/WebMcpTools";
import { lazyRoute } from "@/lib/lazy-route";

const ScrabbleSolver = lazyRoute(() => import("@/pages/ScrabbleSolver"));
const CrosswordSolver = lazyRoute(() => import("@/pages/CrosswordSolver"));
const WordFinder = lazyRoute(() => import("@/pages/WordFinder"));
const Blog = lazyRoute(() => import("@/pages/Blog"));
const BlogPost = lazyRoute(() => import("@/pages/BlogPost"));
const Auth = lazyRoute(() => import("@/pages/Auth"));
const Admin = lazyRoute(() => import("@/pages/Admin"));
const NotFound = lazyRoute(() => import("@/pages/NotFound"));
const WordsHub = lazyRoute(() => import("@/pages/WordsHub"));
const WordsStartingWith = lazyRoute(() => import("@/pages/programmatic/WordsStartingWith"));
const WordsEndingIn = lazyRoute(() => import("@/pages/programmatic/WordsEndingIn"));
const NLetterWordsWith = lazyRoute(() => import("@/pages/programmatic/NLetterWordsWith"));
const Unscramble = lazyRoute(() => import("@/pages/programmatic/Unscramble"));
const About = lazyRoute(() => import("@/pages/About"));
const Contact = lazyRoute(() => import("@/pages/Contact"));
const Privacy = lazyRoute(() => import("@/pages/Privacy"));
const Terms = lazyRoute(() => import("@/pages/Terms"));

/**
 * Resolve the chunk for the current URL *before* hydration so the prerendered
 * markup is replaced by the real page in one commit — no placeholder frame,
 * no layout shift.
 */
export function preloadRouteFor(pathname: string): Promise<unknown> {
  const p = pathname.replace(/\/+$/, "") || "/";
  const map: Array<[RegExp, { preload: () => Promise<void> }]> = [
    [/^\/scrabble-solver$/, ScrabbleSolver],
    [/^\/crossword-solver$/, CrosswordSolver],
    [/^\/word-finder$/, WordFinder],
    [/^\/blog$/, Blog],
    [/^\/blog\/.+/, BlogPost],
    [/^\/words$/, WordsHub],
    [/^\/words\/starting-with\/.+/, WordsStartingWith],
    [/^\/words\/ending-in\/.+/, WordsEndingIn],
    [/^\/words\/.+/, NLetterWordsWith],
    [/^\/unscramble\/.+/, Unscramble],
    [/^\/about$/, About],
    [/^\/contact$/, Contact],
    [/^\/privacy$/, Privacy],
    [/^\/terms$/, Terms],
    [/^\/auth$/, Auth],
    [/^\/admin$/, Admin],
  ];
  const hit = map.find(([re]) => re.test(p));
  return hit ? hit[1].preload() : Promise.resolve();
}

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" aria-label="Loading page" />;
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AnalyticsTracker />
      <WebMcpTools />
      <Navbar />
      <main className="pb-24 md:pb-0">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scrabble-solver" element={<ScrabbleSolver />} />
            <Route path="/crossword-solver" element={<CrosswordSolver />} />
            <Route path="/word-finder" element={<WordFinder />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/words" element={<WordsHub />} />
            <Route path="/words/starting-with/:letter" element={<WordsStartingWith />} />
            <Route path="/words/ending-in/:letter" element={<WordsEndingIn />} />
            <Route path="/words/:slug" element={<NLetterWordsWith />} />
            <Route path="/unscramble/:letters" element={<Unscramble />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
      <CookieConsent />
    </div>
  );
}
