import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "積立タイムマシン｜積立投資シミュレーション",
    short_name: "積立タイムマシン",
    description: "過去の実績データをもとに、オルカン・S&P500・NASDAQ100などの積立結果をシミュレーション。",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
