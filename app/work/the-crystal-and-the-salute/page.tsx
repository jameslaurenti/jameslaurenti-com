import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Crystal and the Salute — James Laurenti",
  description:
    "An essay on mimetic desire, solitude, and resonance: how the self is built from others, and why being understood holds us together.",
};

const introNote =
  "Most of us get the same advice growing up: be yourself, follow your heart. I never liked it. Looking back, I think it was because I knew, somewhere, that I wasn't the person I needed to be yet. That gap between who you are and who you're becoming is something I've thought about for a long time, and it turns out there are two thinkers who gave me better language for it than anything the advice columnists ever offered. René Girard, a philosopher who spent his career explaining how human desire actually works, and the poet Rainer Maria Rilke, who thought the goal of a relationship was two solitudes saluting each other across a distance. They seem to be pulling in opposite directions. I don't think they are. It took years of borrowing wrong and failing badly before I understood why, and this essay is my attempt to explain it.";

const paragraphs = [
  "Nobody wants in a vacuum. You learn what to want by watching other people want things. This isn't weakness or shallowness. It's just how human desire works. The philosopher René Girard called it mimetic desire, and his point wasn't that we're all sheep. It was that we're fundamentally oriented toward other minds. We need them not just for company but for meaning. Other people teach us what's worth caring about.",
  "But there's a problem baked into that. If meaning is built through contact with others, what happens when that contact disappears? Depression, at its core, is often a meaning-collapse. Things stop mattering. If the machinery that makes things matter runs on human connection, then isolation doesn't just feel bad. It breaks something. You can be surrounded by people and still feel it, if the contact is shallow enough. What protects people isn't quantity of connection. It's whether someone actually understood you.",
  "Call that resonance. Something you said landed. They recognized it. Rarer than it sounds, and doing more work than we admit.",
  "But connection has a cost. The same mechanism that builds meaning through others can dissolve you into them. Spend enough time being shaped by whoever is nearest, borrow enough of their desires and framings and ways of seeing, and at some point you look up and can't find yourself in the room. There's a piece of received wisdom that's supposed to solve this: be yourself. Follow your heart. Across centuries and cultures it's been the default answer, from philosophers to pop songs to children's television. The problem is that Girard already explained why it's insufficient. The self you're being told to trust was built from borrowed material. \"Be yourself\" assumes a self that formed cleanly from the inside out. It didn't.",
  "The poet Rainer Maria Rilke had a better formulation. He thought the ideal relationship was two solitudes that border one another and salute each other. He warned against losing yourself too quickly, against the rush toward merger before the self is fully formed. His instinct was to protect something. The integrity of a distinct inner life.",
  "The self Rilke wants you to protect was never purely internal to begin with. It was built from the outside in. Everything that ever resonated with you, every idea that stuck, every person whose way of seeing things changed yours. All of that is in there. Your solitude is real. It's just not original. It's a crystallization. The world passed through you, and something particular precipitated out.",
  "When you meet another person, you're not encountering a mystery exactly. You're seeing how the same world landed in a different mind. The same floating ideas, the same losses, the same moments that demand a response. What they kept. What they let go. Which things rhymed with something already in them, and which ones didn't take.",
  "Resonance is when two people built this way find that some of the structures match. Not all of them. Not even most. But enough. The familiarity and the discovery arrive at the same moment. That's why it feels different from just meeting someone nice.",
  "Rilke and Girard aren't in conflict. You need contact to build a self. Then you need solitude for that self to consolidate, to stop being purely reactive to whoever is nearest. Then you can meet someone from inside something coherent, not from hunger, not from the need to borrow an identity wholesale. The two solitudes can only salute each other if they've both actually formed.",
  "The self never fully finishes forming. The best relationships keep adding to it. But there's a difference between a self that's still being shaped and one that's being dissolved. What Rilke was protecting against: people who skip straight from external influence to merger, never pausing to notice what had crystallized in them.",
  "What you're saluting across the distance, when a relationship works, isn't pure mystery. It's a particular shape. A history of resonances that became a person. Unknowable in its totality. But recognizable in its outline.",
  "The harder question, the one this framework doesn't fully answer, is what to do when you look at what crystallized in you and don't like what you see. When the self that formed is pulling toward something destructive. The crystal isn't always beautiful. Some of what the world deposits in you shouldn't be followed toward its natural conclusion. Knowing yourself and trusting yourself aren't the same thing. That's a different essay. But it's worth knowing the question is there, sitting just outside the frame of this one.",
];

export default function CrystalAndSalute() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <h1
        className="font-display text-3xl sm:text-5xl font-semibold tracking-tight"
        style={{ lineHeight: 1.08 }}
      >
        The Crystal and the Salute
      </h1>
      <p
        className="mt-4 text-ink-faint italic"
        style={{ fontSize: "1.15rem" }}
      >
        On mimetic desire, solitude, and being recognized.
      </p>

      {/* Personal note, set off from the essay body */}
      <div
        className="mt-10 border-l-[3px] border-accent pl-5 text-ink-mid"
        style={{ fontSize: "1rem", lineHeight: 1.7 }}
      >
        <p style={{ margin: 0 }}>{introNote}</p>
      </div>

      <div className="prose text-ink mt-12">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
