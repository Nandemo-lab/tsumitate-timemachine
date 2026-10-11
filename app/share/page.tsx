import type { Metadata } from "next";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS } from "@/lib/funds";
import { FundId } from "@/types";
import { buildShareUrl, parseShareParams } from "@/lib/utils/shareUrl";
import { RETURN_SERIES_REGISTRY } from "@/lib/return-series";
import Link from "next/link";

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
      robots: { index: false, follow: true },
      alternates: { canonical: null },
    };
  }

  const { fund, fundB, year, month, endYear, endMonth, amount } = parsed;
  const result = simulate({ fundId: fund as FundId, startYear: year, startMonth: month, endYear, endMonth, monthlyAmount: amount });
  const fundName = FUNDS[fund as FundId]?.shortName ?? fund;

  const resultB = fundB ? simulate({ fundId: fundB, startYear: year, startMonth: month, endYear, endMonth, monthlyAmount: amount }) : null;
  const fundBName = fundB ? FUNDS[fundB].shortName : null;
  const canonicalShareUrl = buildShareUrl(parsed);
  const ogImageUrl = `${BASE_URL}/api/og?fund=${fund}${fundB ? `&fundB=${fundB}` : ""}&year=${year}&month=${month}&endYear=${endYear}&endMonth=${endMonth}&amount=${amount}`;
  const title = fundBName
    ? `${fundName}と${fundBName}｜${year}年${month}月からの同条件積立結果`
    : `もし${year}年${month}月から${fundName}を毎月${formatCurrency(amount)}積み立てていたら`;
  const description = resultB
    ? `${year}年${month}月〜${endYear}年${endMonth}月、月${formatCurrency(amount)}。${fundName} ${formatCurrency(result.finalValue)}、${fundBName} ${formatCurrency(resultB.finalValue)}。`
    : `元本${formatCurrency(result.totalPrincipal)} → 期間末評価額${formatCurrency(result.finalValue)}。過去の月次実績による再現結果です。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalShareUrl,
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

  if (!parsed) {
    return (
      <main className="min-h-dvh bg-zinc-950 px-4 py-16 text-zinc-50">
        <div className="mx-auto max-w-lg rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-6">
          <h1 className="text-xl font-bold">共有条件を確認できません</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">商品・期間・積立額のいずれかが利用可能な実績範囲外です。既定商品や金額へ置き換えず、再計算を停止しました。</p>
          <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold">条件を選び直す</Link>
        </div>
      </main>
    );
  }

  const { fund, fundB, year, month, endYear, endMonth, amount } = parsed;
  const results = [fund, ...(fundB ? [fundB] : [])].map((fundId) => simulate({
    fundId,
    startYear: year,
    startMonth: month,
    endYear,
    endMonth,
    monthlyAmount: amount,
  }));
  const includesReferenceSeries = results.some((result) => RETURN_SERIES_REGISTRY[result.fundId].quality !== "A");

  return (
    <main className="min-h-dvh bg-zinc-950 px-4 py-12 text-zinc-50">
      <div className="mx-auto max-w-lg space-y-6">
        <header>
          <p className="text-xs font-bold tracking-widest text-indigo-300">共有された検証条件</p>
          <h1 className="mt-2 text-2xl font-black">同じ条件で結果を再現</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{year}年{month}月〜{endYear}年{endMonth}月・毎月{formatCurrency(amount)}・月初積立</p>
        </header>
        <section className="space-y-3">
          {results.map((result) => {
            const quality = RETURN_SERIES_REGISTRY[result.fundId].quality;
            return (
              <article key={result.fundId} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold" style={{ color: result.fundColor }}>{result.fundName}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${quality === "A" ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>{quality}品質</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-zinc-500">元本</dt><dd className="font-bold">{formatCurrency(result.totalPrincipal)}</dd></div>
                  <div><dt className="text-zinc-500">期間末評価額</dt><dd className="font-bold">{formatCurrency(result.finalValue)}</dd></div>
                  <div><dt className="text-zinc-500">損益</dt><dd className="font-bold">{result.profit >= 0 ? "+" : "−"}{formatCurrency(Math.abs(result.profit))}</dd></div>
                  <div><dt className="text-zinc-500">積立回数</dt><dd className="font-bold">{result.monthsElapsed}回</dd></div>
                </dl>
              </article>
            );
          })}
        </section>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-zinc-400">
          {includesReferenceSeries
            ? "G品質の参考系列を含むため、商品の優劣は表示しません。公式商品属性と参考結果を分けて確認してください。"
            : "同じ開始月・終了月・積立額を、検証済み月次実績へ適用した過去結果です。将来の成果を示すものではありません。"}
        </div>
        <p className="text-xs leading-relaxed text-zinc-500">A品質は商品設定後の検証済み月次実績だけを使用し、設定前を指数で補いません。税金・売買手数料・実取引の為替コストは個別計算していません。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold">別の条件を試す</Link>
          <Link href="/about/data-sources" className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300">出典と計算方法</Link>
        </div>
      </div>
    </main>
  );
}
