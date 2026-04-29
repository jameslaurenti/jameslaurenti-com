import Link from "next/link";

const currentlyInto = [
  { label: "Reading", value: "The Goldfinch" },
  { label: "Listening", value: "Radiohead — OK Computer through Amnesiac" },
  { label: "Drinking", value: "Austrian reds — St. Laurent" },
  { label: "Thinking about", value: "If souls are individual or collective" },
  { label: "Watching", value: "Crows. Just crows." },
  { label: "Playing", value: "Old-school JRPGs" },
  { label: "Photographing", value: "My daughters negotiating their world" },
  { label: "Skeptical of", value: "FOMO merchants" },
];

const aboutCards = [
  {
    tag: "Work",
    title: "Finding signal in messy systems",
    body: "From compliance infrastructure for 8,500+ alcohol merchants to retention frameworks for Grubhub's highest-value diners — the work is always about making complicated situations legible enough to act on.",
    href: "/work",
    linkLabel: "Explore the work",
  },
  {
    tag: "Before tech",
    title: "Wine, Latin, Greek, and a family liquor store",
    body: "Certified Specialist of Wine. Studied Classics at BU, graduated summa cum laude. Fond of Ovid, Catullus, the Odyssey — stories that take resilience seriously and don't pretend the journey is clean.",
    href: "/about",
    linkLabel: "More about me",
  },
  {
    tag: "What drives me",
    title: "The big questions, honestly held",
    body: "Consciousness of who I'm helping and hurting with every decision. Curiosity as a practice, not a pose. Never shying from what's hard to answer. Raising kids who exceed me.",
    href: "/about",
    linkLabel: "More about me",
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
          className="font-display font-bold text-ink mb-5"
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

        {/* Subhead */}
        <p
          className="font-sans font-light italic text-ink-faint mb-8"
          style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)" }}
        >
          Fifteen years making complicated things work.
        </p>

        {/* Body */}
        <p
          className="text-ink-mid"
          style={{ fontSize: "1.02rem", lineHeight: 1.78, maxWidth: "54ch" }}
        >
          Principal PM at Grubhub. I specialize in the parts that resist easy
          measurement — retention, care tooling, compliance infrastructure, the
          moments where a product either earns someone's trust or quietly loses
          it. Before tech: wine consulting, a liquor store family, a Classics
          degree, and a lot of time with books that asked impossible questions.
        </p>
      </section>

      {/* Currently into strip — full width */}
      <div className="border-t border-rule border-b border-rule">
        <div className="flex overflow-x-auto">
          <div
            className="shrink-0 border-r border-rule flex items-center"
            style={{ padding: "1.2rem 2rem" }}
          >
            <span
              className="text-ink-faint uppercase whitespace-nowrap"
              style={{ fontSize: "0.67rem", letterSpacing: "0.18em" }}
            >
              Currently into
            </span>
          </div>
          {currentlyInto.map((item) => (
            <div
              key={item.label}
              className="shrink-0 border-r border-rule hover:bg-bg-card transition-colors"
              style={{ padding: "1.2rem 1.75rem", minWidth: "170px" }}
            >
              <div
                className="text-ink-faint uppercase mb-1"
                style={{ fontSize: "0.64rem", letterSpacing: "0.1em" }}
              >
                {item.label}
              </div>
              <div className="text-ink font-normal" style={{ fontSize: "0.87rem" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About section */}
      <div className="flex items-center gap-4 px-10 pt-10 mb-10">
        <span
          className="text-ink-faint uppercase shrink-0"
          style={{ fontSize: "0.67rem", letterSpacing: "0.18em" }}
        >
          About
        </span>
        <div className="flex-1 h-px bg-rule" />
      </div>

      <div className="px-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-rule">
          {aboutCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-bg p-8 hover:bg-bg-card transition-colors flex flex-col"
            >
              <div
                className="text-accent uppercase mb-3"
                style={{ fontSize: "0.67rem", letterSpacing: "0.15em" }}
              >
                {card.tag}
              </div>
              <h3
                className="font-display font-medium text-ink mb-3"
                style={{ fontSize: "1.15rem" }}
              >
                {card.title}
              </h3>
              <p
                className="text-ink-mid leading-relaxed mb-4 flex-1"
                style={{ fontSize: "0.88rem" }}
              >
                {card.body}
              </p>
              <span className="text-accent" style={{ fontSize: "0.78rem" }}>
                {card.linkLabel} →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/*
        Making things section — hidden until content exists.
        To re-enable: uncomment below and add Making Things back to Nav links.

      <div className="flex items-center gap-4 px-10 mb-10">
        <span
          className="text-ink-faint uppercase shrink-0"
          style={{ fontSize: "0.67rem", letterSpacing: "0.18em" }}
        >
          Making things
        </span>
        <div className="flex-1 h-px bg-rule" />
      </div>

      <div className="mx-10 mb-16 border-t border-rule">
        rows go here — pull from getAllPosts() when content exists
      </div>
      */}

    </div>
  );
}
