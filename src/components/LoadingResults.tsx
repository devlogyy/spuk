import { motion } from "framer-motion";

export function LoadingResults({ count = 6 }: { count?: number }) {
  return (
    <div aria-live="polite" aria-busy="true" className="space-y-3">
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-full w-1/3 bg-gradient-to-r from-primary to-gold"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-16 animate-pulse rounded bg-muted/70" />
          </div>
        ))}
      </div>
      <span className="sr-only">Searching for words…</span>
    </div>
  );
}
