import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — James Laurenti",
  description: "Product leader, builder, Classics minor, Beverly MA.",
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
        About
      </h1>

      <div className="prose text-ink">
        {/* Replace placeholder text below with your actual About copy */}
        <p>
          I'm a product leader focused on building things that actually help
          people — not impressive-sounding things, useful things. I currently
          work as a Principal Product Manager in the Care domain at Grubhub,
          where I spend most of my time thinking about how customer support
          should actually work at scale.
        </p>
        <p>
          Before product, I studied Classics and spent time in the wine
          industry — both of which taught me more about how to read people and
          situations than any MBA would have. I care about precision in
          language, the kind of thinking that moves slowly before it moves
          fast, and work that holds up to scrutiny.
        </p>
        <p>
          I'm also genuinely enthusiastic about AI tooling — not as a buzzword
          but as something I use daily to build things that wouldn't otherwise
          be possible for a non-engineer. The Beverly Civic Assistant is the
          first public example of that.
        </p>
        <p>
          I live in Beverly, Massachusetts with my wife and two kids. When I'm
          not working I'm usually cooking, chasing the kids around, or
          thinking about local civic stuff more than any normal person should.
        </p>

        <div className="mt-10 pt-8 border-t border-line">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-4 font-medium"
          >
            Download résumé ↗
          </a>
        </div>
      </div>
    </div>
  );
}
