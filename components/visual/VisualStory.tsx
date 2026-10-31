import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Banknote,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Coins,
  Database,
  GitCompareArrows,
  Globe2,
  GraduationCap,
  Landmark,
  LineChart,
  PiggyBank,
  School,
  ShieldCheck,
  Signpost,
  Target,
  Users,
  WalletCards,
} from "lucide-react";
import { KODOMO_NISA_LIMITS, NISA_LIMITS, formatManEn } from "@/lib/nisa";
import { FUNDS, formatExpenseRatio } from "@/lib/funds";
import type { FundId } from "@/types";

type PageVisualKind = "guide" | "compare" | "fund" | "ranking" | "timeline" | "data";

const PAGE_VISUALS: Record<PageVisualKind, {
  eyebrow: string;
  title: string;
  steps: { label: string; detail: string; icon: LucideIcon }[];
}> = {
  guide: {
    eyebrow: "迷ったら、疑問から選ぶ",
    title: "知る → 条件を決める → 数字で確かめる",
    steps: [
      { label: "しくみを知る", detail: "専門用語は、最初にやさしく整理", icon: School },
      { label: "条件を決める", detail: "目的・期間・使う時期を確認", icon: CalendarDays },
      { label: "実績を確かめる", detail: "公式月次データで同じ条件を検証", icon: LineChart },
    ],
  },
  compare: {
    eyebrow: "同じものさしで比べる",
    title: "商品をそろえた条件で比較",
    steps: [
      { label: "商品A", detail: "投資対象と費用を確認", icon: Globe2 },
      { label: "共通条件", detail: "期間と毎月の金額を統一", icon: GitCompareArrows },
      { label: "商品B", detail: "経路と結果を同時に確認", icon: LineChart },
    ],
  },
  fund: {
    eyebrow: "商品を数字の前に知る",
    title: "対象・費用・データ品質を確認",
    steps: [
      { label: "投資対象", detail: "どの国や企業に投資するか", icon: Globe2 },
      { label: "費用", detail: "信託報酬・経費率を一次情報で確認", icon: Coins },
      { label: "実績データ", detail: "設定日以降の検証可能な期間だけ使用", icon: ShieldCheck },
    ],
  },
  ranking: {
    eyebrow: "順位だけで決めない",
    title: "条件と対象を確認して読む",
    steps: [
      { label: "同じ期間", detail: "比較できる共通期間にそろえる", icon: CalendarDays },
      { label: "同じ月額", detail: "元本の条件を統一", icon: WalletCards },
      { label: "過去実績", detail: "将来の順位予測ではない", icon: LineChart },
    ],
  },
  timeline: {
    eyebrow: "開始時期で経路は変わる",
    title: "毎月の元本と評価額を時間軸で確認",
    steps: [
      { label: "積立開始", detail: "開始年と月額を決める", icon: Clock3 },
      { label: "月末の経路", detail: "元本割れも月末観測で確認", icon: LineChart },
      { label: "期間末", detail: "元本と評価額を分けて読む", icon: CircleDollarSign },
    ],
  },
  data: {
    eyebrow: "数字の出どころをたどれる",
    title: "一次情報 → 月次データ → 計算結果",
    steps: [
      { label: "公式データ", detail: "運用会社・指数提供元・日本銀行", icon: Landmark },
      { label: "検証台帳", detail: "取得日とSHA-256を保存", icon: Database },
      { label: "計算結果", detail: "欠損や設定前データは補完しない", icon: ShieldCheck },
    ],
  },
};

export function HomeEditorialIllustration() {
  return (
    <figure className="tm-editorial-illustration" aria-labelledby="home-illustration-caption">
      <Image
        src="/images/illustrations/family-education-planning.png"
        alt="親子が貯金箱、カレンダー、学校と積立グラフを見ながら将来のお金を考えるイラスト"
        width={2048}
        height={1152}
        priority
        sizes="(max-width: 767px) 92vw, 560px"
        className="h-auto w-full"
      />
      <figcaption id="home-illustration-caption" className="sr-only">
        積立条件を決め、教育費など将来のお金を過去の公式データで確かめる流れを表しています。
      </figcaption>
    </figure>
  );
}

