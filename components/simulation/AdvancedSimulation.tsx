"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId, EventType, InvestmentEvent, AdvancedSimulationResult } from "@/types";
import { FUNDS, FUND_LIST } from "@/lib/funds";
import { simulateAdvanced, formatCurrency, START_YEAR_OPTIONS, MONTH_OPTIONS, MONTHLY_AMOUNT_OPTIONS } from "@/lib/simulation";
import { Plus, Trash2, ChevronDown, PlayCircle, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const EVENT_LABELS: Record<EventType, string> = {
  start: "📅 積立開始",
  change_amount: "📝 積立額変更",
  add_fund: "➕ 銘柄追加",
  lump_sum: "💰 一括投資",
  bonus: "🎁 ボーナス投資",
  stop: "⛔ 積立停止",
};

function newEvent(type: EventType, year: number, month: number): InvestmentEvent {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type, year, month,
    fundId: "orcan",
    monthlyAmount: 30000,
    lumpAmount: 100000,
    bonusMonths: [6, 12],
    bonusAmount: 50000,
  };
}

function EventRow({
  event,
  onChange,
  onDelete,
  isFirst,
}: {
  event: InvestmentEvent;
  onChange: (ev: InvestmentEvent) => void;
  onDelete: () => void;
  isFirst: boolean;
}) {
  const fund = event.fundId ? FUNDS[event.fundId] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden"
    >
      {/* Timeline dot */}
      <div className="flex">
        <div className="flex flex-col items-center px-3 py-4">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ background: fund?.color ?? "#6366f1", color: "#000" }}
          />
          {!isFirst && <div className="w-px flex-1 bg-white/10 mt-2" style={{ minHeight: 8 }} />}
        </div>

        <div className="flex-1 py-3 pr-3 space-y-3">
          {/* Event type & time */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={event.type}
              onChange={(e) => onChange({ ...event, type: e.target.value as EventType })}
              className="flex-1 min-w-0 bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs font-bold text-white appearance-none"
            >
              {Object.entries(EVENT_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-zinc-900">{v}</option>
              ))}
            </select>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Year/Month */}
          <div className="flex gap-2">
            <select
              value={event.year}
              onChange={(e) => onChange({ ...event, year: Number(e.target.value) })}
              className="flex-1 bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs text-zinc-300 appearance-none"
            >
              {START_YEAR_OPTIONS.map((y) => (
                <option key={y} value={y} className="bg-zinc-900">{y}年</option>
              ))}
            </select>
            <select
              value={event.month}
              onChange={(e) => onChange({ ...event, month: Number(e.target.value) })}
              className="w-20 bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs text-zinc-300 appearance-none"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m} className="bg-zinc-900">{m}月</option>
              ))}
            </select>
          </div>

          {/* Fund selector (where applicable) */}
          {(event.type === "start" || event.type === "add_fund" || event.type === "change_amount" || event.type === "lump_sum" || event.type === "bonus") && (
            <select
              value={event.fundId ?? "orcan"}
              onChange={(e) => onChange({ ...event, fundId: e.target.value as FundId })}
              className="w-full bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs text-zinc-300 appearance-none"
            >
              {FUND_LIST.map((f) => (
                <option key={f.id} value={f.id} className="bg-zinc-900">{f.encyclopedia.nickname}（{f.shortName}）</option>
              ))}
            </select>
          )}

          {/* Monthly amount */}
          {(event.type === "start" || event.type === "change_amount" || event.type === "add_fund") && (
            <select
              value={event.monthlyAmount ?? 30000}
              onChange={(e) => onChange({ ...event, monthlyAmount: Number(e.target.value) })}
              className="w-full bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs text-zinc-300 appearance-none"
            >
              {MONTHLY_AMOUNT_OPTIONS.map((a) => (
                <option key={a} value={a} className="bg-zinc-900">月{a.toLocaleString()}円</option>
              ))}
            </select>
          )}

          {/* Lump sum */}
          {event.type === "lump_sum" && (
            <select
              value={event.lumpAmount ?? 100000}
              onChange={(e) => onChange({ ...event, lumpAmount: Number(e.target.value) })}
              className="w-full bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs text-zinc-300 appearance-none"
            >
              {[50000, 100000, 200000, 300000, 500000, 1000000].map((a) => (
                <option key={a} value={a} className="bg-zinc-900">{a.toLocaleString()}円</option>
              ))}
            </select>
          )}

          {/* Bonus */}
          {event.type === "bonus" && (
            <div className="flex gap-2">
              <select
                value={event.bonusAmount ?? 50000}
                onChange={(e) => onChange({ ...event, bonusAmount: Number(e.target.value) })}
                className="flex-1 bg-white/[0.06] border border-white/12 rounded-lg px-2 py-1.5 text-xs text-zinc-300 appearance-none"
              >
                {[30000, 50000, 100000, 200000, 300000].map((a) => (
                  <option key={a} value={a} className="bg-zinc-900">{a.toLocaleString()}円/回</option>
                ))}
              </select>
              <div className="flex gap-1">
                {[6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      const months = event.bonusMonths ?? [];
                      const next = months.includes(m) ? months.filter((x) => x !== m) : [...months, m];
                      onChange({ ...event, bonusMonths: next });
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      (event.bonusMonths ?? []).includes(m)
                        ? "bg-indigo-500 text-white"
                        : "bg-white/[0.06] text-zinc-500"
                    }`}
                  >
                    {m}月
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const DEFAULT_EVENTS: InvestmentEvent[] = [
  {
    id: "default-1",
    type: "start",
    year: 2020,
    month: 1,
    fundId: "orcan",
    monthlyAmount: 30000,
  },
];

export default function AdvancedSimulation() {
  const [events, setEvents] = useState<InvestmentEvent[]>(DEFAULT_EVENTS);
  const [result, setResult] = useState<AdvancedSimulationResult | null>(null);
  const [showChart, setShowChart] = useState(false);

  const addEvent = () => {
    const last = events[events.length - 1];
    const year = last?.year ?? 2020;
    const month = (last?.month ?? 12) + 1 > 12 ? 1 : (last?.month ?? 12) + 1;
    setEvents((ev) => [...ev, newEvent("change_amount", year, month)]);
  };

  const updateEvent = useCallback((id: string, updated: InvestmentEvent) => {
    setEvents((ev) => ev.map((e) => (e.id === id ? updated : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((ev) => ev.filter((e) => e.id !== id));
  }, []);

  const run = () => {
    const r = simulateAdvanced(events);
    setResult(r);
    setShowChart(true);
  };

  const chartData = result?.monthlyDataPoints.filter((_, i) => i % 6 === 0) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-violet-400" />
        <p className="text-sm font-black text-white">詳細シミュレーション</p>
        <span className="text-xs text-zinc-600">あなたの積立ストーリーを入力</span>
      </div>

      {/* Event list */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {events.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              isFirst={i === 0}
              onChange={(updated) => updateEvent(event.id, updated)}
              onDelete={() => deleteEvent(event.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add event */}
      <button
        onClick={addEvent}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 border border-dashed border-white/15 text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/25 transition-all"
      >
        <Plus className="h-3.5 w-3.5" />
        イベントを追加
      </button>

      {/* Run button */}
      <motion.button
        onClick={run}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-black text-white transition-all bg-gradient-to-r from-violet-500 to-indigo-500 hover:opacity-90"
      >
        <PlayCircle className="h-4 w-4" />
        シミュレーション実行
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {result && showChart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4"
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-zinc-600 mb-1">最終利益</p>
                <p className="text-3xl font-black text-emerald-400">
                  +{formatCurrency(result.profit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 mb-0.5">評価額</p>
                <p className="text-base font-bold text-zinc-200">{formatCurrency(result.finalValue)}</p>
                <p className="text-[10px] text-zinc-600">元本 {formatCurrency(result.totalPrincipal)}</p>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="adv-val" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="adv-pri" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52525b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#52525b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 8, fill: "#52525b" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 10 }}
                      formatter={(v) => [formatCurrency(Number(v)), ""]}
                    />
                    <Area type="monotone" dataKey="principal" stroke="#52525b" fill="url(#adv-pri)" strokeWidth={1} />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#adv-val)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-[10px] text-zinc-700 text-center">
              ※ 手数料・税金は含みません。過去の実績であり将来を保証しません。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
