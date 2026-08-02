// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Includes static routes, blog posts, and programmatic SEO routes (words/unscramble).
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.lexorawords.com";

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

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const N_LETTER_LENGTHS = [3, 4, 5, 6, 7];

// Load TWL dictionary to skip impossible n-letter+letter combos (keeps sitemap clean).
let twl: Set<string> = new Set();
try {
  const text = readFileSync(resolve("public/dict/twl06.txt"), "utf8");
  twl = new Set(text.toUpperCase().split(/\r?\n/).filter(Boolean));
} catch {
  // dict missing — fall back to including all combinations
}

function hasNLetterWithLetter(n: number, letter: string): boolean {
  if (twl.size === 0) return true;
  const L = letter.toUpperCase();
  for (const w of twl) {
    if (w.length === n && w.includes(L)) return true;
  }
  return false;
}

// Curated popular racks (mirror src/content/popular-racks.ts; subset to keep sitemap manageable).
const POPULAR_RACKS = [
  "stare","crate","arose","raise","slate","trace","adieu","audio","later","heart",
  "earth","table","plate","share","spare","alone","along","story","horse","house",
  "happy","money","music","peace","power","point","price","right","round","scene",
  "smile","sound","space","speak","stage","stand","start","state","stone","style",
  "teach","thank","think","three","throw","under","value","voice","water","white",
  "world","write","young","beach","brain","bread","break","brown","build","catch",
  "chair","chart","cheap","check","child","clear","climb","close","cloud","color",
  "coast","could","count","cover","craft","crash","cream","crime","cross","crowd",
  "crown","daily","dance","death","depth","doubt","dream","drink","drive","early",
  "empty","enjoy","enter","entry","equal","event","every","exact","exist",
  "extra","faith","false","fault","field","fight","final","first","floor","focus",
  "force","frame","fresh","front","fruit","funny","ghost","giant","glass","grade",
  "grand","grant","grass","great","green","group","guard","guess","guest","guide",
  "heavy","honor","human","ideal","image","index","input","issue",
  "joint","judge","known","label","large","laugh","layer","learn","least",
  "leave","legal","level","light","limit","local","logic","loose","lower","lucky",
  "magic","major","march","match","metal","might","minor","minus","model",
  "month","moral","motor","mount","mouse","mouth","movie",
  "listen","silent","master","stream","planet","random","scream","silver","summer","winter",
  "garden","forest","branch","bridge","castle","circus","cinema","danger","dragon","dinner",
  "doctor","driver","editor","engine","family","father","figure","finger","flight","flower",
  "friend","future","ground","growth","health","height","hidden","honest","income","island",
  "junior","ladder","letter","liquid","little","lonely","longer","manner",
  "market","matter","memory","method","middle","minute","mirror","modern","moment","mother",
  "motion","murder","muscle","museum","mutual","myself","nation","native","nature","nearby",
  "needle","normal","number","object","office","online","option","orange","origin","output",
  "oxygen","palace","parent","passed","pencil","period","person",
  "rainbow","mystery","kingdom","library","machine","measure","morning","network",
  "october","passage","perfect","picture","pioneer","plastic","popular","present","problem","produce",
  "promise","protect","provide","quality","reality","receive","reduce","respect",
  "respond","results","retired","reveal","review","reward","rocket",
  "science","scratch","section","service","several","setting","shadow","similar","singer",
  "sketch","slowly","smooth","social","society","soldier","solving","special","stadium",
  "station","stretch","student","studio","subject","success","sunday","support","surface",
  "survey","systems","teacher","theory","therapy","tonight","trouble","unknown",
  "useful","victory","village","virtual","volume","wedding","welcome","whisper","witness",
  "retains","stainer","plates","integral","triangle","altering","relating","alerting",
  "tearing","reading","stranger","training","painters","creates","catered","reacted",
];
const UNIQUE_RACKS = Array.from(new Set(POPULAR_RACKS.map((r) => r.toLowerCase())));


const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/scrabble-solver", changefreq: "weekly", priority: "0.9" },
  { path: "/crossword-solver", changefreq: "weekly", priority: "0.9" },
  { path: "/word-finder", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/words", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

const blogEntries: SitemapEntry[] = BLOG_SLUGS.map((slug) => ({
  path: `/blog/${slug}`,
  changefreq: "monthly",
  priority: "0.8",
}));

const startingEntries: SitemapEntry[] = LETTERS.map((l) => ({
  path: `/words/starting-with/${l}`,
  changefreq: "monthly",
  priority: "0.7",
}));

const endingEntries: SitemapEntry[] = LETTERS.map((l) => ({
  path: `/words/ending-in/${l}`,
  changefreq: "monthly",
  priority: "0.7",
}));

const nLetterEntries: SitemapEntry[] = [];
for (const n of N_LETTER_LENGTHS) {
  for (const l of LETTERS) {
    if (!hasNLetterWithLetter(n, l)) continue;
    nLetterEntries.push({
      path: `/words/${n}-letter-words-with-${l}`,
      changefreq: "monthly",
      priority: "0.6",
    });
  }
}

const unscrambleEntries: SitemapEntry[] = UNIQUE_RACKS.map((r) => ({
  path: `/unscramble/${r}`,
  changefreq: "monthly",
  priority: "0.6",
}));

const entries: SitemapEntry[] = [
  ...staticEntries,
  ...blogEntries,
  ...startingEntries,
  ...endingEntries,
  ...nLetterEntries,
  ...unscrambleEntries,
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
