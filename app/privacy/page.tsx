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
 * it sounds like something is being managed. Say what is collected, say why, make the
 * opt-out genuinely easy, and stop talking.
 *
 * The opt-out links are real rather than decorative. The analytics wrapper no-ops when
 * gtag is absent, so "nothing will break" is a fact about the code and not a hope.
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
          follow. It tells me what people here are actually interested in, which helps me
          work out what to write next and how to make this more useful.
        </p>
        <p>
          It is ordinary traffic measurement. I do not collect your name or your email,
          and none of it tells me who you are. I am not selling anything, there are no ads
          here, and I do not share any of it with anyone.
        </p>
        <p>
          People do write to me, and I am grateful for every one of those notes. But far
          more people read this than write about it, and I would rather understand the
          whole picture than only the part of it that is kind enough to send a message.
        </p>
        <p>
          If you would rather not be counted, any content blocker will stop it and nothing
          on the site will break.{" "}
          <a
            href="https://ublockorigin.com/"
            target="_blank"
            rel="noopener"
            className="rlink"
          >
            uBlock Origin
          </a>{" "}
          is a good free one, or Google publishes its own{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener"
            className="rlink"
          >
            opt-out add-on
          </a>{" "}
          if you would rather switch off just the analytics.
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
