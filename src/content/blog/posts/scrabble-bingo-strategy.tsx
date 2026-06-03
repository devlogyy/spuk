import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        A bingo in Scrabble — playing all seven of your tiles in one turn — adds a flat 50-point bonus on top of
        the word&apos;s normal score. Beginners get one every few games. Tournament players average 1.5 to 2 per
        game. That gap, more than any other single factor, is what separates a 250-point game from a 450-point
        game. This guide shows you how to close it.
      </p>

      <h2 id="why-bingos">Why bingos dominate Scrabble scoring</h2>
      <p>
        A typical good play scores 20-35 points. A typical bingo scores 65-90. Get two bingos in a game and
        you&apos;ve already added 130-180 points your opponent didn&apos;t. The math is brutal: if your opponent
        bingos twice and you bingo zero, you basically can&apos;t win, regardless of how clever your individual
        plays are.
      </p>
      <p>
        Bingos also burn through your rack faster, getting you to fresh draws sooner. They are the single
        highest-leverage activity in the game.
      </p>

      <h2 id="probability">The probability fundamentals</h2>
      <p>
        Not every rack can bingo. The hard truth is that most racks have only a 20-30% chance of containing a
        playable 7-letter word at any given moment. The skill is two-fold:
      </p>
      <ol>
        <li>Recognize when your rack has bingo potential.</li>
        <li>Manage your rack <em>between</em> turns so future racks have higher bingo potential.</li>
      </ol>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="stems">Stem theory: the 25 stems that win games</h2>
      <p>
        A &quot;stem&quot; is a 6-letter combination of letters that combines with many different 7th letters to
        form valid 7-letter words. Memorizing the top stems and the letters they hook with is the most
        cost-effective study in Scrabble.
      </p>

      <h3>The big four stems</h3>
      <ul>
        <li>
          <strong>SATIRE</strong> (A, E, I, R, S, T) — combines with C, D, F, G, H, K, L, M, N, P, R, U, V, W, Y
          to form ASTERIA, READIEST, FAIREST, GAITERS, HASTIER, KEISTRA, SALTIER, MAESTRI… you get the idea.
        </li>
        <li>
          <strong>RETINA</strong> (A, E, I, N, R, T) — same letters as SATIRE minus the S. Combines with B, C, D,
          E, G, H, K, L, M, P, R, S, T, U, V, Z.
        </li>
        <li>
          <strong>TISANE</strong> (A, E, I, N, S, T) — combines with B, C, D, G, H, K, L, M, N, P, R, S, T, X.
        </li>
        <li>
          <strong>SENIOR</strong> (E, I, N, O, R, S) — combines with A, C, D, E, G, K, M, N, P, S, T, V.
        </li>
      </ul>

      <h3>Why these four matter so much</h3>
      <p>
        They share the most common Scrabble letters: A, E, I, N, R, S, T. These are the letters you draw most
        often. If you can hold any subset of A E I N R S T on your rack between turns, you&apos;re fishing for a
        bingo on the next draw.
      </p>

      <h3>Next-tier stems worth memorizing</h3>
      <ul>
        <li><strong>ROUTES</strong> — E, O, R, S, T, U</li>
        <li><strong>TONERS</strong> — E, N, O, R, S, T</li>
        <li><strong>ORATES</strong> — A, E, O, R, S, T</li>
        <li><strong>SAINER</strong> — A, E, I, N, R, S</li>
        <li><strong>NASTIE</strong> — A, E, I, N, S, T</li>
      </ul>

      <h2 id="rack-management">Rack management: the actual skill</h2>
      <p>
        Knowing the stems doesn&apos;t help if your rack is full of garbage. Rack management is the act of choosing
        plays that leave behind a balanced, bingo-friendly leave for the next turn. Three rules:
      </p>

      <h3>Rule 1 — Track vowel/consonant balance</h3>
      <p>
        Ideal leave: 3 vowels, 3 consonants, plus one tile that will become the seventh. Aim to never end a turn
        with all vowels or all consonants in hand.
      </p>

      <h3>Rule 2 — Don&apos;t waste your S or blank for short money</h3>
      <p>
        The S and the blank are the two most valuable tiles in the game because they enable bingos. Don&apos;t
        play an S to gain 8 points when holding it for one more turn could gain you 50.
      </p>

      <h3>Rule 3 — Dump duplicates and high-value rocks</h3>
      <p>
        Two of the same letter (especially two I&apos;s, two U&apos;s) chokes your bingo potential. So does sitting
        on a Q, J, X or Z when you can&apos;t score them well — they&apos;re &quot;rocks&quot; that block bingo
        formation. Play them for whatever you can get and refresh.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="seeing-bingos">How to actually see a bingo when it&apos;s there</h2>
      <p>
        Most players have bingo-able racks more often than they realize but fail to spot them. Two techniques:
      </p>

      <h3>Anagram chunking</h3>
      <p>
        Group your tiles into 2- and 3-letter chunks: -TION, -ING, RE-, UN-, ST-. Your brain processes chunks
        much faster than individual letters. The same skill we describe in our{" "}
        <Link to="/blog/words-from-letters">words from letters guide</Link>.
      </p>

      <h3>Suffix scan</h3>
      <p>
        Before anything else, check if your rack contains the letters for -ING, -ED, -ER, -EST or -IES. If yes,
        you&apos;re halfway to a bingo and just need to find the root.
      </p>

      <h2 id="board-placement">Where on the board to play your bingo</h2>
      <p>
        Even a 65-point bingo can be made into a 90-point bingo with better placement. Look for:
      </p>
      <ul>
        <li>Lanes through double-word squares (especially when the row is open both ways).</li>
        <li>Hooks into existing words (a bingo that adds an S to make an existing word plural gets you parallel scoring).</li>
        <li>Avoiding triple-letter squares that you&apos;d hand to your opponent next turn for a big return play.</li>
      </ul>

      <h2 id="practice">A 30-day bingo drill</h2>
      <ol>
        <li>Each day, draw 7 random tiles from a Scrabble bag.</li>
        <li>Set a 90-second timer. Write down every 7-letter word you can find.</li>
        <li>Drop the rack into the <Link to="/scrabble-solver">Scrabble Solver</Link> and see what you missed.</li>
        <li>For any 7-letter word you missed, write it down along with the stem (the 6 letters that combined with the 7th).</li>
        <li>Review the stem list weekly.</li>
      </ol>
      <p>
        Players who do this drill for 30 days consistently report adding 0.5-1 bingo per game to their average.
        That&apos;s 25-50 points per game, every game, forever.
      </p>

      <h2 id="defense">The defensive flip side</h2>
      <p>
        Don&apos;t make it easy for your opponent to bingo. Avoid leaving open lanes through double-word squares
        when you don&apos;t need them. When you suspect your opponent is fishing (held tiles, low-scoring plays),
        consider blocking. We touch on this in our{" "}
        <Link to="/blog/high-scoring-scrabble-words">high-scoring words guide</Link> — defense is half the game.
      </p>

      <h2 id="next">Compound this with the rest of the stack</h2>
      <p>
        Bingos plus <Link to="/blog/2-letter-scrabble-words">2-letter words</Link> plus{" "}
        <Link to="/blog/words-with-q-no-u">Q-without-U plays</Link> are the entire Scrabble offensive game. Master
        them in that order — bingos first because they have the largest impact per point of study.
      </p>
    </>
  );
}
