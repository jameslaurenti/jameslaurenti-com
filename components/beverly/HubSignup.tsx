"use client";

import { KIT_FORM_URL, SIGNUP_CONTACT, useDigestSignup } from "@/components/beverly/DigestSignup";

/**
 * The email form inside the digest card on the Beverly hub. Same Kit form and submit logic as
 * every other placement (useDigestSignup); its own placement name, "hub-card", so hub signups
 * can be told apart from the issue bands and the subscribe page.
 */
export default function HubSignup() {
  const placement = "hub-card";
  const { status, reason, handleSubmit } = useDigestSignup(placement);

  if (status === "sent") {
    return (
      <p className="text-[0.97rem] leading-relaxed" role="status">
        Almost done. Check your inbox for a confirmation email from Beverly Meeting Digest, and
        your spam folder if it is not there. You are subscribed once you click the link in it.
      </p>
    );
  }

  return (
    <div>
      <p className="text-[0.97rem] leading-snug">
        <b>Get it in your inbox.</b>{" "}
        <span className="text-ink-mid">
          One short email on Mondays. Free, with an unsubscribe link in every issue.
        </span>
      </p>
      <form
        action={KIT_FORM_URL}
        method="post"
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-2.5 sm:flex-row"
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
          className="min-w-0 flex-1 rounded border border-rule bg-bg px-4 py-2.5 text-[1rem] focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-ink px-5 py-2.5 text-[0.95rem] font-semibold text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2.5 text-[0.92rem] text-debt" role="alert">
          That did not go through.{" "}
          {reason ? <>Kit, the email service, said: &ldquo;{reason}&rdquo; </> : null}
          Check the address and try again, or email{" "}
          <a href={`mailto:${SIGNUP_CONTACT}`} className="rlink">
            {SIGNUP_CONTACT}
          </a>{" "}
          and I will add you.
        </p>
      )}
      <p className="mt-2.5 text-[0.8rem] leading-relaxed text-ink-faint">
        Sent through Kit, an email service. Your address is used for the digest and nothing else.
      </p>
    </div>
  );
}
