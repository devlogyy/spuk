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
