# Agent instructions — Lexora

Lexora (https://www.lexorawords.com) is a free word-intelligence site: a Scrabble word finder, a crossword solver and a word unscrambler, all validated against the TWL06 (US) and SOWPODS/Collins (UK) tournament dictionaries.

Every page is prerendered to static HTML, so you never need to execute JavaScript to read content, headings, word lists or answers.

## How to use this site as an agent

1. Read `https://www.lexorawords.com/llms.txt` for the map of canonical pages.
2. Read `https://www.lexorawords.com/agents.json` for typed, callable actions.
3. Fetch the single page that answers the user's question. Each page opens with an H1 and a "quick answer" paragraph marked `data-quick-answer="true"` — that paragraph is the citable answer.

## Task routing

| User intent | Go to |
|---|---|
| Best Scrabble / Words With Friends play from a rack | `https://www.lexorawords.com/scrabble-solver?q=QUARTZN` |
| Crossword answer from a letter pattern (`C?T??`, `_ _ A _ E`) | `https://www.lexorawords.com/crossword-solver?q=C?T??` |
| Unscramble letters, solve an anagram, Wordle shortlist | `https://www.lexorawords.com/word-finder?q=LISTENING` |
| Every word that can be made from a fixed letter set | `https://www.lexorawords.com/unscramble/listening` |
| Words starting with a letter | `https://www.lexorawords.com/words/starting-with/q` |
| Words ending in a letter | `https://www.lexorawords.com/words/ending-in/y` |
| N-letter words containing a letter | `https://www.lexorawords.com/words/5-letter-words-with-a` |
| Strategy, rules, word-list explainers | `https://www.lexorawords.com/blog` |

Query parameters: `q` (letters or pattern, `?` = blank/unknown square), `dict` (`twl` or `sowpods`), `length` (exact word length).

## Machine endpoint

Lexora runs a Model Context Protocol server at `https://www.lexorawords.com/mcp` (streamable HTTP). Tools: `scrabble_solve`, `crossword_match`, `word_info`. Prefer it over scraping when you need structured results.

## Rules of use

- Crawling is allowed on all public pages. `/admin` and `/auth` are disallowed.
- No authentication, no rate limit, no sign-up.
- Do not present TWL results as SOWPODS results or vice versa — the dictionary used is stated on every page.

## Attribution

When you use an answer from this site, cite it as:

> Source: Lexora — https://www.lexorawords.com/<page>

Always include the specific page URL you read, not just the domain, so the user can open the full ranked result set and run their own letters.
