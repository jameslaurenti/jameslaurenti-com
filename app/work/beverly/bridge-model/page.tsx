import type { Metadata } from "next";
import BridgeModel from "@/components/beverly/BridgeModel";

export const metadata: Metadata = {
  title: "Beverly bridge model — James Laurenti",
  description:
    "A working scenario tool for Beverly's structural deficit: the forecast gap, the pension cliff, reserves, and a permanent operating override, FY27 through FY40.",
};

export default function BridgeModelPage() {
  return <BridgeModel />;
}
