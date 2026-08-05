import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CookieConsent } from "@/components/CookieConsent";

const ScrabbleSolver = lazy(() => import("@/pages/ScrabbleSolver"));
const CrosswordSolver = lazy(() => import("@/pages/CrosswordSolver"));
const WordFinder = lazy(() => import("@/pages/WordFinder"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Auth = lazy(() => import("@/pages/Auth"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const WordsHub = lazy(() => import("@/pages/WordsHub"));
const WordsStartingWith = lazy(() => import("@/pages/programmatic/WordsStartingWith"));
const WordsEndingIn = lazy(() => import("@/pages/programmatic/WordsEndingIn"));
const NLetterWordsWith = lazy(() => import("@/pages/programmatic/NLetterWordsWith"));
const Unscramble = lazy(() => import("@/pages/programmatic/Unscramble"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function RouteFallback() {
  return <div className="min-h-[60vh]" aria-busy="true" aria-label="Loading page" />;
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AnalyticsTracker />
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
