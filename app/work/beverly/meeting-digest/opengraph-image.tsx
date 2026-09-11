import { ImageResponse } from "next/og";

// The digest sits under /work/beverly for URL tidiness but is not part of the
// "What Beverly Does Next" collection, so it cannot use the shared card: that image
// has the collection name set across it, which made every shared link advertise the
// collection instead of the digest. Same palette and furniture, its own words.
export const alt = "Beverly Meeting Digest: what the city's boards did, and what is coming next";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site palette, from app/globals.css.
const PAPER = "#f0ede8";
const INK = "#1a1815";
const INK_MID = "#554d45";
const ACCENT = "#2d6a4f";
const SIENNA = "#9c4a24";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: SIENNA,
              fontWeight: 700,
            }}
          >
            Beverly, Massachusetts · Aug 26 to Sep 9, 2026
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 96,
              lineHeight: 1.03,
              letterSpacing: -2.5,
              color: INK,
              fontWeight: 800,
              maxWidth: 960,
            }}
          >
            Beverly Meeting Digest
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 34,
              lineHeight: 1.35,
              color: INK_MID,
              maxWidth: 940,
            }}
          >
            What the City Council, School Committee and Deficit Reduction Committee took up, plus
            the dates coming next.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{ width: 76, height: 8, background: ACCENT, borderRadius: 4, display: "flex" }}
          />
          <div style={{ fontSize: 28, color: INK_MID }}>
            jameslaurenti.com · Independent and sourced
          </div>
        </div>
      </div>
    ),
    size
  );
}
