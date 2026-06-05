import { Link } from "react-router-dom";
import type { FAQItem } from "@/lib/seo";

interface ToolFAQProps {
  title?: string;
  faqs: FAQItem[];
  related?: { to: string; label: string; desc?: string }[];
}

/**
 * On-page FAQ + internal-link block for tool pages.
 * Pairs with FAQPage JSON-LD injected via Helmet at the page level.
 */
export function ToolFAQ({ title = "Frequently asked questions", faqs, related }: ToolFAQProps) {
  return (
    <section className="mt-16 space-y-10">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1.5 text-sm text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      {related && related.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold">Related guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="block rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary"
              >
                <div className="text-sm font-bold leading-snug">{r.label}</div>
                {r.desc && <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
