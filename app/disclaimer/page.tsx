import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "免責事項",
  description: "積立タイムマシンの免責事項です。投資助言ではないこと、データの正確性、シミュレーションの限界について説明します。",
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    icon: "📊",
    title: "投資助言ではありません",
    body: "本サービスで提供する情報・シミュレーション結果は、特定の金融商品の売買を推奨・勧誘するものではなく、金融商品取引法に定める投資助言・代理業には該当しません。投資に関する最終的な判断は、利用者ご自身の責任において行ってください。",
  },
  {
    icon: "📉",
    title: "シミュレーションのデータ定義",
    body: "VTは公式月次NAV Total Returnと日本銀行の月末為替を使用します。その他9系列は、原典・通貨・配当・費用・為替処理を値ごとに遡れる記録がない年次参考系列です。いずれも将来の運用成果を示すものではありません。",
  },
  {
    icon: "🔢",
    title: "データの正確性について",
    body: "信託報酬・銘柄数等は公式資料で確認していますが、シミュレーション用の年次リターン系列は現在G（原典未特定）として管理しています。実際の投資判断の前には、各金融商品の公式資料をご確認ください。詳しい監査状況は「データソース・計算方法」ページで公開しています。",
  },
  {
    icon: "🏛️",
    title: "制度に関する情報について",
    body: "NISA・税制など公的制度に関する記述は、記事の執筆・確認時点の情報に基づいています。制度は将来変更される可能性があるため、最新情報は金融庁・国税庁・お取引の証券会社等の公式情報を必ずご確認ください。",
  },
  {
    icon: "⚖️",
    title: "損害についての免責",
    body: "本サービスの利用・情報の参照によって利用者に生じたいかなる損害（直接的・間接的損害を含む）についても、運営者は一切の責任を負いません。",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50" style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #f59e0b10 0%, transparent 70%)" }}
        />
      </div>

      <nav className="relative border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">免責事項</span>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            免責事項
          </h1>
        </div>

        <div
          className="rounded-2xl border border-amber-500/20 p-5 mb-8 text-sm text-zinc-400 leading-relaxed"
          style={{ background: "rgba(245,158,11,0.05)" }}
        >
          本サービス「積立タイムマシン」をご利用いただく前に、以下の免責事項をご確認ください。
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
          より詳しい運営方針は<Link href="/about" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">このサービスについて</Link>、データの出典は<Link href="/about/data-sources" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">データソース・計算方法</Link>のページをご覧ください。
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
