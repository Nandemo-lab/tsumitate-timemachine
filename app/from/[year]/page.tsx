import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, TrendingUp, ArrowRight, Trophy } from "lucide-react";
import { FUNDS, FUND_LIST } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
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
  2019: "米中貿易摩擦が続く中でも米国株が力強く上昇した年。FRBが3度の利下げを実施し、S&P500が年間+31%を記録。「景気後退懸念を乗り越えた強気相場」として振り返られる年です。",
  2020: "コロナショックによる急落と急回復の年。3月に多くの銘柄が年初比で約30%下落しましたが、大規模金融緩和で急反発。「最悪の出来事が最高の買い場になった」と語り継がれる年です。",
  2021: "コロナ後の回復相場が加速した年。低金利・財政出動の恩恵を受け、成長株・テック株が力強く上昇。多くの指数が年間20〜30%超のリターンを記録しました。",
  2022: "急激な利上げと景気減速懸念で株式市場が大幅調整した年。FRBが歴史的ペースで利上げし、主要指数は年間15〜35%下落。積立投資家には「安く仕込めた」年でもありました。",
  2023: "生成AIブームと利上げ打ち止め期待で急回復した年。NASDAQ100が年間+53%を記録するなど、ハイテク株主導の強烈な上昇相場となりました。",
  2024: "新NISA元年。1月開始と同時に約1兆円が流入し、米国株が年間+23〜25%上昇。AI株の躍進と円安（150円台）が重なり、日本の投資家にとって高リターンの年でした。",
};

