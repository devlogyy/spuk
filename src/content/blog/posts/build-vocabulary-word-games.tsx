import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        Vocabulary is the single best predictor of reading comprehension, writing quality, and verbal fluency.
        It&apos;s also the most miserable thing to study by flashcard. The trick is to learn words in context,
        repeatedly, in environments where you actively want to remember them. That&apos;s exactly what word games
        do — and used deliberately, they&apos;ll build a 10,000-word working vocabulary faster than any app on
        your phone.
      </p>

      <h2 id="why-games-work">Why games beat flashcards</h2>
      <p>
        Three reasons rooted in cognitive science:
      </p>
      <ol>
        <li>
          <strong>Active recall.</strong> Word games force you to <em>produce</em> a word from a rack, clue or
          letter pool. Production is several times more effective than passive recognition (the recognition you
          get from reading a flashcard).
        </li>
        <li>
          <strong>Spaced repetition by accident.</strong> The most useful words in English are also the most
          common in word games. You&apos;ll encounter ETUI, OREO, AERIE and AURA in crosswords every week —
          spaced repetition without setting any reminders.
        </li>
        <li>
          <strong>Emotional encoding.</strong> Playing a Q-without-U word for 36 points feels good. That dopamine
          locks the word in. A flashcard saying &quot;QAT: leaves chewed as a stimulant&quot; does not.
        </li>
      </ol>

      <h2 id="the-method">The 30-minute daily method</h2>
      <p>
        The structure I&apos;ve coached writers and ESL learners through:
      </p>

      <h3>Minutes 1-10: Crossword</h3>
      <p>
        Do one daily crossword (the NYT Mini is fine to start; graduate to the daily within 2 weeks). Crosswords
        force you to recognize definitions and pull from a wide vocabulary. Use our{" "}
        <Link to="/blog/how-to-solve-crossword-clues">7-step solving method</Link> to keep you moving.
      </p>

      <h3>Minutes 11-20: Scrabble or Word Finder drill</h3>
      <p>
        Either play one casual Scrabble game (vs a friend or a bot) or do a Word Finder drill: 5 random racks of
        7 letters, find every word you can in 90 seconds each. Both build the &quot;letter-pool to word&quot;
        pattern recognition that compounds with crossword skills.
      </p>

      <h3>Minutes 21-30: Vocabulary capture</h3>
      <p>
        Write down 5 new words you encountered today, with a one-sentence definition and one example. After 30
        days you&apos;ll have 150 captured words. After a year, 1,825. After 5 years, 9,125 — and that&apos;s with
        zero formal vocabulary study, just word-game time.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="capture">The vocabulary capture sheet</h2>
      <p>
        A simple template that works in any notebook or notes app:
      </p>
      <pre>{`Date | Word | Source | One-line definition | Sentence using the word`}</pre>
      <p>
        The &quot;sentence using the word&quot; is the key. Writing a sentence forces semantic processing — the
        deep encoding that actually moves a word from passive to active vocabulary.
      </p>

      <h2 id="word-categories">The four word categories to track</h2>
      <p>
        Don&apos;t treat every word equally. Sort them as you capture:
      </p>

      <h3>Category A — Active words (use daily)</h3>
      <p>Common high-utility words you&apos;ll use in conversation and writing.</p>

      <h3>Category B — Passive recognition (don&apos;t use, but understand)</h3>
      <p>Words you should recognize in reading but don&apos;t need to produce.</p>

      <h3>Category C — Game-only (Scrabble/crossword fill)</h3>
      <p>
        Words like ETUI, ANOA, ESNE, QAT — useful in puzzles, rare outside them. Don&apos;t overinvest in these;
        they&apos;ll stick from repeat exposure anyway.
      </p>

      <h3>Category D — Worth a deeper look</h3>
      <p>
        Words whose etymology or usage you find genuinely interesting. These become anchor words your brain uses
        to connect related vocabulary.
      </p>

      <h2 id="reading">Pair word games with active reading</h2>
      <p>
        Word games are best paired with reading. Crosswords expose definitions; books expose context. Together,
        they produce vocabulary that&apos;s both wide and deep. Three suggestions:
      </p>
      <ul>
        <li>Read one essay a day (Aeon, The Atlantic, Longreads) and capture 2-3 new words from it.</li>
        <li>Use the dictionary aggressively — every unknown word, look it up immediately. The interrupt cost is low; the retention gain is high.</li>
        <li>Re-read essays a week later. Words you encountered once and forgot will hit harder the second time.</li>
      </ul>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="word-roots">Word roots: the multiplier</h2>
      <p>
        Learning Latin and Greek roots is the single highest-leverage vocabulary investment. Each root unlocks
        dozens of words. A starter list:
      </p>
      <ul>
        <li><strong>BENE-</strong> (good): benevolent, benefit, beneficial, benediction</li>
        <li><strong>MAL-</strong> (bad): malevolent, malicious, malady, malfunction</li>
        <li><strong>SCRIB-/SCRIPT-</strong> (write): inscribe, manuscript, prescription, transcript</li>
        <li><strong>SPEC-/SPECT-</strong> (see): inspect, retrospect, prospect, spectacle</li>
        <li><strong>VOC-/VOK-</strong> (call): vocation, evoke, provoke, revoke, convocation</li>
      </ul>
      <p>
        Twenty roots cover roughly 10,000 English words. Drill them once and your crossword-clue intuition will
        sharpen noticeably.
      </p>

      <h2 id="game-specific">Game-specific vocabulary boosters</h2>

      <h3>For Scrabble players</h3>
      <p>
        Start with the <Link to="/blog/2-letter-scrabble-words">107 two-letter words</Link> and the{" "}
        <Link to="/blog/scrabble-bingo-strategy">top bingo stems</Link>. Both are evergreen and high-leverage.
      </p>

      <h3>For crossword solvers</h3>
      <p>
        Learn the &quot;crosswordese&quot; list — those vowel-heavy short words that appear constantly. Build
        comfort with <Link to="/blog/crossword-clue-patterns">pattern matching</Link> so unfamiliar words become
        guessable from crossings alone.
      </p>

      <h3>For everyone</h3>
      <p>
        Use <Link to="/word-finder">the Word Finder</Link> not just to solve but to discover. Type in 7 random
        letters and look at every valid word the tool produces. You&apos;ll meet 20-30 unfamiliar words per
        session.
      </p>

      <h2 id="measurement">How to measure progress</h2>
      <p>
        Standardized vocabulary tests (Test Your Vocab, Vocabulary.com&apos;s test) give you a rough number every
        few months. More usefully:
      </p>
      <ul>
        <li>Track your crossword solve times — they&apos;ll drop as your vocabulary grows.</li>
        <li>Track your Scrabble win rate against the same opponents — bigger vocabulary = more bingos = more wins.</li>
        <li>Notice when you reach for words in conversation that you wouldn&apos;t have known six months ago. That&apos;s the win condition.</li>
      </ul>

      <h2 id="closing">Stick with it</h2>
      <p>
        Ten thousand words isn&apos;t a 30-day project — it&apos;s a 3-year one. But word games turn the work into
        play, which is the only way most people sustain that kind of effort. Start with 30 minutes a day, capture
        what you encounter, and let the puzzles do the heavy lifting. Three years from now you&apos;ll be a
        different reader, writer and player.
      </p>
    </>
  );
}
