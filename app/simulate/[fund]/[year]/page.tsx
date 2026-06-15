import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { simulate, formatCurrency, calcElapsedYears } from "@/lib/simulation";
import { FUNDS, FUND_LIST } from "@/lib/funds";
import { FundId } from "@/types";
import SimulatePageClient from "./SimulatePageClient";

interface Props {
  params: Promise<{ fund: string; year: string }>;
  searchParams: Promise<{ amount?: string }>;
}

function isValidFundId(id: string): id is FundId {
  return id in FUNDS;
}

export async function generateStaticParams() {
  const funds = FUND_LIST.map((f) => f.id);
  const years = ["2015", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  const paths = [];
  for (const fund of funds) {
    for (const year of years) {
      paths.push({ fund, year });
    }
  }
  return paths;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { fund, year } = await params;
  const { amount } = await searchParams;
  if (!isValidFundId(fund)) return {};

  const fundData = FUNDS[fund];
  const startYear = parseInt(year);
  const monthlyAmount = parseInt(amount ?? "30000");
  const result = simulate({ fundId: fund, startYear, startMonth: 1, monthlyAmount });
  const elapsed = calcElapsedYears(startYear, 1).toFixed(0);

  const title = `${startYear}年から${fundData.shortName}を積み立てていたら？ ${formatCurrency(result.profit)}の利益`;
  const description = `もし${startYear}年1月から毎月${formatCurrency(monthlyAmount)}を${fundData.shortName}に積み立てていたら、約${elapsed}年で${formatCurrency(result.profit)}の利益（${result.returnRate.toFixed(1)}%リターン）。現在評価額は${formatCurrency(result.finalValue)}。`;

  const ogUrl = new URL("https://tsumitate-timemachine.vercel.app/api/og");
  ogUrl.searchParams.set("fund", fund);
  ogUrl.searchParams.set("year", year);
  ogUrl.searchParams.set("amount", String(monthlyAmount));

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
    alternates: {
      canonical: `https://tsumitate-timemachine.vercel.app/simulate/${fund}/${year}`,
    },
  };
}

export default async function SimulatePage({ params, searchParams }: Props) {
  const { fund, year } = await params;
  const { amount } = await searchParams;

  if (!isValidFundId(fund)) notFound();

  const startYear = parseInt(year);
  if (isNaN(startYear) || startYear < 2015 || startYear > 2024) notFound();

  const monthlyAmount = parseInt(amount ?? "30000");
  const fundData = FUNDS[fund];
  const result = simulate({ fundId: fund, startYear, startMonth: 1, monthlyAmount });
  const elapsed = calcElapsedYears(startYear, 1);

  // 構造化データ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${startYear}年から${fundData.shortName}を積み立てていたら？`,
    description: `${startYear}年から約${elapsed.toFixed(0)}年間、毎月${formatCurrency(monthlyAmount)}を${fundData.shortName}に積み立てた場合のシミュレーション結果`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: "積立タイムマシン" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-zinc-950">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-15"
            style={{ background: `radial-gradient(ellipse, ${fundData.color} 0%, transparent 70%)` }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-12 pb-24">
          {/* パンくず */}
          <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
            <Link href="/" className="hover:text-zinc-400 transition-colors">トップ</Link>
            <span>/</span>
            <span className="text-zinc-400">{fundData.shortName}</span>
            <span>/</span>
            <span className="text-zinc-400">{startYear}年〜</span>
          </nav>

          {/* H1 */}
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            もし{startYear}年から<br />
            <span style={{ color: fundData.color }}>{fundData.shortName}</span>を<br />
            積み立てていたら？
          </h1>
          <p className="text-zinc-400 text-sm mb-10">
            毎月{formatCurrency(monthlyAmount)} · {startYear}年1月〜2025年6月（約{elapsed.toFixed(0)}年間）
          </p>

          {/* クライアントコンポーネント（グラフ・アニメーション） */}
          <SimulatePageClient
            fundId={fund}
            startYear={startYear}
            startMonth={1}
            monthlyAmount={monthlyAmount}
            result={result}
          />

          {/* 解説テキスト（SEO用） */}
          <section className="mt-12 space-y-6 text-sm text-zinc-400 leading-relaxed">
            <h2 className="text-lg font-bold text-white">
              {startYear}年から{fundData.shortName}に積み立てた場合の詳細
            </h2>
            <p>
              {startYear}年1月から2025年6月まで、毎月{formatCurrency(monthlyAmount)}を
              {fundData.name}（{fundData.shortName}）に積み立てた場合、
              元本合計{formatCurrency(result.totalPrincipal)}に対して、
              現在の評価額は{formatCurrency(result.finalValue)}となります。
              利益額は<strong className="text-white">+{formatCurrency(result.profit)}</strong>で、
              リターン率は{result.returnRate.toFixed(1)}%です。
            </p>
            <p>
              {fundData.shortName}（{fundData.name}）は{fundData.description}。
              リスクレベルは5段階中{fundData.riskLevel}で、
              {fundData.riskLevel <= 2 ? "比較的安定した運用が期待できます" :
               fundData.riskLevel <= 3 ? "中程度のリスク・リターンが特徴です" :
               "高リターンの可能性がありますが、価格変動も大きいです"}。
            </p>
            <p>
              ※ このシミュレーションは過去の実績データに基づくものであり、
              将来の運用成果を保証するものではありません。
              実際の投資では信託報酬・為替コスト・税金などが発生します。
              投資は自己責任でお願いします。
            </p>
          </section>

          {/* 他の条件も試す */}
          <section className="mt-12">
            <h3 className="text-sm font-bold text-zinc-400 mb-4 tracking-widest uppercase">他の条件でも試す</h3>
            <div className="grid grid-cols-2 gap-3">
              {[2015, 2018, 2019, 2020, 2021, 2022].filter(y => y !== startYear).slice(0, 4).map((y) => {
                const r = simulate({ fundId: fund, startYear: y, startMonth: 1, monthlyAmount });
                return (
                  <Link
                    key={y}
                    href={`/simulate/${fund}/${y}?amount=${monthlyAmount}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-all"
                  >
                    <p className="text-xs text-zinc-500 mb-1">{y}年〜</p>
                    <p className="text-sm font-bold" style={{ color: fundData.color }}>
                      +{formatCurrency(r.profit)}
                    </p>
                    <p className="text-xs text-zinc-600">+{r.returnRate.toFixed(1)}%</p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 他の銘柄へ */}
          <section className="mt-8">
            <h3 className="text-sm font-bold text-zinc-400 mb-4 tracking-widest uppercase">同期間で他の銘柄と比べる</h3>
            <div className="grid grid-cols-2 gap-3">
              {FUND_LIST.filter((f) => f.id !== fund).slice(0, 4).map((f) => {
                const r = simulate({ fundId: f.id, startYear, startMonth: 1, monthlyAmount });
                return (
                  <Link
                    key={f.id}
                    href={`/simulate/${f.id}/${year}?amount=${monthlyAmount}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-all"
                  >
                    <p className="text-xs mb-1" style={{ color: f.color }}>{f.shortName}</p>
                    <p className="text-sm font-bold text-white">
                      +{formatCurrency(r.profit)}
                    </p>
                    <p className="text-xs text-zinc-600">+{r.returnRate.toFixed(1)}%</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              ⚡ 自分の条件でシミュレーション
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