const YEAR_FAQS: Record<number, { q: string; a: string }[]> = {
  2020: [
    { q: "2020年から積み立てを始めた場合、どの銘柄が最も増えましたか？", a: "上記のランキングをご確認ください。テック集中型（NASDAQ100・FANG+）がコロナ後の急騰で高リターンになりやすい一方、2022年の大幅下落も経験しています。分散型（オルカン・S&P500）は安定して高いリターンを維持してきた傾向があります。" },
    { q: "2020年はコロナショックがあったのに積み立てて良かったのですか？", a: "結果的には、2020年3月の急落時に安値で多くの口数を積み上げたことが後の回復局面で大きな利益につながりました。積立投資（ドルコスト平均法）では、下落局面ほど安値で多く買えるため、長期では下落が恩恵になることがあります。" },
    { q: "2020年から新NISAで積み立てていた場合の非課税メリットは？", a: "新NISAが開始されたのは2024年1月からです。2020〜2023年は旧つみたてNISA（年40万円上限）が対象でした。2020年から積み立てていた方は旧制度枠を使っている場合もあります。現在の状況に応じて、新NISAへの移行・継続を検討してください。" },
    { q: "月3万円の積立で2020年から始めた場合の元本はいくらですか？", a: "2020年1月スタートから現在（2025年6月）まで積み立てた場合、元本は月3万円×約65ヶ月=約195万円程度です。上記各銘柄の評価額と比較することで、実際に増えた金額を確認できます。" },
    { q: "2020年積立開始の投資家がするべきこととは？", a: "2020年開始の方は既に5年以上の積立実績があり、複利効果が蓄積されています。基本的には「定額積立を継続すること」が最善策です。下落局面でも積み立てを止めず、長期20〜30年の視点で資産形成を続けることが重要です。" },
  ],
  2021: [
    { q: "2021年から積み立てた場合、2022年の大幅下落は大きな痛手でしたか？", a: "2021年開始の方は、翌2022年に多くの銘柄が大幅下落（S&P500約−18%、NASDAQ100約−37%）を経験しました。ただし定額積立では下落時に安値で多くの口数を取得でき、2023年以降の回復で評価額が改善した方が多いです。上記シミュレーションで現在の状況をご確認ください。" },
    { q: "2021年開始組の現在の成績はどの銘柄が最も良いですか？", a: "上記ランキングをご確認ください。2021年は高値からのスタートでしたが、4年以上の積立継続により多くの銘柄でプラスのリターンになっています。" },
    { q: "2021年はどの銘柄が最も下落しましたか？", a: "2022年の下落では、テック株集中型（NASDAQ100約−37%、FANG+約−44%）の落ち込みが大きく、2021年開始の方は一時大きな評価損を経験しました。一方、高配当系（VYM・SCHD）は比較的下落が小さく、2022年に強さを発揮しました。" },
    { q: "2021年開始の積立を2024年の新NISAにどう活かすべきですか？", a: "旧つみたてNISAで積み立てていた分は非課税期間（20年）が残っています。新NISAの枠は別枠として2024年から新たに使えるため、継続して活用することでさらなる非課税積立が可能です。" },
    { q: "2021年積立開始で今後の見通しはどうですか？", a: "将来の市場予測は誰にも正確にはできません。ただし長期積立では短期の上下よりも「継続することの複利効果」が重要です。2021年開始の方はまだ積立期間が4〜5年で、10〜20年の目標まで続けることが最大のポイントです。" },
  ],
  2022: [
    { q: "2022年はほぼ全銘柄が下落しましたが、積み立て開始して良かったですか？", a: "結果的には、2022年の下落相場で安値から積み立てを開始できたため、2023年以降の急回復で大きな恩恵を受けた年でもありました。特にNASDAQ100は2022年約−37%の後、2023年に約+53%と急回復しています。" },
    { q: "2022年の最大の勝ち組と負け組はどの銘柄でしたか？", a: "2022年の年間リターンで最も下落が小さかったのはVYM（約−0.1%）・SCHD（約−3%）などの高配当系。最も下落したのはFANG+（約−44%）・NASDAQ100（約−33%）などのテック集中系でした。2022年開始の現在成績は上記ランキングをご確認ください。" },
    { q: "2022年は「最高の積立開始年」と言われる理由は？", a: "安値での積立スタートにより、その後の上昇相場での恩恵が大きいためです。積立投資は「安い時期に多くの口数を取得し、高い時期に評価額が膨らむ」構造を持っています。2022年の下落相場での積立は、まさにこの恩恵を最大限に受けるタイミングでした。" },
    { q: "2022年の暴落中に積み立てを止めなかった人はどうなりましたか？", a: "2022年の下落中も定額積立を継続した方は、安値での口数積み上げにより2023年の急回復で大きな利益を得やすい結果となりました。逆に下落時に積立をやめた方は、回復局面での恩恵が限定的になった可能性があります。" },
    { q: "2022年から積み立てていた場合の現在の評価額は？", a: "上記各銘柄のシミュレーション結果をご確認ください。2022年は下落年でしたが、その後の回復を含めた現在の累計リターンが表示されています。" },
  ],
  2023: [
    { q: "2023年から積み立て開始した場合のリターンは？", a: "上記ランキングをご確認ください。2023年はAIブームで多くの銘柄が好調でした。特にNASDAQ100・FANG+が年間50〜70%という高リターンを記録したため、2023年開始の方も2年程度の積立で高い累計リターンになっている可能性があります。" },
    { q: "2023年は高値圏でのスタートでしたが大丈夫でしたか？", a: "2023年に始めた方の成績は上記シミュレーションをご確認ください。2023年自体が高リターン年だったため、年初に積み立てを始めた方はその恩恵を受けています。2024年も引き続き高い水準が続いており、現時点ではプラスになっているケースが多いと思われます。" },
    { q: "2023年からNASDAQ100を積み立てた場合の特徴は？", a: "2023年はNASDAQ100が年間+53%という圧倒的なリターンを記録したため、2023年1月開始の積立は短期間で大きく評価額が増えました。ただしNASDAQ100は変動も大きいため、今後の下落局面でも継続できるか確認しておくことが重要です。" },
    { q: "新NISAが始まる前（2023年）に始めるべきでしたか？", a: "旧つみたてNISA（2023年まで）と新NISA（2024年〜）は別制度です。2023年以前に始めた方は旧制度の非課税枠を活用しつつ、2024年からの新NISA枠を別途活用できます。どちらのタイミングで始めても長期積立の本質は変わりません。" },
    { q: "2023年から高配当株（SCHD・VYM）を積み立てた場合は？", a: "2023年の高配当系ETFは成長株に比べるとリターンが控えめでした（SCHD+6.8%、VYM+10.7%）。ただし配当収入を含めたトータルリターンや、下落耐性の高さを考慮すると長期保有での強みが発揮されます。上記シミュレーション結果と合わせてご確認ください。" },
  ],
  2024: [
    { q: "2024年から積み立てを始めた場合の現在の結果は？", a: "上記ランキングをご確認ください。2024年は新NISA元年として多くの方が積立を開始した年です。年間リターンも米国株中心に高水準で、2024年開始の方も現時点でプラスになっているケースが多いと思われます。" },
    { q: "新NISAで2024年から始めた場合、どの銘柄が人気でしたか？", a: "2024年の新NISAつみたて投資枠で最も人気が高かったのはオルカン（eMAXIS Slim 全世界株式）とS&P500（eMAXIS Slim 米国株式）の2銘柄です。この2銘柄で新NISAつみたて投資枠の残高の大きな割合を占めています。" },
    { q: "2024年開始組は2025年以降も続けるべきですか？", a: "はい、積立投資の本質は「長期間続けること」にあります。2024年開始の方はまだ1〜2年目で、10〜20年の積立目標には道半ばです。短期の上下に関わらず、定額積立を継続することが複利効果を最大化する最善策です。" },
    { q: "2024年の円安で積立の評価額が大きく増えましたが、円高になったらどうなりますか？", a: "外国資産（オルカン・S&P500・ETFなど）は円高になると日本円換算の評価額が目減りするリスクがあります。ただし長期積立では為替の短期変動より「資産の実質的な成長」が重要です。外貨建て資産への積立は為替リスクを理解した上で長期保有することが基本です。" },
    { q: "2024年に新NISAで積み立てた金額の非課税枠は永久ですか？", a: "新NISA（2024年〜）の非課税保有期間は無期限です。旧つみたてNISAは最長20年の非課税期間でしたが、新NISAは期限なく保有できます。2024年に積み立てた分も、売却するまで非課税で運用し続けられます。" },
  ],
  2019: [
    { q: "2019年から積み立てを始めた場合、約6年でどのくらい増えましたか？", a: "上記ランキングをご確認ください。2019年はS&P500が+31%という高リターン年でした。その後コロナショック（2020年）・急騰（2021年）・下落（2022年）・回復（2023年）・続伸（2024年）という相場変動を経験した6年間です。" },
    { q: "2019年から積み立てた場合の最大の試練は何でしたか？", a: "最大の試練は2020年3月のコロナショック（主要指数が1ヶ月で約30%急落）と2022年の大幅下落（S&P500約−18%、NASDAQ100約−37%）の2回です。ただし定額積立継続の投資家はどちらの下落後も回復・最高値更新を経験しています。" },
    { q: "2019年積立開始の場合、新NISAとの関係は？", a: "2019〜2023年は旧つみたてNISA（年40万円上限）で積み立てていた方が多いと思われます。新NISAが始まった2024年からは旧制度分とは別に、新NISAの枠（つみたて年120万円＋成長投資枠年240万円）が追加で使えるようになりました。" },
    { q: "2019年から積立を続けた場合の「続けることの価値」は？", a: "コロナショック・2022年の大幅下落など複数の試練を乗り越え、定額積立を6年以上続けた場合の評価額は、多くの銘柄でプラスの高いリターンになっています。「下落時に売らずに続けること」が長期積立の最大の価値を示す事例です。" },
    { q: "2019年積立開始で最も成績が良かった銘柄は？", a: "上記ランキングをご確認ください。テック集中型（FANG+・NASDAQ100）が下落局面の振れ幅は大きかったものの、長期では高いリターンを記録する傾向があります。ただし精神的・財務的にリスクに耐えられた場合に限ります。" },
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
  const title = `${year}年（${label}）から積み立てていたら？全銘柄リターンランキング`;
  const description = `${prefix}${year}年から月3万円を全銘柄に積み立てた場合のリターンをランキング形式で公開。オルカン・S&P500・NASDAQ100など主要ファンドの実績を今すぐ確認→`;
  return {
    title: `${title} | 積立タイムマシン`,
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
          alt: `${year}年から積み立てていたら？全銘柄リターン比較`,
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

  // 全銘柄シミュレーション → リターン率でソート
  const ranked = FUND_LIST.map((fund) => {
    const result = simulate({
      fundId: fund.id,
      startYear: yearNum,
      startMonth: SIM_MONTH,
      monthlyAmount: SIM_AMOUNT,
    });
    return { fund, result };
  }).sort((a, b) => b.result.returnRate - a.result.returnRate);

  const winner = ranked[0];
  const yearContext = YEAR_CONTEXT[yearNum] ?? "";
  const faqs = YEAR_FAQS[yearNum] ?? [];

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
                {year}年から積み立てていたら？<br />全銘柄リターンランキング
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
          <section
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
          </section>

          {/* ── 全銘柄ランキング ─────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {year}年スタート・全銘柄リターンランキング
            </h2>
            <div className="space-y-2">
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
                    href={`/${yearPageSlug}/${yearNum}`}
                    className={baseClass + " hover:bg-white/[0.08]"}
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div key={fund.id} className={baseClass}>
                    {CardContent}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 text-center">
              ※月3万円 / {year}年{SIM_MONTH}月〜現在の積立シミュレーション（積立タイムマシン調べ）
            </p>
          </section>

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
