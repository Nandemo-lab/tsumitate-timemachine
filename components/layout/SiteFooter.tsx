import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/terms",   label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/8 py-6 px-4 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
      <nav className="flex items-center justify-center gap-4 flex-wrap mb-3">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="text-[10px] text-zinc-600">
        © 2025 積立タイムマシン　※過去の実績に基づくシミュレーションです。将来の運用成果を保証しません。
      </p>
    </footer>
  );
}
