import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { SITE_URL, LAST_UPDATED_PRIVACY } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "積立タイムマシンのプライバシーポリシーです。個人情報の取り扱いおよびCookieの利用について説明します。",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    icon: "🔒",
    title: "個人情報の収集について",
    body: "本サービスは、閲覧だけで氏名やメールアドレスの入力を求めません。お問い合わせフォームでは、返信と問い合わせ対応のため、入力された氏名・メールアドレス・メッセージをGoogleフォーム経由で受領します。これらは対応に必要な範囲で保管し、法令に基づく場合を除いて第三者へ販売・提供しません。削除のご希望はお問い合わせフォームからご連絡ください。",
  },
  {
    icon: "🍪",
    title: "Cookieの利用について",
    body: "本サービスでは、利便性向上およびアクセス解析のためにCookieを利用する場合があります。ブラウザの設定によりCookieを無効にすることができますが、一部機能が正常に動作しない場合があります。",
  },
  {
    icon: "📊",
    title: "アクセス解析について",
    body: "本サービスでは、Google Analytics 4（GA4）を使用しています。GA4はCookie等を利用して、閲覧ページ、利用端末、流入元などの利用状況を収集する場合があります。当サイトは氏名やメールアドレスをGA4へ送信しませんが、収集データの取り扱いはGoogleのポリシーにも従います。データ収集を無効にしたい場合は、Google Analyticsオプトアウトアドオンをご利用ください。",
  },
  {
    icon: "💾",
    title: "最近試した条件の端末内保存",
    body: "シミュレーションを再実行しやすくするため、商品・開始月・終了月・積立額だけをブラウザのlocalStorageへ最大5件、最長180日間保存します。評価額や損益、氏名などの個人情報は保存・送信しません。トップページから個別削除または一括削除できます。",
  },
  {
    icon: "📢",
    title: "広告配信について",
    body: "本サービスは、第三者配信事業者（Googleを含む）による広告を掲載する場合があります。これらの事業者はCookieを使用して、ユーザーが本サービスや他のサイトに過去にアクセスした情報に基づき、広告を配信することがあります。Googleによる広告Cookieの使用により、ユーザーは本サービスや他のサイトへのアクセスに基づいて広告の配信を受けることがあります。ユーザーは、Google広告設定ページ（https://adssettings.google.com/）でパーソナライズ広告を無効にすることができます。また、広告設定の詳細は www.aboutads.info でも確認できます。",
  },
  {
    icon: "🚫",
    title: "情報の第三者提供について",
    body: "取得した情報は、サービスの提供・改善を目的としてのみ使用します。法令に基づく場合を除き、第三者への提供・開示は行いません。",
  },
  {
    icon: "🔗",
    title: "外部リンクについて",
    body: "本サービスには外部サイトへのリンクが含まれる場合があります。リンク先のプライバシーポリシーは各サイトをご確認ください。当サービスは外部サイトの内容について責任を負いません。",
  },
  {
    icon: "📝",
    title: "ポリシーの変更について",
    body: "本プライバシーポリシーは、法令の改正やサービス内容の変更に伴い、予告なく更新する場合があります。変更後のポリシーは本ページに掲載した時点で効力を生じます。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50" style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #10b98110 0%, transparent 70%)" }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="relative border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">プライバシーポリシー</span>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              プライバシーポリシー
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">最終更新日：{LAST_UPDATED_PRIVACY}</p>
          </div>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl border border-emerald-500/20 p-5 mb-8 text-sm text-zinc-400 leading-relaxed"
          style={{ background: "rgba(16,185,129,0.05)" }}
        >
          本サービス「積立タイムマシン」における個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-white/8 p-5"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div
          className="rounded-2xl border border-white/8 p-5 mt-8 flex items-start gap-3"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            本サービスは個人情報保護の観点から、必要最小限の情報のみを取り扱う方針で運営しています。ご不明な点は<Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">お問い合わせ</Link>ください。
          </p>
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
