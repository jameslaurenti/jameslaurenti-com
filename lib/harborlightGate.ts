// Friction gate for the Harborlight parent digest, mirroring lib/draftGate.ts but
// with its own cookie and password so parents and draft-readers stay separate.
// Friction, not security: the fallback password lives in a public repo. Set
// HARBORLIGHT_PASSWORD in the Vercel project to override it and keep the real
// value out of git.

/** The one page behind this gate. The enter page and the feed are not gated. */
export const HL_PATH = "/harborlight";
export const HL_ENTER_PATH = "/harborlight/enter";

export const HL_ACCESS_COOKIE = "hl_parent_access";
export const HL_ACCESS_VALUE = "1";

export function harborlightPassword(): string {
  return process.env.HARBORLIGHT_PASSWORD ?? "seahorse";
}
