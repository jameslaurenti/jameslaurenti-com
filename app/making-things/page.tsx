import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Making Things — James Laurenti",
  description: "Writing, music, and experiments.",
};

const typeLabel: Record<Post["type"], string> = {
  essay: "Essay",
  song: "Song",
  experiment: "Experiment",
};

export default function MakingThings() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Making Things
      </h1>
      <p className="text-ink-mid mb-14 leading-relaxed">
        Writing, songs, experiments. Things I've made, not a formal blog.
      </p>

      {posts.length === 0 ? (
        <p className="text-dim border-t border-line pt-10">
          Nothing here yet. Check back soon.
        </p>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => {
            const isExternal = Boolean(post.external_url);
            const href = isExternal
              ? post.external_url!
              : `/making-things/${post.slug}`;

            return (
              <a
                key={post.slug}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group border-t border-line py-7 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 hover:text-accent transition-colors"
              >
                <div>
                  <span className="font-medium">
                    {post.title}
                    {isExternal && " ↗"}
                  </span>
                  {post.description && (
                    <p className="text-sm text-ink-mid mt-1 group-hover:text-accent/70 transition-colors">
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-dim uppercase tracking-wide">
                    {typeLabel[post.type]}
                  </span>
                  {post.date && (
                    <span className="text-xs text-dim">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
