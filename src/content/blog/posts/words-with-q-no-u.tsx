import { Link } from "react-router-dom";
import { AdSlot } from "@/components/AdSlot";

export default function Body() {
  return (
    <>
      <p className="lead">
        The Q is the heaviest tile in Scrabble (10 points), and for most players it&apos;s also the most stressful.
        You draw it, you scan your rack for a U, you panic if there isn&apos;t one. The good news: you don&apos;t need
        a U. The official Scrabble dictionaries — both TWL (North America) and SOWPODS (international) — accept
        roughly thirty words that pair Q with another letter entirely. Learning them is the single fastest way to
        turn a liability tile into a 20- to 40-point turn.
      </p>

      <p>
        I&apos;ll walk through every common Q-without-U word, group them by usefulness, and show the rack-and-board
        setups that turn each one into a high-scoring play. By the end you&apos;ll have a memorizable list and a
        repeatable way to use it.
      </p>

      <h2 id="why-q-no-u">Why Q-without-U words exist</h2>
      <p>
        Scrabble&apos;s tile distribution gives you one Q and four U tiles in a 100-tile bag. That sounds fine, but
        because U is also a very common letter in regular play, you often draw the Q on a U-less rack. The
        committee that maintains the official word lists has, over decades, added words borrowed from Arabic,
        Hebrew, and Chinese transliteration that use Q without U. Those borrowings are the entire reason QI, QAT
        and QOPH are legal.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="essential-five">The essential five (learn these first)</h2>
      <p>
        If you only memorize five Q-without-U words, make them these. They&apos;re short, score well, and combine
        with letters you actually draw.
      </p>
      <ul>
        <li>
          <strong>QI</strong> — life force in Chinese philosophy. The most-played Q-without-U word at the
          tournament level. Two tiles, 11 base points, and it forms a 2-letter parallel hook almost anywhere.
        </li>
        <li>
          <strong>QAT</strong> — an East African shrub whose leaves are chewed as a stimulant. Three tiles, 12 base
          points, opens up T-row hooks.
        </li>
        <li>
          <strong>QOPH</strong> — the 19th letter of the Hebrew alphabet. Worth 16 base points; lands on a triple
          letter for 30+ regularly.
        </li>
        <li>
          <strong>QADI</strong> — a Muslim judge interpreting Islamic law. Four tiles, 14 base points, plus a clean
          plural QADIS for bingo setups.
        </li>
        <li>
          <strong>QANAT</strong> — an underground irrigation channel from ancient Persia. Five tiles, 15 base
          points, and one of the few Q-without-U words that gives you a 5-tile play.
        </li>
      </ul>

      <h2 id="full-list">The full list of Q-without-U words</h2>
      <p>Sorted by length so you can scan based on rack size:</p>
      <ul>
        <li><strong>2 letters:</strong> QI</li>
        <li><strong>3 letters:</strong> QAT, QIS</li>
        <li><strong>4 letters:</strong> QADI, QOPH, QATS, QOPHS</li>
        <li><strong>5 letters:</strong> QANAT, QADIS, FAQIR, TRANQ</li>
        <li><strong>6 letters:</strong> QANATS, QINDAR, QINTAR, SHEQEL, FAQIRS, TRANQS</li>
        <li><strong>7 letters:</strong> QINDARS, QINTARS, SHEQELS, QABALAH</li>
        <li><strong>8 letters:</strong> QABALAHS, QINGHAOSU</li>
      </ul>
      <p>
        Some of these (QINDAR, QINTAR — Albanian monetary units; SHEQEL — Israeli currency) are TWL legal but show
        up rarely. The first six rows are where 90% of your real-game value lives.
      </p>

      <h2 id="rack-setups">Rack setups that score 30+</h2>
      <p>
        Knowing the word is half the battle. Knowing how to land it on a premium square is the other half. Three
        repeatable patterns:
      </p>

      <h3>Pattern 1 — Q on the double-letter, parallel play</h3>
      <p>
        Find a double-letter square with an existing tile next to it. If you can play QI parallel to that tile so
        the Q sits on the double letter, you score the Q twice (20 points) plus a second 2-letter word for free.
        On a triple-letter, that&apos;s 30 just for the Q.
      </p>

      <h3>Pattern 2 — QAT hook on an open T or A</h3>
      <p>
        If the board has an open T or A on a triple-word column, QAT extending from it puts the Q on a high-value
        square and triples the whole word. 36 points in a single 3-tile play is a common result.
      </p>

      <h3>Pattern 3 — QI plus a 2-letter hook</h3>
      <p>
        Almost every endgame in modern Scrabble involves QI plus a 2-letter parallel like AI, AB, AD, AE, AG, AH,
        AL, AM, AN, AR, AS, AT, AW, AX, AY. Memorize the 2-letter words and QI becomes a Swiss-army knife. We
        cover the full list in our <Link to="/blog/2-letter-scrabble-words">guide to two-letter Scrabble words</Link>.
      </p>

      <AdSlot zoneKey="blog-inline" />

      <h2 id="memorization">How to actually memorize them</h2>
      <p>
        Lists don&apos;t stick. What sticks is using the word in a real position. Three drills that work:
      </p>
      <ol>
        <li>
          <strong>Rack-and-board flashcards.</strong> Write each Q-without-U word on a card with one example board
          position. Drill 5 cards per day for a week.
        </li>
        <li>
          <strong>Solver practice.</strong> Open the <Link to="/scrabble-solver">Scrabble Solver</Link>, enter a
          rack with the Q but no U, and play through 20 positions. You&apos;ll start seeing the patterns
          instinctively.
        </li>
        <li>
          <strong>Real games with a notebook.</strong> Every time you hold the Q for more than one turn, write down
          what you eventually did with it. Patterns emerge within ten games.
        </li>
      </ol>

      <h2 id="dictionary-differences">TWL vs SOWPODS: small but important differences</h2>
      <p>
        North American tournaments use TWL. International tournaments (UK, Australia, Singapore, South Africa) use
        SOWPODS. SOWPODS accepts a few extras you should know if you ever play internationally: QIN, QIS variants,
        and some obscure plurals. If you&apos;re playing casually with friends, default to whichever dictionary your
        Scrabble set ships with — both are widely accepted.
      </p>

      <h2 id="next">Where to take this next</h2>
      <p>
        The Q-without-U list is a small, high-leverage piece of Scrabble study. The next two layers that compound
        with it are the <Link to="/blog/2-letter-scrabble-words">complete 2-letter word list</Link> (which makes
        every QI play possible) and <Link to="/blog/scrabble-bingo-strategy">bingo strategy</Link> (which is what
        separates 300-point games from 450-point games). Work through all three and you&apos;ll add 30-50 points
        per game within a month.
      </p>
      <p>
        Want to test a rack right now? Drop your letters into the{" "}
        <Link to="/scrabble-solver">Scrabble Solver</Link> and watch how often a Q-without-U word slips into the
        top 5 plays. It&apos;s more often than you&apos;d think.
      </p>
    </>
  );
}
