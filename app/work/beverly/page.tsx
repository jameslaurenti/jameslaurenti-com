import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Civic Resources: Beverly — James Laurenti",
  description:
    "Explainers and tools that make Beverly's budget and development legible to the people who live here.",
};

type Piece = {
  title: string;
  blurb: string;
  href: string;
  beta?: boolean;
  meta?: string;
};

type Group = {
  label: string;
  description: string;
  numbered?: boolean;
  pieces: Piece[];
};

const groups: Group[] = [
  {
    label: "Reading",
    description:
      "Narrative explainers that turn a contentious civic problem into plain language. They build on each other, so start at the top.",
    numbered: true,
    pieces: [
      {
        title: "How the budget works",
        blurb: "Why the city keeps running short, in plain language.",
        href: "/work/beverly/budget-explainer",
        meta: "Written spring 2026, before the FY2027 budget was set",
      },
      {
        title: "The FY2027 budget",
        blurb:
          "The year the gap got real: rising costs, the trash-fee fight, and what was cut to balance one budget.",
        href: "/work/beverly/fy27-budget",
      },
    ],
  },
  {
    label: "Tools",
    description: "Interactive pieces. Poke at the numbers and the map yourself.",
    pieces: [
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
        beta: true,
      },
    ],
  },
];

export default function BeverlyCollection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Civic Resources: Beverly
      </h1>
      <p
        className="text-ink-mid mb-14 leading-relaxed"
        style={{ maxWidth: "62ch" }}
      >
        My town is making hard decisions with real consequences, and the
        conversation around them has been contentious. These are an attempt to
        make it clearer: explainers that walk through the problem, and tools to
        poke at it yourself. Nonpartisan, sourced, and built for people who
        don&apos;t have time to dig.
      </p>

      <div className="flex flex-col gap-12">
        {groups.map((group) => (
          <section key={group.label}>
            <div className="flex items-center gap-3">
              <h2
                className="font-semibold uppercase text-accent"
                style={{ fontSize: "0.78rem", letterSpacing: "0.16em" }}
              >
                {group.label}
              </h2>
              <span
                className="flex-1"
                style={{ height: "1px", background: "var(--color-accent)", opacity: 0.28 }}
              />
            </div>
            <p
              className="mt-2.5 text-ink-mid leading-relaxed"
              style={{ maxWidth: "60ch", fontSize: "0.95rem" }}
            >
              {group.description}
            </p>

            <ol
              className="mt-4 flex flex-col rounded-xl overflow-hidden"
              style={{
                border: "1px solid var(--color-line)",
                background: "var(--color-bg-card)",
              }}
            >
              {group.pieces.map((piece, i) => (
                <li
                  key={piece.href}
                  className={i > 0 ? "border-t border-line" : ""}
                >
                  <Link
                    href={piece.href}
                    className="group flex gap-5 px-5 sm:px-6 py-6 hover:text-accent transition-colors"
                  >
                    <span
                      className="font-display text-ink-faint shrink-0"
                      style={{ fontSize: "1.5rem", lineHeight: 1.15 }}
                      aria-hidden
                    >
                      {group.numbered ? (
                        i + 1
                      ) : (
                        <span style={{ fontSize: "0.9rem" }}>◆</span>
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-display text-2xl font-semibold tracking-tight">
                          {piece.title}
                        </h3>
                        {piece.beta && (
                          <span
                            className="shrink-0 rounded-full border border-ink-faint/40 text-ink-faint uppercase"
                            style={{
                              fontSize: "0.6rem",
                              padding: "0.12rem 0.5rem",
                              letterSpacing: "0.1em",
                            }}
                          >
                            Beta
                          </span>
                        )}
                      </div>
                      {piece.meta && (
                        <p
                          className="mt-1 text-ink-faint"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {piece.meta}
                        </p>
                      )}
                      <p className="mt-2 text-ink-mid leading-relaxed group-hover:text-accent/70 transition-colors">
                        {piece.blurb}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
