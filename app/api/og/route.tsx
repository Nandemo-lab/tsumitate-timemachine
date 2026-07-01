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
  // static=1 → default landing OGP (no simulation params needed)
  const isStatic = searchParams.get("static") === "1" || searchParams.size === 0;

  if (isStatic) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "#09090b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            fontFamily: "sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Background glow top */}
          <div
            style={{
              position: "absolute",
              top: "-120px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "900px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, #6366f118 0%, transparent 65%)",
            }}
          />
          {/* Background glow bottom-right */}
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              right: "-100px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, #f59e0b0e 0%, transparent 65%)",
            }}
          />

          {/* Brand pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "100px",
              padding: "8px 22px",
              marginBottom: "48px",
            }}
          >
            <span style={{ fontSize: "20px" }}>⏰</span>
            <span style={{ color: "#a5b4fc", fontSize: "18px", fontWeight: 700, letterSpacing: "0.05em" }}>
              積立タイムマシン
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              color: "#f4f4f5",
              fontSize: "62px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textAlign: "center",
              lineHeight: 1.15,
              marginBottom: "36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#a1a1aa", fontSize: "32px", fontWeight: 700, marginBottom: "12px", display: "flex" }}>
              もし2020年から積み立てていたら？
            </span>
            <span style={{ color: "#10b981", fontSize: "88px", fontWeight: 900, lineHeight: 1, display: "flex", letterSpacing: "-0.03em" }}>
              +110万円
            </span>
            <span style={{ color: "#34d399", fontSize: "28px", fontWeight: 700, marginTop: "8px", display: "flex" }}>
              （+56.0%）毎月3万円 · S&P500
            </span>
          </div>

          {/* Fund chips row */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "52px" }}>
            {[
              { name: "オルカン", color: "#6366f1" },
              { name: "S&P500", color: "#f59e0b" },
              { name: "NASDAQ100", color: "#ec4899" },
            ].map((f) => (
              <div
                key={f.name}
                style={{
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}44`,
                  borderRadius: "12px",
                  padding: "8px 20px",
                  color: f.color,
                  fontSize: "16px",
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                {f.name}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "36px",
              left: "64px",
              right: "64px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "20px",
            }}
          >
            <span style={{ color: "#3f3f46", fontSize: "13px", display: "flex" }}>
              ※過去の実績に基づくシミュレーション。将来を保証しません
            </span>
            <span style={{ color: "#6366f1", fontSize: "16px", fontWeight: 900, display: "flex" }}>
              tsumitate-timemachine.com
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Dynamic: fund-specific result OGP
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
          padding: "56px 64px",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "450px",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${fundColor}1a 0%, transparent 65%)`,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
          <div
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "100px",
              padding: "6px 18px",
              fontSize: "14px",
              color: "#a5b4fc",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⏰</span>
            <span>積立タイムマシン</span>
          </div>
        </div>

        {/* Condition */}
        <div style={{ color: "#71717a", fontSize: "22px", marginBottom: "20px", display: "flex" }}>
          もし {startYear}年{startMonth}月から 毎月{formatCurrency(monthlyAmount)} 積み立てていたら
        </div>

        {/* Main result */}
        <div style={{ display: "flex", gap: "36px", alignItems: "flex-start", flex: 1 }}>
          {/* Winner card */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(145deg, ${fundColor}1e 0%, transparent 70%)`,
              border: `1px solid ${fundColor}44`,
              borderRadius: "24px",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {resultB && (
              <div style={{ color: fundColor, fontSize: "13px", fontWeight: 900, marginBottom: "10px", display: "flex" }}>
                🏆 WINNER
              </div>
            )}
            <div style={{ color: fundColor, fontSize: "28px", fontWeight: 900, marginBottom: "10px", display: "flex" }}>
              {fund.shortName}
            </div>
            <div style={{ color: profitColor, fontSize: "72px", fontWeight: 900, lineHeight: 1, display: "flex", letterSpacing: "-0.02em" }}>
              +{formatCurrency(result.profit)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "14px" }}>
              <span style={{ color: "#34d399", fontSize: "20px", fontWeight: 700, display: "flex" }}>
                +{result.returnRate.toFixed(1)}%
              </span>
              <span style={{ color: "#52525b", fontSize: "16px", display: "flex" }}>
                現在資産 {formatCurrency(result.finalValue)}
              </span>
            </div>
          </div>

          {/* Fund B card */}
          {resultB && (
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "24px",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ color: "#52525b", fontSize: "13px", fontWeight: 700, marginBottom: "10px", display: "flex" }}>
                比較
              </div>
              <div style={{ color: FUNDS[fundBId]?.color ?? "#94a3b8", fontSize: "28px", fontWeight: 900, marginBottom: "10px", display: "flex" }}>
                {FUNDS[fundBId]?.shortName}
              </div>
              <div style={{ color: "#10b981", fontSize: "56px", fontWeight: 900, lineHeight: 1, display: "flex", letterSpacing: "-0.02em" }}>
                +{formatCurrency(resultB.profit)}
              </div>
              <div style={{ color: "#52525b", fontSize: "16px", marginTop: "14px", display: "flex" }}>
                差額 {formatCurrency(Math.abs(result.profit - resultB.profit))}
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
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ color: "#3f3f46", fontSize: "13px", display: "flex" }}>
            ※過去の実績に基づくシミュレーション。将来を保証しません
          </div>
          <div style={{ color: "#6366f1", fontSize: "17px", fontWeight: 900, display: "flex" }}>
            tsumitate-timemachine.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
