import { FundId } from "@/types";
import { FUNDS, formatAnnualReturn, formatExpenseRatio } from "@/lib/funds";

export interface FundPageFaq {
  q: string;
  a: string;
}

export interface FundPage {
  slug: string;
  fundId: FundId;
  metaTitle: string;
  metaDescription: string;
  h1?: string;
  /** シミュレーション条件 */
  simYear: number;
  simMonth: number;
  simAmount: number;
  faqs: FundPageFaq[];
  /** /compare/[slug] へのリンク用 */
  relatedCompareSlugs: string[];
  /** /fund/[slug] へのリンク用（同画面内） */
  relatedFundSlugs: string[];
  contextualComparison?: string;
}

export const FUND_PAGES: FundPage[] = [
  // ── オルカン ─────────────────────────────────────────────────────────
  {
    slug: "orukan",
    contextualComparison: "世界分散型と米国高配当型の違いは、[オルカンと米国ETF SCHDの比較](/compare/orukan-vs-schd)で確認できます。SCHDの数値は原典未検証の参考データです。",
    fundId: "orcan",
    metaTitle: "オルカン（全世界株式）とは？新NISAで人気の理由・メリット・積立実績",
    metaDescription:
      "eMAXIS Slim全世界株式（オルカン）の信託報酬・NISA対応・メリット・積立実績を解説。オルカンとS&P500どっちがいいか迷っている方も今すぐ確認→",
    h1: "オルカンとは？特徴・メリット・新NISAでの活用法",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["orukan-vs-sp500", "vti-vs-orukan"],
    relatedFundSlugs: ["sp500", "vti", "nasdaq100"],
    faqs: [
      {
        q: "オルカンとはどんな投資信託ですか？",
        a: "オルカンは「eMAXIS Slim 全世界株式（オール・カントリー）」の通称で、世界50ヵ国以上の約3,000銘柄に一括投資できる低コスト投資信託です。「全世界に分散＋コスト最安水準＋NISA完全対応」という3拍子が揃い、新NISAの積立先として最も人気の商品の一つです。",
      },
      {
        q: "オルカンとS&P500はどちらがいいですか？",
        a: "オルカンは全世界、eMAXIS Slim 米国株式（S&P500）は米国大型株へ投資します。当サイトの実績比較は、両商品の公式月次データがそろう共通期間に限定しています。",
      },
      {
        q: "オルカンは新NISAで買えますか？",
        a: "はい、つみたて投資枠・成長投資枠の両方で購入できます。特につみたて投資枠での月最大10万円の非課税積立に対応しており、新NISAをフル活用できます。",
      },
      {
        q: "オルカンにリスクはありますか？",
        a: "元本保証はなく、株式市場の下落時には価格が大きく下がる場合があります。ただし世界約50ヵ国に分散投資しているため、特定の国・地域の下落の影響は分散されます。10〜20年の長期保有を前提にすれば歴史的には回復・成長してきた実績があります。",
      },
      {
        q: "オルカンの信託報酬は高いですか？",
        a: "年率0.05775%と業界最低水準の一つです。100万円を10年間運用しても手数料は累計約6,000円以下。長期積立において低コストは複利効果を最大化する重要な要素です。",
      },
      {
        q: "オルカンはいくらから始められますか？",
        a: "各証券会社で100円から積立可能です。毎月1,000円、5,000円など無理のない金額からスタートし、余裕ができたら増額するのが長続きのコツです。",
      },
    ],
  },

  // ── S&P500 ───────────────────────────────────────────────────────────
  {
    slug: "sp500",
    fundId: "sp500",
    metaTitle: "S&P500とは？過去の積立実績・メリット・オルカンとの違いを解説",
    metaDescription:
      "eMAXIS Slim米国株式（S&P500）の信託報酬・NISA対応・積立実績を解説。2020年から月3万円積み立てた場合の実績も公開→今すぐ確認",
    h1: "S&P500とは？特徴・メリット・長期積立の実績",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["orukan-vs-sp500", "sp500-vs-nasdaq100", "vti-vs-sp500", "schd-vs-sp500"],
    relatedFundSlugs: ["orukan", "nasdaq100", "vti"],
    faqs: [
      {
        q: "S&P500とはどんな指数ですか？",
        a: "S&P500は米国の主要取引所に上場する大型株500社で構成される株価指数です。Apple・Microsoft・NVIDIA・Amazonなど時代をリードする企業が名を連ね、「米国株式市場の縮図」として世界で最も参照される指数の一つです。",
      },
      {
        q: "S&P500とオルカンはどちらがいいですか？",
        a: "eMAXIS Slim 米国株式（S&P500）は米国大型株、オルカンは全世界の株式へ投資します。当サイトの実績比較は、両商品の公式月次データがそろう共通期間に限定しています。",
      },
      {
        q: "S&P500の過去リターンはどのくらいですか？",
        a: "過去40年以上の年平均リターンは約10%とされています。例年ではプラスのリターンを記録することが多いですが、2022年のように大きく下落する年もあります。長期積立では下落局面を平均化でき、歴史的には高いリターンを記録してきました。",
      },
      {
        q: "S&P500は新NISAで買えますか？",
        a: "はい、eMAXIS Slim 米国株式（S&P500）はつみたて投資枠・成長投資枠の両方で購入できます。つみたて投資枠の対象商品です。",
      },
      {
        q: "S&P500は初心者向けですか？",
        a: "米国への地域集中、費用、設定日、指数との連動方法、許容できる値動きを確認します。このページは購入順序や初心者適性を判定しません。",
      },
      {
        q: "S&P500で大きく下落した年はありますか？",
        a: `eMAXIS Slim 米国株式（S&P500）の円ベース・分配金再投資込みの暦年リターンは、2022年が${formatAnnualReturn("sp500", 2022)}、2023年が${formatAnnualReturn("sp500", 2023)}でした。暦年リターンは年中の高値から安値までの最大下落率や、下落前の水準までの回復期間を示すものではありません。`,
      },
    ],
  },

  // ── NASDAQ100 ────────────────────────────────────────────────────────
  {
    slug: "nasdaq100",
    fundId: "nasdaq100",
    metaTitle: "NASDAQ100とは？S&P500との違い・リスク・積立実績を解説",
    metaDescription:
      "NASDAQ100（eMAXIS Slim/iFreeNEXT）の信託報酬・リスク・積立実績を解説。S&P500との違いも比較→今すぐ確認",
    h1: "NASDAQ100とは？特徴・S&P500との違い・リスク",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["sp500-vs-nasdaq100", "nasdaq100-vs-fangplus"],
    relatedFundSlugs: ["sp500", "fangplus", "orukan"],
    faqs: [
      {
        q: "NASDAQ100とは何ですか？",
        a: "NASDAQ100はナスダック市場に上場する非金融大型株上位100社で構成される株価指数です。当サイトの商品実績はiFreeNEXT NASDAQ100インデックスの設定後に取得できる公式月次データだけを使用します。",
      },
      {
        q: "NASDAQ100とS&P500の違いは何ですか？",
        a: "NASDAQ100はナスダック上場のテック系企業100社に集中、S&P500は米国全業種500社に幅広く分散します。NASDAQ100はリターンが高い年が多い一方、下落時の振れ幅も大きくなります。サテライトとしてNASDAQ100を持ち、コアをS&P500にする組み合わせも人気です。",
      },
      {
        q: "NASDAQ100は新NISAで買えますか？",
        a: "はい、eMAXIS Slim NASDAQ100やiFreeNEXT NASDAQ100などの投資信託として、つみたて投資枠・成長投資枠の両方で購入できます。",
      },
      {
        q: "NASDAQ100のリスクはどのくらいですか？",
        a: `テクノロジー関連企業への集中度が高く、値動きが大きくなる場合があります。iFreeNEXT NASDAQ100インデックスの2022年の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("nasdaq100", 2022)}でした。これは年中の最大下落率ではなく、将来の値動きを示すものでもありません。`,
      },
      {
        q: "NASDAQ100は初心者向けですか？",
        a: "業種・銘柄の集中度、費用、設定日、許容できる値動きを確認します。このページは購入順序や配分を推奨しません。",
      },
      {
        q: "NASDAQ100とFANG+はどう比較しますか？",
        a: "NASDAQ100はナスダック上場の非金融大型株、FANG+は10銘柄を均等加重する指数への連動を目指します。銘柄数、採用基準、加重方法、費用、他の保有商品との重複を同じ時点で確認します。",
      },
    ],
  },

  // ── SCHD ─────────────────────────────────────────────────────────────
  {
    slug: "schd",
    fundId: "schd",
    metaTitle: "米国ETF SCHDの基本情報｜指数・経費率・VYMとの違い",
    metaDescription:
      "Schwab U.S. Dividend Equity ETF（SCHD）の仕組み・経費率・VYMとの違いを解説。楽天SCHDとは別商品として整理します。",
    h1: "米国ETF SCHDとは？特徴・経費率・VYMとの比較",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["schd-vs-vym", "schd-vs-sp500"],
    relatedFundSlugs: ["vym", "sp500", "orukan"],
    faqs: [
      {
        q: "SCHDとはどんなETFですか？",
        a: `SCHDはSchwab Asset Managementが運用する米国ETFで、Dow Jones U.S. Dividend 100 Indexへの連動を目指します。配当の質と持続性、財務比率等を用いる指数設計で、${FUNDS.schd.shareCount}へ投資します。当サイトのSCHDリターン系列はG品質（参考データ・原典未検証）です。`,
      },
      {
        q: "SCHDの配当利回りはどのくらいですか？",
        a: "SCHDの分配利回りは市場価格と分配実績により変動します。固定的な利回りや増配率ではないため、Schwab公式の商品ページで基準日と最新値を確認してください。",
      },
      {
        q: "SCHDとVYMの違いは何ですか？",
        a: `SCHDは財務比率等を用いて選定する${FUNDS.schd.shareCount}、VYMは配当利回りが市場平均を上回る米国株${FUNDS.vym.shareCount}へ投資します。主な違いは指数の銘柄選定方法と分散範囲です。`,
      },
      {
        q: "SCHDは新NISAで買えますか？",
        a: "米国ETF SCHDと楽天・シュワブ・高配当株式・米国ファンドは別商品です。NISA区分や取扱いは利用する証券会社の商品ページで確認してください。",
      },
      {
        q: "SCHDは初心者向けですか？",
        a: "米国ETFのため、外貨での売買、分配金、税務、取扱証券会社を確認する必要があります。高配当株を対象とする商品設計だけで、値動きの安定や将来の成果が保証されるものではありません。",
      },
      {
        q: "SCHDで配当金はいつ受け取れますか？",
        a: "米国ETF SCHDは四半期分配です。楽天SCHDの分配方針・税務・取扱いは別商品の公式資料で確認する必要があります。",
      },
    ],
  },

  // ── VYM ──────────────────────────────────────────────────────────────
  {
    slug: "vym",
    contextualComparison: "高配当株への投資と世界全体への分散を比べる場合は、[VYMとオルカンの違い](/compare/orukan-vs-vym)も確認できます。",
    fundId: "vym",
    metaTitle: "VYMとは？配当利回り・積立実績・SCHDとの違いを解説",
    metaDescription:
      "VYM（バンガード米国高配当株式ETF）の配当利回り・積立実績・SCHDとの違いを解説。安定配当ETFの特徴を今すぐ確認→",
    h1: "VYMとは？配当利回り・特徴・SCHDとの比較",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["schd-vs-vym"],
    relatedFundSlugs: ["schd", "sp500", "orukan"],
    faqs: [
      {
        q: "VYMとはどんなETFですか？",
        a: `VYMはバンガードが運用する米国高配当ETFで、配当利回りが市場平均を上回る${FUNDS.vym.shareCount}に投資します。銘柄数は指数の入替えで変動します。経費率は${formatExpenseRatio("vym")}です。`,
      },
      {
        q: "VYMの配当利回りはどのくらいですか？",
        a: `VYMの分配利回りは市場価格と分配実績により変動します。固定的な利回りではなく、Vanguard公式の最新値と分配履歴を確認してください。${FUNDS.vym.shareCount}への分散が特徴です。`,
      },
      {
        q: "VYMとSCHDの違いは何ですか？",
        a: `VYMは${FUNDS.vym.shareCount}へ幅広く分散し、SCHDは財務指標等で選定した約100銘柄で構成されます。指数の選定方法、分散範囲、分配方針、コストが主な違いです。`,
      },
      {
        q: "VYMは新NISAで買えますか？",
        a: "VYM（ETF）はNISAの成長投資枠で購入できます。つみたて投資枠には対応していないため、ETFとして成長投資枠の年240万円枠で購入する形になります。",
      },
      {
        q: "VYMは長期投資に向いていますか？",
        a: "保有期間だけで適性は決まりません。分配方針、価格変動、為替、費用、税務、資金を使う時期を確認します。",
      },
      {
        q: "VYMとS&P500ではどちらが良いですか？",
        a: "VYMは四半期分配を行う米国ETF、国内S&P500投信はファンド内で分配金を再投資します。比較期間、通貨、税務をそろえない限り優劣は判断できません。",
      },
    ],
  },

  // ── VTI ──────────────────────────────────────────────────────────────
  {
    slug: "vti",
    contextualComparison: "米国株全体への分散と大型グロース株への集中の違いは、[VTIとNASDAQ100の比較](/compare/vti-vs-nasdaq100)で確認できます。",
    fundId: "vti",
    metaTitle: "VTIとは？S&P500との違い・楽天VTI・積立実績を解説",
    metaDescription:
      "VTI（楽天VTI含む）の経費率・S&P500との違い・積立実績を解説。米国全体に投資するETFの特徴を今すぐ確認→",
    h1: "VTIとは？特徴・楽天VTI・S&P500との違い",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["vti-vs-orukan", "vti-vs-sp500"],
    relatedFundSlugs: ["sp500", "orukan", "nasdaq100"],
    faqs: [
      {
        q: "VTIとはどんなETFですか？",
        a: `VTIは「バンガード・トータル・ストック・マーケットETF」の略で、米国株式市場全体（大型株から中小型株まで${FUNDS.vti.shareCount}）に投資するETFです。`,
      },
      {
        q: "VTIとS&P500の違いは何ですか？",
        a: `S&P500は米国の大型株500社、VTIは大型株から中小型株まで${FUNDS.vti.shareCount}をカバーします。VTIは米国内での投資対象がより広いETFです。`,
      },
      {
        q: "VTIとオルカンはどちらがいいですか？",
        a: `VTIは米国株${FUNDS.vti.shareCount}、オルカンは全世界株へ投資します。米国だけを対象にするか、世界へ地域分散するかが主な違いです。`,
      },
      {
        q: "VTIは新NISAで買えますか？",
        a: "VTIのETF直接購入はNISAの成長投資枠で可能です。また「楽天・全米株式インデックス・ファンド（楽天VTI）」などの連動投資信託であれば、つみたて投資枠でも積立できます。",
      },
      {
        q: "VTIの信託報酬（経費率）はいくらですか？",
        a: "VTI ETFの経費率は年率0.03%と世界最低水準の一つです。100万円を運用して年300円のコストのみ。長期積立ではこの低コストが複利効果を最大化します。",
      },
      {
        q: "VTIは初心者向けですか？",
        a: "VTIは米国上場ETFです。注文方法、最低買付単位、通貨、分配、税務と、利用する金融機関の取扱いを確認してください。連動する国内投信は別商品です。",
      },
    ],
  },

  // ── FANG+ ─────────────────────────────────────────────────────────────
  {
    slug: "fangplus",
    fundId: "fangplus",
    metaTitle: "FANG+とは？NASDAQ100との違い・リスク・積立実績を解説",
    metaDescription:
      "iFreeNEXT FANG+インデックスの正式商品、費用、設定日、データ品質を整理。NASDAQ100との指数構造の違いと公式月次実績の範囲を確認できます。",
    h1: "FANG+とは？特徴・NASDAQ100との違い・リスク",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    relatedCompareSlugs: ["nasdaq100-vs-fangplus"],
    relatedFundSlugs: ["nasdaq100", "sp500", "orukan"],
    faqs: [
      {
        q: "FANG+とはどんな投資信託ですか？",
        a: "iFreeNEXT FANG+インデックスはNYSE FANG+指数への連動を目指す国内投信です。指数は10銘柄を均等加重し、構成銘柄は定期見直しで変わります。少数銘柄への集中が基準価額へ強く影響します。",
      },
      {
        q: "FANG+のリスクはどのくらいですか？",
        a: `10銘柄への集中投資のため、構成銘柄の値動きが基準価額へ大きく影響します。iFreeNEXT FANG+インデックスの2022年の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("fangplus", 2022)}でした。これは年中の最大下落率ではなく、将来の損失幅を示すものでもありません。`,
      },
      {
        q: "FANG+とNASDAQ100の違いは何ですか？",
        a: "NASDAQ100はナスダック上場の非金融大型株を時価総額等に基づいて構成し、FANG+は10銘柄を均等加重します。銘柄数、採用基準、加重方法、費用が異なり、過去実績だけで購入順序や配分は決められません。",
      },
      {
        q: "FANG+は新NISAで買えますか？",
        a: "iFreeNEXT FANG+インデックスは新NISAのつみたて投資枠・成長投資枠の両方で購入できます。つみたて投資枠は年120万円、成長投資枠は年240万円の範囲で利用できます。",
      },
      {
        q: "FANG+を選ぶ前に何を確認しますか？",
        a: "10銘柄への集中度、指数の入替方法、費用、許容できる値動きを確認します。このページは購入順序や配分を推奨しません。",
      },
      {
        q: "FANG+の信託報酬はいくらですか？",
        a: `iFreeNEXT FANG+インデックスの信託報酬は${formatExpenseRatio("fangplus")}です。オルカン（${formatExpenseRatio("orcan")}）やeMAXIS Slim米国株式（S&P500、${formatExpenseRatio("sp500")}）より高い水準です。`,
      },
    ],
  },
];

export const FUND_PAGE_MAP = new Map(FUND_PAGES.map((p) => [p.slug, p]));
export const FUND_PAGE_BY_FUND_ID = new Map(FUND_PAGES.map((p) => [p.fundId, p]));

export function getFundPage(slug: string): FundPage | undefined {
  return FUND_PAGE_MAP.get(slug);
}

/** FundId → /fund/[slug] の変換。対応ページがない場合は null */
export function getFundPageSlug(fundId: string): string | null {
  return FUND_PAGE_BY_FUND_ID.get(fundId as FundPage["fundId"])?.slug ?? null;
}
