import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, renderMarkdown } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts()
    .filter((p) => !p.external_url)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — James Laurenti`,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.external_url) notFound();

  const contentHtml = await renderMarkdown(post.content);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <Link
        href="/making-things"
        className="text-sm text-dim hover:text-accent transition-colors"
      >
        ← Making Things
      </Link>

      <header className="mt-8 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-dim uppercase tracking-wide">
            {post.type}
          </span>
          {post.date && (
            <span className="text-xs text-dim">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-3 text-dim text-lg">{post.description}</p>
        )}
      </header>

      <div
        className="prose text-ink"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
