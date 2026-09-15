import Link from "next/link";

/**
 * Split deliberately. A uniform grid gave eight things identical visual weight, which
 * flattens a joke and an album title into the same box. Personality lives in the
 * unevenness, so two or three items get a sentence and the rest stay a list.
 */
const currentlyRest = [
  { label: "Listening", value: "Geese, Getting Killed" },
  { label: "Playing", value: "Hollow Knight: Silksong" },
  { label: "Drinking", value: "Austrian reds, St. Laurent" },
  { label: "Photographing", value: "My daughters negotiating their world" },
  { label: "Skeptical of", value: "FOMO merchants" },
];

const whatIMake = [
  {
    mode: "How things work",
    body: "Tools and writing that take something tangled and make it legible. Right now: Beverly's budget, the development reshaping a fast-growing city, and a weekly digest of what the city's boards actually did.",
    cta: "See the Beverly work →",
    href: "/beverly",
  },
  {
    mode: "What things mean",
    body: "Essays on memory, identity, and what's worth paying attention to. Starting with one on why being understood holds us together.",
    cta: "Read →",
    href: "/writing",
  },
];

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <section
        className="px-10"
        style={{ paddingTop: "5.5rem", paddingBottom: "4rem" }}
      >
        {/* Eyebrow */}
        <div className="flex items-center mb-7" style={{ gap: "0.55rem" }}>
          <span className="inline-block h-px bg-accent" style={{ width: "20px" }} />
          <span
            className="text-accent uppercase font-sans"
            style={{ fontSize: "0.72rem", letterSpacing: "0.14em" }}
          >
            Product · Classics · Curiosity
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-display font-bold text-ink mb-8"
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
          }}
        >
          I find the signal.<br />
          Then I build something<br />
          worth keeping.
        </h1>

        {/* Intro */}
        <p
          className="text-ink-mid"
          style={{ fontSize: "1.02rem", lineHeight: 1.78, maxWidth: "54ch" }}
        >
          Most of what&apos;s here began with a question I couldn&apos;t put
          down. Some are about how things work, like where my city&apos;s money
          actually goes. Others are about what things mean, which is harder to
          pin down and more personal.
        </p>
        <p
          className="text-ink-mid"
          style={{
            fontSize: "1.02rem",
            lineHeight: 1.78,
            maxWidth: "54ch",
            marginTop: "1.1rem",
          }}
        >
          By trade I&apos;m a product manager at Grubhub. Before that, a Classics
          degree, a family liquor store, and a long stretch in wine. The rest is
          curiosity that wouldn&apos;t stay in its lane.
        </p>

        <p style={{ marginTop: "1.6rem" }}>
          <Link
            href="/about"
            className="text-accent hover:underline underline-offset-4"
            style={{ fontSize: "0.95rem" }}
          >
            More about me →
          </Link>
        </p>
      </section>

      {/* What I make */}
      <div className="flex items-center gap-4 px-10 pt-14 mb-10">
        <span
          className="font-display font-semibold text-ink shrink-0"
          style={{ fontSize: "1.35rem", letterSpacing: "-0.01em" }}
        >
          What I make
        </span>
        <div className="flex-1 h-px bg-rule" />
      </div>

      <div className="px-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-rule">
          {whatIMake.map((item) => (
            <Link
              key={item.mode}
              href={item.href}
              className="bg-bg p-8 hover:bg-bg-card transition-colors flex flex-col"
            >
              <h3
                className="font-display font-medium text-ink mb-3"
                style={{ fontSize: "1.3rem" }}
              >
                {item.mode}
              </h3>
              <p
                className="text-ink-mid leading-relaxed mb-4 flex-1"
                style={{ fontSize: "0.92rem" }}
              >
                {item.body}
              </p>
              <span className="text-accent" style={{ fontSize: "0.78rem" }}>
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Currently into. See the note on currentlyRest above for why this is not a grid. */}
      <div className="flex items-center gap-4 px-10 mb-6">
        <span
          className="text-ink-faint uppercase shrink-0"
          style={{ fontSize: "0.67rem", letterSpacing: "0.18em" }}
        >
          Currently into
        </span>
        <div className="flex-1 h-px bg-rule" />
      </div>

      <div className="px-10 mb-16">
        <div className="grid gap-6 sm:grid-cols-[1.25fr_1fr] sm:gap-10">
          <p
            className="text-ink-mid"
            style={{ fontSize: "1.02rem", lineHeight: 1.7, maxWidth: "48ch" }}
          >
            Watching more <span className="text-ink font-medium">BevCam footage</span> than is
            strictly healthy. Reading{" "}
            <span className="text-ink font-medium">Dungeon Crawler Carl</span> on a promise to
            myself that I will finish it. Thinking about what AI is actually worth, and not
            landing anywhere comfortable.
          </p>

          <div>
            {currentlyRest.map((item, i) => (
              <div
                key={item.label}
                className={i === 0 ? "py-2" : "py-2 border-t border-rule"}
              >
                <div
                  className="text-ink-faint uppercase"
                  style={{ fontSize: "0.64rem", letterSpacing: "0.1em" }}
                >
                  {item.label}
                </div>
                <div className="text-ink-mid" style={{ fontSize: "0.87rem" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
