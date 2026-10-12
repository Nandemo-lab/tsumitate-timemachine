import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { SITE_URL } from "@/lib/site";
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
    body: "A系列は一次情報から検証した月次実績を使用します。米国ETFは公式NAV Total Returnを日本銀行の月末USD/JPYで円換算し、国内投信は商品設定後の分配金再投資基準価額を使用します。G系列は参考データとして品質を明示しています。",
  },
  {
    icon: "🔢",
    title: "データの正確性について",
    body: "A系列の月次実績、信託報酬、銘柄数等は一次情報と照合しています。SCHDは月次原典の検証が未完了のためG（参考データ・原典未検証）として分離しています。実際の投資判断の前には各商品の公式資料をご確認ください。詳しい監査状況は「データソース・計算方法」ページで公開しています。",
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
    <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]" style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #f59e0b10 0%, transparent 70%)" }}
        />
      </div>

      <nav className="relative border-b border-[#D9E3E8] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-slate-600">
          <Link href="/" className="hover:text-slate-700 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-slate-700">免責事項</span>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <h1
            className="text-xl font-bold text-[#263A53]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            免責事項
          </h1>
        </div>

        <div
          className="rounded-2xl border border-amber-500/20 p-5 mb-8 text-sm text-slate-600 leading-relaxed"
          style={{ background: "rgba(245,158,11,0.05)" }}
        >
          本サービス「積立タイムマシン」をご利用いただく前に、以下の免責事項をご確認ください。
        </div>

        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-[#D9E3E8] p-5"
              style={{ background: "#FFFFFF" }}
            >
              <h2 className="text-sm font-bold text-[#263A53] mb-2 flex items-center gap-2">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white border border-[#E1E8EC] p-5 mt-8 text-xs text-slate-500 leading-relaxed">
          より詳しい運営方針は<Link href="/about" className="text-[#236B8E] hover:text-[#236B8E] underline underline-offset-2 transition-colors">このサービスについて</Link>、データの出典は<Link href="/about/data-sources" className="text-[#236B8E] hover:text-[#236B8E] underline underline-offset-2 transition-colors">データソース・計算方法</Link>のページをご覧ください。
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
            ← トップページへ戻る
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
