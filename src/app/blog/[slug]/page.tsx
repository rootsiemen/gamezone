import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost, formatPostDate } from "@/lib/posts";

const SITE_URL = "https://games.tempmaill.tech";

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | PlayZone Blog`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const url = `${SITE_URL}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "PlayZone", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "PlayZone",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-[#a3adc9]">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-white">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-white font-semibold">{post.title}</span>
      </nav>
      <div className="mt-4 text-5xl">{post.emoji}</div>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-[#a3adc9]">
        <span>{formatPostDate(post.date)}</span>
        <span>•</span>
        <span>{post.readMinutes} min read</span>
        <span>•</span>
        <span>PlayZone</span>
      </div>
      <div className="mt-8 space-y-8">
        {post.content.map((block, i) => (
          <section key={i}>
            {block.heading && (
              <h2 className="mb-3 text-2xl font-bold text-white">
                {block.heading}
              </h2>
            )}
            {block.paragraphs.map((para, j) => (
              <p
                key={j}
                className="mb-4 leading-relaxed text-[#d5daf0]"
              >
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-[#35406e] bg-[#232b4d] p-6 text-center">
        <p className="text-lg font-bold text-white">
          Done reading? Time to play! 🎮
        </p>
        <Link
          href="/"
          className="mt-3 inline-block rounded-xl bg-[#7c6cf8] px-6 py-3 font-bold text-white transition hover:bg-[#6a5ae0]"
        >
          Play Free Games
        </Link>
      </div>
      {others.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-white">
            More from the blog
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/blog/${o.slug}`}
                className="rounded-2xl border border-[#35406e] bg-[#2a3560] p-4 transition hover:border-[#7c6cf8]"
              >
                <div className="text-3xl">{o.emoji}</div>
                <h3 className="mt-2 text-sm font-bold text-white line-clamp-2">
                  {o.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
