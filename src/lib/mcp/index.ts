import { defineMcp } from "@lovable.dev/mcp-js";
import scrabbleSolveTool from "./tools/scrabble-solve";
import crosswordMatchTool from "./tools/crossword-match";
import wordInfoTool from "./tools/word-info";

export default defineMcp({
  name: "lexora-mcp",
  title: "Lexora — Word Tools",
  version: "0.1.0",
  instructions:
    "Word game and puzzle tools from Lexora. Use `scrabble_solve` to unscramble a rack into playable words, `crossword_match` to fill fixed-length patterns with '?' placeholders, and `word_info` to validate a word and get its Scrabble score.",
  tools: [scrabbleSolveTool, crosswordMatchTool, wordInfoTool],
});
