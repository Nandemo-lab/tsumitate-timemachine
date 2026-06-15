import { MetadataRoute } from "next";
import { FUND_LIST } from "@/lib/funds";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";
const YEARS = [2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const simPages: MetadataRoute.Sitemap = [];
  for (const fund of FUND_LIST) {
    for (const year of YEARS) {
      simPages.push({
        url: `${BASE_URL}/simulate/${fund.id}/${year}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...simPages];
}
