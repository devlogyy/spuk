import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Word not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We searched every dictionary. This page isn't in any of them.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again, or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-to-r from-primary to-gold px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#ff7a30" },
      { title: "Lexora — AI Scrabble Solver, Crossword & Word Finder" },
      { name: "description", content: "Lexora is the premium AI-powered platform for Scrabble, Crossword, Anagrams and Word Finder. Beat any board with US & UK dictionaries, scoring, and smart suggestions." },
      { name: "author", content: "Lexora" },
      { property: "og:site_name", content: "Lexora" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Lexora — AI Scrabble Solver, Crossword & Word Finder" },
      { property: "og:description", content: "Lexora is the premium AI-powered platform for Scrabble, Crossword, Anagrams and Word Finder. Beat any board with US & UK dictionaries, scoring, and smart suggestions." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lexora — AI Scrabble Solver, Crossword & Word Finder" },
      { name: "twitter:description", content: "Lexora is the premium AI-powered platform for Scrabble, Crossword, Anagrams and Word Finder. Beat any board with US & UK dictionaries, scoring, and smart suggestions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8597e994-367d-48ef-80a8-2b13886a4ac4/id-preview-4c891544--6fe4ad78-1ff9-4e4a-99de-4307032ca854.lovable.app-1779550442962.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8597e994-367d-48ef-80a8-2b13886a4ac4/id-preview-4c891544--6fe4ad78-1ff9-4e4a-99de-4307032ca854.lovable.app-1779550442962.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Lexora",
          description: "AI-powered Scrabble, Crossword and Word Finder platform.",
          potentialAction: {
            "@type": "SearchAction",
            target: "/word-finder?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </QueryClientProvider>
  );
}
