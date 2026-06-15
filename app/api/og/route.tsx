import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS } from "@/lib/funds";
import { FundId } from "@/types";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const fundId = (searchParams.get("fund") ?? "sp500") as FundId;
  const startYear = parseInt(searchParams.get("year") ?? "2020");
  const startMonth = parseInt(searchParams.get("month") ?? "1");
  const monthlyAmount = parseInt(searchParams.get("amount") ?? "30000");
  const fundBId = (searchParams.get("fundB") ?? "") as FundId;

  const fund = FUNDS[fundId] ?? FUNDS["sp500"];
  const result = simulate({ fundId, startYear, startMonth, monthlyAmount });
  const resultB = fundBId && FUNDS[fundBId]
    ? simulate({ fundId: fundBId, startYear, startMonth, monthlyAmount })
    : null;

  const profitColor = result.profit >= 0 ? "#10b981" : "#ef4444";
  const fundColor = fund.color;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${fundColor}22 0%, transparent 70%)`,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div
            style={{
              background: `${fundColor}22`,
              border: `1px solid ${fundColor}55`,
              borderRadius: "100px",
              padding: "6px 16px",
              fontSize: "14px",
              color: fundColor,
              fontWeight: 700,
            }}
          >
            ⏰ 積立タイムマシン
          </div>
        </div>

        {/* Condition */}
        <div style={{ color: "#71717a", fontSize: "22px", marginBottom: "20px", display: "flex" }}>
          もし {startYear}年{startMonth}月から 毎月{formatCurrency(monthlyAmount)} 積み立てていたら
        </div>

        {/* Main result */}
        <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flex: 1 }}>
          {/* Winner */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(145deg, ${fundColor}22 0%, transparent 70%)`,
              border: `1px solid ${fundColor}44`,
              borderRadius: "24px",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {resultB && (
              <div style={{ color: fundColor, fontSize: "14px", fontWeight: 900, marginBottom: "12px", display: "flex" }}>
                🏆 勝者
              </div>
            )}
            <div style={{ color: fundColor, fontSize: "32px", fontWeight: 900, marginBottom: "8px", display: "flex" }}>
              {fund.shortName}
            </div>
            <div style={{ color: profitColor, fontSize: "72px", fontWeight: 900, lineHeight: 1, display: "flex" }}>
              +{formatCurrency(result.profit)}
            </div>
            <div style={{ color: "#52525b", fontSize: "18px", marginTop: "12px", display: "flex" }}>
              現在資産 {formatCurrency(result.finalValue)} · +{result.returnRate.toFixed(1)}%
            </div>
          </div>

          {/* vs B */}
          {resultB && (
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "24px",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ color: "#52525b", fontSize: "14px", fontWeight: 700, marginBottom: "12px", display: "flex" }}>
                比較
              </div>
              <div style={{ color: FUNDS[fundBId]?.color ?? "#94a3b8", fontSize: "32px", fontWeight: 900, marginBottom: "8px", display: "flex" }}>
                {FUNDS[fundBId]?.shortName}
              </div>
              <div style={{ color: "#10b981", fontSize: "56px", fontWeight: 900, lineHeight: 1, display: "flex" }}>
                +{formatCurrency(resultB.profit)}
              </div>
              <div style={{ color: "#52525b", fontSize: "18px", marginTop: "12px", display: "flex" }}>
                差 {formatCurrency(Math.abs(result.profit - resultB.profit))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ color: "#3f3f46", fontSize: "14px", display: "flex" }}>
            ※過去の実績に基づくシミュレーション。将来を保証するものではありません
          </div>
          <div style={{ color: "#6366f1", fontSize: "18px", fontWeight: 900, display: "flex" }}>
            tsumitate-timemachine.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
