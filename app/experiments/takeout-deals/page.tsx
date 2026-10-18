import type { Metadata } from "next";
import DealFinder from "./DealFinder";
import { CHECKED, DEALS } from "./deals";

/**
 * Weekly restaurant specials around Beverly that work for pickup or delivery, for deciding on
 * a no-cook night. Unlisted under /experiments (noindex via next.config.ts). The data lives in
 * deals.ts so a refresh only touches one file.
 */
export const metadata: Metadata = {
  title: "Takeout Deals Around Beverly — James Laurenti",
  description:
    "Day-by-day restaurant specials in Beverly, Salem and nearby towns that you can pick up or get delivered.",
  robots: { index: false, follow: false },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const checkedLabel = (() => {
  const [y, m, d] = CHECKED.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
})();

export default function TakeoutDealsPage() {
  const towns = new Set(DEALS.map((d) => d.town)).size;
  return (
    <div className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="pb-2 pt-12">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-accent">No-cook night</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Takeout deals around Beverly
          </h1>
          <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-ink-mid">
            Weekly specials you can pick up or get delivered, within about ten minutes of downtown
            Beverly. {DEALS.length} deals across {towns} towns, checked {checkedLabel}. Specials change
            without notice, so each one links to where it came from. Call before you drive.
          </p>
        </header>

        <DealFinder deals={DEALS} />

        <footer className="mt-16 border-t border-rule pt-6 text-[0.875rem] leading-relaxed text-ink-mid">
          <p>
            Found from restaurant websites, online ordering pages, menus and local posts. Dine-in-only
            deals are left out. &ldquo;Takeout unconfirmed&rdquo; means the source didn&rsquo;t say;
            &ldquo;Unverified&rdquo; means the source is old or secondhand. Massachusetts bans drink
            happy hours, so there are none here.
          </p>
        </footer>
      </div>
    </div>
  );
}
