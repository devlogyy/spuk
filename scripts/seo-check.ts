/**
 * Automated SEO validator for tool pages.
 * Run: `bun run seo:check`  (also runs before every build via `prebuild`).
 *
 * Statically parses each tool page + sitemap + robots to verify:
 *   - <title> / meta description present and non-default
 *   - self-referencing canonical + og:url
 *   - og:title, og:description, og:type, twitter:card
 *   - faqPageSchema(FAQS) emitted as JSON-LD
 *   - FAQS array: >= 5 entries, each has non-empty q + a within safe lengths
 *   - robots.txt does not globally disallow crawling
 *   - sitemap.xml lists every tool page canonical path
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

interface PageSpec {
  file: string;
  route: string;
  label: string;
  minFaqs?: number;
}

const PAGES: PageSpec[] = [
  { file: "src/pages/ScrabbleSolver.tsx", route: "/scrabble-solver", label: "Scrabble Solver", minFaqs: 5 },
  { file: "src/pages/CrosswordSolver.tsx", route: "/crossword-solver", label: "Crossword Solver", minFaqs: 5 },
  { file: "src/pages/WordFinder.tsx", route: "/word-finder", label: "Word Finder", minFaqs: 5 },
];

const ROBOTS = "public/robots.txt";
const SITEMAP = "public/sitemap.xml";

type Issue = { level: "error" | "warn"; page: string; message: string };
const issues: Issue[] = [];
const err = (page: string, message: string) => issues.push({ level: "error", page, message });
const warn = (page: string, message: string) => issues.push({ level: "warn", page, message });

// ----- FAQS array extractor (static, brace-matched) -----
function extractFaqs(src: string): { q: string; a: string }[] | null {
  const start = src.match(/const\s+FAQS\s*:\s*FAQItem\[\]\s*=\s*\[/);
  if (!start || start.index === undefined) return null;
  const from = start.index + start[0].length - 1; // include `[`
  let depth = 0;
  let end = -1;
  for (let i = from; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end < 0) return null;
  const body = src.slice(from + 1, end);
  const items: { q: string; a: string }[] = [];
  // Match { q: "...", a: "..." } tolerating single/double/backtick quotes and escaped chars.
  const re = /\{\s*q\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1\s*,\s*a\s*:\s*(["'`])((?:\\.|(?!\3).)*)\3\s*,?\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) items.push({ q: m[2], a: m[4] });
  return items;
}

function checkPage(spec: PageSpec) {
  const path = resolve(spec.file);
  if (!existsSync(path)) { err(spec.label, `file not found: ${spec.file}`); return; }
  const src = readFileSync(path, "utf8");

  // Head tags
  const titleMatch = src.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) err(spec.label, "missing <title>");
  else if (/Lovable App/i.test(titleMatch[1])) err(spec.label, `default title still present: "${titleMatch[1]}"`);
  else if (titleMatch[1].length > 65) warn(spec.label, `title is ${titleMatch[1].length} chars (recommended ≤ 60)`);

  const desc = src.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  if (!desc) err(spec.label, "missing meta description");
  else if (/Lovable Generated Project/i.test(desc[1])) err(spec.label, "default meta description still present");
  else if (desc[1].length > 170) warn(spec.label, `description is ${desc[1].length} chars (recommended ≤ 160)`);

  const canonical = src.match(/<link\s+rel="canonical"\s+href=\{absoluteUrl\("([^"]+)"\)\}/);
  if (!canonical) err(spec.label, "canonical must use absoluteUrl(\"...\") for the current route");
  else if (canonical[1] !== spec.route) err(spec.label, `canonical points at ${canonical[1]}, expected ${spec.route}`);

  const ogUrl = src.match(/property="og:url"\s+content=\{absoluteUrl\("([^"]+)"\)\}/);
  if (!ogUrl) err(spec.label, "missing self-referencing og:url");
  else if (ogUrl[1] !== spec.route) err(spec.label, `og:url points at ${ogUrl[1]}, expected ${spec.route}`);

  for (const [tag, re] of [
    ["og:title", /property="og:title"/],
    ["og:description", /property="og:description"/],
    ["og:type", /property="og:type"/],
    ["twitter:card", /name="twitter:card"/],
  ] as const) {
    if (!re.test(src)) err(spec.label, `missing ${tag}`);
  }

  // JSON-LD wiring
  if (!/faqPageSchema\(FAQS\)/.test(src)) err(spec.label, "FAQPage JSON-LD (faqPageSchema(FAQS)) not emitted");
  if (!/application\/ld\+json/.test(src)) err(spec.label, "no application/ld+json script tag found");

  // FAQ contents
  const faqs = extractFaqs(src);
  if (!faqs) { err(spec.label, "could not parse FAQS array"); return; }
  const min = spec.minFaqs ?? 5;
  if (faqs.length < min) err(spec.label, `only ${faqs.length} FAQs (need ≥ ${min})`);
  const seen = new Set<string>();
  faqs.forEach((f, i) => {
    const key = f.q.trim().toLowerCase();
    if (!f.q.trim()) err(spec.label, `FAQ #${i + 1} has empty question`);
    if (!f.a.trim()) err(spec.label, `FAQ #${i + 1} has empty answer`);
    if (f.a.trim().length < 40) warn(spec.label, `FAQ #${i + 1} answer is short (${f.a.trim().length} chars)`);
    if (f.a.length > 320) warn(spec.label, `FAQ #${i + 1} answer is long (${f.a.length} chars)`);
    if (seen.has(key)) err(spec.label, `duplicate FAQ question on page: "${f.q}"`);
    seen.add(key);
  });
}

function checkRobots() {
  const path = resolve(ROBOTS);
  if (!existsSync(path)) { err("robots.txt", "public/robots.txt is missing"); return; }
  const txt = readFileSync(path, "utf8");
  // Detect a global block: `User-agent: *` followed (before any other UA block) by `Disallow: /` alone.
  const starBlock = txt.split(/^user-agent:/im).find((b) => /^\s*\*/.test(b));
  if (starBlock && /^\s*disallow:\s*\/\s*$/im.test(starBlock)) {
    err("robots.txt", "global crawler block detected: `User-agent: *` + `Disallow: /`");
  }
  for (const p of PAGES) {
    const re = new RegExp(`^\\s*disallow:\\s*${p.route.replace(/\//g, "\\/")}\\s*$`, "im");
    if (re.test(txt)) err("robots.txt", `tool route ${p.route} is disallowed for crawlers`);
  }
}

