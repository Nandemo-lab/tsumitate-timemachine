import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #f59e0b 100%)",
        }}
      >
        <div
          style={{
            width: "124px",
            height: "124px",
            borderRadius: "50%",
            border: "13px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "10px",
              height: "40px",
              background: "white",
              borderRadius: "5px",
              top: "18px",
              left: "57px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "32px",
              height: "10px",
              background: "white",
              borderRadius: "5px",
              top: "55px",
              left: "60px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
