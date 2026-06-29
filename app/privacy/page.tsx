import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { SITE_NAME, SITE_URL, LAST_UPDATED_PRIVACY } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${SITE_NAME}`,
  description: "積立タイムマシンのプライバシーポリシーです。個人情報の取り扱いおよびCookieの利用について説明します。",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    icon: "🔒",
    title: "個人情報の収集について",
    body: "本サービスは、氏名・メールアドレスなど個人を特定できる情報を収集していません。お問い合わせフォームを通じてご連絡いただいた場合、返信のみに使用し、第三者への提供は行いません。",
  },
  {
    icon: "🍪",
    title: "Cookieの利用について",
    body: "本サービスでは、利便性向上およびアクセス解析のためにCookieを利用する場合があります。ブラウザの設定によりCookieを無効にすることができますが、一部機能が正常に動作しない場合があります。",
  },
  {
    icon: "📊",
    title: "アクセス解析について",
    body: "本サービスでは、Google Analytics 4（GA4）を使用しています。GA4はCookieを利用してアクセスデータ（ページ閲覧数・滞在時間・流入元など）を収集します。収集されるデータは匿名であり、個人を特定できる情報は含まれません。GA4のデータ収集を無効にしたい場合は、Google Analytics オプトアウトアドオンをご利用ください。",
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
