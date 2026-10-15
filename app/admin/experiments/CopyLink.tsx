"use client";

import { useState } from "react";

/** Copies the full URL of an experiment, for sharing one by text or email. */
export default function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}${path}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked: the path is shown on the card anyway */
        }
      }}
      className="rounded-md border border-ink-faint/40 px-3 py-1.5 text-[0.8125rem] text-ink-mid hover:bg-bg-card"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
