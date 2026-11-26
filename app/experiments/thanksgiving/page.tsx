import type { Metadata } from "next";
import Game from "./Game";
import { getState, type GameState } from "./store";

/**
 * A shared Thanksgiving drinking game. Anyone with the link adds "drink when…" ideas and
 * taps one when it happens; every phone on the page sees the same board within a few
 * seconds. Unlisted under /experiments (noindex via next.config.ts and below). The board
 * lives in Upstash Redis; see store.ts.
 */
export const dynamic = "force-dynamic";

const DESCRIPTION = "Add what’s bound to happen at dinner. Tap it when it does. Everyone drinks.";

export const metadata: Metadata = {
  title: "Thanksgiving drinking game",
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    title: "Thanksgiving drinking game",
    description: DESCRIPTION,
    siteName: "James Laurenti",
  },
};

export default async function Thanksgiving() {
  let initial: GameState | null = null;
  try {
    initial = await getState();
  } catch {
    // Not configured or unreachable: the client shows the right message on its first poll.
  }
  return <Game initial={initial} />;
}
