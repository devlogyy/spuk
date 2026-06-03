import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        You have seven random letters and need to find every word they can make. Maybe you&apos;re stuck on a
        Scrabble rack, or trying to crack an anagram puzzle, or solving a Words With Friends turn. The good news
        is that this is a systematic problem with a repeatable method. The faster you can run it, the better you
        play every word game ever invented.
      </p>

      <h2 id="manual-method">The manual method (do this first)</h2>
      <p>
        Before you reach for a tool, run the human algorithm. It builds the pattern recognition you need to play
        without aids.
      </p>

      <h3>Step 1 — Sort your letters alphabetically</h3>
      <p>
        Take your rack — say <code>R A I N E S T</code> — and write it as A E I N R S T. This single act exposes
        patterns instantly. You&apos;ll see your vowel/consonant balance and any duplicates jump out.
      </p>

      <h3>Step 2 — Count vowels vs consonants</h3>
      <p>
        Three vowels (A, E, I) and four consonants (N, R, S, T). That&apos;s a balanced rack — almost guaranteed
        to make a 7-letter word. If you have 5 vowels and 2 consonants, you have a problem to manage; if you have
        6 consonants and one vowel, you have a different problem. Both call for different strategies.
      </p>

      <h3>Step 3 — Look for common suffix endings</h3>
      <p>
        Suffixes are huge accelerators. With A E I N R S T, does it end in -ING? No I-N-G together. -ED? -ER? -EST?
        It does end in -EST. So now you&apos;re building around _ _ _ _ E S T using A, I, N, R. That&apos;s a
        much smaller problem: <strong>RAINEST</strong>? Not a word. <strong>STAINER</strong>? Yes. <strong>RETAINS</strong>?
        Yes. <strong>RATINES</strong>? Yes. <strong>NASTIER</strong>? Yes. <strong>ANTSIER</strong>? Yes (in TWL).
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h3>Step 4 — Pivot on common stems</h3>
      <p>
        Skilled players memorize roughly two dozen 6-letter &quot;stems&quot; that combine with many letters to
        form 7-letter bingos. The most famous are SATIRE, RETINA, TISANE, SENIOR, ROUTES, TONERS. If you have a 6-letter
        stem on your rack plus one wildcard letter, you almost always have a bingo. We cover these in depth in our{" "}
        <Link to="/blog/scrabble-bingo-strategy">Scrabble bingo strategy guide</Link>.
      </p>

      <h3>Step 5 — Build shorter words inside</h3>
      <p>
        If you don&apos;t see a 7-letter word, scan for 5 and 6-letter words. From A E I N R S T:
      </p>
      <ul>
        <li>6-letter: SATIRE, STRAIN, INSTAR, RESIST (with the extras), TRAINS, SAINTS</li>
        <li>5-letter: TRAIN, STAIN, SAINT, RAINS, SATIN, TARNS, RIANT, ANTRE</li>
        <li>4-letter: RAIN, RANI, RAIN, ANTS, TANS, RATS</li>
      </ul>
      <p>
        This stockpile gives you backup plays when the 7-letter bingo doesn&apos;t fit the board.
      </p>

      <h2 id="vowel-heavy">When you have too many vowels</h2>
      <p>
        A rack like A E I O U N R is brutal-looking but solvable. Memorize the vowel-heavy short words:
      </p>
      <ul>
        <li>AE, AI, AA, OE, OI — 2-letter vowel pairs (covered in our{" "}
          <Link to="/blog/2-letter-scrabble-words">2-letter words guide</Link>)</li>
        <li>AURA, AREA, IDEA, OBOE, AGUE, ANOA</li>
        <li>OUREBI, AALII, NAOI, JIAO — the truly esoteric vowel dumps</li>
      </ul>

      <h2 id="consonant-heavy">When you have too many consonants</h2>
      <p>
        Consonant clusters are actually friendlier than you&apos;d think because of English digraphs (CH, SH, TH,
        PH, WH, GH, NG, NK, ND, NT). And these words help:
      </p>
      <ul>
        <li>HM, MM — yes, both valid</li>
        <li>CWM, CRWTH — Welsh borrowings with no normal vowels</li>
        <li>SH, SHH, PFFT, PSST — onomatopoeic exits</li>
        <li>NTH, BRR, BRRR — exclamations</li>
      </ul>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="word-finder-tool">When and how to use a word finder tool</h2>
      <p>
        For competitive play, external tools are forbidden. For everything else — learning, casual play, getting
        unstuck — a word finder is the fastest way to expand your visible vocabulary.
      </p>
      <p>
        Open the <Link to="/word-finder">Lexora Word Finder</Link>, enter your letters, and the tool returns every
        valid word grouped by length. Use it as a study aid: after each casual game, drop your unused racks in and
        review what you missed. The patterns repeat. Within 50 games you&apos;ll find most of those words yourself.
      </p>

      <h2 id="for-puzzles">For anagram puzzles specifically</h2>
      <p>
        Anagram puzzles usually demand a single target word that uses all the letters. The fastest method:
      </p>
      <ol>
        <li>Sort alphabetically (same first step).</li>
        <li>Look for a suffix that fits the letter pool. -ING, -ED, -ER, -TION are the big four.</li>
        <li>Look for a prefix that fits. RE-, UN-, OVER-, MIS- are common.</li>
        <li>If a prefix and suffix both fit, the middle is usually a 3-4 letter root you can spot fast.</li>
      </ol>

      <h2 id="how-it-improves">How this skill transfers</h2>
      <p>
        The mental operation behind &quot;find words from these letters&quot; is the same one behind{" "}
        <Link to="/blog/crossword-clue-patterns">crossword pattern matching</Link>,{" "}
        <Link to="/blog/scrabble-bingo-strategy">spotting Scrabble bingos</Link>, and even solving{" "}
        <Link to="/blog/how-to-solve-crossword-clues">cryptic clues</Link>. Every word game rewards the same
        skill: searching a constrained letter pool for valid English structures. Build it once, use it everywhere.
      </p>
      <p>
        Practice tonight. Pick 7 random letters from a Scrabble bag, set a 3-minute timer, write down every word
        you find, then run the rack through the <Link to="/word-finder">Word Finder</Link> and see how many you
        missed. Do this for two weeks and your rating will move.
      </p>
    </>
  );
}
