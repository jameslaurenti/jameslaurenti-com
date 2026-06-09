import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beverly, in public — James Laurenti",
  description:
    "Three tools that make Beverly's budget and development legible to the people who live here.",
};

// Minimal placeholder — full collection page (intro + sequenced pieces) lands in the content pass.
const pieces = [
  { title: "The budget, explained", href: "/work/beverly/budget-explainer" },
  { title: "Find the money", href: "/work/beverly/budget-challenge" },
  { title: "The development map", href: "/work/beverly/development-map" },
];

export default function BeverlyCollection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
        Beverly, in public
      </h1>
      <div className="flex flex-col">
        {pieces.map((piece) => (
          <Link
            key={piece.href}
            href={piece.href}
            className="group border-t border-line py-7 font-medium hover:text-accent transition-colors"
          >
            {piece.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
