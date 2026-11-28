"use client";

import { useEffect, useState } from "react";
import { simulate, formatCurrency } from "@/lib/simulation";
import { parseShareParams, type ShareParams } from "@/lib/utils/shareUrl";
import { RETURN_SERIES_REGISTRY } from "@/lib/return-series";
import Link from "next/link";
import PathInsights from "@/components/simulation/PathInsights";

// The query is validated by the same parser used by the original server page.
// No financial result is shown until the URL has been read and calculated.
export default function ShareClient() {
  const [parsed, setParsed] = useState<ShareParams | null | undefined>(undefined);
  useEffect(() => {
    const sync = () => setParsed(parseShareParams(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  if (parsed === undefined) {
    return <main className="min-h-dvh bg-[#FAFAF7] px-4 py-16 text-[#263A53]"><p role="status" className="mx-auto max-w-lg text-sm">共有条件を確認しています。</p></main>;
  }
  if (!parsed) {
    return (
      <main className="min-h-dvh bg-[#FAFAF7] px-4 py-16 text-[#263A53]">
        <div className="mx-auto max-w-lg rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-6">
          <h1 className="text-xl font-bold">共有条件を確認できません</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">商品・期間・積立額のいずれかが利用可能な実績範囲外です。既定商品や金額へ置き換えず、再計算を停止しました。</p>
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
    <main className="min-h-dvh bg-[#FAFAF7] px-4 py-12 text-[#263A53]">
      <div className="mx-auto max-w-lg space-y-6">
        <header>
          <p className="text-xs font-bold tracking-widest text-[#236B8E]">共有された検証条件</p>
          <h1 className="mt-2 text-2xl font-black">同じ条件で結果を再現</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{year}年{month}月〜{endYear}年{endMonth}月・毎月{formatCurrency(amount)}・月初積立</p>
        </header>
        <section className="space-y-3">
          {results.map((result) => {
            const quality = RETURN_SERIES_REGISTRY[result.fundId].quality;
            return (
              <article key={result.fundId} className="rounded-2xl border border-[#D2DEE4] bg-[#F7FAFB] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold" style={{ color: result.fundColor }}>{result.fundName}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${quality === "A" ? "bg-emerald-400/10 text-emerald-700" : "bg-amber-400/10 text-amber-700"}`}>{quality}品質</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-slate-500">元本</dt><dd className="font-bold">{formatCurrency(result.totalPrincipal)}</dd></div>
                  <div><dt className="text-slate-500">期間末評価額</dt><dd className="font-bold">{formatCurrency(result.finalValue)}</dd></div>
                  <div><dt className="text-slate-500">損益</dt><dd className="font-bold">{result.profit >= 0 ? "+" : "−"}{formatCurrency(Math.abs(result.profit))}</dd></div>
                  <div><dt className="text-slate-500">積立回数</dt><dd className="font-bold">{result.monthsElapsed}回</dd></div>
                </dl>
              </article>
            );
          })}
        </section>
        <section className="space-y-4" aria-label="共有条件の月末経路分析">
          {results.map((result) => <PathInsights key={result.fundId} result={result} title={`${result.fundName}の途中経過`} />)}
        </section>
        <div className="rounded-xl border border-[#D2DEE4] bg-white p-4 text-xs leading-relaxed text-slate-600">
          {includesReferenceSeries
            ? "G品質の参考系列を含むため、商品の優劣は表示しません。公式商品属性と参考結果を分けて確認してください。"
            : "同じ開始月・終了月・積立額を、検証済み月次実績へ適用した過去結果です。将来の成果を示すものではありません。"}
        </div>
        <p className="text-xs leading-relaxed text-slate-500">A品質は商品設定後の検証済み月次実績だけを使用し、設定前を指数で補いません。税金・売買手数料・実取引の為替コストは個別計算していません。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold">別の条件を試す</Link>
          <Link href="/about/data-sources" className="inline-flex min-h-11 items-center rounded-xl border border-[#D2DEE4] px-4 py-3 text-sm font-bold text-slate-700">出典と計算方法</Link>
        </div>
      </div>
    </main>
  );
}
