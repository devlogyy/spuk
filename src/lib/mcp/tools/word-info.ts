import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { loadDictionary, scoreWord } from "../dict";

export default defineTool({
  name: "word_info",
  title: "Word info",
  description:
    "Look up whether a word is valid in the TWL06 (US) and SOWPODS (UK) Scrabble dictionaries and get its Scrabble tile score.",
  inputSchema: {
    word: z.string().min(1).max(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ word }) => {
    const w = word.trim().toUpperCase();
    const [us, uk] = await Promise.all([loadDictionary("US"), loadDictionary("UK")]);
    const info = {
      word: w,
      score: scoreWord(w),
      length: w.length,
      valid_in: {
        us_twl06: us.includes(w),
        uk_sowpods: uk.includes(w),
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
