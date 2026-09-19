import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, TrendingUp, ArrowRight, Trophy } from "lucide-react";
import { FUNDS, FUND_LIST, formatAnnualReturn } from "@/lib/funds";
import { CURRENT_MONTH, CURRENT_YEAR, simulate, formatCurrency, formatCurrencyFull } from "@/lib/simulation";
import { getReturnSeriesDefinition, monthKey } from "@/lib/return-series";
import { YEAR_PAGES } from "@/lib/year-pages";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import SiteFooter from "@/components/layout/SiteFooter";
import { FundId } from "@/types";

const BASE_URL = "https://tsumitate-timemachine.com";

const SUPPORTED_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

const SIM_AMOUNT = 30000;
const SIM_MONTH = 1;

// ── 年の背景テキスト ─────────────────────────────────────────────────

const YEAR_CONTEXT: Record<number, string> = {
  2019: `米国株が上昇した年です。eMAXIS Slim 米国株式（S&P500）の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("sp500", 2019)}でした。単年のリターンと、2019年から積み立てた累積結果は別の指標です。`,
  2020: `コロナショックによる急落と、その後の反発があった年です。eMAXIS Slim 米国株式（S&P500）の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("sp500", 2020)}でした。年中の最大下落率や、2020年開始の積立結果を示す数値ではありません。`,
  2021: `米国株やテクノロジー関連株が上昇した年です。eMAXIS Slim 米国株式（S&P500）の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("sp500", 2021)}でした。2021年から積み立てた累積結果は下のランキングで確認できます。`,
  2022: `利上げなどを背景に株式市場が調整した年です。円ベース・分配金再投資込みの暦年リターンは、S&P500が${formatAnnualReturn("sp500", 2022)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}でした。暦年リターンと2022年開始の積立結果は別の指標です。`,
  2023: `テクノロジー関連株が上昇した年です。円ベース・分配金再投資込みの暦年リターンは、NASDAQ100が${formatAnnualReturn("nasdaq100", 2023)}、FANG+が${formatAnnualReturn("fangplus", 2023)}でした。2023年開始の積立結果は下のランキングで確認できます。`,
  2024: `新NISAが始まった年です。円ベース・分配金再投資込みの暦年リターンは、S&P500が${formatAnnualReturn("sp500", 2024)}、オルカンが${formatAnnualReturn("orcan", 2024)}でした。単年の上昇率と積立の累積利益率は異なります。`,
};

