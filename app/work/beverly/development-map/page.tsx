import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beverly Property Development Tracker — James Laurenti",
  description:
    "An interactive map of active and recent real estate development projects in Beverly, MA.",
};

export default function BeverlyDevelopmentMapPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
      {/* Back-bar — keeps the immersive map from being a dead end */}
      <div className="shrink-0 border-b border-rule bg-bg">
        <div className="px-6 py-2.5 flex items-center justify-between gap-4">
          <Link
            href="/work/beverly"
            className="text-sm font-medium text-accent hover:text-accent-lt transition-colors"
          >
            ← Beverly
          </Link>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full border border-ink-faint/40 text-ink-faint uppercase"
              style={{
                fontSize: "0.6rem",
                padding: "0.1rem 0.45rem",
                letterSpacing: "0.1em",
              }}
            >
              Beta
            </span>
            <span className="text-ink-faint" style={{ fontSize: "0.78rem" }}>
              James Laurenti
            </span>
          </div>
        </div>
      </div>
      <iframe
        src="https://beverly-property-dev-tracker.vercel.app"
        className="flex-1 w-full"
        style={{ border: "none" }}
        title="Beverly Property Development Tracker"
      />
    </div>
  );
}
