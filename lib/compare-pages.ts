import { FundId } from "@/types";

export interface CompareFaq {
  q: string;
  a: string;
}

export interface CompareSpec {
  label: string;
  a: string;
  b: string;
}

export interface ComparePage {
  slug: string;               // e.g. "orukan-vs-sp500"
  fundAId: FundId;
  fundBId: FundId;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  conclusionA: string;        // "分散重視 → オルカン"
  conclusionB: string;        // "リターン重視 → S&P500"
  simYear: number;
  simMonth: number;
  simAmount: number;
  specs: CompareSpec[];
  faqs: CompareFaq[];
}

export const COMPARE_PAGES: ComparePage[] = [
  {
    slug: "orukan-vs-sp500",
    fundAId: "orcan",
    fundBId: "sp500",
    metaTitle: "オルカンとS&P500はどっち？過去実績・リスク・積立結果を比較",
    metaDescription:
      "オルカンとS&P500を過去実績・リスク・分散性・積立シミュレーションで比較。新NISAでどちらを選ぶべきか分かりやすく解説。",
    h1: "オルカン vs S&P500｜どちらを選ぶ？徹底比較",
    intro:
      "新NISAで最も人気の2銘柄「オルカン」と「S&P500」。過去の積立実績・リスク・分散性を数字で比べ、あなたに合った選び方を解説します。",
    conclusionA: "分散重視・安心感 → オルカン",
    conclusionB: "リターン重視・米国集中 → S&P500",
    simYear: 2020,
    simMonth: 1,
    simAmount: 30000,
    specs: [
      { label: "投資対象",    a: "全世界株式（先進国＋新興国）", b: "米国株式（S&P500指数）" },
      { label: "国数",        a: "約50ヵ国",                    b: "米国のみ（1ヵ国）" },
      { label: "銘柄数",      a: "約3,000銘柄",                 b: "500銘柄" },
      { label: "分散性",      a: "◎ 世界全体に分散",            b: "○ 米国内で分散" },
      { label: "リスク",      a: "中（★★★）",                  b: "中（★★★）" },
      { label: "リターン期待値", a: "中〜高（年率+7〜9%想定）",  b: "高（年率+8〜11%想定）" },
      { label: "信託報酬",    a: "年0.05775%",                   b: "年0.09372%" },
      { label: "NISA対応",    a: "○ つみたて・成長両対応",       b: "○ つみたて・成長両対応" },
    ],
    faqs: [
      {
        q: "オルカンとS&P500はどっちがおすすめですか？",
        a: "投資目的によります。「全世界に分散して安心したい・初心者」ならオルカン、「米国の成長力に集中して高リターンを狙いたい」ならS&P500が向いています。どちらも新NISAで人気No.1・No.2を争う定番商品です。",
      },
      {
        q: "新NISAならオルカンとS&P500どちらが人気ですか？",
        a: "2024年時点ではオルカン（eMAXIS Slim 全世界株式）が残高・購入額ともにトップ。S&P500（eMAXIS Slim 米国株式）も常に上位3位以内に入り、両銘柄合わせて新NISAつみたて投資枠の3〜4割を占めています。",
      },
      {
        q: "初心者にはどちらが向いていますか？",
        a: "初心者にはオルカンがやや有利です。全世界分散により米国が不調な時でも他の国が補ってくれるため、価格変動に動じにくくなります。一方S&P500は過去10年のリターンが高いため、米国経済への信頼がある方に向いています。",
      },
      {
        q: "暴落時に強いのはどちらですか？",
        a: "下落幅はほぼ同程度ですが、オルカンのほうが米国以外の地域にも分散されているため、米国株だけが急落する局面では相対的にダメージが小さくなる傾向があります。ただし2022年のような世界同時株安では両者ともほぼ同様に下落します。",
      },
      {
        q: "長期投資に向いているのはどちらですか？",
        a: "どちらも長期積立に適していますが、過去20年のデータではS&P500のほうが年率リターンで約1〜2%上回っています。ただし将来の米国優位が続くとは限らないため、長期では世界分散のオルカンのほうが安定感があるという意見もあります。",
      },
      {
        q: "オルカンとS&P500を両方買うのはありですか？",
        a: "可能ですが、オルカンはすでに全世界株の約60%が米国株で構成されているため、S&P500を追加するとポートフォリオの米国比率がさらに高まります。「実質的にS&P500に偏った分散」になるため、意図してリターンを高めたい場合を除き、どちらか1本に絞ることが多いです。",
      },
    ],
  },

  // ── 今後追加予定ページ（スタブ） ─────────────────────────────────
  // { slug: "sp500-vs-nasdaq100", fundAId: "sp500", fundBId: "nasdaq100", ... },
  // { slug: "vti-vs-orukan",      fundAId: "vti",   fundBId: "orcan",    ... },
  // { slug: "schd-vs-vym",        fundAId: "schd",  fundBId: "vym",      ... },
];

export const COMPARE_PAGE_MAP = new Map(COMPARE_PAGES.map((p) => [p.slug, p]));

export function getComparePage(slug: string): ComparePage | undefined {
  return COMPARE_PAGE_MAP.get(slug);
}
