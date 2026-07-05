/**
 * 積立タイムマシンのブランドロゴマーク（時計の巻き戻し矢印 + 成長グラフ）。
 * favicon（app/icon.tsx）・apple-touch-icon（app/apple-icon.tsx）で共有する。
 * @vercel/og の ImageResponse（satori）で描画するため、JSXを返す関数として定義する。
 *
 * satoriはSVGパスの楕円弧コマンド（A）を正しく描画できないため、
 * 円弧は多数の直線（L）で近似したポリラインとして生成する。
 */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number, segments = 48): string {
  const sweep = endDeg - startDeg;
  const points: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const deg = startDeg + (sweep * i) / segments;
    const rad = (deg * Math.PI) / 180;
    // θ=0 を12時方向とし、時計回りに増加する角度系（画面座標はy下向き）
    const x = cx + r * Math.sin(rad);
    const y = cy - r * Math.cos(rad);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

function pointOnCircle(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

// 巻き戻し矢印の円弧: 中心(48,49) 半径27、325度→255度（時計回りに290度・左側に70度の隙間）
const ARC_CX = 48;
const ARC_CY = 49;
const ARC_R = 27;
const ARC_START = 325;
const ARC_END = 255 + 360; // 時計回りに一周を跨ぐため+360

const arrowTip = pointOnCircle(ARC_CX, ARC_CY, ARC_R, ARC_START);

export function LogoSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="arcGrad" x1="20" y1="15" x2="72" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6d5ff5" />
          <stop offset="100%" stopColor="#2dd4ff" />
        </linearGradient>
        <linearGradient id="growthGrad" x1="62" y1="88" x2="98" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>

      {/* 背景円（キャンバス全面） */}
      <circle cx="50" cy="50" r="50" fill="#080818" />

      {/* 巻き戻し矢印（時計回りの太い円弧・約290度、直線近似） */}
      <path
        d={arcPath(ARC_CX, ARC_CY, ARC_R, ARC_START, ARC_END)}
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 矢印の三角形（円弧の起点・左上を指す） */}
      <polygon
        points={`${arrowTip.x + 8},${arrowTip.y - 12} ${arrowTip.x - 11},${arrowTip.y - 7} ${arrowTip.x - 1},${arrowTip.y + 9}`}
        fill="#a855f7"
      />

      {/* 時計の針（中心は円弧と同心） */}
      <circle cx={ARC_CX} cy={ARC_CY} r="3.6" fill="#5b6fef" />
      <line x1={ARC_CX} y1={ARC_CY} x2="42.8" y2="29.7" stroke="url(#arcGrad)" strokeWidth="5" strokeLinecap="round" />
      <line x1={ARC_CX} y1={ARC_CY} x2="70.6" y2="57.2" stroke="url(#arcGrad)" strokeWidth="5" strokeLinecap="round" />

      {/* 成長グラフ（右下・棒グラフ + 上昇矢印） */}
      <rect x="64" y="76" width="7.5" height="14" rx="1.8" fill="url(#growthGrad)" />
      <rect x="75.5" y="67" width="7.5" height="23" rx="1.8" fill="url(#growthGrad)" />
      <rect x="87" y="56" width="7.5" height="34" rx="1.8" fill="url(#growthGrad)" />
      <path d="M 61 71 L 91 41" stroke="url(#growthGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <polygon points="96,36 80,39 91,50" fill="#2dd4bf" />
    </svg>
  );
}
