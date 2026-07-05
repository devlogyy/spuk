import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { loadDictionary, matchesPattern, scoreWord, type DictName } from "../dict";

export default defineTool({
  name: "crossword_match",
  title: "Crossword pattern match",
  description:
    "Find dictionary words matching a fixed-length pattern. Use '?' (or '_' / '.') for unknown letters, e.g. 'C?T' matches CAT, COT, CUT.",
  inputSchema: {
    pattern: z.string().min(1).max(15).describe("Pattern with '?' for unknowns."),
    dictionary: z.enum(["US", "UK"]).default("US"),
    max_results: z.number().int().min(1).max(200).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ pattern, dictionary, max_results }) => {
    const words = await loadDictionary(dictionary as DictName);
    const matches = words
      .filter((w) => matchesPattern(w, pattern))
      .slice(0, max_results)
      .map((word) => ({ word, score: scoreWord(word) }));
    return {
      content: [{ type: "text", text: JSON.stringify(matches, null, 2) }],
      structuredContent: { results: matches, count: matches.length },
    };
  },
});