function checkSitemap() {
  const path = resolve(SITEMAP);
  if (!existsSync(path)) { err("sitemap.xml", "public/sitemap.xml is missing — run `bun run predev`"); return; }
  const xml = readFileSync(path, "utf8");
  for (const p of PAGES) {
    if (!xml.includes(`<loc>`) || !new RegExp(`<loc>[^<]*${p.route}(?:\\?[^<]*)?</loc>`).test(xml)) {
      err("sitemap.xml", `missing entry for ${p.route}`);
    }
  }
}

// ----- Run -----
PAGES.forEach(checkPage);
checkRobots();
checkSitemap();

const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warn");

const bar = "─".repeat(60);
console.log(bar);
console.log(`SEO check — ${PAGES.length} tool pages`);
console.log(bar);

for (const p of PAGES) {
  const pageIssues = issues.filter((i) => i.page === p.label);
  if (pageIssues.length === 0) { console.log(`✔ ${p.label}  (${p.route})`); continue; }
  console.log(`✖ ${p.label}  (${p.route})`);
  for (const i of pageIssues) console.log(`   ${i.level === "error" ? "ERROR" : "warn "}  ${i.message}`);
}
for (const bucket of ["robots.txt", "sitemap.xml"]) {
  const b = issues.filter((i) => i.page === bucket);
  if (b.length === 0) { console.log(`✔ ${bucket}`); continue; }
  console.log(`✖ ${bucket}`);
  for (const i of b) console.log(`   ${i.level === "error" ? "ERROR" : "warn "}  ${i.message}`);
}

console.log(bar);
console.log(`${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`);

if (errors.length > 0) process.exit(1);
