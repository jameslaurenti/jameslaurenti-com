"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HUB = "/beverly";
const DIGEST = `${HUB}/digest`;

/**
 * Trail back out of a Beverly piece.
 *
 * Two kinds of thing live under /beverly and they need different trails:
 *
 * - Pieces in the "What Beverly Does Next" collection go back to the hub, which is what
 *   the nav's "Beverly" item points at.
 * - Digest issues go back to the digest archive. They sit at this URL for tidiness but
 *   are not part of that collection, and naming it in their crumb would claim a
 *   membership they do not have. The archive is also otherwise unreachable from inside
 *   an issue, so this is the crumb that does real work.
 *
 * Hidden where there is nothing useful above: the hub itself, the archive index (one
 * click below a nav item), and the development map, a full-height immersive view with
 * its own back-bar.
 */
export default function Breadcrumb() {
  const path = usePathname().replace(/\/$/, "") || "/";

  if (path === HUB || path === DIGEST) return null;
  if (path.startsWith(`${HUB}/development-map`)) return null;

  const inDigest = path.startsWith(`${DIGEST}/`);
  const href = inDigest ? DIGEST : HUB;
  const label = inDigest ? "Beverly Meeting Digest" : "What Beverly Does Next";

  return (
    // Sticks under the site nav (h-14) so the way back stays reachable in pieces that run
    // thousands of words. Height is BREADCRUMB_H; the FY2027 phase tracker stacks below it.
    <nav
      aria-label="Breadcrumb"
      className="sticky top-14 z-30 h-9 border-b border-rule bg-bg"
    >
      <ol className="mx-auto flex h-full max-w-3xl flex-wrap items-center gap-1.5 px-6 text-[0.8125rem] text-ink-faint">
        <li aria-hidden className="select-none text-ink-faint/60">
          &larr;
        </li>
        <li>
          <Link
            href={href}
            className="font-medium text-accent transition-colors hover:text-accent-deep"
          >
            {label}
          </Link>
        </li>
      </ol>
    </nav>
  );
}
