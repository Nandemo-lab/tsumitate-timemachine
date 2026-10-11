import { FundId } from "@/types";
import { FUNDS } from "@/lib/funds";

export interface RankingFundEntry {
  fundId: FundId;
  fundSlug?: string;    // /fund/[slug] (undefined = no fund page exists)
  yearSlug?: string;    // /[yearSlug]/2020 (year page slug)
  rank: number;
  badge: string;        // 🥇🥈🥉 or "4位"
  highlight: string;    // このランキングでの推薦理由（1行）
  pros: string[];       // メリット（2〜3点）
  cons: string[];       // 注意点（1〜2点）
  metric: string;       // このランキングの評価軸ラベル
  metricValue: string;  // 評価値の文字列表現
}

export interface RankingCriteria {
  label: string;
  description: string;
}

export interface RankingFaq {
  q: string;
  a: string;
}

export interface RankingPageData {
  slug: string;         // "" | "nisa" | "beginner" | "high-return" | "high-dividend"
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  criteria: RankingCriteria[];
  funds: RankingFundEntry[];
  faqs: RankingFaq[];
  relatedCompareSlugs: string[];
  relatedRankingSlugs: string[]; // 関連ランキングページ
  // シミュレーション基準（全カード共通）
  simYear: number;
  simMonth: number;
  simAmount: number;
}

