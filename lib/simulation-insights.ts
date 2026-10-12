import { MonthlyDataPoint } from "@/types";

export interface SimulationPathInsights {
  belowPrincipalMonths: number;
  longestBelowPrincipalStreak: number;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
  worstShortfall: number;
  worstShortfallRate: number;
  worstShortfallMonth: string | null;
}

/**
 * 月初積立を反映した後の月末評価額だけを使って、積立経路を要約する。
 * 日中の最大下落率や、指数水準の回復期間を表すものではない。
 */
export function analyzeSimulationPath(dataPoints: MonthlyDataPoint[]): SimulationPathInsights {
  let belowPrincipalMonths = 0;
  let currentStreak = 0;
  let currentStreakStart: string | null = null;
  let longestBelowPrincipalStreak = 0;
  let longestStreakStart: string | null = null;
  let longestStreakEnd: string | null = null;
  let worstShortfall = 0;
  let worstShortfallRate = 0;
  let worstShortfallMonth: string | null = null;

  for (const point of dataPoints) {
    const shortfall = point.value - point.principal;
    const shortfallRate = point.principal > 0 ? (shortfall / point.principal) * 100 : 0;

    if (shortfall < 0) {
      belowPrincipalMonths++;
      currentStreak++;
      currentStreakStart ??= point.date;

      if (currentStreak > longestBelowPrincipalStreak) {
        longestBelowPrincipalStreak = currentStreak;
        longestStreakStart = currentStreakStart;
        longestStreakEnd = point.date;
      }

      if (shortfall < worstShortfall) {
        worstShortfall = shortfall;
        worstShortfallRate = shortfallRate;
        worstShortfallMonth = point.date;
      }
    } else {
      currentStreak = 0;
      currentStreakStart = null;
    }
  }

  return {
    belowPrincipalMonths,
    longestBelowPrincipalStreak,
    longestStreakStart,
    longestStreakEnd,
    worstShortfall,
    worstShortfallRate: Math.round(worstShortfallRate * 10) / 10,
    worstShortfallMonth,
  };
}
