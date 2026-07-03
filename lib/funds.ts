import { Fund, FundId, FundCategory, FundCategoryMeta } from "@/types";

export const FUND_CATEGORIES: Record<FundCategory, FundCategoryMeta> = {
  global:   { id: "global",   label: "全世界",   emoji: "🌍", description: "世界中の株式に分散投資" },
  us:       { id: "us",       label: "米国",     emoji: "🇺🇸", description: "米国株式市場に投資" },
  dividend: { id: "dividend", label: "高配当",   emoji: "💰", description: "配当重視の安定運用" },
  hightech: { id: "hightech", label: "ハイテク", emoji: "🚀", description: "テック企業集中投資" },
  emerging: { id: "emerging", label: "新興国",   emoji: "🌏", description: "インド・新興国市場" },
};

export const FUNDS: Record<FundId, Fund> = {
  // ── 全世界 ─────────────────────────────────────────────────────────
  orcan: {
    id: "orcan", category: "global",
    name: "eMAXIS Slim 全世界株式（オルカン）",
    shortName: "オルカン", ticker: "vt.us",
    color: "#6366f1", riskLevel: 3,
    description: "世界中の企業へまとめて投資できる",
    shareCount: "約3,000銘柄",
    annualReturns: {
      2015: 0.014, 2016: 0.075, 2017: 0.241, 2018: -0.093,
      2019: 0.271, 2020: 0.163, 2021: 0.305, 2022: -0.180,
      2023: 0.234, 2024: 0.191, 2025: 0.082,
    },
    encyclopedia: {
      nickname: "オルカン",
      formalName: "eMAXIS Slim 全世界株式（オール・カントリー）",
      catchCopy: "世界中に一本で分散。最強の「ほったらかし投資」",
      forWhom: "投資初心者・長期積立を始めたい人・NISA活用したい人",
      features: ["🌍 全世界分散", "💰 NISA向き", "📉 低コスト", "🏆 残高No.1"],
      pros: ["全世界の約3000銘柄に自動分散", "信託報酬が業界最低水準", "新NISAの人気ランキング1位", "三菱UFJアセットの運用実績"],
      cons: ["米国株が6割以上を占める", "大きな急騰は期待しにくい"],
      managementFee: "0.05775%（年率）",
      beginnerScore: 5,
      volatility: "中",
      expectedHorizon: "10年以上",
      nisaSupport: { tsumitate: true, growth: true },
    },
  },
  vt: {
    id: "vt", category: "global",
    name: "バンガード・トータル・ワールド・ストック ETF",
    shortName: "VT", ticker: "vt.us",
    color: "#818cf8", riskLevel: 3,
    description: "世界中へETFで分散投資できる",
    shareCount: "約9,000銘柄",
    annualReturns: {
      2015: 0.009, 2016: 0.080, 2017: 0.244, 2018: -0.096,
      2019: 0.266, 2020: 0.161, 2021: 0.299, 2022: -0.183,
      2023: 0.228, 2024: 0.187, 2025: 0.079,
    },
    encyclopedia: {
      nickname: "VT",
      formalName: "Vanguard Total World Stock ETF（VT）",
      catchCopy: "バンガード社が誇る、究極の全世界ETF",
      forWhom: "ETFで国際分散したい人・証券口座で買いたい人",
      features: ["🌍 全世界分散", "📊 ETF形式", "💼 バンガード運用"],
      pros: ["全世界9000銘柄以上をカバー", "バンガード社の信頼性", "流動性が高い"],
      cons: ["円建て投資信託より手間がかかる", "為替リスクあり"],
      managementFee: "0.07%（年率）",
      beginnerScore: 3,
      volatility: "中",
      expectedHorizon: "10年以上",
      nisaSupport: { tsumitate: false, growth: true },
    },
  },

  // ── 米国 ──────────────────────────────────────────────────────────
  sp500: {
    id: "sp500", category: "us",
    name: "eMAXIS Slim 米国株式（S&P500）",
    shortName: "S&P500", ticker: "^spx",
    color: "#f59e0b", riskLevel: 3,
    description: "アメリカの代表企業500社に投資できる",
    shareCount: "500銘柄",
    annualReturns: {
      2015: 0.016, 2016: 0.121, 2017: 0.218, 2018: -0.045,
      2019: 0.316, 2020: 0.186, 2021: 0.289, 2022: -0.184,
      2023: 0.267, 2024: 0.234, 2025: 0.092,
    },
    encyclopedia: {
      nickname: "S&P500",
      formalName: "eMAXIS Slim 米国株式（S&P500）",
      catchCopy: "米国経済の成長をそのまま受け取る。長期投資の王道",
      forWhom: "米国企業の成長に賭けたい人・オルカンより高リターンを狙いたい人",
      features: ["🇺🇸 米国集中", "💰 NISA向き", "📈 高リターン実績", "💼 低コスト"],
      pros: ["過去10年で最も安定した高リターン", "米国を代表する大型成長企業が主力", "信託報酬が超低コスト"],
      cons: ["米国のみへの集中リスク", "円安時に有利だが円高時は注意"],
      managementFee: "0.09372%（年率）",
      beginnerScore: 4,
      volatility: "中",
      expectedHorizon: "10年以上",
      nisaSupport: { tsumitate: true, growth: true },
    },
  },
  vti: {
    id: "vti", category: "us",
    name: "バンガード・トータル・ストック・マーケット ETF",
    shortName: "VTI", ticker: "vti.us",
    color: "#3b82f6", riskLevel: 3,
    description: "アメリカ株式市場全体に幅広く投資できる",
    shareCount: "約3,700銘柄",
    annualReturns: {
      2015: 0.008, 2016: 0.128, 2017: 0.215, 2018: -0.053,
      2019: 0.311, 2020: 0.213, 2021: 0.258, 2022: -0.194,
      2023: 0.263, 2024: 0.221, 2025: 0.087,
    },
    encyclopedia: {
      nickname: "VTI",
      formalName: "Vanguard Total Stock Market ETF（VTI）",
      catchCopy: "S&P500より広く、米国市場全体をカバー",
      forWhom: "S&P500より広い米国分散をしたい人・中小型株も含めたい人",
      features: ["🇺🇸 米国全体", "📊 約3700銘柄", "💼 バンガード運用"],
      pros: ["中小型株も含む幅広い米国分散", "S&P500と近い値動き", "長期実績が豊富"],
      cons: ["円建て投資信託より手間がかかる"],
      managementFee: "0.03%（年率）",
      beginnerScore: 3,
      volatility: "中",
      expectedHorizon: "10年以上",
      nisaSupport: { tsumitate: false, growth: true },
    },
  },

  // ── 高配当 ────────────────────────────────────────────────────────
  vym: {
    id: "vym", category: "dividend",
    name: "バンガード・米国高配当株式 ETF",
    shortName: "VYM", ticker: "vym.us",
    color: "#10b981", riskLevel: 2,
    description: "アメリカの配当が多い企業に投資できる",
    shareCount: "約400銘柄",
    annualReturns: {
      2015: -0.001, 2016: 0.175, 2017: 0.196, 2018: -0.085,
      2019: 0.267, 2020: 0.024, 2021: 0.281, 2022: -0.001,
      2023: 0.107, 2024: 0.159, 2025: 0.072,
    },
    encyclopedia: {
      nickname: "VYM",
      formalName: "Vanguard High Dividend Yield ETF（VYM）",
      catchCopy: "配当で育てる。安定志向の資産形成",
      forWhom: "配当収入を楽しみたい人・安定重視の人・50代以上",
      features: ["💰 高配当", "📉 比較的安定", "🏦 老後向き"],
      pros: ["約3〜4%の配当利回り", "値動きが比較的安定", "景気悪化時に底堅い"],
      cons: ["成長株より値上がり益は小さい", "日本円での配当受取に税金がかかる"],
      managementFee: "0.06%（年率）",
      beginnerScore: 3,
      volatility: "低",
      expectedHorizon: "10年以上",
      nisaSupport: { tsumitate: false, growth: true },
    },
  },
  schd: {
    id: "schd", category: "dividend",
    name: "楽天・高配当株式・米国ファンド（SCHD）",
    shortName: "SCHD", ticker: "schd.us",
    color: "#059669", riskLevel: 2,
    description: "配当を増やし続ける優良企業に投資できる",
    shareCount: "約100銘柄",
    annualReturns: {
      2015: -0.012, 2016: 0.173, 2017: 0.185, 2018: -0.074,
      2019: 0.278, 2020: 0.068, 2021: 0.299, 2022: -0.034,
      2023: 0.068, 2024: 0.141, 2025: 0.065,
    },
    encyclopedia: {
      nickname: "SCHD（楽天SCHD）",
      formalName: "楽天・高配当株式・米国ファンド（愛称：楽天SCHD）",
      catchCopy: "増配株に絞った、質の高い配当成長投資",
      forWhom: "VYMより質の高い配当株に投資したい人・配当成長を重視する人",
      features: ["💰 配当成長", "📈 高品質銘柄", "🛡️ 財務優良銘柄"],
      pros: ["増配実績を持つ財務優良企業に絞込", "VYMより高い配当成長率", "投資信託形式で少額から積立可能"],
      cons: ["高配当株全般より銘柄数が少なく集中リスクあり", "配当重視のため成長株より値上がり益は小さい"],
      managementFee: "0.192%（年率）",
      beginnerScore: 3,
      volatility: "低",
      expectedHorizon: "10年以上",
      nisaSupport: { tsumitate: true, growth: true },
    },
  },

  // ── ハイテク ──────────────────────────────────────────────────────
  nasdaq100: {
    id: "nasdaq100", category: "hightech",
    name: "iFreeNEXT NASDAQ100 インデックス",
    shortName: "NASDAQ100", ticker: "^ndx",
    color: "#8b5cf6", riskLevel: 4,
    description: "アメリカの主要テック企業100社に投資できる",
    shareCount: "約100銘柄",
    annualReturns: {
      2015: 0.097, 2016: 0.074, 2017: 0.331, 2018: -0.012,
      2019: 0.397, 2020: 0.488, 2021: 0.271, 2022: -0.330,
      2023: 0.538, 2024: 0.250, 2025: 0.072,
    },
    encyclopedia: {
      nickname: "NASDAQ100（ナスダック）",
      formalName: "iFreeNEXT NASDAQ100 インデックス",
      catchCopy: "米国ハイテク成長企業を中心に。高リターン・高リスクの攻めの一本",
      forWhom: "テック成長に強気な人・S&P500より高いリターンを狙いたい人",
      features: ["💻 テック集中", "🚀 高リターン実績", "⚡ 高ボラティリティ"],
      pros: ["過去10年で圧倒的なリターン実績を記録", "米国の主要テクノロジー・成長企業が主力", "イノベーション分野の成長の恩恵を受けやすい"],
      cons: ["テクノロジーセクターへの集中リスク", "下落相場では大幅下落する局面もある"],
      managementFee: "0.495%（年率）",
      beginnerScore: 2,
      volatility: "高",
      expectedHorizon: "10〜15年以上",
      nisaSupport: { tsumitate: true, growth: true },
    },
  },
  fangplus: {
    id: "fangplus", category: "hightech",
    name: "iFreeNEXT FANG+インデックス",
    shortName: "FANG+", ticker: "^nyfang",
    color: "#ef4444", riskLevel: 5,
    description: "世界を牽引する大型テクノロジー企業へ集中投資できる",
    shareCount: "10銘柄",
    annualReturns: {
      2015: 0.122, 2016: 0.056, 2017: 0.416, 2018: 0.064,
      2019: 0.414, 2020: 0.628, 2021: 0.344, 2022: -0.443,
      2023: 0.718, 2024: 0.325, 2025: 0.063,
    },
    encyclopedia: {
      nickname: "FANG+（ファング・プラス）",
      formalName: "iFreeNEXT FANG+インデックス",
      catchCopy: "イノベーションを牽引する大型テクノロジー企業10社へ集中。ハイリスク・ハイリターンの極致",
      forWhom: "最大リターンを狙う上級者・リスクを理解した攻め型投資家",
      features: ["🚀 超高リターン", "⚠️ 高リスク", "💻 10銘柄集中"],
      pros: ["過去に数十%を超える驚異的なリターンを記録した実績あり", "時代を代表する大型テクノロジー企業群へ集中投資", "少額から世界屈指の成長企業に投資できる"],
      cons: ["過去に40〜50%超の大幅下落局面あり", "10銘柄のみで集中リスクが非常に高い", "信託報酬が高め"],
      managementFee: "0.7755%（年率）",
      beginnerScore: 1,
      volatility: "非常に高",
      expectedHorizon: "15年以上（覚悟が必要）",
      nisaSupport: { tsumitate: false, growth: true },
    },
  },

  // ── 新興国 ────────────────────────────────────────────────────────
  india: {
    id: "india", category: "emerging",
    name: "iShares MSCI インド ETF（INDA）",
    shortName: "インド株", ticker: "inda.us",
    color: "#f97316", riskLevel: 5,
    description: "急成長中のインド企業に投資できる",
    shareCount: "約130銘柄",
    annualReturns: {
      2015: -0.062, 2016: -0.015, 2017: 0.381, 2018: -0.083,
      2019: 0.126, 2020: 0.143, 2021: 0.418, 2022: 0.012,
      2023: 0.192, 2024: -0.043, 2025: 0.081,
    },
    encyclopedia: {
      nickname: "インド株",
      formalName: "iShares MSCI インド ETF（INDA）",
      catchCopy: "人口14億・平均年齢28歳。次の成長大国へ",
      forWhom: "長期的な新興国成長を取りたい人・中国リスクを避けたい人",
      features: ["🇮🇳 インド特化", "👥 人口ボーナス", "📈 成長期待"],
      pros: ["2021年+41%など高成長期も", "GDP成長率世界トップクラス", "IT・製造業の台頭"],
      cons: ["2024年は-4%など年による差が大きい", "政治リスク・通貨リスクあり", "先進国より情報が少ない"],
      managementFee: "0.65%（年率）",
      beginnerScore: 2,
      volatility: "高",
      expectedHorizon: "15年以上",
      nisaSupport: { tsumitate: false, growth: false },
    },
  },
  emerging: {
    id: "emerging", category: "emerging",
    name: "iShares MSCI 新興国株式 ETF（EEM）",
    shortName: "新興国株", ticker: "eem.us",
    color: "#ec4899", riskLevel: 4,
    description: "中国・台湾など新興国全体に分散投資できる",
    shareCount: "約1,200銘柄",
    annualReturns: {
      2015: -0.147, 2016: 0.113, 2017: 0.373, 2018: -0.146,
      2019: 0.184, 2020: 0.182, 2021: -0.048, 2022: -0.201,
      2023: 0.098, 2024: 0.057, 2025: 0.091,
    },
    encyclopedia: {
      nickname: "新興国株（EEM）",
      formalName: "iShares MSCI 新興国株式 ETF（EEM）",
      catchCopy: "中国・台湾・韓国など24カ国の新興国に広く分散",
      forWhom: "先進国以外の成長を取り込みたい人・分散をさらに広げたい人",
      features: ["🌏 新興国分散", "🇨🇳 中国含む", "📊 24カ国"],
      pros: ["先進国とは異なる経済サイクル", "長期的な人口・経済成長の恩恵", "ポートフォリオの分散効果"],
      cons: ["地政学リスク・政治リスクが高い", "過去10年は先進国に大きく劣後"],
      managementFee: "0.68%（年率）",
      beginnerScore: 2,
      volatility: "高",
      expectedHorizon: "15年以上",
      nisaSupport: { tsumitate: false, growth: true },
    },
  },
};

