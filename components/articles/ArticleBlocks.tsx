import { formatCurrency } from "@/lib/simulation";

/**
 * 比較コラム記事（content/articles/*.tsx）共通のUIパーツ。
 * 記事が増えても見た目・実装を統一するため、記事ファイル側で再定義しない。
 */

export function SectionHeading({ index, title }: { index: number; title: string }) {
  return (
    <h2
      className="flex items-start gap-3 border-b border-[#D9E3E8] pb-3 text-xl font-bold leading-[1.55] tracking-[-0.02em] text-[#20364c] md:text-2xl"
    >
      <span className="text-[#236B8E] font-black text-base mt-0.5 flex-shrink-0">{index + 1}.</span>
      {title}
    </h2>
  );
}

export function SpecCard({ rows }: { rows: [string, string][] }) {
  return (
    <div className="border-y border-[#DDE6EA] py-5">
      <dl className="space-y-3">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 text-sm sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="font-bold text-slate-600">{k}</dt>
            <dd className="leading-6 text-slate-700">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SimCard({ name, color, sim }: {
  name: string;
  color: string;
  sim: { totalPrincipal: number; finalValue: number; profit: number; returnRate: number };
}) {
  return (
    <div
      className="border-y py-4 space-y-2"
      style={{
        borderColor: `${color}30`,
      }}
    >
      <p className="text-xs font-bold" style={{ color }}>{name}</p>
      <p className={`text-xl font-black leading-none ${sim.profit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
        {sim.profit >= 0 ? "+" : ""}{formatCurrency(sim.profit)}
      </p>
      <p className={`text-xs ${sim.returnRate >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{sim.returnRate >= 0 ? "+" : ""}{sim.returnRate.toFixed(1)}%</p>
      <div className="pt-1 border-t border-[#E1E8EC] space-y-0.5">
        <p className="text-xs text-slate-500">元本 {formatCurrency(sim.totalPrincipal)}</p>
        <p className="text-xs text-slate-600">評価額 {formatCurrency(sim.finalValue)}</p>
      </div>
    </div>
  );
}