const YEAR_FAQS: Record<number, { q: string; a: string }[]> = {
  2020: [
    { q: "2020年から積み立てを始めた場合、どの銘柄が最も増えましたか？", a: "上記のランキングをご確認ください。月額・開始月・終了月を同じ条件にし、対象期間全体を計算できるA品質の商品だけを順位付けしています。" },
    { q: "2020年はコロナショックがあったのに積み立てて良かったのですか？", a: "毎月定額で積み立てる場合、価格が低い月には同じ金額で多くの口数を購入します。ただし、その後の値動きや開始月によって結果は変わります。2020年開始の実際の累積結果は、上記ランキングで商品ごとに確認できます。" },
    { q: "2020年から新NISAで積み立てていた場合の非課税メリットは？", a: "新NISAが開始されたのは2024年1月からです。2020〜2023年は旧つみたてNISA（年40万円上限）が対象でした。2020年から積み立てていた方は旧制度枠を使っている場合もあります。現在の状況に応じて、新NISAへの移行・継続を検討してください。" },
    { q: "2020年積立開始後はどう判断すればよいですか？", a: "積立を続けるかどうかは、資金を使う時期、生活防衛資金、許容できる価格変動から判断します。2020年開始の累積結果は上記ランキングで確認できますが、過去の結果だけで今後の継続・売却を一律に決めることはできません。" },
  ],
  2021: [
    { q: "2021年から積み立てた場合、2022年の下落はどう影響しましたか？", a: `2022年の円ベース・分配金再投資込みの暦年リターンは、S&P500が${formatAnnualReturn("sp500", 2022)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}でした。これは単年の商品リターンで、2021年からの積立損益とは異なります。累積結果は上記ランキングで確認できます。` },
    { q: "2021年開始組の現在の成績はどの銘柄が最も良いですか？", a: "上記ランキングをご確認ください。2021年は高値からのスタートでしたが、4年以上の積立継続により多くの銘柄でプラスのリターンになっています。" },
    { q: "2022年の暦年リターンは商品ごとにどう違いましたか？", a: `検証済み商品の円ベース・分配金再投資込みの暦年リターンは、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}、FANG+が${formatAnnualReturn("fangplus", 2022)}、VYMが${formatAnnualReturn("vym", 2022)}でした。これは年中の最大下落率や、2021年開始の積立損益を示すものではありません。` },
    { q: "2021年開始の積立を2024年の新NISAにどう活かすべきですか？", a: "旧つみたてNISAで積み立てていた分は非課税期間（20年）が残っています。新NISAの枠は別枠として2024年から新たに使えるため、継続して活用することでさらなる非課税積立が可能です。" },
    { q: "2021年積立開始で今後の見通しはどうですか？", a: "将来の市場は予測できません。積立を続けるかどうかは、資金を使う時期、生活防衛資金、価格変動への許容度から判断します。2021年開始の過去実績は上記ランキングで確認できますが、将来の結果は保証しません。" },
  ],
  2022: [
    { q: "2022年から積み立てた結果はどう確認できますか？", a: `2022年の円ベース・分配金再投資込みの暦年リターンは、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}、FANG+が${formatAnnualReturn("fangplus", 2022)}でした。2022年から毎月積み立てた累積結果は単年リターンとは異なるため、上記ランキングで確認してください。` },
    { q: "2022年の暦年リターンは商品ごとにどう違いましたか？", a: `検証済み商品の円ベース・分配金再投資込みの暦年リターンは、VYMが${formatAnnualReturn("vym", 2022)}、FANG+が${formatAnnualReturn("fangplus", 2022)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}でした。暦年リターンは年中の最大下落率ではなく、2022年開始の現在成績は上記ランキングで別に確認できます。` },
    { q: "2022年は積立開始に適した年だったのですか？", a: "積立開始に最適な年だったと一律には判断できません。毎月定額の積立では価格が低い月に多くの口数を購入しますが、その後の結果は商品・開始月・終了月によって変わります。上記ランキングは2022年1月開始という同じ条件で比較しています。" },
    { q: "2022年の下落中も積み立てた場合、どうなりましたか？", a: "下落中も定額積立を続けた場合の現在までの結果は、上記ランキングに表示しています。価格が低い月には多くの口数を購入しますが、その後に利益が出ることや回復時期を保証する仕組みではありません。" },
    { q: "2022年から積み立てていた場合の現在の評価額は？", a: "上記各銘柄のシミュレーション結果をご確認ください。2022年は下落年でしたが、その後の回復を含めた現在の累計リターンが表示されています。" },
  ],
  2023: [
    { q: "2023年から積み立て開始した場合のリターンは？", a: `上記ランキングをご確認ください。2023年の円ベース・分配金再投資込みの暦年リターンは、NASDAQ100が${formatAnnualReturn("nasdaq100", 2023)}、FANG+が${formatAnnualReturn("fangplus", 2023)}でした。単年リターンと2023年からの積立累積利益率は別の指標です。` },
    { q: "2023年は高値圏でのスタートでしたが大丈夫でしたか？", a: "2023年開始の積立結果は上記ランキングで確認できます。表示しているのは月額・開始月・終了月を揃えた過去の結果であり、開始時点が適切だったかや将来の成績を保証するものではありません。" },
    { q: "2023年からNASDAQ100を積み立てた場合の特徴は？", a: `iFreeNEXT NASDAQ100インデックスの2023年の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("nasdaq100", 2023)}でした。2023年1月からの積立結果は上記ランキングで確認できます。値動きが大きくなる場合があるため、単年の好成績だけで将来を判断できません。` },
    { q: "新NISAが始まる前（2023年）に始めるべきでしたか？", a: "旧つみたてNISA（2023年まで）と新NISA（2024年〜）は別制度です。2023年以前に始めた方は旧制度の非課税枠を活用しつつ、2024年からの新NISA枠を別途活用できます。どちらのタイミングで始めても長期積立の本質は変わりません。" },
    { q: "2023年から高配当ETFのVYMを積み立てた場合は？", a: `検証済み月次データを使用するVYMの2023年の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("vym", 2023)}でした。2023年1月から現在までの積立結果は上記ランキングで確認できます。原典未検証の参考系列であるSCHDは数値順位に含めていません。` },
  ],
  2024: [
    { q: "2024年から積み立てを始めた場合の現在の結果は？", a: "上記ランキングをご確認ください。月額・開始月・終了月を同じ条件にした、2024年1月開始の過去の結果を表示しています。" },
    { q: "新NISAで2024年から始めた場合、どの銘柄が人気でしたか？", a: "2024年の新NISAつみたて投資枠で最も人気が高かったのはオルカン（eMAXIS Slim 全世界株式）とS&P500（eMAXIS Slim 米国株式）の2銘柄です。この2銘柄で新NISAつみたて投資枠の残高の大きな割合を占めています。" },
    { q: "2024年開始後は積立を続けるべきですか？", a: "積立を続けるかどうかは、資金を使う時期、生活防衛資金、価格変動への許容度から判断します。2024年開始の過去実績は上記ランキングで確認できますが、その結果だけで今後の継続・売却を一律に決めることはできません。" },
    { q: "2024年の円安で積立の評価額が大きく増えましたが、円高になったらどうなりますか？", a: "外国資産を含む商品は、投資対象の値動きが同じでも、円高になると円換算の評価額が下がる場合があります。上記ランキングは円ベースの過去実績であり、将来の為替変動を予測するものではありません。" },
    { q: "2024年に新NISAで積み立てた金額の非課税枠は永久ですか？", a: "新NISA（2024年〜）の非課税保有期間は無期限です。旧つみたてNISAは最長20年の非課税期間でしたが、新NISAは期限なく保有できます。2024年に積み立てた分も、売却するまで非課税で運用し続けられます。" },
  ],
  2019: [
    { q: "2019年から積み立てを始めた場合、どのくらい増えましたか？", a: `上記ランキングをご確認ください。eMAXIS Slim 米国株式（S&P500）の2019年の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("sp500", 2019)}でしたが、2019年からの積立累積利益率とは別の指標です。` },
    { q: "2019年から積み立てた期間には、どのような下落局面がありましたか？", a: `2020年のコロナショックや2022年の調整局面が含まれます。2022年の円ベース・分配金再投資込みの暦年リターンは、S&P500が${formatAnnualReturn("sp500", 2022)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}でした。これは年中の最大下落率ではありません。` },
    { q: "2019年積立開始の場合、新NISAとの関係は？", a: "2019〜2023年は旧つみたてNISA（年40万円上限）で積み立てていた方が多いと思われます。新NISAが始まった2024年からは旧制度分とは別に、新NISAの枠（つみたて年120万円＋成長投資枠年240万円）が追加で使えるようになりました。" },
    { q: "2019年から積立を続けた結果から何が分かりますか？", a: "コロナショックや2022年の調整局面を含む期間の積立結果を、同じ月額・終了月で商品ごとに比較できます。ただし、この特定期間の結果が、別の開始時期や将来にも再現されるとは限りません。" },
    { q: "2019年積立開始で最も成績が良かった銘柄は？", a: "上記のランキングをご確認ください。対象期間全体を計算できるA品質の商品に限り、同じ月額・開始月・終了月で比較しています。" },
  ],
};

