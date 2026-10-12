import { FundId } from "@/types";
import { isValidMonthlyAmount } from "@/lib/simulation";
import { isReturnMonthAvailable, isVerifiedReturnSeries } from "@/lib/return-series";

export type RecentSimulation = {
  mode: "single" | "compare";
  fundA: FundId;
  fundB?: FundId;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  monthlyAmount: number;
  savedAt: number;
};

const KEY = "ttm:recent-simulations:v1";
const MAX_ITEMS = 5;
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const EMPTY: RecentSimulation[] = [];
let snapshot: RecentSimulation[] = EMPTY;
const listeners = new Set<() => void>();

function valid(item: unknown): item is RecentSimulation {
  if (!item || typeof item !== "object") return false;
  const value = item as RecentSimulation;
  if ((value.mode !== "single" && value.mode !== "compare") || !isVerifiedReturnSeries(value.fundA)) return false;
  if (value.mode === "compare" && (!value.fundB || !isVerifiedReturnSeries(value.fundB))) return false;
  if (!isValidMonthlyAmount(value.monthlyAmount) || !Number.isFinite(value.savedAt)) return false;
  if (Date.now() - value.savedAt > MAX_AGE_MS) return false;
  const funds = value.fundB ? [value.fundA, value.fundB] : [value.fundA];
  return funds.every((fund) =>
    isReturnMonthAvailable(fund, value.startYear, value.startMonth)
    && isReturnMonthAvailable(fund, value.endYear, value.endMonth)
  ) && `${value.endYear}-${String(value.endMonth).padStart(2, "0")}` >= `${value.startYear}-${String(value.startMonth).padStart(2, "0")}`;
}

function read(): RecentSimulation[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(valid).slice(0, MAX_ITEMS) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function publish(next: RecentSimulation[]) {
  snapshot = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function saveRecentSimulation(item: Omit<RecentSimulation, "savedAt">) {
  if (typeof window === "undefined") return;
  const next = { ...item, savedAt: Date.now() };
  if (!valid(next)) return;
  const identity = (value: RecentSimulation) => [value.mode, value.fundA, value.fundB ?? "", value.startYear, value.startMonth, value.endYear, value.endMonth, value.monthlyAmount].join(":");
  publish([next, ...read().filter((value) => identity(value) !== identity(next))].slice(0, MAX_ITEMS));
}

export function removeRecentSimulation(savedAt: number) {
  if (typeof window !== "undefined") publish(read().filter((item) => item.savedAt !== savedAt));
}

export function clearRecentSimulations() {
  if (typeof window !== "undefined") publish(EMPTY);
}

export function subscribeRecentSimulations(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  if (listeners.size === 0) snapshot = read();
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      snapshot = read();
      listeners.forEach((current) => current());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const getRecentSimulationsSnapshot = () => snapshot;
export const getRecentSimulationsServerSnapshot = () => EMPTY;
