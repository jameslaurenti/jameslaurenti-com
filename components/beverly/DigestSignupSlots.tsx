"use client";

import { usePathname } from "next/navigation";
import DigestSignup, {
  KIT_FORM_URL,
  SIGNUP_CONTACT,
  useDigestSignup,
} from "@/components/beverly/DigestSignup";

/**
 * The two signup placements the digest layout adds to every issue and the archive: a band
 * with the form above the content and the full box below it. No pop-ups, nothing sticky:
 * the band scrolls away with the page. Hidden on the signup and welcome pages, which are
 * themselves the signup.
 *
 * The band replaced a one-line "Get it by email" link on Nov 15, 2026 (option A of the
 * /experiments/digest-signup mockup). Its placements are named *-top-band so its signups
 * can be compared with the old line's and with a later test of option B (a card under
 * the contents list).
 */
const OWN_PAGES = ["/beverly/digest/subscribe", "/beverly/digest/welcome"];
const hidden = (path: string | null) => !!path && OWN_PAGES.some((p) => path.startsWith(p));

export function SignupBand() {
  const path = usePathname();
  const placement = path === "/beverly/digest" ? "archive-top-band" : "issue-top-band";
  const { status, reason, handleSubmit } = useDigestSignup(placement);
  if (hidden(path)) return null;
  return (
    <div className="border-b border-rule bg-bg-card">
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5 px-6 py-3.5 sm:flex-row sm:items-center sm:gap-5">
        <p className="text-[0.95rem] leading-snug sm:shrink-0">
          <b>Get the digest by email.</b>{" "}
          <span className="text-ink-mid">One short email on Mondays.</span>
        </p>
        <div className="sm:ml-auto sm:w-[22rem]">
          {status === "sent" ? (
            <p className="text-[0.92rem] leading-snug" role="status">
              Almost done. Check your inbox for a confirmation email and click the link in it.
            </p>
          ) : (
            <form
              action={KIT_FORM_URL}
              method="post"
              onSubmit={handleSubmit}
              className="flex w-full gap-2"
            >
              <label htmlFor={`digest-email-${placement}`} className="sr-only">
                Email address
              </label>
              <input
                id={`digest-email-${placement}`}
                name="email_address"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded border border-rule bg-bg px-3 py-2 text-[0.95rem] focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="shrink-0 rounded bg-ink px-4 py-2 text-[0.9rem] font-semibold text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-1.5 text-[0.85rem] text-debt" role="alert">
              That did not go through.{" "}
              {reason ? <>Kit, the email service, said: &ldquo;{reason}&rdquo; </> : null}
              Try again, or email{" "}
              <a href={`mailto:${SIGNUP_CONTACT}`} className="rlink">
                {SIGNUP_CONTACT}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SignupBox() {
  const path = usePathname();
  if (hidden(path)) return null;
  return (
    <div className="bg-bg">
      <div className="mx-auto max-w-3xl px-6 pb-10">
        <DigestSignup placement={path === "/beverly/digest" ? "archive-end" : "issue-end"} />
      </div>
    </div>
  );
}
