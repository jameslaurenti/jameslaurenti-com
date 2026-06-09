import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — James Laurenti",
  description: "Principal PM at Grubhub. Classics degree. Beverly, MA.",
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
        About
      </h1>

      <div className="prose text-ink">
        <p>
          I'm a Principal PM at Grubhub, where I work on the parts of a product
          that are hardest to measure: retention, care tooling, the moments where
          someone either trusts you or quietly stops. Seven years at Grubhub
          across white-label ordering, alcohol and grocery launch, and now Care.
          Before that, a decade building ecommerce for wine and spirits retailers.
          My family has run a liquor store in New Jersey for over 55 years, so I
          came to product through the stockroom, not a business school.
        </p>
        <p>
          Two kinds of curiosity drive most of what I make: figuring out how
          things work — systems, budgets, markets, made clear enough to act on —
          and chasing what things mean — memory, identity, what&apos;s worth
          paying attention to. Outward and inward, the same attention pointed two
          ways.
        </p>
        <p>
          I studied Classics at Boston University: Latin, Greek, Ovid, Homer,
          Catullus. It's not incidental. People who study dead languages tend to
          be comfortable sitting with things that don't resolve cleanly, and that
          turns out to be useful in product work.
        </p>
        <p>
          Outside work: NYT Crossword, Formula 1, Charles Leclerc specifically.
          Live music, museums, plays, something creative every month if I can
          manage it. Two daughters who are sharper and funnier than me, and who
          keep my ego appropriately calibrated.
        </p>
        <p>
          I'm based in Beverly, Massachusetts. Always up for a conversation about
          wine, retention strategy, or why the Ferrari pit wall keeps costing
          Charles races.
        </p>

        <div className="mt-10 pt-8 border-t border-line">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-4 font-medium"
          >
            Download resume ↗
          </a>
        </div>
      </div>
    </div>
  );
}
