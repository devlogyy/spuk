import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { canMakeFromRack, loadDictionary, scoreWord, type DictName } from "../dict";

export default defineTool({
  name: "scrabble_solve",
  title: "Scrabble solver",
  description:
    "Find valid Scrabble/Words With Friends plays from a rack of letters. Use '?' or '*' for blank tiles. Returns words ranked by score.",
  inputSchema: {
    rack: z.string().min(1).describe("Letters available (2-15 chars). Use '?' or '*' for blanks."),
    dictionary: z.enum(["US", "UK"]).default("US").describe("US = TWL06, UK = SOWPODS."),
    min_length: z.number().int().min(2).max(15).default(2),
    max_results: z.number().int().min(1).max(100).default(25),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ rack, dictionary, min_length, max_results }) => {
    const words = await loadDictionary(dictionary as DictName);
    const matches = words
      .filter((w) => w.length >= min_length && canMakeFromRack(w, rack))
      .map((word) => ({ word, score: scoreWord(word) }))
      .sort((a, b) => b.score - a.score || b.word.length - a.word.length)
      .slice(0, max_results);
    return {
      content: [{ type: "text", text: JSON.stringify(matches, null, 2) }],
      structuredContent: { results: matches, count: matches.length },
    };
  },
});
