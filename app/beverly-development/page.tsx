import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Property Development Tracker — James Laurenti",
  description:
    "An interactive map of active and recent real estate development projects in Beverly, MA.",
};

export default function BeverlyDevelopmentPage() {
  return (
    <div style={{ height: "calc(100dvh - 56px)", overflow: "hidden" }}>
      <iframe
        src="https://beverly-property-dev-tracker.vercel.app"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Beverly Property Development Tracker"
      />
    </div>
  );
}
