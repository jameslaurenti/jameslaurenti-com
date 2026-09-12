import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — James Laurenti",
  description:
    "Two kinds of curiosity: figuring out how things work, and chasing what things mean. Currently pointed mostly at Beverly, Massachusetts.",
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
        About
      </h1>

      <div className="prose text-ink">
        <p>
          Two kinds of curiosity drive most of what I make. Figuring out how
          things work, a city&apos;s budget or a market broken down until
          it&apos;s clear enough to act on. And chasing what things mean, memory,
          identity, the things worth paying attention to. The same curiosity,
          aimed two ways.
        </p>
        <p>
          Right now most of it points at{" "}
          <Link href="/beverly" className="rlink">
            Beverly, Massachusetts
          </Link>
          , where I live. The city&apos;s budget is tightening and the choices
          ahead will shape the place my kids are growing up in, so I write
          explainers, build tools, and lately summarize the meetings themselves.
          Staying informed about your own city should not take six hours of video
          a week, and at the moment it does.
        </p>
        <p>
          I studied Classics at Boston University. Latin and Greek, Ovid, Homer,
          Catullus. Spending years on dead languages teaches you to think, to sit
          with what doesn&apos;t resolve and read for what&apos;s underneath, and
          that&apos;s done more for how I work than most of what came after.
        </p>
        <p>
          By trade I&apos;m a Principal PM at Grubhub, seven years now, most
          recently on retention and Care. Those two sit at opposite ends of the
          same problem: keeping people&apos;s trust, and rebuilding it when
          something breaks. Before that I spent a decade building ecommerce for
          wine and spirits retailers, which is how I came into product sideways,
          through retail. My family runs a liquor store in New Jersey. The longer
          version is on my{" "}
          <a href="/resume.pdf" className="rlink">
            resume
          </a>
          .
        </p>
        <p>
          Outside the job: the NYT crossword, Formula 1, live music, museums,
          plays, something creative most months if I can manage it. Two daughters
          who are sharper and funnier than I am, and who keep my ego correctly
          sized.
        </p>
        <p>
          Always up for a conversation about wine, local government, or why the
          Ferrari pit wall keeps costing Charles races.
        </p>
      </div>
    </div>
  );
}