// 年別ページが存在するファンドスラグのマッピング
const FUND_ID_TO_YEAR_PAGE_SLUG: Partial<Record<FundId, string>> = {
  orcan: "orukan",
  sp500: "sp500",
  nasdaq100: "nasdaq100",
};

interface Props {
  params: Promise<{ year: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_YEARS.map((y) => ({ year: String(y) }));
}

function getRankedFunds(year: number) {
  const requestedStart = monthKey(year, SIM_MONTH);
  const requestedEnd = monthKey(CURRENT_YEAR, CURRENT_MONTH);

  return FUND_LIST.filter((fund) => {
    const definition = getReturnSeriesDefinition(fund.id);
    return (
      definition.quality === "A" &&
      definition.startMonth <= requestedStart &&
      definition.endMonth >= requestedEnd
    );
  });
}

const FROM_YEAR_LABEL: Record<number, string> = {
  2019: "コロナ前夜",
  2020: "コロナ直後",
  2021: "コロナ回復",
  2022: "暴落スタート",
  2023: "AIブーム",
  2024: "新NISA元年",
};

const FROM_YEAR_DESC_PREFIX: Record<number, string> = {
  2019: "コロナ前夜の",
  2020: "コロナショック直後の",
  2021: "コロナ後の回復相場が続いた",
  2022: "株価暴落が続いた",
  2023: "生成AIブームに沸いた",
  2024: "新NISA元年の",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yearNum = Number(year);
  if (!SUPPORTED_YEARS.includes(yearNum)) return {};
  const label = FROM_YEAR_LABEL[yearNum] ?? String(yearNum);
  const prefix = FROM_YEAR_DESC_PREFIX[yearNum] ?? `${year}年から`;
  const title = `${year}年（${label}）から積み立てていたら？検証済み銘柄リターンランキング`;
  const description = `${prefix}${year}年から月3万円を検証済み銘柄に積み立てた場合のリターンをランキング形式で公開。オルカン・S&P500・NASDAQ100など主要ファンドの実績を今すぐ確認→`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/from/${year}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/from/${year}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: `${BASE_URL}/api/og?fund=sp500&year=${year}&amount=30000`,
          width: 1200,
          height: 630,
          alt: `${year}年から積み立てていたら？検証済み銘柄リターン比較`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/api/og?fund=sp500&year=${year}&amount=30000`],
    },
  };
}

const RANK_BADGES = ["🥇", "🥈", "🥉", "4位", "5位", "6位", "7位", "8位", "9位", "10位"];

export default async function FromYearPage({ params }: Props) {
  const { year } = await params;
  const yearNum = Number(year);
  if (!SUPPORTED_YEARS.includes(yearNum)) notFound();

  // 同一期間を検証済み月次データで計算できる銘柄だけを順位付けする。
  const ranked = getRankedFunds(yearNum).map((fund) => {
    const result = simulate({
      fundId: fund.id,
      startYear: yearNum,
      startMonth: SIM_MONTH,
      monthlyAmount: SIM_AMOUNT,
    });
    return { fund, result };
  }).sort((a, b) => b.result.returnRate - a.result.returnRate);

  const winner = ranked[0] ?? null;
  const yearContext = YEAR_CONTEXT[yearNum] ?? "";
  const faqs = [...(YEAR_FAQS[yearNum] ?? [])];
  if (yearNum === 2020 && winner) {
    faqs.splice(3, 0, {
      q: "月3万円の積立で2020年から始めた場合の元本はいくらですか？",
      a: `2020年1月から${CURRENT_YEAR}年${CURRENT_MONTH}月まで、月初に${formatCurrency(SIM_AMOUNT)}を${winner.result.monthsElapsed}回積み立てた元本は${formatCurrencyFull(winner.result.totalPrincipal)}です。上記各銘柄の評価額と比較することで、運用による増減を確認できます。`,
    });
  }

  const referenceFunds = FUND_LIST.filter(
    (fund) => getReturnSeriesDefinition(fund.id).quality === "G"
  );

  // 同年の各銘柄ページへのリンク（year-pagesに存在するもの）
  const yearPageLinks = YEAR_PAGES.filter((p) => p.year === yearNum);

  // おすすめ比較ページ（上位3銘柄に関連するもの）
  const topFundIds = new Set(ranked.slice(0, 3).map((r) => r.fund.id));
  const relatedCompares = COMPARE_PAGES.filter(
    (p) => topFundIds.has(p.fundAId) || topFundIds.has(p.fundBId)
  ).slice(0, 4);

  // JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: `${year}年から積み立てていたら`, item: `${BASE_URL}/from/${year}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-400">{year}年から積み立てていたら</span>
          </nav>

          {/* ── H1 ───────────────────────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <h1
                className="text-2xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
              {year}年から積み立てていたら？<br />検証済み銘柄リターンランキング
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              月3万円 / {year}年{SIM_MONTH}月スタート / 最新データで計算
            </p>

            {/* 年の背景 */}
            {yearContext && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-4">
                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-2">
                  {year}年の市場
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">{yearContext}</p>
              </div>
            )}
          </section>

