import { formatCurrency } from "@/lib/simulation";

/**
 * 比較コラム記事（content/articles/*.tsx）共通のUIパーツ。
 * 記事が増えても見た目・実装を統一するため、記事ファイル側で再定義しない。
 */

export function SectionHeading({ index, title }: { index: number; title: string }) {
  return (
    <h2
      className="text-lg font-black text-white flex items-start gap-2 leading-tight"
      style={{ fontFamily: "var(--font-serif-jp), serif" }}
    >
      <span className="text-indigo-400 font-black text-base mt-0.5 flex-shrink-0">{index + 1}.</span>
      {title}
    </h2>
  );
}

export function SpecCard({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
      <ul className="space-y-2">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-start gap-3 text-sm">
            <span className="text-zinc-500 w-20 flex-shrink-0">{k}</span>
            <span className="text-zinc-200">{v}</span>
          </li>
        ))}
      </ul>
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
      className="rounded-xl p-4 space-y-2"
      style={{
        background: `linear-gradient(145deg, ${color}12 0%, transparent 70%)`,
        border: `1px solid ${color}30`,
      }}
    >
      <p className="text-[11px] font-bold" style={{ color }}>{name}</p>
      <p className="text-xl font-black text-emerald-400 leading-none">
        +{formatCurrency(sim.profit)}
      </p>
      <p className="text-[11px] text-emerald-300">+{sim.returnRate.toFixed(1)}%</p>
      <div className="pt-1 border-t border-white/[0.06] space-y-0.5">
        <p className="text-[10px] text-zinc-500">元本 {formatCurrency(sim.totalPrincipal)}</p>
        <p className="text-[10px] text-zinc-400">評価額 {formatCurrency(sim.finalValue)}</p>
      </div>
    </div>
  );
}