export function PageVisualStory({ kind }: { kind: PageVisualKind }) {
  const visual = PAGE_VISUALS[kind];
  return (
    <section className="tm-visual-story" aria-label={visual.title}>
      <div className="tm-visual-story__heading">
        <p>{visual.eyebrow}</p>
        <h2>{visual.title}</h2>
      </div>
      <ol className="tm-visual-story__steps">
        {visual.steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.label}>
              <span className="tm-visual-story__number" aria-hidden="true">{index + 1}</span>
              <span className="tm-visual-story__icon" aria-hidden="true"><Icon /></span>
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ArticleComparisonVisual({ fundIds }: { fundIds: string[] }) {
  const ids = fundIds.filter((id): id is FundId => id in FUNDS).slice(0, 2);
  if (ids.length !== 2) return null;
  const [fundA, fundB] = ids.map((id) => FUNDS[id]);
  const focus: Partial<Record<FundId, string>> = {
    orcan: "先進国・新興国を含む世界株式",
    sp500: "米国を代表する大型株",
    nasdaq100: "NASDAQ上場の非金融大型株",
    fangplus: "米国の大型テクノロジー企業",
    vt: "世界の株式市場",
    vti: "米国株式市場全体",
    vym: "米国の高配当株",
    schd: "米国の連続配当株",
    india: "インド株式",
    emerging: "新興国株式",
  };
  const isWorldVsNasdaq = ids.includes("orcan") && ids.includes("nasdaq100");
  return (
    <figure className="tm-comparison-figure tm-comparison-map" aria-label={`${fundA.shortName}と${fundB.shortName}の商品構造比較`}>
      <div className="tm-comparison-map__heading">
        <span>ひと目で見る違い</span>
        <strong>投資先の広さと費用を、先に分けて確認</strong>
      </div>
      <div className="tm-comparison-figure__fund">
        <span>商品 A</span>
        <strong>{fundA.shortName}</strong>
        {isWorldVsNasdaq && fundA.id === "orcan" ? (
          <div className="tm-market-map tm-market-map--world" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
            <span>世界へ広く</span>
          </div>
        ) : isWorldVsNasdaq && fundA.id === "nasdaq100" ? (
          <div className="tm-market-map tm-market-map--focused" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
            <span>大型株へ集中</span>
          </div>
        ) : <div className="tm-comparison-map__scope" aria-hidden="true"><Globe2 /></div>}
        <p>{focus[fundA.id] ?? fundA.description}</p>
        <dl>
          <div><dt>構成</dt><dd>{fundA.shareCount}</dd></div>
          <div><dt>費用</dt><dd>{formatExpenseRatio(fundA.id)}</dd></div>
        </dl>
      </div>
      <div className="tm-comparison-figure__axis" aria-hidden="true">
        <GitCompareArrows />
        <span>違いを分ける</span>
      </div>
      <div className="tm-comparison-figure__fund">
        <span>商品 B</span>
        <strong>{fundB.shortName}</strong>
        {isWorldVsNasdaq && fundB.id === "orcan" ? (
          <div className="tm-market-map tm-market-map--world" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
            <span>世界へ広く</span>
          </div>
        ) : isWorldVsNasdaq && fundB.id === "nasdaq100" ? (
          <div className="tm-market-map tm-market-map--focused" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
            <span>大型株へ集中</span>
          </div>
        ) : <div className="tm-comparison-map__scope tm-comparison-map__scope--focused" aria-hidden="true"><Target /></div>}
        <p>{focus[fundB.id] ?? fundB.description}</p>
        <dl>
          <div><dt>構成</dt><dd>{fundB.shareCount}</dd></div>
          <div><dt>費用</dt><dd>{formatExpenseRatio(fundB.id)}</dd></div>
        </dl>
      </div>
      <figcaption>構成数だけで分散効果は決まりません。投資対象を確認したうえで、評価額の差は共通条件の比較ページで確かめます。</figcaption>
    </figure>
  );
}

function KodomoAgeTimeline() {
  const ages = [0, 5, 10, 15];
  return (
    <figure className="tm-age-timeline" aria-labelledby="kodomo-age-timeline-title">
      <div className="tm-diagram-heading">
        <span>月1万円の元本だけを比較</span>
        <h2 id="kodomo-age-timeline-title">開始年齢で、18歳までの時間が変わる</h2>
      </div>
      <div className="tm-age-timeline__scale" aria-hidden="true"><span>0歳</span><span>6歳</span><span>12歳</span><span>18歳</span></div>
      <ol>
        {ages.map((age) => {
          const months = (KODOMO_NISA_LIMITS.adultTransitionAge - age) * 12;
          const principal = months * 10_000;
          return (
            <li key={age}>
              <strong>{age}歳から</strong>
              <span className="tm-age-timeline__track" aria-hidden="true"><i style={{ width: `${((18 - age) / 18) * 100}%` }} /></span>
              <span><b>{months}回</b><small>元本 {formatManEn(principal)}</small></span>
            </li>
          );
        })}
      </ol>
      <div className="tm-age-timeline__risk"><ShieldCheck aria-hidden="true" /><span>長く積み立てても利益は確定しません。教育費を使う時期と元本割れを一緒に確認します。</span></div>
      <figcaption>棒の長さは18歳までの積立期間です。運用益を示すグラフではありません。</figcaption>
    </figure>
  );
}

function ParentChildNisaMap() {
  return (
    <figure className="tm-account-map" aria-labelledby="parent-child-map-title">
      <div className="tm-diagram-heading">
        <span>枠の大きさより、名義と目的</span>
        <h2 id="parent-child-map-title">同じ教育費でも、お金の持ち主が違う</h2>
      </div>
      <div className="tm-account-map__question"><span>まず確認</span><strong>誰のお金？<br />いつ使う？</strong></div>
      <div className="tm-account-map__branches" aria-label="親のNISAとこどもNISAの違い">
        <section>
          <div className="tm-account-map__person"><Users aria-hidden="true" /><span>親</span></div>
          <h3>親のNISA</h3>
          <p>親名義で管理</p>
          <strong>年 {formatManEn(NISA_LIMITS.tsumitateAnnual)}</strong>
          <small>家計全体・老後資金など</small>
        </section>
        <section>
          <div className="tm-account-map__person tm-account-map__person--child"><Baby aria-hidden="true" /><span>子</span></div>
          <h3>こどもNISA</h3>
          <p>子ども名義で管理</p>
          <strong>年 {formatManEn(KODOMO_NISA_LIMITS.annual)}</strong>
          <small>教育費など子どもの目的</small>
        </section>
      </div>
      <div className="tm-account-map__notice"><GitCompareArrows aria-hidden="true" /><span>NISAの非課税と、親から子への贈与税は別の制度です。</span></div>
      <figcaption>払出し条件と資金の帰属を確認してから、利用する口座を分けます。</figcaption>
    </figure>
  );
}

function getGuideVisualMode(slug: string) {
  if (/vs-|chigai|wariate|kouza/.test(slug)) return "compare";
  if (/nansnen|ikou|torikuzushi|shuuryou|henkou|kakuteishinkoku|how-to-start|tsumitate-ikura/.test(slug)) return "timeline";
  if (/booraku|shippai|yameta|zeikin|koujo|tsukaikitta|necessary/.test(slug)) return "risk";
  return "path";
}

export function GuidePointVisual({ slug, points }: { slug: string; points: { title: string; body: string }[] }) {
  const mode = getGuideVisualMode(slug);
  const settings = {
    compare: { label: "違いを並べて確認", title: "判断するときの3つの軸", icons: [GitCompareArrows, Target, ShieldCheck] },
    timeline: { label: "時間の流れで見る", title: "今から次の行動までを整理", icons: [CalendarDays, LineChart, Signpost] },
    risk: { label: "先に知る注意点", title: "迷いやすいポイントを分けて確認", icons: [ShieldCheck, LineChart, Signpost] },
    path: { label: "迷わないための3つの確認", title: "この記事の要点を、順番に整理", icons: [Signpost, LineChart, ShieldCheck] },
  }[mode];
  return (
    <figure className={`tm-guide-point-map tm-guide-point-map--${mode}`} aria-labelledby={`guide-point-map-${slug}`}>
      <div className="tm-guide-point-map__heading">
        <span>{settings.label}</span>
        <h2 id={`guide-point-map-${slug}`}>{settings.title}</h2>
      </div>
      <ol aria-label={settings.title}>
        {points.slice(0, 3).map((point, index) => {
          const Icon = settings.icons[index] ?? ShieldCheck;
          return (
            <li key={point.title}>
              <span className="tm-guide-point-map__icon" aria-hidden="true"><Icon /></span>
              <span className="tm-guide-point-map__step">0{index + 1}</span>
              <strong>{point.title}</strong>
              <div className="tm-guide-point-map__copy">
                {point.body.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption>{mode === "compare" ? "3つの軸を別々に見ると、似ている点と異なる点を混同せずに読めます。" : mode === "timeline" ? "順番にたどると、今確認することと将来の手続を分けて読めます。" : mode === "risk" ? "不安を結論にせず、事実・条件・次の確認へ分けて読みます。" : "上から順に確認すると、制度・数字・注意点を混ぜずに読めます。"}</figcaption>
    </figure>
  );
}

const KODOMO_VISUALS: Record<string, {
  label: string;
  title: string;
  items: { title: string; detail: string; icon: LucideIcon }[];
}> = {
  "kodomo-nisa": {
    label: "制度の全体像",
    title: `${KODOMO_NISA_LIMITS.startYear}年から、子どもの名義で長期の積立を考える制度`,
    items: [
      { title: "子どもの名義", detail: `${KODOMO_NISA_LIMITS.minAge}〜${KODOMO_NISA_LIMITS.maxAge}歳が対象`, icon: Baby },
      { title: "年間の投資枠", detail: formatManEn(KODOMO_NISA_LIMITS.annual), icon: PiggyBank },
      { title: "使う時期も確認", detail: "払出し条件と価格変動を先に確認", icon: GraduationCap },
    ],
  },
  "kodomo-nisa-tsumitate-ikura": {
    label: "月額の決め方",
    title: "使う時期から逆算し、続けられる金額を決める",
    items: [
      { title: "毎月の金額", detail: "家計に無理のない範囲を確認", icon: WalletCards },
      { title: "積立できる月数", detail: "始める年齢で元本が変わる", icon: CalendarDays },
      { title: "元本と値動き", detail: "将来試算は仮定として分けて読む", icon: LineChart },
    ],
  },
  "kodomo-nisa-orukan-vs-sp500": {
    label: "投資対象の違い",
    title: "全世界と米国大型株を、同じ条件で比べる",
    items: [
      { title: "オルカン", detail: `${FUNDS.orcan.shareCount}・世界へ分散`, icon: Globe2 },
      { title: "共通する部分", detail: "米国の大型企業を多く含む", icon: GitCompareArrows },
      { title: "S&P500", detail: `${FUNDS.sp500.shareCount}・米国大型株`, icon: LineChart },
    ],
  },
  "kodomo-nisa-vs-gakushi-hoken": {
    label: "準備方法の違い",
    title: "値動き・保障・使う時期を分けて考える",
    items: [
      { title: "NISA", detail: "価格変動があり、元本割れもある", icon: LineChart },
      { title: "共通の目的", detail: "教育費を必要な時期まで準備", icon: School },
      { title: "学資保険", detail: "保障内容と受取条件を契約で確認", icon: ShieldCheck },
    ],
  },
  "kodomo-nisa-hikidashi": {
    label: "払出しの確認",
    title: "年齢・目的・手続を、使う前に確認する",
    items: [
      { title: "積立中", detail: "価格変動を見ながら長期で準備", icon: PiggyBank },
      { title: "払出し条件", detail: "制度と金融機関の案内を確認", icon: CalendarDays },
      { title: "使用時", detail: "教育費など目的に合わせて現金化", icon: GraduationCap },
    ],
  },
  "kodomo-nisa-daigaku-shikin-deguchi": {
    label: "大学資金の出口",
    title: "必要な直前まで投資を続ける前提にしない",
    items: [
      { title: "数年前", detail: "必要額と時期を洗い出す", icon: CalendarDays },
      { title: "段階的に", detail: "使う分を現金へ移す考え方", icon: Banknote },
      { title: "入学時", detail: "相場にかかわらず必要な支出へ", icon: GraduationCap },
    ],
  },
  "kodomo-nisa-nansai-kara": {
    label: "始める年齢",
    title: "年齢ではなく、18歳までの残り月数から考える",
    items: [
      { title: "今の年齢", detail: "残りの積立期間を確認", icon: Baby },
      { title: "毎月の元本", detail: "月額×積立回数で整理", icon: Coins },
      { title: "使う時期", detail: "元本割れに備える余裕も確認", icon: School },
    ],
  },
  "kodomo-nisa-oya-nisa-tsukaiwake": {
    label: "親子口座の使い分け",
    title: "名義・目的・払出し条件を混ぜずに整理する",
    items: [
      { title: "親のNISA", detail: "親名義・家計全体の目的", icon: Users },
      { title: "目的を分ける", detail: "誰のお金を何に使うか確認", icon: GitCompareArrows },
      { title: "こどもNISA", detail: "子ども名義・制度条件を確認", icon: Baby },
    ],
  },
};

export function GuideConceptVisual({ slug }: { slug: string }) {
  if (slug === "kodomo-nisa-nansai-kara") return <KodomoAgeTimeline />;
  if (slug === "kodomo-nisa-oya-nisa-tsukaiwake") return <ParentChildNisaMap />;
  const visual = KODOMO_VISUALS[slug];
  if (!visual) return null;
  const variant = slug === "kodomo-nisa"
    ? "system"
    : slug === "kodomo-nisa-tsumitate-ikura"
      ? "budget"
      : slug === "kodomo-nisa-orukan-vs-sp500" || slug === "kodomo-nisa-vs-gakushi-hoken"
        ? "compare"
        : "timeline";
  return (
    <figure className={`tm-concept-figure tm-concept-figure--${variant}`} aria-labelledby={`visual-${slug}`}>
      <div className="tm-concept-figure__heading">
        <span>{visual.label}</span>
        <h2 id={`visual-${slug}`}>{visual.title}</h2>
      </div>
      <div className="tm-concept-figure__items">
        {visual.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="tm-concept-figure__item">
              <div className="tm-concept-figure__icon" aria-hidden="true"><Icon /></div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              {index < visual.items.length - 1 && <span className="tm-concept-figure__connector" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>
      <figcaption>図の内容は本文で詳しく説明しています。制度条件は公式情報の更新に合わせて表示します。</figcaption>
    </figure>
  );
}
