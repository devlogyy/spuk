import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        Crossword solving is a learnable skill. The people who finish the Saturday <em>New York Times</em>{" "}
        crossword in 12 minutes aren&apos;t smarter than you — they have a repeatable method. This guide breaks that
        method into seven steps you can use on your very next puzzle.
      </p>

      <h2 id="method">The 7-step crossword method</h2>

      <h3>Step 1 — Scan for fill-in-the-blanks</h3>
      <p>
        Clues like <em>&quot;___ vu&quot;</em> or <em>&quot;Star ___&quot;</em> are gifts. They have one or two
        possible answers and they instantly lock in crossing letters. Always do them first — they cost nothing and
        unlock the surrounding grid.
      </p>

      <h3>Step 2 — Hit the proper nouns</h3>
      <p>
        Names of countries, capitals, actors, presidents, sports teams and brands rarely have wordplay. If the
        clue is <em>&quot;Java neighbor&quot;</em>, it&apos;s BALI. Knock these out next.
      </p>

      <h3>Step 3 — Identify the abbreviations</h3>
      <p>
        Crossword editors flag abbreviated answers in the clue. <em>&quot;NBA stat&quot;</em> means a 3-letter
        abbreviation. <em>&quot;Doctor, briefly&quot;</em> means MD. A question mark at the end of a clue signals
        wordplay; a comma followed by a qualifier signals abbreviation.
      </p>

      <h3>Step 4 — Look for plural and tense markers</h3>
      <p>
        If the clue ends in <em>-s</em> or <em>-ed</em>, the answer almost always does too. <em>&quot;Looked
        intently&quot;</em> tells you the last two letters are E and D. That&apos;s two free crossing letters.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h3>Step 5 — Decode the wordplay markers</h3>
      <p>
        In American-style puzzles, certain phrases telegraph wordplay:
      </p>
      <ul>
        <li><strong>?</strong> at the end of a clue = pun, double meaning, or category shift.</li>
        <li><strong>&quot;briefly&quot;, &quot;for short&quot;</strong> = abbreviation expected.</li>
        <li><strong>&quot;say&quot;, &quot;e.g.&quot;, &quot;perhaps&quot;</strong> = example of a category.</li>
        <li><strong>&quot;in Paris&quot;, &quot;Spanish&quot;</strong> = foreign-language answer.</li>
      </ul>

      <h3>Step 6 — Pattern-match the partially-filled answers</h3>
      <p>
        Once you have 3-4 letters in any answer slot, the candidate pool shrinks dramatically. This is exactly
        what a <Link to="/crossword-solver">crossword pattern solver</Link> is built for, but you can also do it in
        your head once you&apos;ve practiced. We cover the technique in depth in our{" "}
        <Link to="/blog/crossword-clue-patterns">pattern matching guide</Link>.
      </p>

      <h3>Step 7 — Come back to the hard ones with crossings</h3>
      <p>
        Don&apos;t stare at a clue you can&apos;t solve. Move on. Two answers later you&apos;ll have new crossing
        letters that change the puzzle. Most expert solvers loop through the grid 3-4 times rather than going
        straight through.
      </p>

      <h2 id="clue-types">The five clue types every solver should recognize</h2>

      <h3>1. Straight definition</h3>
      <p><em>&quot;Capital of France&quot;</em> → PARIS. No tricks, no wordplay. Just trivia.</p>

      <h3>2. Fill in the blank</h3>
      <p><em>&quot;___ Vegas&quot;</em> → LAS. Often the easiest clues in the puzzle.</p>

      <h3>3. Synonym</h3>
      <p>
        <em>&quot;Quick&quot;</em> → RAPID, FAST, SPEEDY, BRISK — the number of letters narrows the candidates.
        Build a mental thesaurus by reading widely.
      </p>

      <h3>4. Pun or wordplay</h3>
      <p>
        <em>&quot;Bank withdrawal?&quot;</em> → SILT (the river bank kind). The question mark is your warning
        flag.
      </p>

      <h3>5. Cryptic-style (UK and some indie puzzles)</h3>
      <p>
        <em>&quot;Caught a fish, we hear (6)&quot;</em> → CAUGHT sounds like NETTED. Cryptic clues are their own
        skill; if you&apos;re starting, focus on American-style first.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="vocabulary">Build a crossword vocabulary</h2>
      <p>
        Editors recycle a surprisingly small set of short, vowel-heavy words because they&apos;re the only ones
        that fit common grid patterns. Memorize this list and you&apos;ll fly through fill:
      </p>
      <ul>
        <li><strong>OREO</strong> — the cookie, &quot;Sandwich treat&quot;</li>
        <li><strong>EPEE</strong> — fencing weapon</li>
        <li><strong>ETUI</strong> — small ornamental case</li>
        <li><strong>ASEA</strong> — at sea, on a voyage</li>
        <li><strong>ALOU</strong> — baseball family name</li>
        <li><strong>ESNE</strong> — Anglo-Saxon laborer</li>
        <li><strong>ANOA</strong> — wild ox of the Philippines</li>
        <li><strong>ASTA</strong> — the dog in <em>The Thin Man</em></li>
      </ul>
      <p>
        These &quot;crosswordese&quot; entries make up 5-10% of clues in major newspaper puzzles. They&apos;re
        free points.
      </p>

      <h2 id="speed">How to actually get faster</h2>
      <p>
        Speed is a byproduct of three things:
      </p>
      <ol>
        <li>
          <strong>Solve daily.</strong> The <em>NYT</em> Mini takes 2 minutes; the daily takes 15-30. Consistency
          beats intensity.
        </li>
        <li>
          <strong>Time yourself.</strong> Even a stopwatch app builds urgency. Aim for 10% improvement per month.
        </li>
        <li>
          <strong>Review the answers you didn&apos;t get.</strong> Look up every obscure word at the end. It will
          appear again within a month.
        </li>
      </ol>

      <h2 id="tools">When to use a crossword solver</h2>
      <p>
        For competition or speed-solving leagues, solvers are off-limits — that&apos;s the sport. For learning,
        casual solving and stuck moments, a <Link to="/crossword-solver">pattern-matching crossword solver</Link>{" "}
        is one of the fastest learning tools. Punch in C_A__T and you&apos;ll get all valid candidates ranked by
        commonness.
      </p>

      <h2 id="next">Keep going</h2>
      <p>
        Two follow-up reads compound with this guide: the{" "}
        <Link to="/blog/crossword-clue-patterns">pattern matching deep-dive</Link> for when you&apos;re stuck on
        ambiguous fill, and our <Link to="/blog/build-vocabulary-word-games">vocabulary-building method</Link>{" "}
        which doubles as crossword preparation.
      </p>
    </>
  );
}
