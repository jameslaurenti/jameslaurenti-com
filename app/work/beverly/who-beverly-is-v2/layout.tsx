import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who Beverly Is (v2 review draft) — James Laurenti",
  description:
    "Second revision of the Beverly identity piece, for reader comment. Section 03 rebuilt around statewide reserve data; section 01's public works comparison is new.",
  // Same posture as v1: the URL works for anyone sent it, but a draft should not be
  // indexed. v1 stays live and unchanged at /work/beverly/who-beverly-is so readers
  // already reviewing it are not reading a moving target.
  robots: { index: false, follow: false },
};

export default function WhoBeverlyIsV2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
