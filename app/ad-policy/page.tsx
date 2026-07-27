import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Megaphone } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "広告掲載ポリシー",
  description: "積立タイムマシンの広告掲載ポリシーです。第三者配信広告の利用方針、コンテンツとの区別、広告と記事内容の独立性について説明します。",
  alternates: { canonical: `${SITE_URL}/ad-policy` },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    icon: "📢",
    title: "広告の掲載について",
    body: "本サービスは、サイト運営を継続するための収益源として、Google AdSense等の第三者配信事業者による広告を掲載する場合があります。広告の配信・内容は各配信事業者のシステムによって自動的に決定されるため、運営者が個別の広告内容を選定・保証するものではありません。",
  },
  {
    icon: "🔀",
    title: "広告と記事コンテンツの独立性",
    body: "本サービスの記事・シミュレーション結果・比較データは、広告掲載の有無や広告主との関係に影響されることなく、独立した基準（Single Source of Truthとして管理する実データ）に基づいて作成しています。特定の金融機関・証券会社から広告掲載料を受け取ることで、当該事業者に有利な記述を行うことはありません。",
  },
  {
    icon: "🔗",
    title: "紹介リンク（アフィリエイト）について",
    body: "本サービスでは、記事内で証券会社等のサービスを紹介する際に、成果報酬型の紹介リンク（アフィリエイトリンク）を設置する場合があります。これらのリンクを経由してサービスに申し込みがあった場合、運営者が紹介料を受け取ることがあります。紹介リンクの有無にかかわらず、比較・評価の内容が変わることはありません。",
  },
  {
    icon: "⚠️",
    title: "広告内容についての責任範囲",
    body: "第三者配信事業者による広告の内容・リンク先の安全性・正確性については、運営者は保証・責任を負いません。広告経由でアクセスしたサイトのご利用は、利用者ご自身の判断でお願いします。",
  },
];

export default function AdPolicyPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50" style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #6366f110 0%, transparent 70%)" }}
        />
      </div>

      <nav className="relative border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">広告掲載ポリシー</span>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Megaphone className="h-5 w-5 text-indigo-400" />
          </div>
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            広告掲載ポリシー
          </h1>
        </div>

        <div
          className="rounded-2xl border border-indigo-500/20 p-5 mb-8 text-sm text-zinc-400 leading-relaxed"
          style={{ background: "rgba(99,102,241,0.05)" }}
        >
          本サービス「積立タイムマシン」における広告の掲載方針について、以下のとおり定めます。
        </div>

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

        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 mt-8 text-xs text-zinc-500 leading-relaxed">
          広告・Cookieの取り扱いについては<Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">プライバシーポリシー</Link>もあわせてご確認ください。
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
