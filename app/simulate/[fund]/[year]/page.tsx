import { Metadata } from "next";
import { notFound } from "next/navigation";
import { simulate, formatCurrency, calcElapsedYears, parseStrictInteger } from "@/lib/simulation";
import { FUNDS, FUND_LIST } from "@/lib/funds";
import { FundId } from "@/types";
import { isProgrammaticIndexException } from "@/lib/index-policy";
import { getAvailableStartMonth, isReturnMonthAvailable, isVerifiedReturnSeries } from "@/lib/return-series";
import SimulationDetail from "./SimulationDetail";

interface Props {
  params: Promise<{ fund: string; year: string }>;
}

function isValidFundId(id: string): id is FundId {
  return id in FUNDS;
}

export async function generateStaticParams() {
  const funds = FUND_LIST.map((f) => f.id);
  const years = Array.from({ length: 10 }, (_, i) => String(2015 + i));
  const paths = [];
  for (const fund of funds) {
    for (const year of years) {
      paths.push({ fund, year });
    }
  }
  return paths;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fund, year } = await params;
  if (!isValidFundId(fund)) return {};

  const fundData = FUNDS[fund];
  const startYear = parseStrictInteger(year);
  if (startYear === null) return {};
  const pathname = `/simulate/${fund}/${year}`;
  const keepIndexed = isProgrammaticIndexException(pathname);
  const monthlyAmount = 30000;
  if (!isVerifiedReturnSeries(fund)) {
    return {
      title: `${fundData.shortName}のデータ品質と商品情報`,
      description: `${fundData.shortName}は参考系列（G品質）のため、未検証の評価額・利益・リターンは表示しません。確認済みの商品属性とデータ品質をご案内します。`,
      robots: { index: false, follow: true },
      alternates: { canonical: null },
    };
  }
  if (!isReturnMonthAvailable(fund, startYear, 1)) {
    const available = getAvailableStartMonth(fund);
    return {
      title: `${fundData.shortName}の公式実績は${available.replace("-", "年")}月から`,
      description: `${fundData.shortName}の検証済み実績を利用できる開始時期をご案内します。商品設定前の架空実績は表示しません。`,
      robots: { index: false, follow: true },
      alternates: { canonical: null },
    };
  }
  const result = simulate({ fundId: fund, startYear, startMonth: 1, monthlyAmount });
  const elapsed = calcElapsedYears(startYear, 1).toFixed(0);

  const title = `${startYear}年から${fundData.shortName}を積み立てていたら？ ${formatCurrency(result.profit)}の利益`;
  const description = `もし${startYear}年1月から毎月${formatCurrency(monthlyAmount)}を${fundData.shortName}に積み立てていたら、約${elapsed}年で${formatCurrency(result.profit)}の利益（${result.returnRate.toFixed(1)}%リターン）。現在評価額は${formatCurrency(result.finalValue)}。`;

  const ogUrl = new URL("https://tsumitate-timemachine.com/api/og");
  ogUrl.searchParams.set("fund", fund);
  ogUrl.searchParams.set("year", year);
  ogUrl.searchParams.set("amount", String(monthlyAmount));

  return {
    title,
    description,
    robots: { index: keepIndexed, follow: true },
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
    alternates: {
      canonical: keepIndexed ? `https://tsumitate-timemachine.com${pathname}` : null,
    },
  };
}

export default async function SimulatePage({ params }: Props) {
  const { fund, year } = await params;
  const parsedYear = parseStrictInteger(year);
  if (!isValidFundId(fund) || parsedYear === null || parsedYear < 2015 || parsedYear > 2024) notFound();
  return <>
    <style>{`html[data-simulate-pending] #simulation-detail { visibility: hidden }
      #simulation-pending { display: none }
      html[data-simulate-pending] #simulation-pending { display: block }`}</style>
    <script dangerouslySetInnerHTML={{ __html: `if(new URLSearchParams(location.search).has('amount') && new URLSearchParams(location.search).get('amount') !== '30000') document.documentElement.setAttribute('data-simulate-pending','1')` }} />
    <p id="simulation-pending" role="status" className="mx-auto max-w-2xl px-4 py-16 text-sm text-slate-700">指定条件を計算しています。</p>
    <div id="simulation-detail"><SimulationDetail fund={fund} year={year} /></div>
  </>;
}
