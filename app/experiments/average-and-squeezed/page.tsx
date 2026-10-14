import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * "Average, and Squeezed Anyway": the Beverly identity essay, in draft, shared by link
 * with a handful of readers for comment.
 *
 * Unlisted under /experiments, which carries `X-Robots-Tag: noindex, nofollow` from
 * next.config.ts and is deliberately absent from the sitemap and the nav. It is not in
 * robots.ts disallow, for the reason set out there: a disallowed page is never fetched,
 * so the crawler never sees the noindex and the bare URL can still surface.
 *
 * The piece is PAUSED. A load-bearing claim, that Beverly has never put a Proposition 2.5
 * question to voters, is wrong: a $2.5M override failed in June 2008 and is missing from
 * the state's own override database. The note at the top says so, and names the sections
 * that depend on it. Do not publish this to a real route until those are rebuilt.
 *
 * Body HTML is generated from draft_reframe_v2.md in the beverly-identity project; edit
 * the markdown and regenerate rather than editing content/experiments/*.html by hand.
 */

export const metadata: Metadata = {
  title: "Average, and Squeezed Anyway — working draft",
  description:
    "A draft on Beverly's budget: where the squeeze comes from, what the schools cost, and what comparable communities have done. Shared privately for comment.",
  robots: { index: false, follow: false },
};

const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[1.0rem] leading-[1.7] text-ink-mid">{children}</p>
);

export default function AverageAndSqueezedDraft() {
  const body = fs.readFileSync(
    path.join(process.cwd(), "content", "experiments", "average-and-squeezed.html"),
    "utf8",
  );

  return (
    <div className="bg-bg text-ink">
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        Unpublished draft &middot; paused &middot; shared by link
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Average, and Squeezed Anyway
        </h1>
        <p className="mt-3 text-[1.05rem] text-ink-faint">
          Working draft, circulated privately for comment. Paused 29 September 2026.
        </p>

        <section className="mt-10 rounded-lg border border-rule bg-white/70 px-6 py-5">
          <h2 className="font-display text-xl font-bold tracking-tight">Read this first</h2>

          <Note>This draft is paused, and I want to say why before you read it.</Note>

          <Note>
            It is built in part on a claim that turned out to be wrong. I had Beverly as one of
            eighteen Massachusetts municipalities that has never put a Proposition 2&frac12;
            question to its voters, not an override and not a debt exclusion. Beverly held one.
            In June 2008 a $2.5 million override went on the ballot and lost, 6,686 to 3,846,
            with &ldquo;no&rdquo; carrying all twelve precincts. The McKeown School closed at the
            end of that month.
          </Note>

          <Note>
            The error came from the source. The state&rsquo;s database of override votes, which
            is where a claim like this comes from, does not contain that election. I checked it
            and it returned nothing for Beverly. A discussion guide from Rep. Hannah
            Bowen&rsquo;s office flags the same defect, noting that the state&rsquo;s data
            &ldquo;may be missing some votes that failed.&rdquo; The mistake is still mine. It
            also says something worth knowing on its own: the public record here is not
            complete.
          </Note>

          <Note>
            That claim is load-bearing. It is the thesis in section 1, the comparison that runs
            through section 7, the closing argument in section 9, and the whole premise of
            Appendix A. Those passages are wrong as written. They need rebuilding around
            something closer to &ldquo;has not put a question to voters since a 2008 override
            failed,&rdquo; and I have not made those edits yet, on purpose, because I would
            rather you saw what I actually had than a patch over it.
          </Note>

          <Note>
            The rest has been checked against primary sources and has already survived several
            rounds of correction. But I have been sitting on this for about a month instead of
            publishing, because when the most striking thing in a piece turns out to rest on an
            incomplete source, the answer is to slow down and re-verify, not to fix one sentence
            and keep going.
          </Note>

          <Note>
            <strong className="text-ink">What would help most:</strong> tell me where you do not
            believe me, and what you would go check. Flag anything that reads as an argument
            rather than a finding. And if you know anything about that 2008 vote,{" "}
            <Link href="/contact" className="rlink">
              I want to hear it
            </Link>
            .
          </Note>
        </section>

        <div
          className="prose essay mt-12 text-ink"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  );
}
