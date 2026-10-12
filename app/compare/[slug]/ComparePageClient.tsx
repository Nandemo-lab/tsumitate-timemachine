"use client";

import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import PathInsights from "@/components/simulation/PathInsights";
import Link from "next/link";
import { trackCompareClick, trackSourceView } from "@/lib/analytics";

interface Props {
  resultA: SimulationResult;
  resultB: SimulationResult;
}

export default function ComparePageClient({ resultA, resultB }: Props) {
  const isTie = resultA.finalValue === resultB.finalValue;
  const winner = isTie ? null : (resultA.finalValue > resultB.finalValue ? resultA : resultB);
  const diff = Math.abs(resultA.finalValue - resultB.finalValue);
  const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatCurrency(Math.abs(value))}`;
  const compareHref = `/?tab=compare&fund=${resultA.fundId}&fundB=${resultB.fundId}&year=${resultA.startYear}&month=${resultA.startMonth}&amount=${resultA.monthlyAmount}`;

  return (
    <div className="min-w-0 space-y-8">
      {/* シミュレーション結果カード */}
      <section>
        <h2
          className="text-base font-bold text-[#263A53] mb-4"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          積立シミュレーション比較
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          {resultA.startYear}年{resultA.startMonth}月〜 / 毎月
          {(resultA.monthlyAmount / 10000).toFixed(0)}万円積立
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
      </section>

      <div className="grid gap-4">
        <PathInsights result={resultA} title={`${resultA.fundName}の途中経過`} />
        <PathInsights result={resultB} title={`${resultB.fundName}の途中経過`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={compareHref} onClick={() => trackCompareClick({ fund_id: `${resultA.fundId}_vs_${resultB.fundId}` })} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-[#263A53]">
          同じ2商品で条件を変える
        </Link>
        <Link href="/about/data-sources" onClick={() => trackSourceView("compare_result")} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D2DEE4] px-4 py-3 text-sm font-bold text-slate-700">
          データ期間・出典を確認
        </Link>
      </div>

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
    </div>
  );
}
