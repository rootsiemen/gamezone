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

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/blog"
        className="text-sm font-bold text-[#7c6cf8] hover:text-[#9a8fff]"
      >
        ← Back to blog
      </Link>
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
            {block.image && (
              <figure className="mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.image.src}
                  alt={block.image.alt}
                  loading="lazy"
                  className="w-full rounded-2xl border border-[#35406e]"
                />
              </figure>
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
