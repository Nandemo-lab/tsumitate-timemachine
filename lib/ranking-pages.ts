import { FundId } from "@/types";

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
    metaTitle: "インデックスファンド総合ランキング【2024年】おすすめ銘柄比較",
    metaDescription:
      "オルカン・S&P500・NASDAQ100など人気インデックスファンドをリターン・リスク・コスト・分散性で総合評価。2020年からの実際の積立実績も掲載。",
    h1: "インデックスファンド総合ランキング【2024年版】",
    intro:
      "オルカン・S&P500・NASDAQ100・VYM・SCHDなど人気インデックスファンドをリターン・リスク・分散性・コストの4軸で総合評価しました。「どの銘柄を選べばいいか分からない」方はこのランキングを参考にしてください。",
    criteria: [
      { label: "リターン", description: "過去5年（2020〜2024年）の年率平均リターンを評価" },
      { label: "リスク",   description: "価格変動の大きさ（ボラティリティ）。低いほど高評価" },
      { label: "分散性",   description: "投資先銘柄数・地域の広がり。広いほど高評価" },
      { label: "コスト",   description: "信託報酬（年率）。低いほど長期で有利" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 1, badge: "🥇",
        highlight: "リターン・コスト・初心者フレンドリーの3拍子揃った最強の1本",
        pros: ["過去10年で最も安定した高リターン", "信託報酬0.09%と超低コスト", "新NISAのつみたて投資枠に対応"],
        cons: ["米国集中リスク（円高時は評価額が下がる）"],
        metric: "総合スコア", metricValue: "★★★★★",
      },
      {
        fundId: "orcan", fundSlug: "orukan", yearSlug: "orukan", rank: 2, badge: "🥈",
        highlight: "全世界分散で安心感No.1。新NISAで最も人気の1本",
        pros: ["全世界50ヵ国・約3,000銘柄に分散", "信託報酬0.058%と業界最安水準", "初心者スコア5/5"],
        cons: ["S&P500より過去リターンはやや低め"],
        metric: "総合スコア", metricValue: "★★★★☆",
      },
      {
        fundId: "nasdaq100", fundSlug: "nasdaq100", yearSlug: "nasdaq100", rank: 3, badge: "🥉",
        highlight: "AIテック成長の恩恵を最大化したい上級者向け",
        pros: ["過去10年で最高水準のリターン", "Apple・Microsoft・NVIDIAなどテック大手を集中保有"],
        cons: ["価格変動（リスク）が大きい", "2022年は−33%の暴落を経験"],
        metric: "総合スコア", metricValue: "★★★★☆",
      },
      {
        fundId: "schd", fundSlug: "schd", yearSlug: undefined, rank: 4, badge: "4位",
        highlight: "配当成長株に絞った高品質な高配当投資",
        pros: ["増配実績を持つ財務優良企業に集中", "VYMより高い配当成長率"],
        cons: ["配当重視のため成長株より値上がり益は小さい"],
        metric: "総合スコア", metricValue: "★★★☆☆",
      },
      {
        fundId: "vym", fundSlug: "vym", yearSlug: undefined, rank: 5, badge: "5位",
        highlight: "約3〜4%の安定配当で老後の収入源を作りたい方に",
        pros: ["年3〜4%の配当利回り", "景気悪化時にも底堅い値動き"],
        cons: ["成長株より値上がり益が小さい"],
        metric: "総合スコア", metricValue: "★★★☆☆",
      },
      {
        fundId: "vti", fundSlug: "vti", yearSlug: undefined, rank: 6, badge: "6位",
        highlight: "米国株全体を中小型株まで網羅したバンガードの傑作",
        pros: ["米国約3,700銘柄に分散", "信託報酬0.03%と超低コスト"],
        cons: ["NISA成長投資枠のみ対応（つみたて投資枠非対応）"],
        metric: "総合スコア", metricValue: "★★★☆☆",
      },
    ],
    faqs: [
      { q: "総合1位はなぜS&P500ですか？", a: "リターン・コスト・NISA対応・初心者フレンドリー度のバランスが優れているためです。過去10〜20年で最も安定した高リターンを出しており、新NISAのつみたて投資枠に対応し、信託報酬も0.09%と超低コストです。" },
      { q: "オルカンとS&P500はどちらを選べばいいですか？", a: "「分散を重視して安心感が欲しい」→オルカン、「多少集中リスクを取ってでも高リターンを狙いたい」→S&P500が基本の判断軸です。どちらも優れた選択肢であり、迷ったらまずどちらかを1本選んで始めることが大切です。" },
      { q: "このランキングの評価基準は？", a: "リターン（過去5年平均）・リスク（価格変動の大きさ）・分散性（銘柄数・地域）・コスト（信託報酬）の4軸を総合評価しています。特定の年のパフォーマンスだけでなく、長期的な投資に適しているかを重視しています。" },
      { q: "NASDAQ100は上位に入っていますか？", a: "3位にランクインしています。過去のリターンでは最高水準ですが、リスク（価格変動）が大きく初心者には向きにくいため、リターン・リスクのバランスを総合評価すると3位となっています。" },
      { q: "高配当ファンドはなぜ順位が低いですか？", a: "VYM・SCHDは「値上がり益」よりも「配当収入」を重視する銘柄で、総合的なトータルリターンはS&P500・オルカンに劣ります。老後の配当収入を目的とする方には適した選択肢ですが、資産最大化を目的とする場合は総合ランキングで下位になります。" },
    ],
    relatedCompareSlugs: ["orukan-vs-sp500", "sp500-vs-nasdaq100", "schd-vs-vym"],
    relatedRankingSlugs: ["nisa", "beginner", "high-return", "high-dividend"],
  },

  // ─── 新NISAランキング (/ranking/nisa) ─────────────────────────────
  {
    slug: "nisa",
    metaTitle: "新NISAおすすめランキング2024【つみたて投資枠対応・初心者向け】",
    metaDescription:
      "新NISAのつみたて投資枠・成長投資枠で買えるおすすめ銘柄ランキング。オルカン・S&P500・NASDAQ100・SCHDを実績・コスト・分散性で比較。",
    h1: "新NISAおすすめ銘柄ランキング【2024年版】つみたて・成長投資枠対応",
    intro:
      "新NISAで「何を買えばいいか」迷っている方のために、つみたて投資枠・成長投資枠で購入できる代表的な銘柄をランキング形式で比較。コスト・リターン・分散性・初心者フレンドリー度を総合評価しました。",
    criteria: [
      { label: "NISA対応",     description: "つみたて投資枠/成長投資枠での購入可否" },
      { label: "初心者適性",   description: "始めやすさ・管理のシンプルさ・情報量" },
      { label: "長期リターン", description: "10〜20年の長期保有に適したリターン特性" },
      { label: "コスト",       description: "信託報酬（年率）の低さ" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "orcan", fundSlug: "orukan", yearSlug: "orukan", rank: 1, badge: "🥇",
        highlight: "新NISA積立先No.1。全世界分散＋最安コスト＋つみたて投資枠対応の最強トリプル",
        pros: ["つみたて投資枠・成長投資枠の両方に対応", "信託報酬0.058%と業界最安水準", "1本で世界50ヵ国に分散投資"],
        cons: ["S&P500より過去リターンはわずかに低め"],
        metric: "NISA適性", metricValue: "★★★★★",
      },
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 2, badge: "🥈",
        highlight: "過去リターンでオルカンを上回る米国集中型。NISA完全対応",
        pros: ["つみたて投資枠・成長投資枠の両方に対応", "過去10年リターンでオルカンを上回る", "米国大型成長株中心で安定感あり"],
        cons: ["米国集中リスク・為替リスク"],
        metric: "NISA適性", metricValue: "★★★★☆",
      },
      {
        fundId: "nasdaq100", fundSlug: "nasdaq100", yearSlug: "nasdaq100", rank: 3, badge: "🥉",
        highlight: "高リターン狙いなら。ただしリスクを理解した上で",
        pros: ["AI・テック成長の恩恵を最大化", "つみたて/成長投資枠（商品による）対応"],
        cons: ["値動きが大きくリスク許容度が必要", "2022年は−33%の大幅下落を経験"],
        metric: "NISA適性", metricValue: "★★★☆☆",
      },
      {
        fundId: "schd", fundSlug: "schd", yearSlug: undefined, rank: 4, badge: "4位",
        highlight: "配当収入重視の方には最適。成長投資枠で購入可能",
        pros: ["増配株に絞った高品質な配当成長投資", "楽天SCHDとして投資信託形式で積立可能"],
        cons: ["成長株より値上がり益は限定的", "つみたて投資枠は対象外"],
        metric: "NISA適性", metricValue: "★★★☆☆",
      },
    ],
    faqs: [
      { q: "新NISAのつみたて投資枠でオルカンとS&P500どちらがいいですか？", a: "どちらも優れた選択肢です。「全世界分散で安心感が欲しい」→オルカン、「米国成長にフォーカスしてリターンを追求したい」→S&P500が一般的な判断基準です。迷ったら1本に決めてまず始めることが大切です。" },
      { q: "新NISAの非課税枠1,800万円はどう使えばいいですか？", a: "月10万円（年120万円）をつみたて投資枠でオルカン等を積立すると約15年で満額になります。残りの成長投資枠（年240万円）でETFや個別株を購入する組み合わせが人気です。" },
      { q: "NASDAQ100は新NISAのつみたて投資枠で買えますか？", a: "商品によります。eMAXIS NASDAQ100インデックスはつみたて投資枠対象外の場合があります。成長投資枠なら多くのNASDAQ100ファンドを購入できます。iFreeNEXT NASDAQ100インデックスなど、つみたて投資枠対象商品を選ぶ必要があります。" },
      { q: "新NISAは損失が出た場合に損益通算できますか？", a: "NISA口座の損失は他の口座と損益通算できません。これはNISAのデメリットですが、長期積立（10年以上）では歴史的に損失確率が大きく下がるため、長期投資を前提に利用するのが最善です。" },
      { q: "SCHDはなぜ新NISAランキングで4位なのですか？", a: "SCHDは配当収入目的には優れていますが、つみたて投資枠が使えず、長期的な資産最大化を目的とした場合はオルカン・S&P500に劣るためです。配当収入を重視する方にとってはNo.1の選択肢になり得ます。" },
    ],
    relatedCompareSlugs: ["orukan-vs-sp500", "sp500-vs-nasdaq100", "schd-vs-sp500"],
    relatedRankingSlugs: ["", "beginner", "high-return"],
  },

  // ─── 初心者ランキング (/ranking/beginner) ─────────────────────────
  {
    slug: "beginner",
    metaTitle: "初心者向け投資信託ランキング【2024年】失敗しない積立の選び方",
    metaDescription:
      "投資初心者におすすめの投資信託ランキング。オルカン・S&P500・VT・VTIを始めやすさ・分散性・リスクの低さで比較。NISAでの活用法も解説。",
    h1: "初心者向け投資信託ランキング【2024年版】失敗しない選び方",
    intro:
      "「投資を始めたいけど何を選べばいいか分からない」という初心者の方のために、始めやすさ・リスクの低さ・長期実績・コストを重視して厳選したランキングです。複雑な銘柄分析なしに始められる商品を紹介します。",
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
        highlight: "初心者に最も向いている1本。全世界分散＋最安コスト＋圧倒的な情報量",
        pros: ["初心者スコア5/5", "1本で世界全体に自動分散", "「とりあえずオルカン」が鉄板"],
        cons: ["米国が6割超を占め、完全な均等分散ではない"],
        metric: "初心者適性", metricValue: "★★★★★",
      },
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 2, badge: "🥈",
        highlight: "「米国経済の成長を信じる」なら迷わずこれ。初心者にも分かりやすい",
        pros: ["米国代表企業500社に分散で理解しやすい", "過去実績・情報量ともに豊富", "NISA完全対応"],
        cons: ["米国への集中リスク", "為替リスクがある"],
        metric: "初心者適性", metricValue: "★★★★☆",
      },
      {
        fundId: "vt", fundSlug: undefined, yearSlug: undefined, rank: 3, badge: "🥉",
        highlight: "ETF好き・SBI証券ユーザーなら選択肢になるバンガードの全世界ETF",
        pros: ["全世界9,000銘柄超と最も広い分散", "バンガード社の圧倒的な信頼性"],
        cons: ["NISA成長投資枠のみ（つみたて投資枠非対応）", "投資信託より手間がかかる"],
        metric: "初心者適性", metricValue: "★★★☆☆",
      },
      {
        fundId: "vti", fundSlug: "vti", yearSlug: undefined, rank: 4, badge: "4位",
        highlight: "米国市場全体をS&P500より広くカバー。中小型株も含む",
        pros: ["米国全体3,700銘柄に分散", "信託報酬0.03%と超低コスト"],
        cons: ["つみたて投資枠非対応", "S&P500との差分は限定的で選ぶ理由が少ない"],
        metric: "初心者適性", metricValue: "★★★☆☆",
      },
    ],
    faqs: [
      { q: "投資初心者は何から始めればいいですか？", a: "まずネット証券（SBI証券・楽天証券）でNISA口座を開設し、オルカンまたはS&P500を月1万円から積み立て設定するのが最もシンプルで失敗しにくいスタートです。証券会社のアプリから10分程度で設定できます。" },
      { q: "オルカンが初心者に最もおすすめな理由は？", a: "①1本で全世界に自動分散②信託報酬が業界最安②NISAに完全対応④情報量が多く勉強しやすい⑤残高No.1で安心感がある、という5つの理由から初心者に最適です。「どれを選べばいいか分からない」なら迷わずオルカンを選べばOKです。" },
      { q: "VTとVTIの違いは何ですか？", a: "VTは全世界9,000銘柄以上に投資する一方、VTIは米国のみ3,700銘柄が対象です。初心者には全世界に分散するVTの方がシンプルでリスク分散になります。ただしどちらもつみたて投資枠非対応のため、NISAをフル活用したいならオルカンの方が使いやすいです。" },
      { q: "初心者はいくらから積み立てればいいですか？", a: "月1,000〜10,000円から始めることをお勧めします。重要なのは金額より「継続できること」と「早く始めること」です。生活費・緊急資金（生活費3ヶ月分）を確保した上で、無理のない金額を自動積立に設定しましょう。" },
      { q: "投資初心者が避けるべき銘柄・手法は？", a: "①信託報酬が1%以上のアクティブファンド②レバレッジETF（2倍・3倍）③個別株の集中投資④FX・仮想通貨などのハイリスク商品は初心者には向きません。まずはインデックスファンドの積立投資から始めて知識を積むことが大切です。" },
    ],
    relatedCompareSlugs: ["orukan-vs-sp500", "vti-vs-orukan", "vt-vs-orukan"],
    relatedRankingSlugs: ["", "nisa", "high-return"],
  },

  // ─── リターン重視ランキング (/ranking/high-return) ─────────────────
  {
    slug: "high-return",
    metaTitle: "リターン重視おすすめ投資信託ランキング【2024年】NASDAQ100・FANG+比較",
    metaDescription:
      "高リターンを狙う投資家向けランキング。NASDAQ100・FANG+・S&P500を過去実績・リターン率で比較。新NISAでの活用法も解説。",
    h1: "リターン重視おすすめランキング【2024年版】NASDAQ100・FANG+・S&P500比較",
    intro:
      "「できるだけ高いリターンを狙いたい」というリスク許容度の高い投資家向けに、過去のリターン実績を中心に評価したランキングです。高リターンは高リスクとセットであることを理解した上でご参照ください。",
    criteria: [
      { label: "年率リターン",   description: "過去5〜10年の年率平均リターンの高さ" },
      { label: "成長セクター集中", description: "AI・テック・成長企業への集中度" },
      { label: "長期実績",       description: "10年以上の運用実績の安定性" },
      { label: "NISA対応",      description: "NISAでの非課税メリットを活かせるか" },
    ],
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    funds: [
      {
        fundId: "fangplus", fundSlug: "fangplus", yearSlug: undefined, rank: 1, badge: "🥇",
        highlight: "GAFAM+αのテック最強10銘柄に集中投資。最もアグレッシブな選択",
        pros: ["Apple・Microsoft・NVIDIA・Amazon等テック最強銘柄に集中", "過去のリターンはNASDAQ100を上回る局面も"],
        cons: ["わずか10銘柄への超集中投資でリスクが極めて大きい", "暴落時の下落幅が大きい", "初心者・リスク許容度低い方には不適切"],
        metric: "リターン期待値", metricValue: "★★★★★",
      },
      {
        fundId: "nasdaq100", fundSlug: "nasdaq100", yearSlug: "nasdaq100", rank: 2, badge: "🥈",
        highlight: "テック成長のリターンを幅広く取りに行く王道の高リターン選択",
        pros: ["過去20年の年率リターン約15%と高水準", "上位100銘柄への分散でFANG+より安定"],
        cons: ["2022年は−33%と大幅下落を経験", "テック株低迷期は大きく下がる"],
        metric: "リターン期待値", metricValue: "★★★★☆",
      },
      {
        fundId: "sp500", fundSlug: "sp500", yearSlug: "sp500", rank: 3, badge: "🥉",
        highlight: "500銘柄への分散でリスクを抑えながら高リターンを狙う",
        pros: ["年率約10%の長期実績（過去30年）", "500社分散でNASDAQ100より安定"],
        cons: ["NASDAQ100・FANG+より期待リターンは低め"],
        metric: "リターン期待値", metricValue: "★★★★☆",
      },
    ],
    faqs: [
      { q: "NASDAQ100とFANG+はどちらが高リターンですか？", a: "短期ではFANG+が上回る局面もありますが、長期（10年以上）ではNASDAQ100の方が安定して高リターンを出しています。FANG+は10銘柄への超集中投資のため値動きが極めて大きく、資産の大部分を投じるには高いリスク許容度が必要です。" },
      { q: "高リターンファンドはいつ始めればいいですか？", a: "定額積立（ドルコスト平均法）で今すぐ始めるのが基本です。高リターク・高リスク銘柄こそ、タイミングを読まずに毎月一定額を積み立てることで平均取得単価を平準化することが重要です。" },
      { q: "NASDAQ100は新NISAで買えますか？", a: "成長投資枠では多くのNASDAQ100ファンドを購入できます。つみたて投資枠は商品によって対応・非対応があります。iFreeNEXT NASDAQ100インデックスなど、つみたて投資枠対応商品を選ぶことも可能です。" },
      { q: "リターン重視でも分散は必要ですか？", a: "はい。FANG+のような超集中投資は特定銘柄の業績悪化で大きく下落するリスクがあります。「資産全体のうち一部（10〜30%）を高リターン・高リスク枠に配分し、残りはS&P500・オルカンで安定させる」という組み合わせが多くの投資家に採用されています。" },
      { q: "2022年のように暴落したらどうすればいいですか？", a: "定額積立を継続することが最善です。NASDAQ100は2022年に−33%下落しましたが、2023年には+55%で急回復しました。暴落時に売却すると損失が確定し回復の恩恵を受けられません。余裕資金で長期投資する前提で保有することが重要です。" },
    ],
    relatedCompareSlugs: ["sp500-vs-nasdaq100", "nasdaq100-vs-fangplus"],
    relatedRankingSlugs: ["", "nisa", "beginner"],
  },

  // ─── 高配当ランキング (/ranking/high-dividend) ─────────────────────
  {
    slug: "high-dividend",
    metaTitle: "高配当ETFランキング【2024年】SCHD vs VYM徹底比較",
    metaDescription:
      "高配当ETFのSCHD（楽天SCHD）とVYMを配当利回り・配当成長率・安定性・コストで比較ランキング。老後の収入源づくりに最適な選び方を解説。",
    h1: "高配当ETFランキング【2024年版】SCHD vs VYM徹底比較",
    intro:
      "老後の配当収入を目的とした投資家向けに、人気の高配当ETFをランキング形式で比較します。単純な配当利回りだけでなく、配当の成長性・安定性・コストを総合評価しました。",
    criteria: [
      { label: "配当利回り",   description: "現在の年間配当利回り（高いほど高評価）" },
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
        highlight: "増配株に絞った「質の高い配当」。VYMより高い配当成長率が魅力",
        pros: ["増配実績を持つ財務優良企業に絞込", "VYMより配当成長率が高い", "楽天SCHDとして投資信託で積立可能"],
        cons: ["VYMより銘柄数が少ない（約100銘柄）", "信託報酬0.192%とVYMより高め"],
        metric: "配当品質", metricValue: "★★★★★",
      },
      {
        fundId: "vym", fundSlug: "vym", yearSlug: undefined, rank: 2, badge: "🥈",
        highlight: "約3〜4%の安定配当。景気悪化でも底堅い値動きで老後の安定収入に",
        pros: ["約3〜4%の配当利回り", "景気悪化時も底堅い", "0.06%と超低コスト"],
        cons: ["SCHDより配当成長率はやや低め", "つみたて投資枠非対応"],
        metric: "配当品質", metricValue: "★★★★☆",
      },
    ],
    faqs: [
      { q: "SCHDとVYMどちらが高い配当ですか？", a: "現在の配当利回りはVYMが約3〜4%でSCHDと同程度ですが、配当の成長率（毎年の増配率）ではSCHDが上回るケースが多いです。長期保有で配当が増え続けることを重視するならSCHD、安定した高利回りを重視するならVYMという判断軸があります。" },
      { q: "高配当ETFは新NISAで買えますか？", a: "VYM・SCHDともにNISA成長投資枠で購入できます。ただしつみたて投資枠は対象外です。NISAを使えば配当・値上がり益ともに非課税になり、高配当ETFの恩恵を最大化できます。" },
      { q: "高配当ETFはインデックス（S&P500・オルカン）と組み合わせた方がいいですか？", a: "多くの投資家が「メイン：S&P500またはオルカン＋サブ：VYM/SCHD」という組み合わせを採用しています。インデックスで資産成長を狙いながら、高配当ETFで定期的な配当収入も確保できるためです。" },
      { q: "高配当ETFは老後資金に向いていますか？", a: "はい、特に引き出し期（60代以降）に向いています。株式を売却せずに配当収入を生活費の補填に使えるため、「資産を売らずに生活できる」というメリットがあります。ただし現役世代は配当より成長（インデックス）を優先した方が資産最大化になりやすいです。" },
      { q: "楽天SCHDとは何ですか？", a: "楽天SCHDは「楽天・高配当株式・米国ファンド」の通称で、米国ETFのSCHD（Schwab US Dividend Equity ETF）に投資する日本の投資信託です。ETFを直接買うより少額から積立でき、NISAの成長投資枠でも購入できます。" },
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
