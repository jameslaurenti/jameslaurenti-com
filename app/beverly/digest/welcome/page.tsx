import type { Metadata } from "next";
import { WelcomeBody } from "@/components/beverly/DigestSubscribe";

/** Where Kit sends people after they click the confirmation link. Not for search. */
export const metadata: Metadata = {
  title: "Subscribed to the Beverly Meeting Digest — James Laurenti",
  robots: { index: false, follow: false },
};

export default function DigestWelcome() {
  return <WelcomeBody />;
}
