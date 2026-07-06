import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { absoluteUrl, breadcrumbSchema, SITE_NAME } from "@/lib/seo";

const OWNER = "Lexora";
const CONTACT_EMAIL = "hello@spuk.lovable.app";
const COUNTRY = "your country of residence";
const LAST_UPDATED = "July 2026";

export default function Privacy() {
  const url = absoluteUrl("/privacy");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy — {SITE_NAME}</title>
        <meta name="description" content={`How ${SITE_NAME} collects, uses and protects your information, including cookies and third-party advertising like Google AdSense.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Privacy Policy — ${SITE_NAME}`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema([
          { name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" },
        ]))}</script>
      </Helmet>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs uppercase tracking-widest text-primary">Legal</div>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="font-display text-2xl font-bold">1. Who we are</h2>
            <p className="mt-2 leading-relaxed">
              {OWNER} operates {SITE_NAME} (the "Site"), a free word-game and dictionary tool. This policy explains what data we collect, how we use it, and the choices you have. Contact: <a className="text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">2. Information we collect</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed">
              <li><strong>Account data</strong> — if you sign in, we store your email address and an authentication identifier via our backend provider.</li>
              <li><strong>Usage data</strong> — anonymous page views, search queries entered into our tools, referrer, approximate location (country), device type and browser.</li>
              <li><strong>Cookies and similar technologies</strong> — see section 4.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">3. How we use information</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed">
              <li>To provide and improve the Site's tools and content.</li>
              <li>To measure aggregate traffic and understand which features are useful.</li>
              <li>To secure the Site against abuse.</li>
              <li>To serve advertising that helps keep the Site free (see section 5).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">4. Cookies</h2>
            <p className="mt-2 leading-relaxed">
              We use first-party cookies to remember your preferences (dictionary, theme, cookie consent) and third-party cookies for analytics and advertising. You can accept, reject or change your choices at any time using the "Cookie settings" link in the footer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">5. Advertising — Google AdSense</h2>
            <p className="mt-2 leading-relaxed">
              We use <strong>Google AdSense</strong> to display advertisements. Google, as a third-party vendor, uses cookies (including the DoubleClick DART cookie) and identifiers to serve ads based on prior visits to this and other websites. Third-party vendors and ad networks may also use cookies to serve ads based on your browsing behaviour.
            </p>
            <p className="mt-3 leading-relaxed">
              You can opt out of personalised advertising by visiting <a className="text-primary underline" href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors' cookies at <a className="text-primary underline" href="https://www.aboutads.info/choices" target="_blank" rel="noreferrer">aboutads.info/choices</a> and <a className="text-primary underline" href="https://www.youronlinechoices.com" target="_blank" rel="noreferrer">youronlinechoices.com</a> (EU).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">6. Analytics</h2>
            <p className="mt-2 leading-relaxed">
              We use privacy-respecting analytics to count visits and understand navigation patterns. Analytics data is aggregated and does not identify you personally.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">7. Data retention & your rights</h2>
            <p className="mt-2 leading-relaxed">
              Account data is retained while your account is active. You can request access, correction or deletion of your personal data by emailing <a className="text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. If you are in the EEA or UK, you have rights under the GDPR / UK GDPR including the right to lodge a complaint with your local supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">8. Children</h2>
            <p className="mt-2 leading-relaxed">
              {SITE_NAME} is a general-audience site and is not directed at children under 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">9. Changes</h2>
            <p className="mt-2 leading-relaxed">
              We may update this policy from time to time. Material changes will be reflected by updating the "Last updated" date above.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">10. Governing law</h2>
            <p className="mt-2 leading-relaxed">
              This policy is governed by the laws applicable in {COUNTRY}. See our <Link to="/terms" className="text-primary underline">Terms of Service</Link> for related terms.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
