# Dedicated Scrabble hub

## User-facing result
Create a new `/scrabble` page that acts as Lexora’s dedicated Scrabble resource hub while preserving `/scrabble-solver` as the focused interactive solver.

The page will include:
- A clear Scrabble word finder/solver introduction with a prominent CTA into the existing solver.
- A searchable/browsable word-list area linking to existing letter, ending, length, and anagram pages.
- A complete standard Scrabble tile-value reference, including high-value tiles and score examples.
- Practical sections for blank tiles, 2-letter words, bingo plays, Q-without-U words, and dictionary differences.
- Internal links to the existing Scrabble blog content and related word tools.

## SEO and discoverability
- Target the page around “Scrabble words,” “Scrabble word finder,” “Scrabble solver,” “Scrabble dictionary,” “Scrabble tile values,” and useful question-style searches such as “is QI a Scrabble word?” without keyword stuffing.
- Add route-specific title, description, canonical, Open Graph, Twitter, breadcrumb, item-list, FAQ, and relevant WebPage/HowTo structured data using the existing SEO conventions.
- Add `/scrabble` to the application route/preload map, primary navigation or tools navigation where appropriate, sitemap generation, and discovery content.
- Link the hub and solver to each other so the new page supports both informational searches and solver conversions.

## Technical details
- Add a lazy-loaded `Scrabble` page and `/scrabble` route; do not duplicate the solver engine.
- Reuse the existing tile-value/scoring helpers, dictionary-driven word-list routes, `RelatedTools`, and the established token-based styling.
- Use static, crawlable explanatory content and links for the hub; keep live rack solving in `/scrabble-solver`.
- Validate the new route, internal links, metadata, structured data, responsive layout, sitemap inclusion, and build output before completion.
