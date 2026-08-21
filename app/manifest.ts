import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "積立タイムマシン｜積立投資シミュレーション",
    short_name: "積立タイムマシン",
    description: "年次参考系列を用いて、オルカン・S&P500・NASDAQ100などの積立結果を簡易シミュレーション。",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
