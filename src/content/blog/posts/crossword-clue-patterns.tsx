import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        You&apos;re looking at C_A__T and you have no idea what fits. The clue is no help. The crossings haven&apos;t
        come in. This is the most common stuck moment in crossword solving — and it&apos;s solvable in seconds
        once you understand pattern matching. This guide shows you how.
      </p>

      <h2 id="what-is">What pattern matching actually is</h2>
      <p>
        Pattern matching is the act of using known letters in an answer slot to dramatically narrow the
        candidate pool. With zero letters known, a 7-letter slot has hundreds of thousands of possible English
        words. With 3 letters known in the right positions, that pool shrinks to fewer than 20. With 4 known
        letters, usually 1-3.
      </p>
      <p>
        It&apos;s the closest thing to a superpower in crossword solving. Editors design grids assuming you&apos;ll
        use it. Cryptic constructors fight it. Speed solvers live by it.
      </p>

      <h2 id="cat-example">Decoding C_A__T</h2>
      <p>
        Take our headline pattern: <code>C_A__T</code>. Six letters, C at position 1, A at position 3, T at
        position 6. The blanks are positions 2, 4, 5.
      </p>
      <p>
        Without thinking about the clue at all, what English 6-letter words fit?
      </p>
      <ul>
        <li><strong>COAGUT</strong>? No — not a word.</li>
        <li><strong>CHAFFT</strong>? No.</li>
        <li><strong>CHALET</strong>? Yes — C, H, A, L, E, T. ✓</li>
        <li><strong>CRAVAT</strong>? Yes — C, R, A, V, A, T. ✓</li>
        <li><strong>CABBOT</strong>? No.</li>
        <li><strong>COMBAT</strong>? C-O-M-B-A-T. The A is in position 5, not 3. ✗</li>
      </ul>
      <p>
        After 30 seconds of pattern-only thinking, two candidates: CHALET, CRAVAT. Now read the clue: <em>&quot;Ski
        getaway&quot;</em>? CHALET. <em>&quot;Knotted neckwear&quot;</em>? CRAVAT. The clue resolves which
        candidate fits. Most stuck moments collapse this fast once you stop trying to brute-force the clue alone.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="position-frequency">Letter frequency by position</h2>
      <p>
        Some letters appear far more often at specific positions in English words. Memorizing the rough
        distribution gives you better intuitive guesses:
      </p>
      <ul>
        <li><strong>Position 1 (word start):</strong> S, C, P, A, T, B most common.</li>
        <li><strong>Position 2:</strong> H, O, E, R, A — H is wildly over-represented because of SH, CH, TH, WH.</li>
        <li><strong>Position last:</strong> E, S, D, N, T — E is the runaway #1.</li>
        <li><strong>Position second-to-last:</strong> N, T, R, E (think -ING, -ENT, -ER, -ATE endings).</li>
      </ul>
      <p>
        Combine these with the clue&apos;s tense and plural markers and you can often guess the last two letters
        before the crossings come in.
      </p>

      <h2 id="suffixes">High-value suffix patterns</h2>
      <p>
        English is suffix-heavy. Recognizing common endings cuts the candidate space in half almost instantly.
      </p>
      <ul>
        <li><strong>-ING</strong> — present participle, ~3% of all words in crosswords.</li>
        <li><strong>-ED</strong> — past tense.</li>
        <li><strong>-ER, -OR</strong> — agent (one who does).</li>
        <li><strong>-EST</strong> — superlative.</li>
        <li><strong>-LY</strong> — adverb.</li>
        <li><strong>-TION, -SION</strong> — abstract noun.</li>
        <li><strong>-NESS, -MENT, -ITY</strong> — abstract noun.</li>
        <li><strong>-OUS, -IVE, -ABLE, -IBLE</strong> — adjective.</li>
      </ul>
      <p>
        Spot one of these at the end of a slot and you&apos;ve essentially solved half the answer.
      </p>

      <h2 id="prefixes">Common prefix patterns</h2>
      <ul>
        <li><strong>UN-, RE-, IN-, DIS-, PRE-, MIS-</strong> — most common 2-3 letter prefixes.</li>
        <li><strong>OVER-, UNDER-, INTER-, TRANS-</strong> — common longer prefixes that lock in 4-5 letters at once.</li>
      </ul>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="solver-workflow">When (and how) to use a crossword solver</h2>
      <p>
        For a daily puzzle you&apos;re trying to learn from, type the pattern into a{" "}
        <Link to="/crossword-solver">crossword pattern solver</Link> using underscores or question marks for
        unknown letters. Lexora&apos;s solver returns candidates ranked by frequency — the more common words come
        first, which is usually what you want.
      </p>
      <p>
        Then close the solver and finish from your own head. The point is to learn the pattern, not to fill the
        grid for you. After a few weeks of this, you&apos;ll start seeing candidates without the tool.
      </p>

      <h2 id="practice-drill">A daily 10-minute practice drill</h2>
      <ol>
        <li>Open any partly-filled crossword (the daily NYT, USA Today, or our puzzle archive).</li>
        <li>Pick three unsolved slots that each have at least 2 crossing letters in.</li>
        <li>Ignore the clues entirely. Generate candidate words just from the pattern.</li>
        <li>Now read the clue and pick the candidate that fits.</li>
        <li>Track which patterns gave you trouble. Drill those letter positions tomorrow.</li>
      </ol>
      <p>
        Ten minutes a day. Within a month your average solve time will drop noticeably.
      </p>

      <h2 id="related">Where this fits in the bigger picture</h2>
      <p>
        Pattern matching is one of three pillars of fast crossword solving. The others are vocabulary (covered in
        our <Link to="/blog/build-vocabulary-word-games">vocabulary guide</Link>) and clue decoding (covered in our{" "}
        <Link to="/blog/how-to-solve-crossword-clues">7-step solving method</Link>). The same pattern-matching
        skill underpins <Link to="/blog/words-from-letters">finding words from a set of letters</Link> — it&apos;s
        the same mental engine, applied to a different input.
      </p>
      <p>
        Open the <Link to="/crossword-solver">Crossword Solver</Link>, try the C_A__T pattern, and notice how the
        candidates organize themselves. That mental sort is the skill.
      </p>
    </>
  );
}
