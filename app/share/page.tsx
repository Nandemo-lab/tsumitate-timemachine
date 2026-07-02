import type { Metadata } from "next";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS } from "@/lib/funds";
import { FundId } from "@/types";
import { parseShareParams } from "@/lib/utils/shareUrl";
import ShareRedirect from "./ShareRedirect";

const BASE_URL = "https://tsumitate-timemachine.com";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const qs = new URLSearchParams(sp as Record<string, string>).toString();
  const parsed = parseShareParams(qs);

  if (!parsed) {
    return {
      title: "積立タイムマシン｜もしあの時から積み立てていたら？",
      openGraph: { images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [`${BASE_URL}/api/og`] },
      alternates: { canonical: BASE_URL },
    };
  }

  const { fund, year, month, amount } = parsed;
  const result = simulate({ fundId: fund as FundId, startYear: year, startMonth: month, monthlyAmount: amount });
  const fundName = FUNDS[fund as FundId]?.shortName ?? fund;

  const ogImageUrl = `${BASE_URL}/api/og?fund=${fund}&year=${year}&month=${month}&amount=${amount}`;
  const title = `もし${year}年${month}月から${fundName}を毎月${formatCurrency(amount)}積み立てていたら +${formatCurrency(result.profit)}（+${result.returnRate.toFixed(1)}%）`;
  const description = `元本${formatCurrency(result.totalPrincipal)} → 評価額${formatCurrency(result.finalValue)}。積立タイムマシンで過去のたられば投資を無料シミュレーション！`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/share?f=${fund}&y=${year}&m=${month}&a=${amount}`,
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    // canonical → root SPA (share pages are not independently indexable content)
    alternates: { canonical: BASE_URL },
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams(sp as Record<string, string>).toString();
  const parsed = parseShareParams(qs);

  return <ShareRedirect params={parsed} />;
}
