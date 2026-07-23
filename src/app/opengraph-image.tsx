import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";
export const alt = "Voxis — Speak your code. Write at lightspeed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Code-generated 1200x630 share card in the brand identity (cyan #22d3ee on
// black). No binary asset to maintain; Next emits og:image + twitter:image
// URLs pointing at this route.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "radial-gradient(1200px 630px at 78% 18%, rgba(34,211,238,0.22), rgba(0,0,0,0) 55%), #000000",
          padding: "88px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "#22d3ee",
            fontSize: 30,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "#22d3ee",
            }}
          />
          Voxis
        </div>
        <div
          style={{
            marginTop: 36,
            color: "#ffffff",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 940,
          }}
        >
          Speak your code.
          <br />
          Write at lightspeed.
        </div>
        <div
          style={{
            marginTop: 34,
            color: "#a1a1aa",
            fontSize: 32,
            maxWidth: 900,
          }}
        >
          Private, blazing-fast desktop voice dictation — Tauri&nbsp;v2 &middot; Rust &middot; Whisper
        </div>
      </div>
    ),
    { ...size },
  );
}
