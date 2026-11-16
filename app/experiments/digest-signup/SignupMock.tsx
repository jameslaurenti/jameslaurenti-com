"use client";

import { useEffect, useRef, useState, FormEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/analytics";

/**
 * Mockup-only signup placements for the digest issue page. The form posts to the real Kit
 * form (double opt-in), so a test signup works end to end. If an option is picked, it moves
 * into components/beverly and the digest layout; nothing here is used by published pages.
 */
const KIT_FORM = "https://app.kit.com/forms/10019223/subscriptions";

function useKitForm(placement: string) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
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
        track("signup_submitted", { placement });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }
  return { status, onSubmit };
}

function Form({ placement, button = "Subscribe" }: { placement: string; button?: string }) {
  const { status, onSubmit } = useKitForm(placement);
  if (status === "sent")
    return (
      <p className="text-[0.95rem] leading-relaxed" role="status">
        Almost done. Check your inbox for a confirmation email and click the link in it.
      </p>
    );
  return (
    <form action={KIT_FORM} method="post" onSubmit={onSubmit} className="flex w-full gap-2">
      <label htmlFor={`mock-email-${placement}`} className="sr-only">
        Email address
      </label>
      <input
        id={`mock-email-${placement}`}
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
        className="shrink-0 rounded bg-ink px-4 py-2 text-[0.9rem] font-semibold text-bg transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : button}
      </button>
      {status === "error" && (
        <span className="sr-only" role="alert">
          That did not go through. Try again.
        </span>
      )}
    </form>
  );
}

/** Option A: a band above the masthead, in place of the small grey line. Not sticky. */
export function TopBand() {
  return (
    <div className="border-b border-rule bg-bg-card">
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5 px-6 py-3.5 sm:flex-row sm:items-center sm:gap-5">
        <p className="text-[0.95rem] leading-snug sm:shrink-0">
          <b>Get the digest by email.</b>{" "}
          <span className="text-ink-mid">One short email on Mondays.</span>
        </p>
        <div className="sm:ml-auto sm:w-[22rem]">
          <Form placement="mockup-a-band" />
        </div>
      </div>
    </div>
  );
}

/** The small grey line the live layout shows today, for options B and C. */
export function CurrentLine() {
  return (
    <div className="bg-bg">
      <p className="mx-auto max-w-3xl px-6 pt-4 text-right text-[0.85rem] text-ink-faint">
        New issue every Monday.{" "}
        <a href="/beverly/digest/subscribe" className="rlink font-semibold">
          Get it by email
        </a>
      </p>
    </div>
  );
}

/**
 * Renders children right after the first element matching `selector`, so a placement can
 * sit inside an issue without the issue's own file being edited.
 */
function After({ selector, children }: { selector: string; children: ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const made = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const anchor = document.querySelector(selector);
    if (!anchor || made.current) return;
    const el = document.createElement("div");
    anchor.after(el);
    made.current = el;
    setHost(el);
    return () => {
      el.remove();
      made.current = null;
    };
  }, [selector]);
  return host ? createPortal(children, host) : null;
}

/** Option B: a compact card right under the "In this issue" list. */
export function AfterContents() {
  return (
    <After selector='nav[aria-label="In this issue"]'>
      <div className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-bg-card/60 px-5 py-4">
        <p className="text-[0.97rem] leading-snug">
          <b>Get each Monday&apos;s issue by email.</b>{" "}
          <span className="text-ink-mid">
            The headlines and a sentence on each story. Free, and you can unsubscribe anytime.
          </span>
        </p>
        <div className="mt-3">
          <Form placement="mockup-b-contents" />
        </div>
      </div>
    </After>
  );
}

/** Option C: a slim ruled row between stories 02 and 03, where a reader is mid-issue. */
export function MidIssue() {
  return (
    <After selector="section#flock">
      <div className="mt-14 max-w-[63ch] border-y border-rule py-4">
        <p className="text-[0.95rem] leading-snug text-ink-mid">
          <b className="text-ink">A new issue comes out every Monday.</b> Get it in your inbox:
        </p>
        <div className="mt-2.5">
          <Form placement="mockup-c-mid" />
        </div>
      </div>
    </After>
  );
}

const OPTIONS: [string, string][] = [
  ["a", "A: band at the top"],
  ["b", "B: under the contents"],
  ["c", "C: between stories"],
];

/** The switcher. Only on the mockup page. */
export function OptionBar({ v }: { v: string }) {
  return (
    <div className="bg-ink text-bg">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-1.5 px-6 py-2.5 text-[0.85rem]">
        <span className="font-bold uppercase tracking-[0.12em] text-[0.72rem] opacity-70">
          Signup mockup
        </span>
        {OPTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`?v=${id}`}
            className={id === v ? "font-bold underline underline-offset-4" : "opacity-80 hover:opacity-100"}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
