import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "DevReview — Get Honest Code Reviews from Developers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #2F6F4E 0%, #3FA97A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#F3FBF6",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#1C2321",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path
                d="M14 10L7 17L14 24"
                stroke="#3FA97A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 18L22 22L28 12"
                stroke="#F3FBF6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              letterSpacing: "-0.02em",
            }}
          >
            Dev<span style={{ color: "#F3FBF6" }}>Review</span>
          </span>
        </div>
        <p
          style={{
            fontSize: "24px",
            opacity: 0.9,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Showcase your projects. Get honest feedback from developers.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
