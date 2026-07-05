/**
 * 積立タイムマシンのブランドロゴマーク（時計の巻き戻し矢印 + 成長グラフ）。
 * favicon（app/icon.tsx）・apple-touch-icon（app/apple-icon.tsx）で共有する。
 * @vercel/og の ImageResponse（satori）で描画するため、JSXを返す関数として定義する。
 */
export function LogoSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="arcGrad" x1="10" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="55%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="growthGrad" x1="65" y1="80" x2="95" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5a4" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>

      {/* 背景円 */}
      <circle cx="50" cy="50" r="50" fill="#05061a" />

      {/* 巻き戻し矢印（反時計回りの円弧） */}
      <path
        d="M 33 20 A 32 32 0 1 1 20 62"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* 矢印の三角形（左上・巻き戻し方向） */}
      <polygon points="34,13 17,17 25,33" fill="#a855f7" />

      {/* 時計の針 */}
      <line x1="46" y1="46" x2="46" y2="28" stroke="url(#arcGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="46" y1="46" x2="62" y2="52" stroke="url(#arcGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="46" cy="46" r="4" fill="#6366f1" />

      {/* 成長グラフ（右下・棒グラフ + 上昇矢印） */}
      <rect x="66" y="72" width="7" height="14" rx="1.5" fill="url(#growthGrad)" />
      <rect x="77" y="64" width="7" height="22" rx="1.5" fill="url(#growthGrad)" />
      <rect x="88" y="54" width="7" height="32" rx="1.5" fill="url(#growthGrad)" />
      <path d="M 63 68 L 92 42" stroke="url(#growthGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <polygon points="97,38 82,40 92,50" fill="#2dd4bf" />
    </svg>
  );
}
