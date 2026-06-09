import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beverly, in public — James Laurenti",
  description:
    "Three tools that make Beverly's budget and development legible to the people who live here.",
};

type Piece = {
  title: string;
  blurb: string;
  href: string;
};

const pieces: Piece[] = [
  {
    title: "The budget, explained",
    blurb:
      "Why the city keeps running short, in plain language with the household version alongside.",
    href: "/work/beverly/budget-explainer",
  },
  {
    title: "Find the money",
    blurb:
      'The actual budget, and a chance to close the gap yourself. It’s harder than "just cut the waste."',
    href: "/work/beverly/budget-challenge",
  },
  {
    title: "The development map",
    blurb: "Where Beverly is changing, parcel by parcel.",
    href: "/work/beverly/development-map",
  },
];

export default function BeverlyCollection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Beverly, in public
      </h1>
      <p
        className="text-ink-mid mb-14 leading-relaxed"
        style={{ maxWidth: "62ch" }}
      >
        My town is making hard decisions with real consequences, and most of the
        conversation is heat, not light. These three things are an attempt at
        light: understand the problem, try to solve it yourself, then see it on
        the ground. Nonpartisan, sourced, and built for people who don&apos;t
        have time to dig.
      </p>

      <ol className="flex flex-col">
        {pieces.map((piece, i) => (
          <li key={piece.href} className="border-t border-line">
            <Link
              href={piece.href}
              className="group flex gap-5 py-8 hover:text-accent transition-colors"
            >
              <span
                className="font-display text-ink-faint shrink-0"
                style={{ fontSize: "1.5rem", lineHeight: 1.15 }}
              >
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {piece.title}
                </h2>
                <p className="mt-2 text-ink-mid leading-relaxed group-hover:text-accent/70 transition-colors">
                  {piece.blurb}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
