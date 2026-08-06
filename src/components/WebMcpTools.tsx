import { useEffect } from "react";
import type { DictName, SolverResult } from "@/lib/dictionary";

/**
 * WebMCP (experimental Chrome API). Registers Lexora's word tools with the
 * browser so an in-page agent can call them directly instead of scraping.
 * Feature-detected: a no-op everywhere the API is unavailable.
 */

interface ModelContext {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: unknown;
    execute: (args: Record<string, unknown>) => Promise<{ content: Array<{ type: "text"; text: string }> }>;
  }) => void | Promise<void>;
}

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value) }],
});

const toDict = (v: unknown): DictName => (String(v ?? "US").toUpperCase() === "UK" ? "UK" : "US");
const slim = (rows: SolverResult[]) => rows.map((r) => ({ word: r.word, score: r.score }));

export function WebMcpTools() {
  useEffect(() => {
    const ctx = (document as unknown as { modelContext?: ModelContext }).modelContext;
    if (!ctx || typeof ctx.registerTool !== "function") return;

    const tools = [
      {
        name: "find_scrabble_words",
        description:
          "Find every legal Scrabble or Words With Friends play from a rack of letters, ranked by tile score. Use '?' for a blank tile. Validated against the TWL (US) or SOWPODS (UK) dictionary.",
        inputSchema: {
          type: "object",
          properties: {
            letters: { type: "string", description: "Rack letters, e.g. QUARTZN. '?' means a blank tile." },
            dictionary: { type: "string", description: "US or UK" },
          },
          required: ["letters"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { solveAnagram } = await import("@/lib/dictionary");
          const res = await solveAnagram(String(args.letters ?? ""), { dict: toDict(args.dictionary), max: 50 });
          return text({
            source: "Lexora — https://www.lexorawords.com/scrabble-solver",
            results: slim(res),
          });
        },
      },
      {
        name: "solve_crossword_pattern",
        description:
          "Solve a crossword clue by letter pattern. Provide known letters and '?' for each empty square (e.g. C?T??) and get every dictionary word of that exact shape.",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string", description: "Pattern such as C?T?? — '?' is an unknown square." },
            dictionary: { type: "string", description: "US or UK" },
          },
          required: ["pattern"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { matchPattern } = await import("@/lib/dictionary");
          const res = await matchPattern(String(args.pattern ?? ""), toDict(args.dictionary), 50);
          return text({
            source: "Lexora — https://www.lexorawords.com/crossword-solver",
            results: slim(res),
          });
        },
      },
      {
        name: "unscramble_letters",
        description:
          "Unscramble letters into every valid anagram and shorter sub-word, each with its Scrabble score. Useful for anagrams, jumble puzzles and Wordle shortlists.",
        inputSchema: {
          type: "object",
          properties: {
            letters: { type: "string", description: "Letters to unscramble, e.g. LISTENING." },
            length: { type: "number", description: "Optional exact word length filter (set 5 for Wordle)." },
            dictionary: { type: "string", description: "US or UK" },
          },
          required: ["letters"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { solveAnagram } = await import("@/lib/dictionary");
          const exactLen = Number(args.length ?? 0);
          const res = await solveAnagram(String(args.letters ?? ""), {
            dict: toDict(args.dictionary),
            max: 100,
            ...(exactLen > 0 ? { exactLen } : {}),
          });
          return text({
            source: "Lexora — https://www.lexorawords.com/word-finder",
            results: slim(res),
          });
        },
      },
    ];

    for (const tool of tools) {
      try {
        void ctx.registerTool(tool);
      } catch {
        /* experimental API — ignore registration failures */
      }
    }
  }, []);

  return null;
}
