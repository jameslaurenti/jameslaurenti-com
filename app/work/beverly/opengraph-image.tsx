import { ImageResponse } from "next/og";

// Applies to /work/beverly and every page nested under it, so each piece gets a real card
// instead of inheriting the site-wide one. The per-page title and description come from each
// route's own metadata; this is the shared image behind them.
export const alt = "What Beverly Does Next: plain-language pieces and tools on the city budget";
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
            Beverly, Massachusetts
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
            What Beverly Does Next
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
            The city budget in plain language, with tools to poke at the numbers yourself.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 76, height: 8, background: ACCENT, borderRadius: 4, display: "flex" }} />
          <div style={{ fontSize: 28, color: INK_MID }}>
            jameslaurenti.com · Nonpartisan and sourced
          </div>
        </div>
      </div>
    ),
    size
  );
}
