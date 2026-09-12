import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writing — James Laurenti",
  description:
    "Essays on memory, identity, and what's worth paying attention to.",
};

/**
 * The other half of the site. The civic work has its own section because there is a
 * lot of it; this is where the essays live, and it is deliberately short. One good
 * piece is better than five written to fill a shelf.
 */
type Essay = {
  title: string;
  blurb: string;
  href: string;
  date: string;
};

const essays: Essay[] = [
  {
    title: "The Crystal and the Salute",
    blurb:
      "Girard, Rilke, and why being truly understood is one of the things that keeps us intact.",
    href: "/writing/the-crystal-and-the-salute",
    date: "2026",
  },
];

export default function Writing() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Writing
      </h1>
      <p
        className="text-ink-mid mb-12 leading-relaxed"
        style={{ maxWidth: "60ch" }}
      >
        Essays on memory, identity, and what&apos;s worth paying attention to.
        The other half of the curiosity: less about how a thing works, more about
        what it means. These come slowly.
      </p>

      <div className="flex flex-col">
        {essays.map((essay) => (
          <Link
            key={essay.href}
            href={essay.href}
            className="group border-t border-line py-8 flex flex-col gap-2.5 hover:text-accent transition-colors"
          >
            <span
              className="text-ink-faint uppercase"
              style={{ fontSize: "0.66rem", letterSpacing: "0.12em" }}
            >
              {essay.date}
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {essay.title}
            </h2>
            <p className="text-ink-mid leading-relaxed group-hover:text-accent/70 transition-colors">
              {essay.blurb}
            </p>
          </Link>
        ))}
      </div>

      <p
        className="text-ink-faint border-t border-line pt-8 mt-8 leading-relaxed"
        style={{ fontSize: "0.92rem", maxWidth: "60ch" }}
      >
        More of my time currently goes to{" "}
        <Link href="/work/beverly" className="rlink">
          the Beverly work
        </Link>
        , which is its own section.
      </p>
    </div>
  );
}
