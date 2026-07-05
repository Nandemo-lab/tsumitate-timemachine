import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "7px",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            border: "2.4px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "1.8px",
              height: "7px",
              background: "white",
              borderRadius: "1px",
              top: "3.5px",
              left: "9.9px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "5.5px",
              height: "1.8px",
              background: "white",
              borderRadius: "1px",
              top: "9.8px",
              left: "10px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
