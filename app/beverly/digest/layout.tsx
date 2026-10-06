import type { Metadata } from "next";

/**
 * Wraps the archive and every issue. Two jobs: tell feed readers where the feeds are, and
 * say once, under every page, that the digest is free to reuse. The terms live here rather
 * than inside each issue so published issues stay as they were written.
 */
export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/beverly/digest/feed.xml", title: "Beverly Meeting Digest" },
        { url: "/beverly/digest/stories.xml", title: "Beverly Meeting Digest, story by story" },
      ],
    },
  },
};

export default function DigestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="bg-bg">
        <p
          className="mx-auto max-w-3xl px-6 pb-16 text-[0.85rem] leading-relaxed text-ink-faint"
          style={{ maxWidth: "48rem" }}
        >
          Free to reuse, adapt or republish, no permission needed (
          <a href="https://creativecommons.org/publicdomain/zero/1.0/" className="rlink">
            CC0
          </a>
          ). A link back is appreciated, and please keep the links to recordings and documents.
          Feeds:{" "}
          <a href="/beverly/digest/feed.xml" className="rlink">
            every issue
          </a>{" "}
          &middot;{" "}
          <a href="/beverly/digest/stories.xml" className="rlink">
            every story
          </a>
          .
        </p>
      </div>
    </>
  );
}
