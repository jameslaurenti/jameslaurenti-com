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
      <p className="text-ink-mid mb-6 leading-relaxed" style={{ maxWidth: "62ch" }}>
        A weekly summary of what Beverly&apos;s boards actually did, and what is coming up.
        Built from the meeting recordings and the city&apos;s own posted documents, with a
        link into the recording for anything you want to hear yourself. Independent, and not
        a City of Beverly publication.
      </p>

      {/* The standing note lives here rather than at the top of every issue. It explains
          the project once, to someone arriving at the section, instead of re-introducing
          itself to a returning reader every week. */}
      <div className="mb-12 rounded-lg border border-rule bg-bg-card/60 px-6 py-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Why this exists</h2>
        <p className="mt-2.5 text-[0.97rem] leading-relaxed" style={{ maxWidth: "63ch" }}>
          I built it for myself first. Keeping up with what the city is actually doing has
          become a bit of a thing for me, but I have small kids, so I am not getting to
          meetings in person, and BevCam runs to hours of video a week. That is a real
          commitment for anyone.
        </p>
        <p className="mt-3 text-[0.97rem] leading-relaxed" style={{ maxWidth: "63ch" }}>
          So: take the recordings, turn them into transcripts, clean those up, and pull out
          what is worth knowing for the week ahead. Ten minutes with a coffee instead of
          three hours on the couch.
        </p>
        <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-faint" style={{ maxWidth: "63ch" }}>
          One caveat, and it matters. This starts from automatic transcripts, and they get
          names and numbers wrong. I check what I can against the city&apos;s posted agendas
          and minutes, and every issue says underneath each item which of the two it came
          from. Everything is linked so you can check me. If I have something wrong,{" "}
          <Link href="/contact" className="rlink">
            tell me
          </Link>{" "}
          and I will fix it.
        </p>
      </div>

      {/* The calendar does the same job as the digest, earlier: subscribe once and the
          meetings turn up in the calendar you already keep. webcal:// makes most desktop
          and phone clients offer to subscribe rather than download a dead snapshot, which
          is the whole difference between this and the per-event buttons inside an issue. */}
      <div className="mb-12 rounded-lg border border-rule px-6 py-5">
        <h2 className="font-display text-lg font-semibold">Put the meetings in your calendar</h2>
        <p className="mt-2 text-[0.97rem] leading-relaxed" style={{ maxWidth: "63ch" }}>
          Every meeting listed here, as a calendar you subscribe to once. New meetings
          appear on their own, and anything the city has not confirmed shows up marked
          tentative rather than pretending to be settled.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="webcal://www.jameslaurenti.com/beverly/meetings.ics"
            className="inline-flex min-h-10 items-center rounded border border-rule bg-white px-4 text-[0.9rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
            data-track="calendar_added"
            data-placement="archive-subscribe"
          >
            Subscribe in your calendar
          </a>
          <a
            href="/beverly/meetings.ics"
            className="rlink text-[0.88rem]"
            data-track="calendar_added"
            data-placement="archive-download"
          >
            or download the file
          </a>
        </div>
      </div>

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
