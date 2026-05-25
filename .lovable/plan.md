Plan to make the GitHub/Vercel setup a standard React + Vite TypeScript app:

1. Convert the app entry structure
- Add a normal Vite `index.html` at the project root.
- Add `src/main.tsx` as the browser entry point.
- Add `src/App.tsx` to own layout, navigation, routes, footer, and mobile nav.
- Move the current page UI into standard React page components instead of TanStack Start route files.

2. Replace server-first routing with client-side routing
- Remove the dependency on TanStack Start route generation for the frontend.
- Use a standard React SPA routing setup for:
  - `/`
  - `/scrabble-solver`
  - `/crossword-solver`
  - `/word-finder`
  - `/blog`
- Preserve the existing Lexora UI, responsiveness, SEO-facing page content, and solver interfaces.

3. Simplify Vite and deployment config
- Replace the current Lovable/TanStack Start Vite config with a conventional Vite React config.
- Update `package.json` scripts so Vercel can run:
  - `bun install`
  - `bun run build`
  - output directory: `dist`
- Add `vercel.json` with a rewrite fallback so direct visits and refreshes on routes like `/scrabble-solver` work correctly.

4. Remove Cloudflare/TanStack server-only files from the deployment path
- Remove or stop relying on Worker-specific files such as `wrangler.jsonc`, `src/server.ts`, and `src/start.ts` for this frontend-only phase.
- Keep the project frontend-only, as requested earlier: no backend logic yet.

5. Preserve SEO-ready frontend structure
- Keep page titles/descriptions using a lightweight document head helper inside the SPA.
- Keep `robots.txt` and sitemap behavior where possible for the static app.
- Ensure semantic headings, accessible labels, mobile tap targets, and responsive layout remain intact.

Technical notes:
- The current project is not broken; it is a TanStack Start SSR app, which is Vite-based but not the same as a plain React Vite SPA.
- Vercel is likely failing because the current template targets a server/edge runtime setup, not a simple static `dist` deployment.
- Since Lexora currently has no backend requirement, a Vite SPA is the safest structure for Vercel and GitHub hosting.
- After implementation, GitHub sync will receive the updated file arrangement automatically if the project is connected.