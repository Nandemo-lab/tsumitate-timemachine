import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail, ExternalLink, Clock } from "lucide-react";
import { SITE_NAME, SITE_URL, CONTACT_FORM_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: `お問い合わせ | ${SITE_NAME}`,
  description: "積立タイムマシンへのお問い合わせはこちら。ご意見・ご要望・不具合報告をお待ちしています。",
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: { index: true, follow: true },
};

const TOPICS = [
  { icon: "🐛", label: "不具合・バグ報告", description: "シミュレーションの計算やUIの不具合など" },
  { icon: "💡", label: "機能リクエスト", description: "追加してほしい銘柄や機能のご提案" },
  { icon: "📊", label: "データについて", description: "掲載データの誤りや更新に関するご指摘" },
  { icon: "📝", label: "その他", description: "上記以外のお問い合わせ" },
];

export default function ContactPage() {
  const hasForm = Boolean(CONTACT_FORM_URL);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50" style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #6366f112 0%, transparent 70%)" }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="relative border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">お問い合わせ</span>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Mail className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              お問い合わせ
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">ご意見・ご要望・不具合報告はこちら</p>
          </div>
        </div>

        {/* Topics */}
        <section className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-3">
            お問い合わせ内容
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOPICS.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-white/8 p-4"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xl mb-1.5 block">{t.icon}</span>
                <p className="text-sm font-bold text-white mb-0.5">{t.label}</p>
                <p className="text-[11px] text-zinc-500 leading-snug">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — form or pending */}
        <section className="mb-8">
          {hasForm ? (
            <a
              href={CONTACT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-98"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 8px 24px #6366f130",
              }}
            >
              <ExternalLink className="h-4 w-4" />
              お問い合わせフォームを開く
            </a>
          ) : (
            <div
              className="rounded-2xl border border-white/8 p-6 text-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <Clock className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-300 mb-1">お問い合わせフォーム準備中</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                現在フォームを準備しています。<br />
                しばらくお待ちください。
              </p>
            </div>
          )}
        </section>

        {/* Notes */}
        <div
          className="rounded-xl border border-white/8 p-5 text-xs text-zinc-500 space-y-2 leading-relaxed"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <p>・ 本サービスは個人開発のため、返信にお時間をいただく場合があります</p>
          <p>・ 投資に関する個別相談・助言はお受けしていません</p>
          <p>・ いただいたご意見はサービス改善に活用させていただく場合があります</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← トップページへ戻る
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
