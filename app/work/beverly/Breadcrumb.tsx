"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HUB = "/work/beverly";

// Pieces that sit under /work/beverly for URL tidiness but are not part of the
// "What Beverly Does Next" collection, and are not listed in its index. They get a trail
// back to /work only: naming the collection in their crumb claimed a membership they do
// not have.
const STANDALONE = [`${HUB}/meeting-digest`];

/**
 * Trail back out of a Beverly piece.
 *
 * Without it the only way up is the "Work" item in the site nav, which skips the collection
 * entirely and lands on the index of everything.
 *
 * Hidden on the hub itself (nothing to go back to) and on the development map, which is a
 * full-height immersive view with its own back-bar.
 */
export default function Breadcrumb() {
  const path = usePathname();
  if (path === HUB || path === `${HUB}/` || path.startsWith(`${HUB}/development-map`)) return null;

  const standalone = STANDALONE.some((p) => path === p || path.startsWith(`${p}/`));

  return (
    // Sticks under the site nav (h-14) so the way back stays reachable in pieces that run
    // thousands of words. Height is BREADCRUMB_H; the FY2027 phase tracker stacks below it.
    <nav
      aria-label="Breadcrumb"
      className="sticky top-14 z-30 h-9 border-b border-rule bg-bg"
    >
      <ol className="mx-auto flex h-full max-w-3xl flex-wrap items-center gap-1.5 px-6 text-[0.8125rem] text-ink-faint">
        <li>
          <Link
            href="/work"
            className={
              standalone
                ? "font-medium text-accent transition-colors hover:text-accent-deep"
                : "transition-colors hover:text-accent"
            }
          >
            Work
          </Link>
        </li>
        {standalone ? null : (
          <>
            <li aria-hidden className="select-none text-ink-faint/60">
              /
            </li>
            <li>
              <Link
                href={HUB}
                className="font-medium text-accent transition-colors hover:text-accent-deep"
              >
                What Beverly Does Next
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