export const RANKING_PAGES: RankingPageData[] = [
  // ─── 総合ランキング (/ranking) ──────────────────────────────────────
  {
    slug: "",
    metaTitle: "インデックスファンド積立ランキング｜リターン・コスト・リスクで比較",
    metaDescription:
      "オルカン・S&P500・NASDAQ100などを、同じ開始月・月額・終了月の期間末評価額で比較。順位の対象・除外理由と商品属性も確認できます。",
    h1: "インデックスファンド積立ランキング",
    intro:
      "オルカン・S&P500・NASDAQ100などを、同じ開始月・月額・終了月で積み立てた期間末評価額の順に確認します。順位とは別に、投資対象・商品形式・費用を整理し、条件を変えて再検証できるようにしています。",
    criteria: [
      { label: "数値順位", description: "同じ条件で計算した期間末評価額（円単位・丸め前）の高い順" },
      { label: "データ品質", description: "期間全体を計算できるA品質系列だけを数値順位に使用" },
      { label: "投資対象", description: "地域・銘柄範囲・商品形式は順位とは分けて確認" },
      { label: "費用", description: "信託報酬・経費率は商品詳細のSSOTから表示" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 1, badge: "🥇",
        highlight: "米国大型株を対象とする低コスト投資信託。下の実績順位は同一条件の評価額で計算",
        pros: ["米国大型株500社へ分散", "低コスト", "新NISAのつみたて投資枠に対応"],
        cons: ["米国集中リスク（円高時は評価額が下がる）"],
        metric: "総合スコア", metricValue: "★★★★★",
      },
      {
        fundId: "orcan", fundSlug: "orukan", yearSlug: "orukan", rank: 2, badge: "🥈",
        highlight: "全世界株式へ分散する低コスト投資信託。米国集中商品との投資範囲の差を確認",
        pros: ["全世界株式を対象", "低コスト", "1本で複数地域へ分散"],
        cons: ["国別構成は均等ではない"],
        metric: "総合スコア", metricValue: "★★★★☆",
      },
      {
        fundId: "nasdaq100", fundSlug: "nasdaq100", yearSlug: "nasdaq100", rank: 3, badge: "🥉",
        highlight: "米国の大型非金融企業を対象とする商品。集中度と値動きを確認",
        pros: ["米国の非金融大型株100社が対象", "Apple・Microsoft・NVIDIAなどテック大手の比率が高い"],
        cons: ["特定セクターの構成比が高くなり得る", "暦年リターンと最大下落率は別指標"],
        metric: "総合スコア", metricValue: "★★★★☆",
      },
      {
        fundId: "schd", fundSlug: "schd", yearSlug: undefined, rank: 4, badge: "4位",
        highlight: "米国の配当株を選別するETF。参考系列のため数値順位の対象外",
        pros: ["Dow Jones U.S. Dividend 100 Indexへの連動を目指す", "四半期分配を行うETF"],
        cons: ["G品質・原典未検証の参考系列", "A品質商品との実績優劣には使用しない"],
        metric: "総合スコア", metricValue: "★★★☆☆",
      },
      {
        fundId: "vym", fundSlug: "vym", yearSlug: undefined, rank: 5, badge: "5位",
        highlight: "米国の高配当株を対象とするETF。分配方針と値動きは別々に確認",
        pros: ["広い米国高配当株を対象", "四半期分配を行うETF"],
        cons: ["成長株より値上がり益が小さい"],
        metric: "総合スコア", metricValue: "★★★☆☆",
      },
      {
        fundId: "vti", fundSlug: "vti", yearSlug: undefined, rank: 6, badge: "6位",
        highlight: "米国株式市場を大型株から小型株まで対象とするETF",
        pros: [`米国${FUNDS.vti.shareCount}に分散`, "経費率が低い"],
        cons: ["NISA成長投資枠のみ対応（つみたて投資枠非対応）"],
        metric: "総合スコア", metricValue: "★★★☆☆",
      },
    ],
    faqs: [
      { q: "総合順位はどのような基準ですか？", a: "分散範囲、コスト、NISA対応、商品形式などの編集基準で整理しています。商品設定前を含む長期実績や、検証期間の異なるリターンを順位根拠にはしていません。" },
      { q: "オルカンとS&P500は何を比べますか？", a: "投資対象地域、国別構成、費用、設定日を確認します。このページの数値順位は一つの過去期間の積立結果で、将来の優劣や適性を示すものではありません。" },
      { q: "このランキングの数値順位はどのように計算しますか？", a: "2020年1月から2026年8月まで月初に3万円を積み立てた期間末評価額の高い順です。期間全体を計算できるA品質系列だけを対象とし、商品設定前や欠損月を補完しません。" },
      { q: "NASDAQ100の順位は何を意味しますか？", a: "同じ条件で計算した期間末評価額の位置を示します。値動きの大きさ、最大下落率、将来のリターンを含む総合評価ではありません。" },
      { q: "高配当ETFは順位に含まれますか？", a: "期間全体を計算できるA品質系列は同じ基準で順位付けします。SCHDはG品質・原典未検証のため順位外の参考情報とし、商品属性だけを確認できます。" },
    ],
    relatedCompareSlugs: ["orukan-vs-sp500", "sp500-vs-nasdaq100", "schd-vs-vym"],
    relatedRankingSlugs: ["nisa", "beginner", "high-return", "high-dividend"],
  },

  // ─── 新NISAランキング (/ranking/nisa) ─────────────────────────────
  {
    slug: "nisa",
    metaTitle: "新NISA銘柄ランキング｜つみたて投資枠対応・初心者向け",
    metaDescription:
      "新NISAで検討される代表商品について、制度上の取扱いと同一条件の過去積立結果を分けて確認できます。",
    h1: "新NISA銘柄ランキング",
    intro:
      "新NISAで検討される代表商品を、制度上の取扱いと同一条件の過去積立結果に分けて確認します。対象枠は商品ごとに異なるため、金融庁・運用会社・証券会社の最新情報も確認してください。",
    criteria: [
      { label: "NISA対応",     description: "つみたて投資枠/成長投資枠での購入可否" },
      { label: "初心者適性",   description: "始めやすさ・管理のシンプルさ・情報量" },
      { label: "実績期間", description: "商品設定後の検証済み月次系列で計算できる期間" },
      { label: "コスト",       description: "信託報酬（年率）の低さ" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "orcan", fundSlug: "orukan", yearSlug: "orukan", rank: 1, badge: "🥇",
        highlight: "全世界株式へ分散する投資信託。対象枠は金融庁・運用会社の最新情報で確認",
        pros: ["つみたて投資枠・成長投資枠の対象商品", "全世界株式を対象", "1本で複数地域へ分散"],
        cons: ["国別構成は均等ではない"],
        metric: "NISA適性", metricValue: "★★★★★",
      },
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 2, badge: "🥈",
        highlight: "米国大型株へ集中する投資信託。全世界型との対象地域の差を確認",
        pros: ["つみたて投資枠・成長投資枠の両方に対応", "米国大型株500社へ投資", "低コスト"],
        cons: ["米国集中リスク・為替リスク"],
        metric: "NISA適性", metricValue: "★★★★☆",
      },
      {
        fundId: "nasdaq100", fundSlug: "nasdaq100", yearSlug: "nasdaq100", rank: 3, badge: "🥉",
        highlight: "米国大型非金融株を対象とする商品。商品ごとのNISA対象区分を確認",
        pros: ["米国大型非金融企業を対象", "NISA対象区分は商品ごとに確認"],
        cons: ["特定セクターの構成比が高くなり得る"],
        metric: "NISA適性", metricValue: "★★★☆☆",
      },
      {
        fundId: "schd", fundSlug: "schd", yearSlug: undefined, rank: 4, badge: "4位",
        highlight: "米国ETFとして増配株へ投資する選択肢。取扱条件は証券会社で確認",
        pros: ["増配株に絞った配当成長戦略", "米国ETF SCHDとして約100銘柄へ分散"],
        cons: ["G：参考データ・原典未検証", "SCHD連動国内投信とは別商品"],
        metric: "NISA適性", metricValue: "★★★☆☆",
      },
    ],
    faqs: [
      { q: "新NISAでオルカンとS&P500を比べる観点は？", a: "NISA対象区分に加え、投資対象地域、国別構成、費用、設定日を比べます。過去の期間末評価額だけで商品選択を決めることはできません。" },
      { q: "NASDAQ100は新NISAのつみたて投資枠で買えますか？", a: "商品によります。eMAXIS NASDAQ100インデックスはつみたて投資枠対象外の場合があります。成長投資枠なら多くのNASDAQ100ファンドを購入できます。iFreeNEXT NASDAQ100インデックスなど、つみたて投資枠対象商品を選ぶ必要があります。" },
      { q: "新NISAは損失が出た場合に損益通算できますか？", a: "NISA口座内の損失は課税口座の利益と損益通算できません。非課税という利点と、損失を税務上利用できない点を分けて確認します。" },
      { q: "SCHDが数値順位の対象外なのはなぜですか？", a: "当サイトのSCHD月次系列はG品質・原典未検証の参考系列だからです。商品属性は表示しますが、A品質商品の検証済み実績と同じ数値順位には含めません。" },
    ],
    relatedCompareSlugs: ["orukan-vs-sp500", "sp500-vs-nasdaq100", "schd-vs-sp500"],
    relatedRankingSlugs: ["", "beginner", "high-return"],
  },

  // ─── 初心者ランキング (/ranking/beginner) ─────────────────────────
  {
    slug: "beginner",
    metaTitle: "初心者向け積立投資ランキング｜銘柄の比較基準を解説",
    metaDescription:
      "積立候補として挙がる代表商品を、投資対象・商品形式・費用と同一条件の過去積立結果に分けて比較します。",
    h1: "初心者向け積立投資ランキング",
    intro:
      "初めて商品を比較するときに確認したい、投資対象、商品形式、費用、NISA対象区分と、同一条件の過去積立結果を分けて整理します。数値順位は初心者への推奨順ではありません。",
    criteria: [
      { label: "始めやすさ",   description: "口座開設・積立設定のシンプルさ・情報量の豊富さ" },
      { label: "分散性",       description: "投資先の地域・銘柄数の広さ。初心者ほど分散が重要" },
      { label: "リスクの低さ", description: "価格変動の小ささ。初心者は変動が少ない方が継続しやすい" },
      { label: "コスト",       description: "信託報酬の低さ。長期では大きな差になる" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "orcan", fundSlug: "orukan", yearSlug: "orukan", rank: 1, badge: "🥇",
        highlight: "全世界株式へ1本で分散する投資信託。費用・設定日・対象地域を確認",
        pros: ["1本で全世界株式を対象", "複数地域へ分散", "国内投信として積立設定が可能"],
        cons: ["米国が6割超を占め、完全な均等分散ではない"],
        metric: "初心者適性", metricValue: "★★★★★",
      },
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 2, badge: "🥈",
        highlight: "米国大型株を対象とする国内投信。全世界型との地域差を確認",
        pros: ["米国代表企業500社に分散で理解しやすい", "過去実績・情報量ともに豊富", "NISA完全対応"],
        cons: ["米国への集中リスク", "為替リスクがある"],
        metric: "初心者適性", metricValue: "★★★★☆",
      },
      {
        fundId: "vt", fundSlug: undefined, yearSlug: undefined, rank: 3, badge: "🥉",
        highlight: "ETF好き・SBI証券ユーザーなら選択肢になるバンガードの全世界ETF",
        pros: [`全世界の${FUNDS.vt.shareCount}を対象`, "米国上場ETFとして取引"],
        cons: ["NISA成長投資枠のみ（つみたて投資枠非対応）", "投資信託より手間がかかる"],
        metric: "初心者適性", metricValue: "★★★☆☆",
      },
      {
        fundId: "vti", fundSlug: "vti", yearSlug: undefined, rank: 4, badge: "4位",
        highlight: "米国市場全体をS&P500より広くカバー。中小型株も含む",
        pros: [`米国${FUNDS.vti.shareCount}に分散`, "経費率が低い"],
        cons: ["つみたて投資枠非対応", "S&P500との差分は限定的で選ぶ理由が少ない"],
        metric: "初心者適性", metricValue: "★★★☆☆",
      },
    ],
    faqs: [
      { q: "初めて商品を比べるときは何を確認しますか？", a: "生活費とは分けた資金であることを確認し、投資対象、費用、設定日、NISA対象区分、許容できる値動きを商品ごとに比較します。手続きと取扱商品は利用する金融機関で確認してください。" },
      { q: "オルカンを候補にする前に何を確認しますか？", a: "全世界株式へ分散する一方、各国を均等保有する商品ではありません。正式商品、費用、設定日、国別構成、NISA対象区分を確認し、米国集中商品との違いを整理します。" },
      { q: "VTとVTIの違いは何ですか？", a: `VTは全世界の${FUNDS.vt.shareCount}、VTIは米国の${FUNDS.vti.shareCount}を対象とするETFです。投資対象地域と、NISAで利用できる枠を確認して比較します。` },
      { q: "初心者はいくらから積み立てればいいですか？", a: "月1,000〜10,000円から始める人が多いです。重要なのは金額より「継続できること」と「早く始めること」です。生活費・緊急資金（生活費3ヶ月分）を確保した上で、無理のない金額を自動積立に設定するケースが一般的です。" },
      { q: "値動きの大きい商品を比べるときの注意点は？", a: "レバレッジ、集中度、費用、価格変動、投資対象を確認します。名称や一期間の順位だけでなく、損失を許容できる範囲と資金を使う時期を先に整理します。" },
    ],
    relatedCompareSlugs: ["orukan-vs-sp500", "vti-vs-orukan", "vt-vs-orukan"],
    relatedRankingSlugs: ["", "nisa", "high-return"],
  },

  // ─── リターン重視ランキング (/ranking/high-return) ─────────────────
  {
    slug: "high-return",
    metaTitle: "リターン重視の積立ランキング｜NASDAQ100・FANG+・S&P500比較",
    metaDescription:
      "高リターンを狙う投資家向けランキング。NASDAQ100・FANG+・S&P500を過去実績・リターン率で比較→今すぐ確認",
    h1: "リターン重視の積立ランキング",
    intro:
      "「できるだけ高いリターンを狙いたい」というリスク許容度の高い投資家向けに、過去のリターン実績を中心に評価したランキングです。高リターンは高リスクとセットであることを理解した上でご参照ください。",
    criteria: [
      { label: "期間末評価額",   description: "同じ開始月・月額・終了月で計算した過去の積立評価額" },
      { label: "成長セクター集中", description: "AI・テック・成長企業への集中度" },
      { label: "実績期間",       description: "正式商品の設定後に検証できる月次系列の範囲" },
      { label: "NISA対応",      description: "NISAでの非課税メリットを活かせるか" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "fangplus", fundSlug: "fangplus", yearSlug: undefined, rank: 1, badge: "🥇",
        highlight: "少数の大型企業へ集中する商品。構成銘柄数と入替ルールを確認",
        pros: ["大型企業10銘柄へ集中", "四半期ごとに等金額へリバランスする指数設計"],
        cons: ["10銘柄への集中度が高い", "構成銘柄の値動きが結果へ強く影響する"],
        metric: "過去のリターン水準", metricValue: "★★★★★",
      },
      {
        fundId: "nasdaq100", fundSlug: "nasdaq100", yearSlug: "nasdaq100", rank: 2, badge: "🥈",
        highlight: "米国の大型非金融企業100銘柄を対象。FANG+との集中度の差を確認",
        pros: ["米国NASDAQ市場の大型非金融企業100銘柄で構成", "FANG+より構成銘柄数が多い"],
        cons: ["特定セクターの構成比が高くなり得る", "暦年リターンと最大下落率は別指標"],
        metric: "過去のリターン水準", metricValue: "★★★★☆",
      },
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 3, badge: "🥉",
        highlight: "米国大型株を対象。NASDAQ100・FANG+との構成範囲の差を確認",
        pros: ["米国大型株500社を対象", "国内投信として積立設定が可能"],
        cons: ["米国株式へ投資対象が集中する"],
        metric: "過去のリターン水準", metricValue: "★★★★☆",
      },
    ],
    faqs: [
      { q: "NASDAQ100とFANG+の過去結果はどう比べますか？", a: "同じ開始月・月額・終了月にそろえた期間末評価額で比較します。NASDAQ100とFANG+は構成銘柄数と指数設計が異なり、特定期間の順位を将来の優劣には使えません。" },
      { q: "高リターンファンドはいつ始めればいいですか？", a: "定額積立（ドルコスト平均法）は購入時期を分散する方法の一つです。高リターン・高リスクの商品は値動きが大きいため、リスク許容度と余裕資金を確認した上で、購入時期や金額を判断する必要があります。" },
      { q: "NASDAQ100は新NISAで買えますか？", a: "成長投資枠では多くのNASDAQ100ファンドを購入できます。つみたて投資枠は商品によって対応・非対応があります。iFreeNEXT NASDAQ100インデックスなど、つみたて投資枠対応商品を選ぶことも可能です。" },
      { q: "集中度はどこで確認しますか？", a: "構成銘柄数、上位銘柄比率、対象セクター、指数の入替方法を確認します。具体的な配分は一期間の順位では決めず、資金を使う時期と許容できる値動きに照らして判断します。" },
      { q: "下落時は数値順位をどう読みますか？", a: "順位は2020年開始から2026年8月までの一つの経路です。積立停止・保有継続・売却は、生活資金と資金を使う時期を確認して別々に判断します。過去の順位から回復時期は予測できません。" },
    ],
    relatedCompareSlugs: ["sp500-vs-nasdaq100", "nasdaq100-vs-fangplus"],
    relatedRankingSlugs: ["", "nisa", "beginner"],
  },

  // ─── 高配当ランキング (/ranking/high-dividend) ─────────────────────
  {
    slug: "high-dividend",
    metaTitle: "高配当ETFランキング｜SCHD vs VYMの配当・積立実績を比較",
    metaDescription:
      "米国ETF SCHDとVYMを配当方針・銘柄分散・コストで比較。データ品質の違いも明示して、高配当ETFを選ぶ判断材料を整理します。",
    h1: "高配当ETFランキング｜SCHD vs VYM",
    intro:
      "米国高配当ETFを、公式に確認できる指数設計・分配方針・費用と、同一条件の参考積立結果に分けて確認します。SCHDの月次系列はG品質のため、検証済み商品の実績と同じ順位には使用しません。",
    criteria: [
      { label: "配当利回り",   description: "公表される年間配当利回り（時点により変動）" },
      { label: "配当成長率",   description: "年間の配当増加率。配当が毎年増えるかどうか" },
      { label: "安定性",       description: "配当の継続性・減配リスクの低さ" },
      { label: "コスト",       description: "信託報酬の低さ。配当収入を減らさないため重要" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "schd", fundSlug: "schd", yearSlug: undefined, rank: 1, badge: "🥇",
        highlight: "米国の配当株を選別するETF。指数設計と分配方針を確認",
        pros: ["増配実績を持つ財務優良企業に絞込", "Dow Jones U.S. Dividend 100 Indexへの連動を目指す", "米国ETFの経費率は0.060%"],
        cons: ["VYMより銘柄数が少ない（約100銘柄）", "G：参考データ・原典未検証"],
        metric: "配当品質", metricValue: "★★★★★",
      },
      {
        fundId: "vym", fundSlug: "vym", yearSlug: undefined, rank: 2, badge: "🥈",
        highlight: "米国高配当株を広く対象とするETF。分配実績と価格変動を分けて確認",
        pros: ["米国高配当株を幅広く対象", "四半期分配を行うETF", "経費率が低い"],
        cons: ["つみたて投資枠非対応", "分配利回りは時点により変動"],
        metric: "配当品質", metricValue: "★★★★☆",
      },
    ],
    faqs: [
      { q: "SCHDとVYMの分配をどう比較しますか？", a: "基準日をそろえた分配利回り、分配履歴、指数の選定方法、経費率を公式資料で確認します。当サイトのSCHDリターン系列はG品質のため、検証済みVYM実績との優劣判定には使用しません。" },
      { q: "高配当ETFは新NISAで買えますか？", a: "米国ETFは成長投資枠で扱われる場合がありますが、商品・証券会社ごとの対象可否と外国税の取扱いを最新の公式情報で確認してください。つみたて投資枠の商品とは別に扱います。" },
      { q: "高配当ETFと広範な株価指数をどう比べますか？", a: "指数の選定方法、投資対象、分配方針、費用を分けて確認します。組み合わせ比率や投資順序は、このページの過去順位からは決められません。" },
      { q: "高配当ETFを取り崩し期に使うときの確認点は？", a: "分配だけでなく価格変動、税金、為替、分配額の変動、必要な生活費を確認します。資産を売却しないことや将来の分配額は保証されません。" },
      { q: "米国ETF SCHDと楽天SCHDは同じ商品ですか？", a: "別商品です。当ページのSCHDはSchwab U.S. Dividend Equity ETFを指します。楽天SCHDは米国ETF SCHDを主要投資対象とする国内投信で、通貨・費用・取扱い・税務が異なります。" },
    ],
    relatedCompareSlugs: ["schd-vs-vym", "schd-vs-sp500"],
    relatedRankingSlugs: ["", "nisa", "beginner"],
  },
];

export function getRankingPage(slug: string): RankingPageData | undefined {
  return RANKING_PAGES.find((p) => p.slug === slug);
}

// カテゴリスラッグ一覧（/ranking/[category] 用）
export const RANKING_CATEGORY_SLUGS = ["nisa", "beginner", "high-return", "high-dividend"] as const;

export const RANKING_LABELS: Record<string, string> = {
  "":               "総合ランキング",
  "nisa":           "新NISAおすすめ",
  "beginner":       "初心者向け",
  "high-return":    "リターン重視",
  "high-dividend":  "高配当",
};
