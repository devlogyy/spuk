import { useEffect } from "react";

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

export function WebMcpTools() {
  useEffect(() => {
    const ctx = (document as unknown as { modelContext?: ModelContext }).modelContext;
    if (!ctx || typeof ctx.registerTool !== "function") return;

    const dict = () => import("@/lib/dictionary");

    const register = async () => {
      const { solveRack, matchPattern, wordInfo } = (await dict()) as unknown as Record<string, never>;
      void solveRack;
      void matchPattern;
      void wordInfo;
    };
    void register;

    const tools = [
      {
        name: "find_scrabble_words",
        description:
          "Find every legal Scrabble or Words With Friends play from a rack of letters, ranked by tile score. Use '?' for a blank tile. Returns words with scores from the TWL (US) or SOWPODS (UK) dictionary.",
        inputSchema: {
          type: "object",
          properties: {
            letters: { type: "string", description: "Rack letters, e.g. QUARTZN. '?' means a blank tile." },
            dictionary: { type: "string", description: "US or UK" },
          },
          required: ["letters"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { solveRack } = await import("@/lib/dictionary");
          const res = await solveRack(
            String(args.letters ?? ""),
            (String(args.dictionary ?? "US").toUpperCase() === "UK" ? "UK" : "US") as "US" | "UK",
            50,
          );
          return text({
            source: "Lexora — https://www.lexorawords.com/scrabble-solver",
            results: res.map((r) => ({ word: r.word, score: r.score })),
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
          const res = await matchPattern(
            String(args.pattern ?? ""),
            (String(args.dictionary ?? "US").toUpperCase() === "UK" ? "UK" : "US") as "US" | "UK",
            50,
          );
          return text({
            source: "Lexora — https://www.lexorawords.com/crossword-solver",
            results: res.map((r) => ({ word: r.word, score: r.score })),
          });
        },
      },
      {
        name: "unscramble_letters",
        description:
          "Unscramble letters into every valid anagram and sub-word, each with its Scrabble score. Useful for anagrams, jumbles and Wordle shortlists.",
        inputSchema: {
          type: "object",
          properties: {
            letters: { type: "string", description: "Letters to unscramble, e.g. LISTENING." },
            length: { type: "number", description: "Optional exact word length filter." },
            dictionary: { type: "string", description: "US or UK" },
          },
          required: ["letters"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { solveRack } = await import("@/lib/dictionary");
          const res = await solveRack(
            String(args.letters ?? ""),
            (String(args.dictionary ?? "US").toUpperCase() === "UK" ? "UK" : "US") as "US" | "UK",
            100,
          );
          const len = Number(args.length ?? 0);
          const filtered = len > 0 ? res.filter((r) => r.word.length === len) : res;
          return text({
            source: "Lexora — https://www.lexorawords.com/word-finder",
            results: filtered.map((r) => ({ word: r.word, score: r.score })),
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
