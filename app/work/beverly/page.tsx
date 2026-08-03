import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Beverly Does Next — James Laurenti",
  description:
    "Beverly's budget is tightening, and the choices the city makes over the next few years will shape the town. Plain-language pieces and tools to help residents understand it and weigh in. Nonpartisan and sourced.",
};

type ToolLink = { label: string; href: string; why?: string };

type Piece = {
  title: string;
  blurb: string;
  href?: string; // omitted while a piece is in progress
  status?: "beta" | "soon" | "next";
  meta?: string;
  alongside?: ToolLink[]; // tools/color that sit with this part of the story
};

type Group = {
  label: string;
  description: string;
  numbered?: boolean;
  pieces: Piece[];
};

const groups: Group[] = [
  {
    label: "The story",
    description:
      "One narrative in three parts: how the budget got here, how this year played out, and the choices ahead. Start at the top.",
    numbered: true,
    pieces: [
      {
        title: "How the budget works",
        blurb:
          "Why the city keeps running short: a state cap on how fast it can raise money, and costs that outrun it. The problem, in plain language.",
        href: "/work/beverly/budget-explainer",
        alongside: [
          { label: "MA property tax explorer", href: "/work/beverly/property-tax", why: "how Beverly's taxes compare to every MA town" },
          { label: "Development map", href: "/work/beverly/development-map", why: "where Beverly's new tax base is being built" },
        ],
      },
      {
        title: "The FY2027 budget",
        blurb:
          "The year the gap got real: rising costs, the trash-fee fight, and what was cut to balance one budget.",
        href: "/work/beverly/fy27-budget",
        alongside: [{ label: "Find the money", href: "/work/beverly/budget-challenge", why: "try closing this year's gap yourself" }],
      },
      {
        title: "The options",
        blurb:
          "What Beverly could do about the bigger gaps ahead, and what each choice costs. It follows the city's Deficit Reduction Committee as it weighs the real options, and the FY2028 shortfall nearly doubles this year's.",
        status: "next",
      },
    ],
  },
  {
    label: "Go deeper",
    description: "Standalone reads that sit alongside the story rather than inside it.",
    pieces: [
      {
        title: "Who Beverly is",
        blurb:
          "A decade of budget choices, measured against six North Shore neighbors, and what they reveal about the town. The scorecard behind the options ahead.",
        href: "/work/beverly/who-beverly-is",
      },
      {
        title: "What sets your property taxes, and what doesn't",
        blurb:
          "How the property tax really works across Massachusetts, and why the wealthiest towns are not the highest-taxed. Statewide, not just Beverly.",
        href: "/work/beverly/what-sets-your-taxes",
      },
    ],
  },
  {
    label: "Explore",
    description: "Interactive pieces. Poke at the numbers and the map yourself.",
    pieces: [
      {
        title: "MA property tax explorer",
        blurb:
          "Every Massachusetts town: your bill and rate across the decade, your town's fiscal shape and the towns most like it, and whether its property values outran its residents' incomes.",
        href: "/work/beverly/property-tax",
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
        status: "beta",
      },
    ],
  },
];

function StatusChip({ status }: { status: "beta" | "soon" | "next" }) {
  const label = status === "beta" ? "Beta" : status === "next" ? "Next" : "In progress";
  const isNext = status === "next";
  return (
    <span
      className={`shrink-0 rounded-full uppercase ${isNext ? "border border-accent text-accent font-semibold" : "border border-ink-faint/40 text-ink-faint"}`}
      style={{ fontSize: "0.6rem", padding: "0.12rem 0.5rem", letterSpacing: "0.1em" }}
    >
      {label}
    </span>
  );
}

function PieceHeaderBlurb({ piece }: { piece: Piece }) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <h3
          className="font-display text-2xl font-semibold tracking-tight"
        >
          {piece.title}
        </h3>
        {piece.status && <StatusChip status={piece.status} />}
      </div>
      {piece.meta && (
        <p className="mt-1 text-ink-faint" style={{ fontSize: "0.8rem" }}>
          {piece.meta}
        </p>
      )}
      <p className="mt-2 text-ink-mid leading-relaxed group-hover:text-accent/70 transition-colors">
        {piece.blurb}
      </p>
    </>
  );
}

export default function BeverlyCollection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        What Beverly Does Next
      </h1>
      <p className="text-ink-mid mb-6 leading-relaxed" style={{ maxWidth: "62ch" }}>
        Beverly is running short. A state law caps how fast the city can raise money, its costs rise faster,
        and the gap between them is starting to hit the services people use. That is not just a Beverly
        problem. Every city and town in Massachusetts runs under the same rules. But how Beverly handles the
        next few years will shape the kind of town it is for a long time after. This is hard to follow. I
        built these pieces to make it clearer, so you can weigh in with more confidence when you want to.
        Nonpartisan, sourced, and built for people who don&apos;t have time to dig.
      </p>

      <div className="mb-14 rounded-r-md border-l-4 border-accent bg-bg-card/60 px-6 py-5" style={{ maxWidth: "62ch" }}>
        <div className="font-display text-lg font-semibold text-ink">A note on why this exists</div>
        <p className="mt-2 leading-relaxed text-ink" style={{ fontSize: "0.95rem" }}>
          I built this because I wanted it and couldn&apos;t find it. I kept hearing about Beverly&apos;s budget
          in passing, and every explanation was either a snapshot missing the context or a source with an agenda.
          I&apos;m a fairly new resident and a father. I love this place, my kids will always call it home, and
          I&apos;m invested in its future. This is also just what I do: my work is untangling complicated problems
          so the people who have to decide can see them clearly, and I care more about handing over the whole
          picture than steering the answer. So here it is. You decide.
        </p>
        <p className="mt-3 font-display italic text-ink-faint" style={{ fontSize: "0.85rem" }}>James Laurenti</p>
      </div>

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
              style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-card)" }}
            >
              {group.pieces.map((piece, i) => {
                const marker = group.numbered ? i + 1 : <span style={{ fontSize: "0.9rem" }}>◆</span>;
                return (
                  <li key={piece.title} className={`flex gap-5 px-5 sm:px-6 py-6 ${i > 0 ? "border-t border-line" : ""}`}>
                    <span
                      className="font-display text-ink-faint shrink-0"
                      style={{ fontSize: "1.5rem", lineHeight: 1.15 }}
                      aria-hidden
                    >
                      {marker}
                    </span>
                    <div className="flex-1">
                      {piece.href ? (
                        <Link href={piece.href} className="group block hover:text-accent transition-colors">
                          <PieceHeaderBlurb piece={piece} />
                        </Link>
                      ) : (
                        <div className="opacity-75">
                          <PieceHeaderBlurb piece={piece} />
                        </div>
                      )}
                      {piece.alongside && piece.alongside.length > 0 && (
                        <div className="mt-3.5 rounded-md border border-rule bg-bg/50 px-3.5 py-2.5">
                          <span
                            className="block font-bold uppercase text-ink-faint"
                            style={{ fontSize: "0.6rem", letterSpacing: "0.13em" }}
                          >
                            Interactive tools for this part
                          </span>
                          <ul className="mt-1.5 flex flex-col gap-1">
                            {piece.alongside.map((t) => (
                              <li key={t.href} style={{ fontSize: "0.85rem" }}>
                                <Link href={t.href} className="rlink">
                                  {t.label}
                                </Link>
                                {t.why && <span className="text-ink-faint"> — {t.why}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
