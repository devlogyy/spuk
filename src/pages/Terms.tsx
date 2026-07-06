import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { absoluteUrl, breadcrumbSchema, SITE_NAME } from "@/lib/seo";

const OWNER = "Lexora";
const COUNTRY = "your country of residence";
const LAST_UPDATED = "July 2026";

export default function Terms() {
  const url = absoluteUrl("/terms");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service — {SITE_NAME}</title>
        <meta name="description" content={`The terms under which you may use ${SITE_NAME}'s word game tools, dictionaries and content.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Terms of Service — ${SITE_NAME}`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema([
          { name: "Home", path: "/" }, { name: "Terms", path: "/terms" },
        ]))}</script>
      </Helmet>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-widest text-primary">Legal</div>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-8 text-foreground/90">
          <section>
            <h2 className="font-display text-2xl font-bold">1. Acceptance</h2>
            <p className="mt-2 leading-relaxed">By accessing or using {SITE_NAME} (the "Site"), operated by {OWNER}, you agree to these Terms. If you do not agree, do not use the Site.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">2. What the Site offers</h2>
            <p className="mt-2 leading-relaxed">
              {SITE_NAME} provides word-game reference tools — including a Scrabble solver, crossword solver, word finder, and dictionary browsing — for personal, non-commercial use. Features may change or be removed at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">3. Acceptable use</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Do not scrape, mirror or bulk-download the Site or its dictionaries.</li>
              <li>Do not attempt to compromise the Site's security or disrupt its availability.</li>
              <li>Do not use the Site for anything unlawful in your jurisdiction.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">4. Intellectual property</h2>
            <p className="mt-2 leading-relaxed">
              The Site's original design, code and written content are the property of {OWNER}. Word lists (TWL, SOWPODS, ENABLE) and their associated scoring rules originate from third parties and remain the property of their respective owners. SCRABBLE® is a registered trademark; {SITE_NAME} is not affiliated with, endorsed by or sponsored by Hasbro, Mattel, Zynga or any dictionary publisher.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">5. Third-party services</h2>
            <p className="mt-2 leading-relaxed">
              The Site displays advertising via Google AdSense and may embed third-party content. Your use of those services is subject to their own terms and privacy policies. See our <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">6. No warranty</h2>
            <p className="mt-2 leading-relaxed">
              The Site is provided "as is" and "as available" without warranty of any kind. Dictionary validity is a best-effort reference; official tournament rulings should always be verified against the current TWL, SOWPODS, or the in-game validator of the app you're playing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">7. Limitation of liability</h2>
            <p className="mt-2 leading-relaxed">
              To the maximum extent permitted by law, {OWNER} will not be liable for any indirect, incidental or consequential loss arising from your use of the Site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">8. Changes</h2>
            <p className="mt-2 leading-relaxed">We may update these Terms. Continued use of the Site after changes means you accept the revised Terms.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">9. Governing law</h2>
            <p className="mt-2 leading-relaxed">These Terms are governed by the laws applicable in {COUNTRY}, without regard to conflict-of-law rules.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
