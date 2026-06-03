import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        Lists of &quot;highest-scoring Scrabble words&quot; are everywhere online, and most of them are useless.
        They show words like OXYPHENBUTAZONE that have never actually been played in a real game because the
        odds of drawing those tiles in that order with the right board state are essentially zero. This guide is
        different: every word here has been played in tournament Scrabble. Learn them and you&apos;ll see them in
        your own games.
      </p>

      <h2 id="how-scoring-works">A 60-second refresher on Scrabble scoring</h2>
      <p>
        Each tile has a face value (A=1, Z=10, etc.). Premium squares multiply: double-letter (DL), triple-letter
        (TL), double-word (DW), triple-word (TW). Hit two triple-word squares with one word and you&apos;re looking
        at 9x scoring on the whole word. Add a high-value tile on a triple-letter inside that word and the math
        gets silly fast. That&apos;s where the headline numbers come from.
      </p>
      <p>
        Worth keeping in mind: the all-7-tiles bingo bonus adds a flat 50 points. We cover bingo strategy in our{" "}
        <Link to="/blog/scrabble-bingo-strategy">dedicated bingo guide</Link>.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="the-50">The 50 highest-scoring Scrabble words you&apos;ll actually play</h2>

      <h3>Tier 1 — Short, scoring, frequent (memorize first)</h3>
      <ol>
        <li><strong>QI</strong> (11) — the workhorse</li>
        <li><strong>ZA</strong> (11) — slang for pizza</li>
        <li><strong>JO</strong> (9) — sweetheart</li>
        <li><strong>XI</strong> (9) — Greek letter</li>
        <li><strong>OX, AX, EX</strong> (9 each) — X parallel plays</li>
        <li><strong>JEU</strong> (10) — a game (French)</li>
        <li><strong>ZEP</strong> (14) — a long sandwich</li>
        <li><strong>QAT</strong> (12) — East African shrub</li>
        <li><strong>JIB</strong> (12) — triangular sail</li>
        <li><strong>FEZ</strong> (15) — brimless hat</li>
      </ol>

      <h3>Tier 2 — 4 and 5-letter scorers</h3>
      <ol start={11}>
        <li><strong>QUIZ</strong> (22)</li>
        <li><strong>JAZZ</strong> (29)</li>
        <li><strong>FUZE</strong> (16)</li>
        <li><strong>JOKY</strong> (17)</li>
        <li><strong>PIZE</strong> (16)</li>
        <li><strong>ZINC</strong> (15)</li>
        <li><strong>QUAY</strong> (16)</li>
        <li><strong>ZONE</strong> (13)</li>
        <li><strong>JUMPY</strong> (21)</li>
        <li><strong>QUICK</strong> (20)</li>
        <li><strong>JOKER</strong> (16)</li>
        <li><strong>WALTZ</strong> (17)</li>
        <li><strong>BLITZ</strong> (16)</li>
        <li><strong>FJORD</strong> (16)</li>
        <li><strong>HIJAB</strong> (19)</li>
      </ol>

      <h3>Tier 3 — Long premium-square plays</h3>
      <ol start={26}>
        <li><strong>QUIXOTIC</strong> (26)</li>
        <li><strong>JAZZILY</strong> (32)</li>
        <li><strong>MUZJIKS</strong> (29) — Russian peasants, the famous high-scorer</li>
        <li><strong>BEZIQUE</strong> (27) — a card game</li>
        <li><strong>CAZIQUE</strong> (28) — a tropical bird</li>
        <li><strong>QUARTZY</strong> (24)</li>
        <li><strong>SQUEEZE</strong> (25)</li>
        <li><strong>JEZAILS</strong> (25) — long Afghan rifles</li>
        <li><strong>ZYMURGY</strong> (24)</li>
        <li><strong>JUKEBOX</strong> (28)</li>
      </ol>

      <h3>Tier 4 — Bingo-friendly 7-letter words with premium placement</h3>
      <ol start={36}>
        <li><strong>BEZIQUE, CAZIQUE, QUIXOTRY, MUZJIKS</strong> — record-book material when placed across two triple-words.</li>
        <li><strong>JAZZIER, BUZZARD, QUARTET, QUICKER, ZEBROID, KIBITZER, HIJACKS, JOCKEYS, MARQUIS, MARQUEE, BANJOIST, SCHMALTZ</strong> — all bingo-able 7-letter words. With a double-word, each is 80+ points; with two double-words or a triple-word, the math heads north of 110.</li>
      </ol>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="play-them">How to actually play these words</h2>
      <p>
        Knowing the word doesn&apos;t score the word. Three habits separate players who memorize lists from
        players who use them:
      </p>

      <h3>1. Look at the board before the rack</h3>
      <p>
        Beginners scan the rack and look for cool words. Experts scan the board first — they identify the open
        triple-word squares, the unbalanced columns, the danger spots. Then they look at the rack and find the
        word that exploits one specific feature.
      </p>

      <h3>2. Hold the Z and the J one extra turn</h3>
      <p>
        Almost every record-book Z and J play involves holding the tile for a turn while you wait for the right
        board to develop. The cost (one turn of slightly less efficient scoring) is usually 5-8 points; the upside
        is 30-50.
      </p>

      <h3>3. Use pattern-matching tools between games</h3>
      <p>
        Real tournaments forbid solvers at the table — that&apos;s the whole sport. But between games, drop your
        post-mortem racks into a <Link to="/scrabble-solver">Scrabble Solver</Link> and look at the top 3 plays
        you missed. After 20 games of post-mortem review, the patterns become automatic.
      </p>

      <h2 id="defensive">The defensive flip side</h2>
      <p>
        Every high-scoring word you know is also a word your opponent knows. Don&apos;t open triple-word lanes
        unless you have an immediate use for them. Don&apos;t leave double-letter squares next to the Z column.
        Defense rarely shows up on lists but consistently swings 40-point games into 100-point routs. Pair this
        with the <Link to="/blog/2-letter-scrabble-words">2-letter word list</Link> and you&apos;ll lock down the
        board far better than most players at your level.
      </p>

      <h2 id="next">What to study next</h2>
      <p>
        Three pieces compound with this list: <Link to="/blog/words-with-q-no-u">Q-without-U words</Link> for the
        most stress-inducing tile, <Link to="/blog/scrabble-bingo-strategy">bingo stems</Link> for the 50-point
        bonus, and <Link to="/blog/2-letter-scrabble-words">all 107 two-letter words</Link> for parallel-play
        leverage. Together they&apos;re the entire offensive game.
      </p>
    </>
  );
}
