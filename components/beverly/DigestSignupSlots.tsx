"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DigestSignup from "@/components/beverly/DigestSignup";

/**
 * The two signup placements the digest layout adds to every issue and the archive: a
 * one-line pointer above the content and the full box below it. No pop-ups, nothing
 * sticky. Hidden on the signup and welcome pages, which are themselves the signup.
 */
const OWN_PAGES = ["/beverly/digest/subscribe", "/beverly/digest/welcome"];
const hidden = (path: string | null) => !!path && OWN_PAGES.some((p) => path.startsWith(p));

export function SignupLine() {
  const path = usePathname();
  if (hidden(path)) return null;
  const placement = path === "/beverly/digest" ? "archive-top" : "issue-top";
  return (
    <div className="bg-bg">
      <p className="mx-auto max-w-3xl px-6 pt-4 text-right text-[0.85rem] text-ink-faint">
        New issue every Monday.{" "}
        <Link href={`/beverly/digest/subscribe?from=${placement}`} className="rlink font-semibold">
          Get it by email
        </Link>
      </p>
    </div>
  );
}

export function SignupBox() {
  const path = usePathname();
  if (hidden(path)) return null;
  return (
    <div className="bg-bg">
      <div className="mx-auto max-w-3xl px-6 pb-10">
        <DigestSignup placement={path === "/beverly/digest" ? "archive-end" : "issue-end"} />
      </div>
    </div>
  );
}
