import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), mcpPlugin()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { host: "::", port: 8080 },
  build: {
    cssCodeSplit: true,
    // Only preload what the first paint actually needs; heavy vendor chunks
    // (charts, database client, animation) load on demand instead of
    // competing with the stylesheet for bandwidth.
    modulePreload: {
      resolveDependencies: (_url, deps) =>
        deps.filter((d) => !/(charts|supabase|radix|motion)-/.test(d)),
    },
    rollupOptions: {

      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Tiny shared utilities stay in the entry chunk. They can be nested
          // inside recharts, and grouping them into "charts" would drag the
          // whole 400 kB chart bundle onto every page.
          if (/node_modules\/(clsx|tailwind-merge|class-variance-authority)\//.test(id)) return;
          if (id.includes("recharts") || id.includes("victory-vendor") || /node_modules\/d3-/.test(id)) return "charts";
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) return "motion";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("react-router") || id.includes("scheduler")) return "react-vendor";
        },
      },
    },
  },
});
