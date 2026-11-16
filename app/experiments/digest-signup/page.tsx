import type { Metadata } from "next";
import Issue10 from "@/app/beverly/digest/2026-11-16/page";
import DigestSignup from "@/components/beverly/DigestSignup";
import { AfterContents, CurrentLine, MidIssue, OptionBar, TopBand } from "./SignupMock";

/**
 * Three ways to make the email signup easier to find on an issue page, shown on the live
 * issue 10. Unlisted under /experiments (noindex via next.config.ts). Views here are tagged
 * as previews by lib/analytics, so they never count toward issue 10. Every option keeps
 * the box at the end of the issue; none is sticky or a pop-up.
 */
export const metadata: Metadata = {
  title: "Digest signup options",
  robots: { index: false, follow: false },
};

export default async function SignupOptions({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v: raw } = await searchParams;
  const v = raw === "b" || raw === "c" ? raw : "a";
  return (
    <>
      <OptionBar v={v} />
      {v === "a" ? <TopBand /> : <CurrentLine />}
      <Issue10 />
      {v === "b" && <AfterContents />}
      {v === "c" && <MidIssue />}
      <div className="bg-bg">
        <div className="mx-auto max-w-3xl px-6 pb-16">
          <DigestSignup placement="mockup-end" />
        </div>
      </div>
    </>
  );
}
