import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analytics and privacy — James Laurenti",
  description:
    "What this site measures, why, and how to opt out. Short version: page views and which links get followed, nothing that identifies you.",
};

/**
 * Deliberately short and in the first person.
 *
 * Length reads as guilt on a page like this: the more elaborate the disclosure, the more
 * it sounds like something is being managed. Say what is collected, say why, say how to
 * stop it, and stop talking.
 */
export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
        Analytics and privacy
      </h1>

      <div className="prose text-ink">
        <p>
          I use Google Analytics to see which pieces get read and which links people
          actually follow. Mostly that comes down to one question. When I link to the
          recording of a meeting, does anyone open it? If people do, the work of making
          everything checkable is worth it. If nobody does, I should spend that effort
          somewhere more useful.
        </p>
        <p>
          It is ordinary traffic measurement. I do not collect your name or your email,
          and none of it tells me who you are. I am not selling anything, there are no
          ads here, and I do not share any of it with anyone.
        </p>
        <p>
          The reason I bother is that the feedback I get is wonderful and comes from
          about six people. I would rather know whether this is genuinely useful than
          guess from the kindness of whoever takes the time to write.
        </p>
        <p>
          If you would rather not be counted, any content blocker will stop it, and
          nothing on the site will break if you do.
        </p>
        <p>
          Questions, or anything here you think I have got wrong,{" "}
          <Link href="/contact" className="rlink">
            send them over
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
