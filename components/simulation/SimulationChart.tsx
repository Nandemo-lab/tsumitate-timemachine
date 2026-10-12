"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";

const compact = (value: number) => Math.abs(value) >= 10000 ? `${Math.round(value / 10000)}万` : `${value}`;

export default function SimulationChart({ result }: { result: SimulationResult }) {
  return (
    <section className="rounded-2xl border border-[#D9E3E8] bg-white p-4 md:p-5" aria-labelledby="simulation-chart-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div><p className="text-xs font-bold text-[#236B8E]">月末の推移</p><h3 id="simulation-chart-title" className="mt-1 text-base font-bold text-[#263A53]">元本と評価額</h3></div>
        <p className="text-xs text-slate-600">最終：{formatCurrency(result.finalValue)}</p>
      </div>
      <div className="h-60 min-w-0 overflow-hidden sm:h-72">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
          <AreaChart data={result.dataPoints} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs><linearGradient id="singleValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={result.fundColor} stopOpacity={0.28} /><stop offset="95%" stopColor={result.fundColor} stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAED" />
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={36} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={compact} width={44} />
            <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name === "principal" ? "元本" : "評価額"]} contentStyle={{ background: "#fff", border: "1px solid #D9E3E8", borderRadius: 12, color: "#263A53" }} />
            <Area type="monotone" dataKey="principal" name="元本" stroke="#8293A4" strokeDasharray="4 4" fill="transparent" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="value" name="評価額" stroke={result.fundColor} fill="url(#singleValue)" strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">月初に積み立て、月末の評価額を記録した過去実績です。日中の値動きは含みません。</p>
    </section>
  );
}
