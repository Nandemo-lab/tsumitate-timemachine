"use client";

import { useMemo } from "react";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import ComparisonChart from "@/components/simulation/ComparisonChart";

interface Props {
  resultA: SimulationResult;
  resultB: SimulationResult;
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      {sub && <span className="text-xs text-zinc-400">{sub}</span>}
    </div>
  );
}

export default function ComparePageClient({ resultA, resultB }: Props) {
  const winner = resultA.profit >= resultB.profit ? resultA : resultB;
  const loser  = resultA.profit >= resultB.profit ? resultB : resultA;
  const diff   = Math.abs(resultA.profit - resultB.profit);

  return (
    <div className="space-y-8">
      {/* シミュレーション結果カード */}
      <section>
        <h2
          className="text-base font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          積立シミュレーション比較
        </h2>
        <p className="text-xs text-zinc-500 mb-4">
          {resultA.startYear}年{resultA.startMonth}月〜 / 毎月
          {(resultA.monthlyAmount / 10000).toFixed(0)}万円積立
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[resultA, resultB].map((r) => (
            <div
              key={r.fundId}
              className="rounded-xl border p-4 space-y-3"
              style={{ borderColor: r.fundColor + "44", background: r.fundColor + "0a" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: r.fundColor }} />
                <span className="text-sm font-bold text-white">{r.fundName}</span>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">評価額</p>
                <p className="text-lg font-bold text-white tabular-nums">
                  {formatCurrency(r.finalValue)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-zinc-500">利益</p>
                  <p className="text-sm font-bold tabular-nums" style={{ color: r.fundColor }}>
                    +{formatCurrency(r.profit)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500">リターン</p>
                  <p className="text-sm font-bold tabular-nums" style={{ color: r.fundColor }}>
                    +{r.returnRate}%
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">元本</p>
                <p className="text-xs text-zinc-400 tabular-nums">
                  {formatCurrency(r.totalPrincipal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 差額バナー */}
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 text-center">
          <p className="text-xs text-zinc-500 mb-1">
            <span className="font-bold text-white">{winner.fundName}</span> が上回った利益差
          </p>
          <p className="text-2xl font-black tabular-nums" style={{ color: winner.fundColor }}>
            +{formatCurrency(diff)}
          </p>
        </div>
      </section>

      {/* グラフ比較 */}
      <section>
        <h2
          className="text-base font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          資産推移グラフ
        </h2>
        <ComparisonChart planA={resultA} planB={resultB} />
      </section>
    </div>
  );
}
