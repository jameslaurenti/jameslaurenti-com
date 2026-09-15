import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest, all issues — James Laurenti",
  description:
    "Every issue of the weekly digest of Beverly city meetings. What the boards did, and what is coming next.",
  // Out of search while the digest is a prototype, matching the issue pages.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: "Beverly Meeting Digest, all issues",
    description:
      "A weekly digest of Beverly city meetings. What the boards did, and what is coming next.",
    url: "/beverly/digest",
    images: ["/beverly/opengraph-image"],
  },
};

/**
 * The archive earns its keep for citation and continuity rather than browsing. Almost
 * nobody reads back issues, but a permalink lets an issue say "as reported on the 11th"
 * and mean it, and threads that run across weeks need the earlier instalment to still
 * exist somewhere. A dated list is very likely enough forever; if it ever is not, that
 * is the point to add filtering, not before.
 */
type Issue = {
  slug: string;
  number: number;
  published: string;
  covering: string;
  teaser: string;
};

const issues: Issue[] = [
  {
    slug: "2026-09-11",
    number: 1,
    published: "September 11, 2026",
    covering: "August 26 to September 9",
    teaser:
      "The Council rejected every proposal for the former dollar store site. A ban on crypto kiosks passed first reading nine to nothing. City Hall moves across the street in October, and Council meetings move with it.",
  },
];

export default function DigestArchive() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Beverly Meeting Digest
      </h1>
      <p className="text-ink-mid mb-12 leading-relaxed" style={{ maxWidth: "62ch" }}>
        A weekly summary of what Beverly&apos;s boards actually did, and what is coming up.
        Built from the meeting recordings and the city&apos;s own posted documents, with a
        link into the recording for anything you want to hear yourself. Independent, and not
        a City of Beverly publication.
      </p>

      <div className="flex flex-col">
        {issues.map((issue) => (
          <Link
            key={issue.slug}
            href={`/beverly/digest/${issue.slug}`}
            className="group border-t border-line py-8 flex flex-col gap-2 hover:text-accent transition-colors"
          >
            <span
              className="text-ink-faint uppercase"
              style={{ fontSize: "0.66rem", letterSpacing: "0.12em" }}
            >
              No. {issue.number} &middot; {issue.published}
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Covering {issue.covering}
            </h2>
            <p className="text-ink-mid leading-relaxed group-hover:text-accent/70 transition-colors">
              {issue.teaser}
            </p>
          </Link>
        ))}
      </div>

      <p
        className="text-ink-faint border-t border-line pt-8 mt-8 leading-relaxed"
        style={{ fontSize: "0.92rem", maxWidth: "62ch" }}
      >
        The explainers and tools that sit behind these summaries are in{" "}
        <Link href="/beverly" className="rlink">
          the rest of the Beverly work
        </Link>
        .
      </p>
    </div>
  );
}
