import Link from "next/link";

const SECTIONS = [
  {
    title: "人気ページ",
    links: [
      { href: "/",           label: "積立シミュレーション" },
      { href: "/fund/orukan", label: "銘柄図鑑" },
      { href: "/compare/orukan-vs-sp500", label: "比較" },
      { href: "/ranking",    label: "ランキング一覧" },
    ],
  },
  {
    title: "投資ガイド",
    links: [
      { href: "/guide/nisa-beginner",            label: "新NISAおすすめ" },
      { href: "/guide/orukan-yameta-houga-ii",   label: "オルカンはやめたほうがいい？" },
      { href: "/guide/orukan-ippon-de-ii",       label: "オルカン一本でいい？" },
      { href: "/guide/sp500-booraku-taisho",     label: "S&P500暴落リスクと対応" },
      { href: "/guide/index-investing",          label: "インデックス投資とは" },
      { href: "/guide/dollar-cost-averaging",    label: "ドルコスト平均法" },
      { href: "/guide/how-to-start",             label: "積立投資の始め方" },
      { href: "/guide/retirement-investing",     label: "老後資金の積立計画" },
      { href: "/guide/nisa-tsumitate-ikura",     label: "新NISAは月いくら積立？" },
      { href: "/guide/nisa-wariate-osusume",     label: "NISAの割合・配分" },
      { href: "/guide/tsumitate-nansnen-keizoku", label: "積立は何年続けるべき？" },
      { href: "/guide/index-shippai-pattern",    label: "インデックス投資の失敗パターン" },
      { href: "/guide/tsumitate-vs-ikkatu",      label: "積立vs一括投資" },
    ],
  },
  {
    title: "人気比較",
    links: [
      { href: "/compare/orukan-vs-sp500",       label: "オルカン vs S&P500" },
      { href: "/compare/sp500-vs-nasdaq100",     label: "S&P500 vs NASDAQ100" },
      { href: "/compare/schd-vs-vym",            label: "SCHD vs VYM" },
      { href: "/compare/vti-vs-orukan",          label: "VTI vs オルカン" },
    ],
  },
  {
    title: "年別ランキング",
    links: [
      { href: "/from/2020", label: "2020年開始ランキング" },
      { href: "/from/2021", label: "2021年開始ランキング" },
      { href: "/from/2022", label: "2022年開始ランキング" },
      { href: "/from/2023", label: "2023年開始ランキング" },
      { href: "/from/2024", label: "2024年開始ランキング" },
    ],
  },
  {
    title: "運営",
    links: [
      { href: "/terms",   label: "利用規約" },
      { href: "/privacy", label: "プライバシーポリシー" },
      { href: "/contact", label: "お問い合わせ" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-black/30 pt-10 pb-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* グリッドリンク */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-8 sm:grid-cols-3">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-3">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors leading-snug"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ブランド + コピーライト */}
        <div className="border-t border-white/[0.06] pt-6 text-center space-y-1">
          <p className="text-xs font-bold text-zinc-500">積立タイムマシン</p>
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            ※過去の実績に基づくシミュレーションです。将来の運用成果を保証しません。
          </p>
          <p className="text-[10px] text-zinc-700">© 2025 積立タイムマシン</p>
        </div>
      </div>
    </footer>
  );
}