// ホームランキングなどで使う、1行に収まる超短い説明
export const FUND_SHORT_DESC: Record<FundId, string> = {
  orcan: "長期積立向け",
  vt: "全世界ETF",
  sp500: "米国成長重視",
  vti: "米国分散型",
  vym: "配当重視型",
  schd: "配当成長型",
  nasdaq100: "ハイリターン型",
  fangplus: "攻めの成長株",
  india: "新興国成長",
  emerging: "新興国分散",
};

export const FUND_LIST = Object.values(FUNDS);
export function getFund(id: FundId): Fund { return FUNDS[id]; }
export function getFundsByCategory(category: FundCategory): Fund[] {
  return FUND_LIST.filter((f) => f.category === category);
}

/**
 * 指定年の暦年リターンを「約-33%」のような表示用文字列で返す。
 * 記事・比較ページの下落率はハードコードせず、必ずこの関数か FUNDS[id].annualReturns を参照する。
 */
export function formatAnnualReturn(fundId: FundId, year: number): string {
  const value = FUNDS[fundId].annualReturns[year];
  if (value === undefined) return "データなし";
  const pct = Math.round(value * 1000) / 10; // 小数第1位まで
  const sign = pct > 0 ? "+" : "";
  const display = pct < 0 ? `−${Math.abs(pct)}` : `${sign}${pct}`; // 負値は全角マイナス(−)でサイト表記に統一
  return `約${display}%`;
}
/**
 * 信託報酬・経費率を「年0.05775%」のような表示用文字列で返す。
 * FUNDS[id].encyclopedia.managementFee（"0.05775%（年率）"）を唯一の参照元とする。
 */
export function formatExpenseRatio(fundId: FundId): string {
  const raw = FUNDS[fundId].encyclopedia.managementFee;
  const numeric = raw.replace("（年率）", "");
  return `年${numeric}`;
}

export const CATEGORY_ORDER: FundCategory[] = ["global", "us", "dividend", "hightech", "emerging"];

// 投資初心者が選びやすいよう、銘柄の特徴を短いラベルに要約する
export function getFundTags(fund: Fund): string[] {
  const enc = fund.encyclopedia;
  const tags: string[] = [];
  if (enc.beginnerScore >= 5) tags.push("初心者向け");
  else if (fund.id === "sp500") tags.push("王道");
  if (fund.category === "hightech") tags.push("高リターン");
  if (fund.category === "us") tags.push("米国株");
  if (fund.category === "dividend") tags.push("高配当");
  if (fund.category === "emerging") tags.push("新興国");
  const feeValue = parseFloat(enc.managementFee);
  if (!Number.isNaN(feeValue) && feeValue < 0.1) tags.push("低コスト");
  if (enc.expectedHorizon.includes("10年")) tags.push("長期向け");
  return Array.from(new Set(tags)).slice(0, 2);
}
