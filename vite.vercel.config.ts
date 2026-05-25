// Vercel-only Vite config. Does NOT touch vite.config.ts (which Lovable uses).
// Run with: vite build --config vite.vercel.config.ts
//
// This builds TanStack Start for a Node serverless target instead of
// Cloudflare Workers, so it can run on Vercel via a serverless function.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "vercel",
      customViteReactPlugin: true,
    }),
    viteReact(),
  ],
});
