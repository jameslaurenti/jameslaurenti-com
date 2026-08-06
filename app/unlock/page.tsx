import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, ACCESS_VALUE, safeNext } from "@/lib/draftGate";

export const metadata: Metadata = {
  title: "Draft access — James Laurenti",
  robots: { index: false, follow: false },
};

async function unlock(formData: FormData) {
  "use server";

  const next = safeNext(String(formData.get("next") ?? ""));
  const supplied = String(formData.get("password") ?? "").trim();
  const expected = process.env.WBI_PASSWORD ?? "tomato93";

  if (supplied.toLowerCase() !== expected.toLowerCase()) {
    redirect(`/unlock?next=${encodeURIComponent(next)}&bad=1`);
  }

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, ACCESS_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days
  });

  redirect(next);
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; bad?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const failed = params.bad === "1";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-16">
      <span
        className="font-semibold uppercase text-accent"
        style={{ fontSize: "0.7rem", letterSpacing: "0.16em" }}
      >
        Unpublished draft
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        This one isn&apos;t finished yet
      </h1>
      <p className="mt-3 leading-relaxed text-ink-mid">
        You&apos;ve reached a piece that is still being edited. It&apos;s shared with a few readers for comment before it
        goes up properly, so it needs a password. If you were sent here, you have it. If you landed here by accident,
        the finished work is on the{" "}
        <a href="/work/beverly" className="rlink">
          Beverly page
        </a>
        .
      </p>

      <form action={unlock} className="mt-7 flex flex-col gap-3">
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
            aria-describedby={failed ? "unlock-error" : undefined}
            className="flex-1 rounded-md border px-3 py-2 text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ borderColor: "var(--color-rule)", background: "var(--color-bg-card)" }}
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2 font-semibold text-white transition-colors hover:bg-accent-deep focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Read it
          </button>
        </div>
        {failed && (
          <p id="unlock-error" role="alert" className="text-debt" style={{ fontSize: "0.875rem" }}>
            That password didn&apos;t work. Check for a stray space and try again.
          </p>
        )}
      </form>

      <p className="mt-8 text-ink-faint" style={{ fontSize: "0.8rem" }}>
        This is a courtesy gate on a draft, not a security boundary. Please don&apos;t share the link or quote from the
        piece until it&apos;s published.
      </p>
    </div>
  );
}
