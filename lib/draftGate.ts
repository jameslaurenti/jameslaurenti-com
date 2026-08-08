// Shared by the middleware (edge) and the unlock page (node), so neither has to import
// the other. Friction, not security: see proxy.ts.

/** Routes behind the draft gate. Also the allowlist for the unlock form's ?next=. */
export const GATED_PATHS = [
  "/work/beverly/who-beverly-is",
  "/work/beverly/who-beverly-is-v2",
];

export const ACCESS_COOKIE = "jl_draft_access";
export const ACCESS_VALUE = "1";

/** Never redirect anywhere except a path this gate protects. */
export function safeNext(raw: string | undefined | null): string {
  return raw && GATED_PATHS.includes(raw) ? raw : "/work/beverly";
}
