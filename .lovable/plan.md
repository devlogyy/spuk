## Goal
Convert the project from TanStack Start (SSR on Cloudflare Workers) to a standard **Vite + React + TypeScript SPA** with `react-router-dom`, so it deploys cleanly to Vercel from GitHub with no 404s.

## What will change

### 1. New entry structure (standard Vite React layout)
- `index.html` at the project root (with `<div id="root">` and `<script type="module" src="/src/main.tsx">`)
- `src/main.tsx` — browser entry, mounts `<App />` inside `BrowserRouter`
- `src/App.tsx` — defines routes using `react-router-dom`, wraps pages with Navbar + Footer + MobileNav

### 2. Pages migrated from `src/routes/` → `src/pages/`
Each TanStack route becomes a plain React page component. UI, styling, SEO content, and components are preserved 1:1.
- `src/pages/Home.tsx` (from `routes/index.tsx`)
- `src/pages/ScrabbleSolver.tsx`
- `src/pages/CrosswordSolver.tsx`
- `src/pages/WordFinder.tsx`
- `src/pages/Blog.tsx`
- `src/pages/NotFound.tsx` (404 fallback)

SEO meta tags will be handled with `react-helmet-async` (client-side, fine for Vercel + SEO since Google renders JS).

### 3. Routing
Using `react-router-dom` v6:
```
/                  → Home
/scrabble-solver   → ScrabbleSolver
/crossword-solver  → CrosswordSolver
/word-finder       → WordFinder
/blog              → Blog
*                  → NotFound
```

### 4. Vite config
Replace `vite.config.ts` with a minimal standard config:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```
Tailwind v4 stays via the existing `@import "tailwindcss"` in `src/styles.css` (imported by `main.tsx`).

### 5. `package.json` scripts
```
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
```
Output goes to `dist/` — what Vercel expects.

### 6. Vercel SPA routing
Update `vercel.json` to rewrite all routes to `index.html` so `/scrabble-solver` works on refresh:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
No build command override needed — Vercel auto-detects Vite.

### 7. Files removed (no longer needed)
- `src/routes/` (entire directory, including `routeTree.gen.ts`, `__root.tsx`, `sitemap[.]xml.ts`)
- `src/router.tsx`, `src/start.ts`, `src/server.ts`
- `src/lib/error-page.ts`, `src/lib/error-capture.ts`
- `wrangler.jsonc`
- `vite.vercel.config.ts` (no longer needed — main config now works for Vercel)
- TanStack Start dependencies from `package.json` (`@tanstack/react-start`, `@tanstack/react-router`, `@lovable.dev/vite-tanstack-config`, `@cloudflare/vite-plugin`, `wrangler`)

### 8. Files added/updated dependencies
- Add `react-router-dom`, `react-helmet-async`
- Keep React 19, Tailwind v4, shadcn/ui, lucide-react, framer-motion, all current components untouched

### 9. Sitemap
Move `public/sitemap.xml` as a static file (replaces the server-rendered route). Same content.

## Important trade-offs

- **Lovable preview/editor**: This template is wired for TanStack Start. After this conversion, the Lovable in-app preview may stop rendering or behave unexpectedly. You'll still be able to edit code here, but the live preview pane is no longer guaranteed. Your GitHub + Vercel deployment is the source of truth going forward.
- **SEO meta**: Switches from SSR-injected `<head>` to client-side via `react-helmet-async`. Google renders JS, so rankings are unaffected, but raw `view-source` won't show per-page titles.
- **No backend**: Solver logic stays frontend-only (as it already is). If you later need server functions, you'd add Vercel serverless functions under `/api/`.

## After implementation
1. Push to GitHub.
2. In Vercel, import the repo — it auto-detects Vite.
3. Deploy. Site loads at your `.vercel.app` URL with all routes working on refresh.
