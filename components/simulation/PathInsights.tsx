import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import { analyzeSimulationPath } from "@/lib/simulation-insights";
import { Activity, TriangleAlert } from "lucide-react";

export default function PathInsights({ result, title = "途中経過も確認する" }: { result: SimulationResult; title?: string }) {
  const insights = analyzeSimulationPath(result.dataPoints);
  const hasShortfall = insights.belowPrincipalMonths > 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" aria-label={title}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">期間末だけでなく、毎月末の評価額がその時点の元本を下回った月を集計しました。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/8 bg-black/10 p-3">
          <p className="text-[11px] text-zinc-400">元本割れ月数</p>
          <p className="mt-1 font-number text-xl font-bold text-white">{insights.belowPrincipalMonths}か月</p>
          <p className="mt-1 text-[10px] text-zinc-500">全{result.monthsElapsed}回の月末観測</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/10 p-3">
          <p className="text-[11px] text-zinc-400">最長の連続元本割れ</p>
          <p className="mt-1 font-number text-xl font-bold text-white">{insights.longestBelowPrincipalStreak}か月</p>
          <p className="mt-1 text-[10px] text-zinc-500">
            {insights.longestStreakStart && insights.longestStreakEnd
              ? `${insights.longestStreakStart}〜${insights.longestStreakEnd}`
              : "該当なし"}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/10 p-3">
          <p className="text-[11px] text-zinc-400">最大の月末評価損</p>
          <p className={`mt-1 font-number text-xl font-bold ${hasShortfall ? "text-rose-300" : "text-white"}`}>
            {hasShortfall ? formatCurrency(insights.worstShortfall) : "0円"}
          </p>
          <p className="mt-1 text-[10px] text-zinc-500">
            {insights.worstShortfallMonth ? `${insights.worstShortfallMonth}（${insights.worstShortfallRate.toFixed(1)}%）` : "該当なし"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-400/[0.06] px-3 py-2.5 text-[11px] leading-relaxed text-amber-100/80">
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <p>月初の積立後に月次収益を反映した月末値で判定しています。日中の最大下落率や、将来の元本割れ確率・回復期間ではありません。</p>
      </div>
    </section>
  );
}
