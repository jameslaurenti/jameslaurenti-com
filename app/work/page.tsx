import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work — James Laurenti",
  description:
    "Two ways I get curious: figuring out how things work, and chasing what things mean.",
};

type Mode = "How things work" | "What things mean";

type Entry = {
  title: string;
  tag: Mode;
  blurb: string;
  href: string;
};

// Flat, tagged index. Adding a piece later is a one-object change; the tag is a
// field, so promoting to two dedicated section pages stays a refactor of this list.
const entries: Entry[] = [
  {
    title: "Beverly, in public",
    tag: "How things work",
    blurb:
      "Three tools that make my city's budget and development legible to the people who live here.",
    href: "/work/beverly",
  },
  {
    title: "The Crystal and the Salute",
    tag: "What things mean",
    blurb:
      "Girard, Rilke, and why being truly understood is one of the things that keeps us intact.",
    href: "/work/the-crystal-and-the-salute",
  },
];

export default function Work() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Work
      </h1>
      <p
        className="text-ink-mid mb-12 leading-relaxed"
        style={{ maxWidth: "60ch" }}
      >
        Two ways I get curious: figuring out{" "}
        <strong className="font-semibold text-ink">how things work</strong>, and
        chasing{" "}
        <strong className="font-semibold text-ink">what things mean.</strong>{" "}
        Some of it&apos;s built for other people, some of it&apos;s just for me.
        All of it started with a problem I couldn&apos;t put down.
      </p>

      <div className="flex flex-col">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group border-t border-line py-8 flex flex-col gap-2.5 hover:text-accent transition-colors"
          >
            <span
              className="self-start rounded-full border border-accent/40 text-accent uppercase"
              style={{
                fontSize: "0.62rem",
                padding: "0.18rem 0.6rem",
                letterSpacing: "0.1em",
              }}
            >
              {entry.tag}
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {entry.title}
            </h2>
            <p className="text-ink-mid leading-relaxed group-hover:text-accent/70 transition-colors">
              {entry.blurb}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