          {/* ── 1位ハイライト ─────────────────────────────────────── */}
          {winner ? <section
            data-winner-fund-id={winner.fund.id}
            data-start-year={yearNum}
            data-start-month={SIM_MONTH}
            data-end-year={CURRENT_YEAR}
            data-end-month={CURRENT_MONTH}
            data-monthly-amount={SIM_AMOUNT}
            data-month-count={winner.result.monthsElapsed}
            data-principal-yen={winner.result.totalPrincipal}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: `${winner.fund.color}12`,
              border: `1px solid ${winner.fund.color}40`,
            }}
          >
            <p className="text-xs font-black tracking-widest uppercase text-zinc-400">
              🥇 {year}年スタート 最高リターン
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: winner.fund.color }}>
                  {winner.fund.encyclopedia.nickname}
                </p>
                <div className="flex items-baseline gap-2">
                  <p
                    className="font-heading font-number text-4xl font-bold"
                    style={{ color: winner.result.profit >= 0 ? "#10b981" : "#ef4444" }}
                  >
                    {winner.result.profit >= 0 ? "+" : ""}{formatCurrency(winner.result.profit)}
                  </p>
                  <span
                    className="font-number text-lg font-bold"
                    style={{ color: winner.result.profit >= 0 ? "#10b981" : "#ef4444" }}
                  >
                    +{winner.result.returnRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 mb-0.5">評価額</p>
                <p className="text-sm font-bold text-zinc-300">{formatCurrency(winner.result.finalValue)}</p>
                <p className="text-[10px] text-zinc-500">元本 {formatCurrency(winner.result.totalPrincipal)}</p>
              </div>
            </div>
          </section> : (
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-sm text-zinc-400">この期間を検証済みデータで計算できる銘柄はありません。</p>
            </section>
          )}

          {/* ── 全銘柄ランキング ─────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {year}年スタート・検証済み{ranked.length}銘柄リターンランキング
            </h2>
            <div className="space-y-2" data-ranked-count={ranked.length}>
              {ranked.map(({ fund, result }, i) => {
                const isProfit = result.profit >= 0;
                const yearPageSlug = FUND_ID_TO_YEAR_PAGE_SLUG[fund.id];
                const hasYearPage = yearPageSlug && YEAR_PAGES.some(
                  (p) => p.fundSlug === yearPageSlug && p.year === yearNum
                );

                const CardContent = (
                  <>
                    {/* 順位・銘柄名 */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm w-6 text-center flex-shrink-0">
                        {RANK_BADGES[i] ?? `${i + 1}位`}
                      </span>
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ background: fund.color }}
                      />
                      <p className="text-sm font-bold text-white">{fund.encyclopedia.nickname}</p>
                    </div>

                    {/* リターン・評価額 */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className="font-number text-base font-bold"
                          style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                        >
                          {isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {isProfit ? "+" : ""}{formatCurrency(result.profit)}
                        </p>
                      </div>
                      {hasYearPage && (
                        <ChevronRight className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                      )}
                    </div>
                  </>
                );

                const baseClass =
                  "flex items-center justify-between rounded-xl px-4 py-3 transition-colors " +
                  (i === 0
                    ? "bg-white/[0.06] border border-white/[0.12]"
                    : "bg-white/[0.03] border border-white/[0.07]");

                return hasYearPage ? (
                  <Link
                    key={fund.id}
                    data-ranked-position={i + 1}
                    data-ranked-fund-id={fund.id}
                    data-ranked-quality={getReturnSeriesDefinition(fund.id).quality}
                    href={`/${yearPageSlug}/${yearNum}`}
                    className={baseClass + " hover:bg-white/[0.08]"}
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div
                    key={fund.id}
                    data-ranked-position={i + 1}
                    data-ranked-fund-id={fund.id}
                    data-ranked-quality={getReturnSeriesDefinition(fund.id).quality}
                    className={baseClass}
                  >
                    {CardContent}
                  </div>
                );
              })}
              {ranked.length === 0 && (
                <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                  順位付けできる検証済み銘柄がありません。
                </p>
              )}
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 text-center">
              ※月3万円 / {year}年{SIM_MONTH}月〜{CURRENT_YEAR}年{CURRENT_MONTH}月 / 検証済み月次データを使用
            </p>
          </section>

          {referenceFunds.length > 0 && (
            <section className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-4 space-y-2">
              <p className="text-xs font-bold text-amber-200">順位外の参考系列</p>
              <p className="text-xs leading-relaxed text-zinc-400">
                {referenceFunds.map((fund) => fund.shortName).join("・")}は原典未検証の参考データ（G品質）のため、数値順位には含めていません。
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                {referenceFunds.map((fund) => (
                  <Link key={fund.id} href={`/fund/${fund.id}`} className="text-amber-200 hover:text-amber-100">
                    {fund.shortName}の商品情報
                  </Link>
                ))}
                <Link href="/about/data-sources" className="text-amber-200 hover:text-amber-100">
                  データ品質の詳細
                </Link>
              </div>
            </section>
          )}

          {/* ── 銘柄別の詳細ページ ───────────────────────────────── */}
          {yearPageLinks.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                銘柄別の詳細シミュレーション
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {yearPageLinks.map((yp) => {
                  const f = FUNDS[yp.fundId];
                  const r = simulate({
                    fundId: yp.fundId,
                    startYear: yearNum,
                    startMonth: SIM_MONTH,
                    monthlyAmount: SIM_AMOUNT,
                  });
                  return (
                    <Link
                      key={yp.fundSlug}
                      href={`/${yp.fundSlug}/${yearNum}`}
                      className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: f.color }}
                        />
                        <div>
                          <p className="text-sm font-bold text-white">{f.encyclopedia.nickname}</p>
                          <p className="text-[10px] text-zinc-500">{year}年から積み立てていたら？</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-number text-sm font-bold"
                          style={{ color: r.returnRate >= 0 ? "#10b981" : "#ef4444" }}
                        >
                          {r.returnRate >= 0 ? "+" : ""}{r.returnRate.toFixed(1)}%
                        </span>
                        <ChevronRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 他の年との比較 ───────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              他の年から積み立てていたら？
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUPPORTED_YEARS.filter((y) => y !== yearNum).map((y) => {
                const topResult = simulate({
                  fundId: "orcan",
                  startYear: y,
                  startMonth: SIM_MONTH,
                  monthlyAmount: SIM_AMOUNT,
                });
                return (
                  <Link
                    key={y}
                    href={`/from/${y}`}
                    className="flex flex-col gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <span className="text-xs font-bold text-zinc-300">{y}年〜</span>
                    <span
                      className="font-number text-sm font-bold"
                      style={{ color: topResult.returnRate >= 0 ? "#10b981" : "#ef4444" }}
                    >
                      オルカン {topResult.returnRate >= 0 ? "+" : ""}{topResult.returnRate.toFixed(1)}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 関連する比較ページ ───────────────────────────────── */}
          {relatedCompares.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                上位銘柄の比較記事
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {relatedCompares.map((cp) => {
                  const fA = FUNDS[cp.fundAId];
                  const fB = FUNDS[cp.fundBId];
                  return (
                    <Link
                      key={cp.slug}
                      href={`/compare/${cp.slug}`}
                      className="flex flex-col gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-white">
                        <span style={{ color: fA.color }}>{fA.shortName}</span>
                        <span className="text-zinc-500 text-xs">vs</span>
                        <span style={{ color: fB.color }}>{fB.shortName}</span>
                      </span>
                      <span className="text-xs text-zinc-500">{cp.relatedDescription}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── CTA ─────────────────────────────────────────────── */}
          <section className="rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                自分の条件でシミュレーション
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              銘柄・開始年・月額を自由に変えて、あなただけの「たられば」を計算できます。
            </p>
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              積立タイムマシンで試す
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* ── FAQ ─────────────────────────────────────────────── */}
          {faqs.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                よくある質問
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2"
                  >
                    <p className="text-sm font-bold text-white">Q. {faq.q}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">A. {faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
