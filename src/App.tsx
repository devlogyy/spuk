import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import ScrabbleSolver from "@/pages/ScrabbleSolver";
import CrosswordSolver from "@/pages/CrosswordSolver";
import WordFinder from "@/pages/WordFinder";
import Blog from "@/pages/Blog";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import { useAnalytics } from "@/hooks/useAnalytics";

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AnalyticsTracker />
      <Navbar />
      <main className="pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scrabble-solver" element={<ScrabbleSolver />} />
          <Route path="/crossword-solver" element={<CrosswordSolver />} />
          <Route path="/word-finder" element={<WordFinder />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
