import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { absoluteUrl, breadcrumbSchema, SITE_NAME } from "@/lib/seo";

const CONTACT_EMAIL = "hello@spuk.lovable.app";

export default function Contact() {
  const url = absoluteUrl("/contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${SITE_NAME}] Message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` <${email}>` : ""}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact — {SITE_NAME}</title>
        <meta name="description" content={`Get in touch with the ${SITE_NAME} team. Feedback, corrections, partnership enquiries.`} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`Contact — ${SITE_NAME}`} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema([
          { name: "Home", path: "/" }, { name: "Contact", path: "/contact" },
        ]))}</script>
      </Helmet>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary">Contact</div>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">Say hello.</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Corrections, feature ideas, partnership questions or a friendly note — we read everything and reply within a couple of days.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">
            <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
          </a>

          <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Reporting a wrong word?</strong> Include the word, the tool you were using, and which dictionary you expected it to be valid in. We'll investigate and update the list if needed.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="name">Your name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="message">Message</label>
            <textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90">
            <Send className="h-4 w-4" /> Send message
          </button>
          <p className="text-xs text-muted-foreground">This opens your email client with the message pre-filled. No data is stored on our servers.</p>
        </form>
      </div>
    </div>
  );
}
