import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE, PREVIEW_ROOT, PREVIEW_VALUE, previewPassword, safePreviewNext } from "@/lib/previewGate";

/**
 * The enter page for everything under /experiments/preview (proxy.ts sends visitors here with ?next=).
 * This page itself is not gated. It lists nothing, so the password is the only way past it.
 */
export const metadata: Metadata = {
  title: "Shared preview — James Laurenti",
  robots: { index: false, follow: false },
};

async function enter(formData: FormData) {
  "use server";

  const next = safePreviewNext(String(formData.get("next") ?? ""));
  const supplied = String(formData.get("password") ?? "").trim();

  if (supplied.toLowerCase() !== previewPassword().toLowerCase()) {
    redirect(`${PREVIEW_ROOT}?next=${encodeURIComponent(next)}&bad=1`);
  }

  const jar = await cookies();
  jar.set(PREVIEW_COOKIE, PREVIEW_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 120, // 120 days
  });

  redirect(next);
}

export default async function PreviewEnterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; bad?: string }>;
}) {
  const params = await searchParams;
  const next = safePreviewNext(params.next);
  const failed = params.bad === "1";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-16">
      <span className="font-semibold uppercase text-accent" style={{ fontSize: "0.7rem", letterSpacing: "0.16em" }}>
        Shared preview
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Work in progress</h1>
      <p className="mt-3 leading-relaxed text-ink-mid">
        These pages are shared with a few people for feedback before they go public, so they need a password. If you
        were sent here, you have it. If you landed here by accident, the finished work is on the{" "}
        <a href="/beverly" className="rlink">
          Beverly page
        </a>
        .
      </p>

      <form action={enter} className="mt-7 flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <label htmlFor="password" className="font-medium text-ink" style={{ fontSize: "0.9rem" }}>
          Password
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            aria-describedby={failed ? "enter-error" : undefined}
            className="flex-1 rounded-md border px-3 py-2 text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ borderColor: "var(--color-rule)", background: "var(--color-bg-card)" }}
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2 font-semibold text-white transition-colors hover:bg-accent-deep focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Open it
          </button>
        </div>
        {failed && (
          <p id="enter-error" role="alert" className="text-debt" style={{ fontSize: "0.875rem" }}>
            That password didn&apos;t work. Check for a stray space, or ask whoever shared the link.
          </p>
        )}
      </form>

      <p className="mt-8 text-ink-faint" style={{ fontSize: "0.8rem" }}>
        This is a courtesy gate, not a lock. Please keep the link within the group it was shared with.
      </p>
    </div>
  );
}
