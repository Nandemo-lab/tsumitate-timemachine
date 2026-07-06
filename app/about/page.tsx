import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, Database, Mail, Users } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: "積立タイムマシンについて",
  description:
    "積立タイムマシンは「もしあの時から積み立てていたら？」という問いに答えるシミュレーションサービスです。個人開発の経緯・運営方針・データの考え方をご紹介します。",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: `積立タイムマシンについて | ${SITE_NAME}`,
    description: "個人開発の積立シミュレーションサービスです。運営方針とデータの考え方をご紹介します。",
    url: `${BASE_URL}/about`,
    type: "article",
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: "積立タイムマシンについて" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `積立タイムマシンについて | ${SITE_NAME}`,
    description: "個人開発の積立シミュレーションサービスです。運営方針とデータの考え方をご紹介します。",
    images: [`${BASE_URL}/api/og?static=1`],
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div
      className="min-h-dvh bg-zinc-950 text-zinc-50"
      style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}
    >
      {/* Breadcrumb */}
      <nav className="border-b border-white/[0.07] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            積立タイムマシン
          </Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">このサービスについて</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">

        {/* ヘッダー */}
        <header className="space-y-3">
          <h1
            className="text-2xl font-black text-white leading-tight"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            積立タイムマシンについて
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            「もし2020年から毎月3万円だけ積み立てていたら、今いくらになっていたんだろう」——そんな問いへの答えを、実際の過去データで確かめられるツールです。
          </p>
        </header>

        {/* なぜ作ったか */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            なぜこのサービスを作ったのか
          </h2>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              積立投資を始めてしばらく経ったころ、ふと思いました。「あのコロナショックの底値から積み立てていた人は、今ごろどのくらい増えているんだろう」と。
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              調べてみると、計算ツールはいくつかあったのですが、「任意の年月からスタートして実際の市場データで計算してくれる」サービスがなかなか見つかりませんでした。
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              それなら自分で作ろう、というのが出発点です。
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              インデックス投資の良さは頭では分かっていても、「本当に続けて大丈夫なのか」という不安はなかなか消えません。過去の実績を自分の目で確かめることで、その不安を少しでも和らげる助けになれば、という思いで開発しています。
            </p>
          </div>
        </section>

        {/* どんな人の役に立ちたいか */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            どんな人の役に立ちたいか
          </h2>
          <div className="space-y-2">
            {[
              {
                icon: <Users className="h-4 w-4 text-indigo-400 flex-shrink-0" />,
                text: "これから新NISAを始めようとしているが、本当に増えるのか実感が持てない人",
              },
              {
                icon: <Clock className="h-4 w-4 text-indigo-400 flex-shrink-0" />,
                text: "暴落が怖くて積立を止めようか悩んでいる人。「あのとき止めなかった人はどうなったか」を確かめたい人",
              },
              {
                icon: <Database className="h-4 w-4 text-indigo-400 flex-shrink-0" />,
                text: "オルカン・S&P500・NASDAQ100などの違いを感覚ではなく数字で理解したい人",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
              >
                {item.icon}
                <p className="text-sm text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 運営方針 */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            運営方針
          </h2>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">個人開発・広告なし</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                本サービスは個人が開発・運営しています。特定の金融機関・証券会社とは提携しておらず、広告収益やアフィリエイトを目的とした誘導は行いません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">投資助言ではありません</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                本サービスは教育・情報提供を目的としており、金融商品取引法に定める投資助言・代理業には該当しません。個別の投資判断はご自身の責任でお願いします。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">過去データの限界について</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                シミュレーションはすべて過去の実績データに基づいています。過去のリターンは将来の結果を保証するものではありません。あくまで参考情報としてご活用ください。
              </p>
            </div>
          </div>
        </section>

        {/* データの考え方 */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            データの考え方
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            各ファンドの年間リターンは、公開された指数データおよび運用会社の開示資料をもとに構成しています。計算方法・出典の詳細は
            <Link
              href="/about/data-sources"
              className="mx-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              データソースページ
            </Link>
            をご覧ください。
          </p>
        </section>

        {/* お問い合わせ */}
        <section className="rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 p-5 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-zinc-200">ご意見・ご要望はこちら</p>
            <p className="text-xs text-zinc-500">不具合・機能リクエスト・データの誤りなど</p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-indigo-400 border border-indigo-500/30 rounded-lg px-3 py-2 hover:bg-indigo-500/10 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            お問い合わせ
          </Link>
        </section>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← トップページへ戻る
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
