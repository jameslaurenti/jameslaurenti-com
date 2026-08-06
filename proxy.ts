import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/draftGate";

// Gate for drafts that are shared by direct link but not ready to be stumbled onto.
// This is friction, not security: the fallback password lives in a public repo, so treat
// it as a "please don't read this yet" sign rather than a lock. Setting WBI_PASSWORD in
// the Vercel project overrides the fallback and keeps the real value out of git.
export function proxy(req: NextRequest) {
  if (req.cookies.get(ACCESS_COOKIE)?.value === ACCESS_VALUE) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

// Must be a static literal; Next reads this at build time.
export const config = {
  matcher: ["/work/beverly/who-beverly-is"],
};
