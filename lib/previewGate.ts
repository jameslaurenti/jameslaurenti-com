// Friction gate for work shared with a small group before it is public: everything under
// /experiments/preview/<name>. Same pattern as lib/draftGate.ts and lib/harborlightGate.ts,
// with its own cookie and password, so a preview reader can't open the drafts or the
// experiments dashboard. Friction, not security: the fallback password lives in a public
// repo, and so does the source of every preview page. Set PREVIEW_PASSWORD in the Vercel
// project to override it.

/** The folder whose pages are gated. Its own index (/experiments/preview) is the enter page. */
export const PREVIEW_ROOT = "/experiments/preview";

export const PREVIEW_COOKIE = "jl_preview_access";
export const PREVIEW_VALUE = "1";

export function previewPassword(): string {
  return process.env.PREVIEW_PASSWORD ?? "tidepool";
}

/** Only ever send someone on to a page inside the preview folder. */
export function safePreviewNext(raw: string | undefined | null): string {
  if (!raw || !raw.startsWith(`${PREVIEW_ROOT}/`) || raw.includes("//") || raw.includes("\\")) {
    return `${PREVIEW_ROOT}/beverly-development`;
  }
  return raw;
}
