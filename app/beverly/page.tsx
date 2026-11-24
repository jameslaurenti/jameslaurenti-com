import type { Metadata } from "next";
import Link from "next/link";
import { issues } from "@/data/beverly/digestIssues";
import HubSignup from "@/components/beverly/HubSignup";

export const metadata: Metadata = {
  title: "Beverly — James Laurenti",
  description:
    "A weekly digest of what Beverly's city boards did, and explainers on how the city works. Neutral, sourced, and linked into the meeting recordings.",
  openGraph: {
    type: "website",
    title: "Beverly",
    description:
      "A weekly digest of what Beverly's city boards did, and explainers on how the city works. Neutral and sourced.",
    url: "/beverly",
  },
};

/**
 * The Beverly hub, simplified in November 2026. The digest is the center of the project now,
 * so it leads: the newest issue, the email signup and the archive. Everything else is a flat
 * list of finished pieces with no reading order. The earlier version told one story about the
 * budget deficit in numbered parts, with "coming soon" slots for pieces still in progress.
 *
 * Interim on purpose: the civic work is moving to its own site (see "Plan to launch" in
 * docs/beverly/development-map.md), so this page stays small until then.
 */

type Featured = {
  title: string;
  kind: "Explainer" | "Tool";
  blurb: string;
  href: string;
};

/**
 * Only pieces that are already public: finished, indexed and in the sitemap. Drafts and held
 * work (the pension cliff, the bridge model, Who Beverly is, the zoning guide) stay unlinked or
 * in /experiments until they launch. The development map is left off as well; its page still
 * works for old links and moves with the rest of the civic work.
 */
const featured: Featured[] = [
  {
    title: "How the budget works",
    kind: "Explainer",
    blurb:
      "Why the city keeps running short, how a state cap limits revenue growth while costs outpace it, and what that math looks like in plain language.",
    href: "/beverly/budget-explainer",
  },
  {
    title: "What sets your property taxes, and what doesn't",
    kind: "Explainer",
    blurb:
      "How property taxes work across Massachusetts, and why the wealthiest towns are not the highest-taxed. Covers the whole state, not just Beverly.",
    href: "/beverly/what-sets-your-taxes",
  },
  {
    title: "MA property tax explorer",
    kind: "Tool",
    blurb:
      "Look up any Massachusetts town to see its tax bill and rate over the past decade, its fiscal shape alongside peer communities, and whether property values outran local incomes.",
    href: "/beverly/property-tax",
  },
  {
    title: "The FY2027 budget",
    kind: "Explainer",
    blurb:
      "Rising costs, the trash-fee debate, and the cuts used to balance a single year's budget.",
    href: "/beverly/fy27-budget",
  },
  {
    title: "Find the money",
    kind: "Tool",
    blurb:
      "The city's budget, with sliders to close the gap yourself. Harder than just cutting waste.",
    href: "/beverly/budget-challenge",
  },
];

/** First sentence of an issue teaser, for the compact list of earlier issues. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s+[A-Z]|$)/);
  return match ? match[0] : text;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2
        className="font-semibold uppercase text-accent"
        style={{ fontSize: "0.78rem", letterSpacing: "0.16em" }}
      >
        {children}
      </h2>
      <span
        className="flex-1"
        style={{ height: "1px", background: "var(--color-accent)", opacity: 0.28 }}
      />
    </div>
  );
}

export default function BeverlyHub() {
  // issues is newest first, read from data/beverly/digestIssues.ts, so publishing an issue
  // updates this page with no other step.
  const [current, ...older] = issues;
  const earlier = older.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Beverly
      </h1>
      <p className="text-ink-mid mb-10 leading-relaxed" style={{ maxWidth: "62ch" }}>
        A weekly digest of what Beverly&apos;s city boards did, plus a few longer explainers on
        how the city works. Neutral, sourced, and linked into the meeting recordings so you can
        hear them for yourself.
      </p>

      {/* The digest: newest issue on top (the whole block opens it, via a stretched link),
          the email form under it. The form sits outside the stretched link's block, so no
          z-index layering is needed. */}
      <section className="mb-12 overflow-hidden rounded-lg border border-accent/35 bg-accent-glow">
        <div className="group relative px-6 pt-6 pb-5 sm:px-7 transition-colors hover:bg-bg-card">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span
              className="font-semibold uppercase text-accent"
              style={{ fontSize: "0.72rem", letterSpacing: "0.16em" }}
            >
              The Beverly Meeting Digest
            </span>
            <span className="text-ink-faint" style={{ fontSize: "0.8rem" }}>
              New issue Mondays
            </span>
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight mt-2 transition-colors group-hover:text-accent">
            <Link
              href={`/beverly/digest/${current.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              Issue No. {current.number} &middot; Covering {current.covering}
            </Link>
          </h2>
          <p className="mt-2 text-ink-mid leading-relaxed">{current.teaser}</p>
          <span className="mt-3 inline-block text-accent" style={{ fontSize: "0.88rem" }}>
            Read this issue &rarr;
          </span>
        </div>
        <div className="border-t border-accent/20 px-6 py-5 sm:px-7">
          <HubSignup />
        </div>
      </section>

      <section className="mb-14">
        <SectionLabel>Earlier issues</SectionLabel>
        <ul className="mt-2">
          {earlier.map((issue) => (
            <li key={issue.slug} className="border-b border-line">
              <Link
                href={`/beverly/digest/${issue.slug}`}
                className="group flex flex-col gap-1 py-4 transition-colors hover:text-accent"
              >
                <span
                  className="text-ink-faint uppercase"
                  style={{ fontSize: "0.66rem", letterSpacing: "0.12em" }}
                >
                  No. {issue.number} &middot; {issue.published}
                </span>
                <span className="leading-relaxed text-ink-mid transition-colors group-hover:text-accent">
                  {firstSentence(issue.teaser)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4" style={{ fontSize: "0.92rem" }}>
          <Link href="/beverly/digest" className="rlink font-semibold">
            {`All ${issues.length} issues →`}
          </Link>
        </p>
      </section>

      <section>
        <SectionLabel>Featured</SectionLabel>
        <p
          className="mt-2.5 text-ink-mid leading-relaxed"
          style={{ maxWidth: "60ch", fontSize: "0.95rem" }}
        >
          Longer explainers and tools. Each one stands on its own.
        </p>
        <ul
          className="mt-4 flex flex-col rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-card)" }}
        >
          {featured.map((piece, i) => (
            <li key={piece.href} className={i > 0 ? "border-t border-line" : ""}>
              <Link
                href={piece.href}
                className="group block px-5 sm:px-6 py-5 transition-colors hover:text-accent"
              >
                <span
                  className="text-ink-faint uppercase"
                  style={{ fontSize: "0.64rem", letterSpacing: "0.12em" }}
                >
                  {piece.kind}
                </span>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {piece.title}
                </h3>
                <p
                  className="mt-1.5 text-ink-mid leading-relaxed transition-colors group-hover:text-accent/70"
                  style={{ fontSize: "0.95rem" }}
                >
                  {piece.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p
        className="mt-14 border-t border-line pt-8 text-ink-faint leading-relaxed"
        style={{ fontSize: "0.92rem", maxWidth: "62ch" }}
      >
        Independent, and not a City of Beverly publication. If I have something wrong,{" "}
        <Link href="/contact" className="rlink">
          tell me
        </Link>{" "}
        and I will fix it.
      </p>
    </div>
  );
}
