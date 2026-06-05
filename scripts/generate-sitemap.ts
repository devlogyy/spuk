// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://spuk.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Mirror src/content/blog/index.ts slugs. Keep in sync when new posts are added.
const BLOG_SLUGS = [
  "words-with-q-no-u",
  "2-letter-scrabble-words",
  "high-scoring-scrabble-words",
  "how-to-solve-crossword-clues",
  "crossword-clue-patterns",
  "words-from-letters",
  "scrabble-bingo-strategy",
  "build-vocabulary-word-games",
];

const today = new Date().toISOString().split("T")[0];

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/scrabble-solver", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/crossword-solver", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/word-finder", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/blog", changefreq: "weekly", priority: "0.8", lastmod: today },
  ...BLOG_SLUGS.map((slug) => ({
    path: `/blog/${slug}`,
    changefreq: "monthly" as const,
    priority: "0.8",
    lastmod: today,
  })),
];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    "",
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
