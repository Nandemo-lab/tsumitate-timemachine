"use client";

import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import PathInsights from "@/components/simulation/PathInsights";
import Link from "next/link";
import { trackCompareClick, trackSourceView } from "@/lib/analytics";
import { PageVisualStory } from "@/components/visual/VisualStory";
import { analyzeSimulationPath } from "@/lib/simulation-insights";

interface Props {
  resultA: SimulationResult;
  resultB: SimulationResult;
}

export default function ComparePageClient({ resultA, resultB }: Props) {
  const isTie = resultA.finalValue === resultB.finalValue;
  const winner = isTie ? null : (resultA.finalValue > resultB.finalValue ? resultA : resultB);
  const diff = Math.abs(resultA.finalValue - resultB.finalValue);
  const lastMonth = resultA.dataPoints.at(-1)?.date;
  const pathA = analyzeSimulationPath(resultA.dataPoints);
  const pathB = analyzeSimulationPath(resultB.dataPoints);
  const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatCurrency(Math.abs(value))}`;
  const compareHref = `/?tab=compare&fund=${resultA.fundId}&fundB=${resultB.fundId}&year=${resultA.startYear}&month=${resultA.startMonth}&amount=${resultA.monthlyAmount}`;

  return (
    <div className="min-w-0 space-y-8">
      <PageVisualStory kind="compare" />
      {/* シミュレーション結果カード */}
      <section>
        <h2
          className="text-base font-bold text-[#263A53] mb-4"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          積立シミュレーション比較
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          {resultA.startYear}年{resultA.startMonth}月〜{lastMonth?.replace("/", "年")}月 / 毎月
          {formatCurrency(resultA.monthlyAmount)}を月初に積立、月末で評価
        </p>

        <div className="mb-4 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3">
          {[resultA, resultB].map((r) => (
            <div
              key={r.fundId}
              className="min-w-0 space-y-3 rounded-xl border p-3 min-[390px]:p-4"
              style={{ borderColor: r.fundColor + "44", background: r.fundColor + "0a" }}
            >
              <div className="flex items-center gap-2 leading-tight">
                <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: r.fundColor }} />
                <span className="min-w-0 break-words text-sm font-bold text-[#263A53]">{r.fundName}</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">評価額</p>
                <p className="text-lg font-bold text-[#263A53] tabular-nums">
                  {formatCurrency(r.finalValue)}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-2">
                <div>
                  <p className="text-[10px] text-slate-500">利益</p>
                  <p className="whitespace-nowrap text-xs font-bold tabular-nums min-[390px]:text-sm" style={{ color: r.fundColor }}>
                    {signed(r.profit)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">リターン</p>
                  <p className="whitespace-nowrap text-xs font-bold tabular-nums min-[390px]:text-sm" style={{ color: r.fundColor }}>
                    {r.returnRate > 0 ? "+" : ""}{r.returnRate}%
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">元本</p>
                <p className="text-xs text-slate-600 tabular-nums">
                  {formatCurrency(r.totalPrincipal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 差額バナー */}
        <div className="rounded-xl bg-[#F7FAFB] border border-[#D9E3E8] p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">
            {winner ? <><span className="font-bold text-[#263A53]">{winner.fundName}</span> の期間末評価額が高い</> : "この条件では期間末評価額が同額"}
          </p>
          <p className="text-2xl font-black tabular-nums" style={{ color: winner?.fundColor ?? "#d4d4d8" }}>
            {winner ? `差 ${formatCurrency(diff)}` : "同額"}
          </p>
        </div>
        <p className="mt-3 rounded-xl border border-[#D9E3E8] bg-white px-4 py-3 text-xs leading-relaxed text-slate-700">
          月末の元本割れは{resultA.fundName}が{pathA.belowPrincipalMonths}か月、{resultB.fundName}が{pathB.belowPrincipalMonths}か月。
          <a
            href="#risk-path"
            onClick={() => { const details = document.getElementById("risk-path") as HTMLDetailsElement | null; if (details) details.open = true; }}
            className="ml-1 font-bold text-[#236B8E] underline underline-offset-2"
          >途中経過と判定条件を見る</a>
        </p>
      </section>

      {/* グラフ比較 */}
      <section>
        <h2
          className="text-base font-bold text-[#263A53] mb-4"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          資産推移グラフ
        </h2>
        <ComparisonChart planA={resultA} planB={resultB} />
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={compareHref} onClick={() => trackCompareClick({ fund_id: `${resultA.fundId}_vs_${resultB.fundId}` })} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#236B8E] px-4 py-3 text-sm font-bold text-white">
          同じ2商品で条件を変える
        </Link>
        <Link href="/about/data-sources" onClick={() => trackSourceView("compare_result")} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#B9CBD4] bg-white px-4 py-3 text-sm font-bold text-[#365F78]">
          データ期間・出典を確認
        </Link>
      </div>

      <details id="risk-path" className="scroll-mt-4 rounded-xl border border-[#D9E3E8] bg-white px-4 py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-bold text-[#263A53]">積立途中の元本割れを確認する</summary>
        <div className="grid gap-4 border-t border-[#E2EAEE] pt-4">
          <PathInsights result={resultA} title={`${resultA.fundName}の途中経過`} />
          <PathInsights result={resultB} title={`${resultB.fundName}の途中経過`} />
        </div>
      </details>
    </div>
  );
}
