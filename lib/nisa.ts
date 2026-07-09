/**
 * 新NISA制度の数値に関するSingle Source of Truth。
 *
 * 制度（非課税枠・投資枠区分など）は法改正により変更される可能性がある。
 * 記事・ガイド内でこれらの数値を扱う場合は、必ずこのファイルの定数・
 * 表示用ヘルパーを参照し、本文中に直接数値を書き込まないこと。
 * 制度改正があった場合は、このファイルの値のみを更新すれば全ページに反映される。
 *
 * 出典: 金融庁 NISA特設ウェブサイト（2024年制度開始時点の内容）
 * https://www.fsa.go.jp/policy/nisa2/index.html
 */

export const NISA_LIMITS = {
  /** つみたて投資枠の年間投資上限（円） */
  tsumitateAnnual: 1_200_000,
  /** 成長投資枠の年間投資上限（円） */
  growthAnnual: 2_400_000,
  /** 生涯非課税保有限度額（総枠、円） */
  lifetimeTotal: 18_000_000,
  /** 生涯非課税保有限度額のうち成長投資枠で使える上限（円） */
  lifetimeGrowthOnly: 12_000_000,
} as const;

/** 制度の最終確認日（このファイルの内容をいつ時点の制度情報として書いたか） */
export const NISA_INFO_LAST_CONFIRMED = "2024年制度開始時点";

/** 万円単位の表示用文字列（例: "120万円"） */
export function formatManEn(yen: number): string {
  return `${Math.round(yen / 10000).toLocaleString("ja-JP")}万円`;
}

/**
 * 制度記事の末尾・本文中で必ず表示する定型の注意書き。
 * NISA・税制など制度を扱う記事はこの文言を必ずどこかに含めること。
 */
export const NISA_SYSTEM_DISCLAIMER =
  "制度は将来変更される可能性があります。最新情報は金融庁・お取引の証券会社等の公式情報をご確認ください。";
