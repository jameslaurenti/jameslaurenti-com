import { ImageResponse } from "next/og";

// The site-wide share card. It applies to every page that has no opengraph-image of its own
// (home, About, Writing, Work and so on); /beverly and each digest issue set their own. It
// follows app/beverly/opengraph-image.tsx so the two cards read as one site.
export const alt = "I can't leave a thing half-understood. James Laurenti's site.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site palette, from app/globals.css.
const PAPER = "#f0ede8";
const INK = "#1a1815";
const INK_MID = "#554d45";
const ACCENT = "#2d6a4f";

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
              color: ACCENT,
              fontWeight: 700,
            }}
          >
            Classics · Curiosity · Beverly
          </div>
          {/* Broken after "thing" on purpose, as on the home page, so the line never splits
              at the hyphen in "half-understood". */}
          <div
            style={{
              marginTop: 26,
              fontSize: 92,
              lineHeight: 1.03,
              letterSpacing: -2.5,
              color: INK,
              fontWeight: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{"I can't leave a thing"}</div>
            <div>half-understood.</div>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 34,
              lineHeight: 1.35,
              color: INK_MID,
              maxWidth: 900,
            }}
          >
            Plain-language guides to how Beverly, Massachusetts runs, and essays on what things mean.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 76, height: 8, background: ACCENT, borderRadius: 4, display: "flex" }} />
          <div style={{ fontSize: 28, color: INK_MID }}>James Laurenti · jameslaurenti.com</div>
        </div>
      </div>
    ),
    size
  );
}
