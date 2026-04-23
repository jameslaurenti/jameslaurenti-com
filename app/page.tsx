import Link from "next/link";

const sections = [
  {
    href: "/about",
    label: "About",
    description: "Background, interests, what I care about.",
  },
  {
    href: "/work",
    label: "Work",
    description: "Things I've built. Real tools, not demos.",
  },
  {
    href: "/making-things",
    label: "Making Things",
    description: "Writing, music, experiments. An ongoing collection.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Get in touch.",
  },
];

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 sm:py-32">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
        James Laurenti
      </h1>
      <p className="text-lg text-dim mb-16 leading-relaxed">
        Product leader. Builder of useful things. Based in Massachusetts.
      </p>

      <nav className="flex flex-col divide-y divide-line">
        {sections.map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-baseline justify-between py-5 hover:text-accent transition-colors"
          >
            <span className="font-medium">{label}</span>
            <span className="text-sm text-dim group-hover:text-accent transition-colors text-right max-w-xs">
              {description}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
