import { ImageResponse } from "next/og";

// Each issue needs its own card. The furniture is shared with issue 1, but the dates and
// the standfirst are baked into the image, so pointing a new issue at an old card ships a
// share preview with the wrong week on it.
export const alt =
  "Beverly Meeting Digest, September 10 to 20, 2026: pensions, a city-run electric utility, and two union agreements";
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
            Beverly, Massachusetts · Sep 10 to Sep 20, 2026
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
            A pension increase the city can stop paying, a city-run electric utility on the
            table, and two union agreements ratified by name.
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
