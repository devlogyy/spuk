import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, User } from "lucide-react";
import { getPost, getRelated, posts } from "@/content/blog";
import { AdSlot } from "@/components/AdSlot";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/seo";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const url = absoluteUrl(`/blog/${post.slug}`);
  const related = getRelated(post.slug);
  const Body = post.Body;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.thumbnail),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`${post.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={absoluteUrl(post.thumbnail)} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li>/</li>
          <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
          <li>/</li>
          <li className="text-foreground">{post.category}</li>
        </ol>
      </nav>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {post.category}
        </div>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
      </motion.header>

      <figure className="mt-8 overflow-hidden rounded-3xl border border-border shadow-card">
        <img
          src={post.thumbnail}
          alt={post.thumbnailAlt}
          width={1280}
          height={704}
          className="h-auto w-full"
          loading="eager"
        />
      </figure>

      <article className="article-body mt-10">
        <Body />
      </article>

      {post.faqs.length > 0 && (
        <section className="mt-16 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
          <dl className="mt-6 space-y-6">
            {post.faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1.5 text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <AdSlot zoneKey="blog-inline" className="mt-10" />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-16">
          <h2 id="related-heading" className="font-display text-2xl font-bold">Related reading</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/blog/${r.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={r.thumbnail}
                    alt={r.thumbnailAlt}
                    loading="lazy"
                    width={1280}
                    height={704}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{r.category}</div>
                  <h3 className="mt-1.5 text-sm font-bold leading-snug group-hover:text-primary">{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-sm">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        <Link to={`/blog/${nextSlug(post.slug)}`} className="inline-flex items-center gap-1.5 text-primary">
          Next article <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function nextSlug(current: string): string {
  const idx = posts.findIndex((p) => p.slug === current);
  const next = posts[(idx + 1) % posts.length];
  return next.slug;
}
