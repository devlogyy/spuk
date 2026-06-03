import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        If you study one thing in Scrabble, study the two-letter words. They look trivial — 107 entries in TWL, 127
        in SOWPODS — but they are the entire reason high-level games hit 400+ points. Every parallel play, every
        endgame squeeze, every clutch use of the Q, J or Z runs through them. Memorize this list and you will play
        a different game by next weekend.
      </p>

      <h2 id="why-matter">Why two-letter words decide games</h2>
      <p>
        Look at a finished tournament game. Count the words longer than 6 letters. There are usually only 6-10 of
        them. Then count the words shorter than 4 letters. There are 30-50. The board is built almost entirely out
        of short words, and the two-letter words are the glue that lets you stack long ones in parallel.
      </p>
      <p>
        A parallel play is when you lay your word next to an existing word, forming multiple short crosswords with
        every tile. Each of those crosswords has to be a real word — and almost all of them end up being 2-letter
        words. If you don&apos;t know the list, you simply can&apos;t see the plays.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="full-list">The complete TWL list, grouped by first letter</h2>
      <p>
        I&apos;ve grouped them by starting letter so you can drill alphabetically. The asterisked entries are
        SOWPODS-only and won&apos;t score in North American tournament play.
      </p>

      <h3>A (20 words)</h3>
      <p>AA, AB, AD, AE, AG, AH, AI, AL, AM, AN, AR, AS, AT, AW, AX, AY, BA (also under B), ZA (under Z)</p>

      <h3>B</h3>
      <p>BA, BE, BI, BO, BY</p>

      <h3>D</h3>
      <p>DE, DO</p>

      <h3>E</h3>
      <p>ED, EF, EH, EL, EM, EN, ER, ES, ET, EW (recent addition), EX</p>

      <h3>F</h3>
      <p>FA, FE</p>

      <h3>G</h3>
      <p>GO</p>

      <h3>H</h3>
      <p>HA, HE, HI, HM, HO</p>

      <h3>I</h3>
      <p>ID, IF, IN, IS, IT</p>

      <h3>J</h3>
      <p>JO</p>

      <h3>K</h3>
      <p>KA, KI</p>

      <h3>L</h3>
      <p>LA, LI, LO</p>

      <h3>M</h3>
      <p>MA, ME, MI, MM, MO, MU, MY</p>

      <h3>N</h3>
      <p>NA, NE, NO, NU</p>

      <h3>O</h3>
      <p>OD, OE, OF, OH, OI, OK, OM, ON, OP, OR, OS, OW, OX, OY</p>

      <h3>P</h3>
      <p>PA, PE, PI, PO</p>

      <h3>Q</h3>
      <p>QI</p>

      <h3>R</h3>
      <p>RE</p>

      <h3>S</h3>
      <p>SH, SI, SO</p>

      <h3>T</h3>
      <p>TA, TI, TO</p>

      <h3>U</h3>
      <p>UH, UM, UN, UP, US, UT</p>

      <h3>W</h3>
      <p>WE, WO</p>

      <h3>X</h3>
      <p>XI, XU</p>

      <h3>Y</h3>
      <p>YA, YE, YO</p>

      <h3>Z</h3>
      <p>ZA</p>

      <h2 id="memorization">How to actually memorize 107 words</h2>
      <p>
        Brute-force flashcards work, but slowly. The faster approach is to drill them in the context of a useful
        letter. Two methods I&apos;ve coached players through:
      </p>

      <h3>Method 1 — Hook drilling</h3>
      <p>
        Take a common letter (say A). Write it in the center of a page. Around it, write every 2-letter word that
        starts or ends with A: AA, AB, AD, AE, AG, AH, AI, AL, AM, AN, AR, AS, AT, AW, AX, AY, BA, FA, HA, KA, LA,
        MA, NA, PA, TA, YA, ZA. That&apos;s 27 entries built around one letter. Repeat for E, I, O, U and you&apos;ve
        covered most of the list.
      </p>

      <h3>Method 2 — Vowel pairs</h3>
      <p>
        Vowel + vowel combinations are non-obvious and high-value: AA, AE, AI, OE, OI. Drilling these 5 alone will
        save you points in every game you play.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="high-value-twos">The 10 highest-value 2-letter words</h2>
      <p>
        Not all 2-letter words are created equal. These are the ones that score the most when paired with premium
        squares or rare tiles:
      </p>
      <ol>
        <li><strong>QI</strong> — 11 points base, lets you play the Q without a U.</li>
        <li><strong>ZA</strong> — 11 points base (slang for pizza), great Z dump.</li>
        <li><strong>XI</strong> — 9 points base, Greek letter.</li>
        <li><strong>XU</strong> — 9 points base, a Vietnamese monetary unit.</li>
        <li><strong>JO</strong> — 9 points base, archaic word for sweetheart.</li>
        <li><strong>OX</strong> — 9 points base, makes parallel X plays trivial.</li>
        <li><strong>AX</strong> — 9 points base, similar utility to OX.</li>
        <li><strong>EX</strong> — 9 points base.</li>
        <li><strong>KA</strong> — 6 points base, the spiritual self in Egyptian belief.</li>
        <li><strong>KI</strong> — 6 points base, variant of QI.</li>
      </ol>

      <h2 id="connection">How this connects to the rest of your game</h2>
      <p>
        Two-letter words enable everything else. They&apos;re what makes{" "}
        <Link to="/blog/words-with-q-no-u">Q-without-U plays</Link> playable, what lets you set up{" "}
        <Link to="/blog/scrabble-bingo-strategy">bingos</Link> without giving your opponent the bonus square, and
        what turns a defensive board into an offensive one. They&apos;re also the foundation of every{" "}
        <Link to="/blog/high-scoring-scrabble-words">high-scoring word play</Link> in modern Scrabble.
      </p>

      <h2 id="practice">Practice this week</h2>
      <p>
        Pick five 2-letter words you didn&apos;t know. Open the{" "}
        <Link to="/scrabble-solver">Scrabble Solver</Link>, enter a rack containing the second letter of each, and
        play 10 boards. By the end of the week you&apos;ll see them in real games without thinking. That&apos;s
        the entire game.
      </p>
    </>
  );
}
