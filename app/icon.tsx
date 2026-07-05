import { ImageResponse } from "next/og";
import { LogoSvg } from "@/components/brand/LogoMark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <LogoSvg size={32} />
      </div>
    ),
    { ...size }
  );
}
