import type { Metadata } from "next";
import { SubscribeBody } from "@/components/beverly/DigestSubscribe";

export const metadata: Metadata = {
  title: "Get the Beverly Meeting Digest by email — James Laurenti",
  description:
    "A weekly email on what Beverly's City Council, School Committee and city boards did, and what is coming up. Free, sourced, independent.",
  openGraph: {
    type: "website",
    title: "Get the Beverly Meeting Digest by email",
    description:
      "What Beverly's boards did this week and what is coming up, in one short email on Mondays. Free.",
    url: "/beverly/digest/subscribe",
    images: ["/beverly/opengraph-image"],
  },
};
// Reads the newest published issue on each request so the sample is never a week stale.
export const dynamic = "force-dynamic";

export default function DigestSubscribe() {
  return <SubscribeBody placement="subscribe-page" />;
}
