import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle break-ins on the police scanner — James Laurenti",
  description:
    "Where Beverly's vehicle break-in and car-check calls went out over the police radio. Built from scanner transcripts, shown at block level, and not an official record.",
  openGraph: {
    type: "article",
    title: "Vehicle break-ins on the police scanner",
    description:
      "Where Beverly's vehicle break-in and car-check calls went out over the police radio. Built from scanner transcripts, shown at block level, and not an official record.",
    url: "/work/beverly/vehicle-incidents",
  },
};

export default function VehicleIncidentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
