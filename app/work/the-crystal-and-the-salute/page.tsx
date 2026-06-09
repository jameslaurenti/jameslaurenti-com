import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Crystal and the Salute — James Laurenti",
  description:
    "An essay on mimetic desire, solitude, and resonance: how the self is built from others, and why being understood holds us together.",
};

const paragraphs = [
  "Nobody wants in a vacuum. You learn what to want by watching other people want things. This isn't weakness or shallowness. It's just how human desire works. The philosopher René Girard called it mimetic desire, and his point wasn't that we're all sheep. It was that we're fundamentally oriented toward other minds. We need them not just for company but for meaning. Other people teach us what's worth caring about.",
  "This creates an interesting problem. If meaning is built through contact with others, what happens when that contact disappears? Depression, at its core, is often a meaning-collapse. Things stop mattering. And if the machinery that makes things matter runs on human connection, then isolation doesn't just feel bad. It breaks something more fundamental. You can be surrounded by people and still feel it, if the contact is shallow enough. What seems to protect people isn't quantity of connection but quality. Not just being around others, but feeling genuinely understood by them.",
  "Call that resonance. The sense that something you said or felt or noticed landed in another person and they recognized it. That experience is rarer than it sounds, and it might be doing more work than we give it credit for.",
  "The poet Rainer Maria Rilke thought the ideal relationship was two solitudes that border one another and salute each other. He warned young people against losing themselves too quickly in relationships, against the rush toward merger before the self is fully formed. His instinct was to protect something, the integrity of a distinct inner life.",
  "But here's where it gets interesting. The self Rilke wants you to protect was never purely internal to begin with. It was built from the outside in. Everything that ever resonated with you, every idea that stuck, every person whose way of seeing the world changed yours, all of that is in there. Your solitude is real. It's just not original. It's a crystallization. The world passed through you, and something particular precipitated out.",
  "So when you meet another person, you're not encountering a mystery exactly. You're seeing how the same surrounding world, the same culture, the same floating ideas and losses and moments of recognition, landed in a different mind. What they kept. What they let go. Which things rhymed with something already in them and which ones didn't take.",
  "Resonance, then, is what happens when two of these crystals hold themselves up to the light and find that some of the structures match. Not all of them. Not even most of them. But enough to create recognition. The familiarity and the discovery arrive at the same moment, which is why it feels different from just meeting someone nice.",
  "Rilke and Girard aren't actually in conflict here. You need contact to build a self. Then you need enough solitude for that self to consolidate, to stop being purely reactive to whoever is nearest. Then you can meet someone from that place, from inside something coherent, rather than from hunger or the need to borrow an identity wholesale. The two solitudes can only salute each other if they've both actually formed.",
  "The self never fully finishes forming, of course. The best relationships keep adding to it. The boundary stays permeable. But there's a difference between a self that's still being shaped and one that's being dissolved. What Rilke was protecting against was people who skip straight from external influence to merger, never pausing to notice what had actually crystallized in them.",
  "What you're saluting across the distance, when a relationship works, isn't pure mystery. It's a particular shape. A history of resonances that became a person. Unknowable in its totality, sure. But recognizable in its outline. And that recognition, it turns out, is one of the things that keeps us intact.",
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

      <div className="prose text-ink mt-10">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
