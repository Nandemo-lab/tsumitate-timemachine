"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";

interface Props {
  planA: SimulationResult;
  planB: SimulationResult;
}

interface MergedPoint {
  date: string;
  principalA: number;
  valueA: number;
  valueB: number;
  profitA: number;
  profitB: number;
}

type ChartMode = "value" | "profit";

function mergeData(a: SimulationResult, b: SimulationResult): MergedPoint[] {
  const maxLen = Math.max(a.dataPoints.length, b.dataPoints.length);
  return Array.from({ length: maxLen }, (_, i) => {
    const pA = a.dataPoints[i]?.principal ?? 0;
    const vA = a.dataPoints[i]?.value ?? 0;
    const vB = b.dataPoints[i]?.value ?? 0;
    return {
      date: a.dataPoints[i]?.date ?? b.dataPoints[i]?.date ?? "",
      principalA: pA,
      valueA: vA,
      valueB: vB,
      profitA: vA - pA,
      profitB: vB - pA,
    };
  });
}

const CustomTooltip = ({
  active,
  payload,
  label,
  planA,
  planB,
  mode,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: readonly any[];
  label?: string;
  planA: SimulationResult;
  planB: SimulationResult;
  mode: ChartMode;
}) => {
  if (!active || !payload?.length) return null;
  const vA = payload.find((p) => p.name === "valueA" || p.name === "profitA")?.value ?? 0;
  const vB = payload.find((p) => p.name === "valueB" || p.name === "profitB")?.value ?? 0;
  const principal = payload.find((p) => p.name === "principalA")?.value ?? 0;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/98 p-3 shadow-xl backdrop-blur-sm text-xs">
      <p className="mb-2 font-bold text-zinc-200">{label}</p>
      {mode === "value" && (
        <p className="text-zinc-400 mb-2 text-[10px]">元本: {formatCurrency(principal)}</p>
      )}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: planA.fundColor }} />
            <span style={{ color: planA.fundColor }} className="font-bold">{planA.fundName}</span>
          </div>
          <span className="font-black text-white">
            {mode === "profit" && vA >= 0 ? "+" : ""}{formatCurrency(vA)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: planB.fundColor }} />
            <span style={{ color: planB.fundColor }} className="font-bold">{planB.fundName}</span>
          </div>
          <span className="font-black text-white">
            {mode === "profit" && vB >= 0 ? "+" : ""}{formatCurrency(vB)}
          </span>
        </div>
        {vA !== vB && (
          <div className="pt-1 border-t border-white/10">
            <span className="text-zinc-400 text-[10px]">差: </span>
            <span className="font-bold text-white text-[10px]">{formatCurrency(Math.abs(vA - vB))}</span>
          </div>
        )}
      </div>
    </div>
  );
};

function getTickInterval(dataLength: number): number {
  if (dataLength <= 24) return 5;
  if (dataLength <= 60) return 11;
  return 23;
}

const yFormatter = (v: number) => {
  if (Math.abs(v) >= 100_000_000) return `${(v / 100_000_000).toFixed(0)}億`;
  if (Math.abs(v) >= 10_000) return `${(v / 10_000).toFixed(0)}万`;
  return `${v}`;
};

export default function ComparisonChart({ planA, planB }: Props) {
  const [mode, setMode] = useState<ChartMode>("value");
  const data = mergeData(planA, planB);
  const interval = getTickInterval(data.length);

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5 gap-0.5 w-fit mb-4">
        {(["value", "profit"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              mode === m ? "bg-white/15 text-white" : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {m === "value" ? "評価額" : "利益額"}
          </button>
        ))}
      </div>

      <div className="h-60 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={planA.fundColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={planA.fundColor} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={planB.fundColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={planB.fundColor} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#52525b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={interval}
            />
            <YAxis
              tick={{ fill: "#52525b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yFormatter}
              width={44}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={props.payload}
                  label={String(props.label ?? "")}
                  planA={planA}
                  planB={planB}
                  mode={mode}
                />
              )}
            />
            {mode === "value" && (
              <Area
                type="monotone"
                dataKey="principalA"
                name="principalA"
                stroke="#ffffff18"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="url(#gradPrincipal)"
                dot={false}
              />
            )}
            <Area
              type="monotone"
              dataKey={mode === "value" ? "valueA" : "profitA"}
              name={mode === "value" ? "valueA" : "profitA"}
              stroke={planA.fundColor}
              strokeWidth={2.5}
              fill="url(#gradA)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey={mode === "value" ? "valueB" : "profitB"}
              name={mode === "value" ? "valueB" : "profitB"}
              stroke={planB.fundColor}
              strokeWidth={2.5}
              fill="url(#gradB)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
