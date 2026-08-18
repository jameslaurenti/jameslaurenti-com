import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  HL_ACCESS_COOKIE,
  HL_ACCESS_VALUE,
  HL_PATH,
  harborlightPassword,
} from "@/lib/harborlightGate";

export const metadata: Metadata = {
  title: "Harborlight parent digest",
  robots: { index: false, follow: false },
};

async function enter(formData: FormData) {
  "use server";

  const supplied = String(formData.get("password") ?? "").trim();
  const expected = harborlightPassword();

  if (supplied.toLowerCase() !== expected.toLowerCase()) {
    redirect(`${HL_PATH}/enter?bad=1`);
  }

  const jar = await cookies();
  jar.set(HL_ACCESS_COOKIE, HL_ACCESS_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 120, // 120 days
  });

  redirect(HL_PATH);
}

export default async function HarborlightEnterPage({
  searchParams,
}: {
  searchParams: Promise<{ bad?: string }>;
}) {
  const failed = (await searchParams).bad === "1";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-16">
      <span
        className="font-semibold uppercase text-accent"
        style={{ fontSize: "0.7rem", letterSpacing: "0.16em" }}
      >
        Harborlight families
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        Parent digest
      </h1>
      <p className="mt-3 leading-relaxed text-ink-mid">
        A light recap of the school notes, the important bits pulled from
        Harborlight emails into one place. It is shared with a few families by
        direct link, so it needs a shared word. If you were sent here, you have
        it.
      </p>

      <form action={enter} className="mt-7 flex flex-col gap-3">
        <label
          htmlFor="password"
          className="font-medium text-ink"
          style={{ fontSize: "0.9rem" }}
        >
          Shared word
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
            style={{
              borderColor: "var(--color-rule)",
              background: "var(--color-bg-card)",
            }}
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2 font-semibold text-white transition-colors hover:bg-accent-deep focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Read it
          </button>
        </div>
        {failed && (
          <p
            id="enter-error"
            role="alert"
            className="text-debt"
            style={{ fontSize: "0.875rem" }}
          >
            That did not match. Check for a stray space, or ask whoever shared
            the link.
          </p>
        )}
      </form>

      <p className="mt-8 text-ink-faint" style={{ fontSize: "0.8rem" }}>
        This is a courtesy gate, not a security boundary. The digest names
        children by first name only. Please keep the link within the Harborlight
        community.
      </p>
    </div>
  );
}
