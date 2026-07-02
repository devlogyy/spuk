// One place to swap when the new domain ships.
export const SITE_URL = "https://spuk.lovable.app";
export const SITE_NAME = "Lexora";
export const SITE_TAGLINE = "AI Scrabble Solver, Crossword & Word Finder";
export const SITE_DESCRIPTION =
  "Lexora is the premium AI-powered platform for Scrabble, Crossword, Anagrams and Word Finder with US (TWL) & UK (SOWPODS) dictionaries.";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export interface FAQItem {
  q: string;
  a: string;
}

export const faqPageSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }),
  ),
});

export const softwareApplicationSchema = (params: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: params.name,
  description: params.description,
  url: params.url,
  applicationCategory: params.category ?? "UtilityApplication",
  operatingSystem: "Any (Web)",
  inLanguage: "en",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
});

export const breadcrumbSchema = (
  crumbs: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export interface HowToStep {
  name: string;
  text: string;
}

export const howToSchema = (params: {
  name: string;
  description: string;
  totalTimeIso?: string; // e.g. "PT30S"
  steps: HowToStep[];
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: params.name,
  description: params.description,
  ...(params.totalTimeIso ? { totalTime: params.totalTimeIso } : {}),
  step: params.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});

export const speakableSchema = (cssSelectors: string[]) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  },
});

export const definedTermSetSchema = (params: {
  name: string;
  description: string;
  terms: { term: string; description?: string }[];
  inDefinedTermSetUrl?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: params.name,
  description: params.description,
  hasDefinedTerm: params.terms.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    ...(t.description ? { description: t.description } : {}),
    ...(params.inDefinedTermSetUrl
      ? { inDefinedTermSet: params.inDefinedTermSetUrl }
      : {}),
  })),
});

