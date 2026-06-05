import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <Helmet>
        <title>404 — Page Not Found | Lexora</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
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
