import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/draftGate";
import {
  HL_ACCESS_COOKIE,
  HL_ACCESS_VALUE,
  HL_ENTER_PATH,
} from "@/lib/harborlightGate";
import { PREVIEW_COOKIE, PREVIEW_ROOT, PREVIEW_VALUE } from "@/lib/previewGate";

// Friction gates for pages shared by direct link but not meant to be stumbled onto.
// This is friction, not security: fallback passwords live in a public repo, so treat
// them as "please don't read this yet" signs rather than locks. Setting WBI_PASSWORD
// (drafts), HARBORLIGHT_PASSWORD (parent digest) or PREVIEW_PASSWORD (shared previews) in
// the Vercel project overrides the fallback and keeps the real value out of git.
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Parent digest: its own cookie and its own enter page.
  if (path === "/harborlight") {
    if (req.cookies.get(HL_ACCESS_COOKIE)?.value === HL_ACCESS_VALUE) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = HL_ENTER_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Shared previews: every page under /experiments/preview/<name>, with their own cookie and
  // their own enter page (the folder's index, which the matcher leaves ungated).
  if (path.startsWith(`${PREVIEW_ROOT}/`)) {
    if (req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_VALUE) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = PREVIEW_ROOT;
    url.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }

  // Draft gate.
  if (req.cookies.get(ACCESS_COOKIE)?.value === ACCESS_VALUE) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

// Must be a static literal; Next reads this at build time. "/harborlight" matches the
// digest page only, so /harborlight/enter and /harborlight/feed/* stay ungated. The preview
// pattern needs one segment or more, so /experiments/preview itself (the enter page) stays open.
export const config = {
  matcher: [
    "/beverly/who-beverly-is",
    "/beverly/who-beverly-is-v2",
    "/admin/experiments",
    "/harborlight",
    "/experiments/preview/:path+",
  ],
};
