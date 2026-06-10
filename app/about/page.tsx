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
          I&apos;m a Principal PM at Grubhub. My family runs a liquor store in
          New Jersey, and my first decade of work was building ecommerce for wine
          and spirits retailers, so I came into product sideways, through retail.
        </p>
        <p>
          Seven years at Grubhub now. I started on the white-label ordering side,
          moved after three years to the team launching alcohol and grocery, and
          for the last couple of years I&apos;ve worked on retention and Care.
          Those two sit at opposite ends of the same problem: keeping
          people&apos;s trust, and rebuilding it when something breaks. Retention
          is mostly the quiet stuff, reliability, value, people finding what they
          came for. Care is the other side, what happens when that fails and
          you&apos;ve got one shot to make it right and earn another chance.
        </p>
        <p>
          Two kinds of curiosity drive most of what I make. Figuring out how
          things work, a city&apos;s budget or a market broken down until
          it&apos;s clear enough to act on. And chasing what things mean, memory,
          identity, the things worth paying attention to. The same curiosity,
          aimed two ways.
        </p>
        <p>
          I studied Classics at Boston University. Latin and Greek, Ovid, Homer,
          Catullus. Spending years on dead languages teaches you to think, to sit
          with what doesn&apos;t resolve and read for what&apos;s underneath, and
          that&apos;s done more for how I work than most of what came after.
        </p>
        <p>
          Outside the job: the NYT crossword, Formula 1, live music, museums,
          plays, something creative most months if I can manage it. Two daughters
          who are sharper and funnier than I am, and who keep my ego correctly
          sized.
        </p>
        <p>
          I&apos;m in Beverly, Massachusetts. Always up for a conversation about
          wine, retention, or why the Ferrari pit wall keeps costing Charles
          races.
        </p>
      </div>
    </div>
  );
}
