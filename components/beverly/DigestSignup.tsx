"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { track } from "@/lib/analytics";

/**
 * Email signup for the digest. Posts straight to the Kit form rather than loading Kit's
 * embed script, which is heavy and restyles the page. Without JavaScript the form still
 * works: the browser posts to Kit and Kit shows its own confirmation page.
 *
 * Kit runs double opt-in on this form, so a successful post means "confirmation email
 * sent", not "subscribed". The copy after submit says so.
 */
const KIT_FORM = "https://app.kit.com/forms/10019223/subscriptions";
const CONTACT = "beverly-digest@jameslaurenti.com";

export default function DigestSignup({
  placement,
  title = "Get the digest by email",
}: {
  /** Where on the site this box sits, for the signup_submitted event. */
  placement: string;
  /** Null on the signup page, where the page heading already says it. */
  title?: string | null;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  // Off-site links carry ?from= (a QR code, a social bio) so a signup can be traced to the
  // channel that brought it. Read on mount to keep the page statically renderable.
  const from = useRef("");
  useEffect(() => {
    from.current = new URLSearchParams(window.location.search).get("from")?.slice(0, 40) ?? "";
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch(KIT_FORM, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.status === "success") {
        setStatus("sent");
        form.reset();
        track("signup_submitted", { placement, ...(from.current ? { from: from.current } : {}) });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-[63ch] rounded-lg border border-rule bg-bg-card/60 px-6 py-6">
      {title && <h2 className="mb-2 font-display text-xl font-bold tracking-tight">{title}</h2>}
      {status === "sent" ? (
        <p className="text-[1rem] leading-relaxed" role="status">
          Almost done. Check your inbox for a confirmation email from Beverly Meeting Digest,
          and your spam folder if it is not there. You are subscribed once you click the link
          in it.
        </p>
      ) : (
        <>
          <p className="text-[0.97rem] leading-relaxed text-ink-mid">
            One short email on Mondays: each story&apos;s headline, a sentence on what happened,
            and a link to the full issue. Free, and every email has an unsubscribe link.
          </p>
          <form
            action={KIT_FORM}
            method="post"
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-2.5 sm:flex-row"
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
              That did not go through. Check the address and try again, or email{" "}
              <a href={`mailto:${CONTACT}`} className="rlink">
                {CONTACT}
              </a>{" "}
              and I will add you.
            </p>
          )}
          <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-faint">
            Sent through Kit, an email service. Your address is used for the digest and nothing
            else.
          </p>
        </>
      )}
    </div>
  );
}
