/**
 * Evidence-based reassessment of the C/D pages identified by the 2026-10-11
 * AdSense quality inventory. This does not replace the broad inventory score.
 * It only awards a small, declared delta when the rendered page contains the
 * reader-facing evidence implemented in this sprint.
 */

import { readFile, writeFile } from "node:fs/promises";

const baseUrl = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const baselinePath = "docs/audits/content-quality-2026-10-11.csv";
const outputPath = "docs/audits/cd-value-sprint-2026-10-11.csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = text.charCodeAt(0) === 0xfeff ? 1 : 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') quoted = false;
      else value += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else value += char;
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const headers = rows.shift();
  return rows.filter((item) => item.length === headers.length).map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index]])));
}

function csv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const plans = [
  {
    match: (path) => /^\/(orukan|sp500|nasdaq100|vti|schd|vt)$/.test(path) || path === "/fang",
    evidence: ["条件を変えて積立結果を確かめる入口", "検証済み月次実績"],
    delta: 4,
    overlap: "銘柄詳細と商品名が重複。Landingは条件変更と結果確認に限定",
    gap: "シミュレーション入口と商品仕様の役割境界が不明確だった",
    improvement: "積立条件を変えるページであることを明示し、存在する銘柄詳細へ誘導",
    action: "ROLE SEPARATION",
  },
  {
    match: (path) => path.startsWith("/fund/"),
    evidence: ["正式商品・費用・データ品質を確認する資料", "設定日"],
    delta: 4,
    overlap: "商品Landingと概要が重複。Fund詳細は正式情報・費用・品質・出典に限定",
    gap: "シミュレーションページとの差が初見で分かりにくかった",
    improvement: "正式商品、費用、設定日、データ品質を調べる役割と積立検証への導線を明示",
    action: "ROLE SEPARATION",
  },
  {
    match: (path) => path.startsWith("/articles/"),
    evidence: ["商品の仕組みと比較結果の読み方を整理する", "同じ条件の積立比較を開く"],
    delta: 4,
    overlap: "Compareと同じ商品組を扱う。記事は構造・判断材料・読み方に限定",
    gap: "数値比較ページとの役割差が明示されていなかった",
    improvement: "記事の役割を明示し、対応する同条件比較へ往復できる導線を追加",
    action: "ROLE SEPARATION",
  },
  {
    match: (path) => path.startsWith("/from/"),
    evidence: ["積立回数", "共通元本", "順位対象", "単年リターンではなく"],
    delta: 6,
    overlap: "開始年だけが異なる共通テンプレート",
    gap: "その年から始めた意味を回数・元本・対象商品で把握しにくかった",
    improvement: "年固有の積立回数、元本、A品質対象数を計算結果から表示し、単年リターンと区別",
    action: "IMPROVE",
  },
  {
    match: (path) => path.startsWith("/ranking/"),
    evidence: ["順位を見る前に：対象と除外条件", "A品質", "G品質"],
    delta: 5,
    overlap: "同じ商品集合を別条件で並べる共通テンプレート",
    gap: "対象期間、算出条件、除外理由が順位より目立たなかった",
    improvement: "開始時点、月額、A品質限定、欠損時非補完、G品質除外を順位前に明示",
    action: "IMPROVE",
  },
  {
    match: (path) => ["/guide", "/guide/tax", "/guide/system", "/guide/booraku", "/compare", "/fund", "/articles"].includes(path),
    evidence: ["確認"],
    delta: 6,
    overlap: "一覧中心で検索意図が近い子ページを列挙していた",
    gap: "初回訪問者が自分の疑問に対応するページを選びにくかった",
    improvement: "質問・確認目的別の選択肢と、ページ群の役割を案内",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/orukan/monthly/30000",
    evidence: ["積立を設定する前の確認事項", "生活費と近い将来に使う資金", "同じ評価額になる将来予測ではないこと"],
    delta: 4,
    overlap: "他の月額ページとテンプレートを共有",
    gap: "年齢・属性別の適性判断に寄り、読者が確認すべき条件が弱かった",
    improvement: "流動性、元本、実績と予測の区別、制度上の取扱いという中立な確認事項へ変更",
    action: "IMPROVE",
  },
];

function advanceOne(classification, score) {
  if (classification === "D" && score >= 55) return "C";
  if (classification === "C" && score >= 65) return "B";
  return classification;
}

const baseline = parseCsv(await readFile(baselinePath, "utf8"));
const targets = baseline.filter((row) => row["分類"] === "C" || row["分類"] === "D");
if (targets.length !== 51) throw new Error(`expected 51 C/D pages, found ${targets.length}`);

const rows = [];
for (const row of targets) {
  const url = new URL(row["URL"]);
  const path = url.pathname;
  const plan = plans.find((candidate) => candidate.match(path));
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const evidenceOk = plan ? plan.evidence.every((token) => html.includes(token)) : false;
  if (plan && !evidenceOk) throw new Error(`${path}: rendered evidence missing (${plan.evidence.join(" / ")})`);
  const beforeScore = Number(row["品質点"]);
  const afterScore = beforeScore + (evidenceOk ? plan.delta : 0);
  const afterClass = advanceOne(row["分類"], afterScore);
  rows.push({
    url: row["URL"],
    beforeScore,
    beforeClass: row["分類"],
    intent: row["検索意図"],
    overlap: plan?.overlap ?? "同一原因の安全なテンプレート改善対象外。個別編集または構造判断が必要",
    unique: evidenceOk ? plan.improvement : "既存本文・一次情報（今回の実装追加なし）",
    gap: plan?.gap ?? "個別の検索意図・流入・被リンクを確認して改善範囲を決める必要がある",
    clicks: row["GSCクリック"],
    impressions: row["GSC表示回数"],
    links: "内部リンクはQAで検査。被リンクは利用可能なエクスポートなし（未確認）",
    improvement: plan?.improvement ?? "今回は変更せず、個別改善または構造変更の承認候補として継続",
    structural: plan?.action ?? (["policy", "trust"].includes(row["ページ種別"]) ? "KEEP" : "MERGE / NOINDEX CANDIDATE（承認待ち）"),
    evidence: evidenceOk ? plan.evidence.join(" / ") : "今回の表示変更なし",
    afterScore,
    afterClass,
  });
}

const headers = ["URL", "変更前点", "変更前分類", "主な検索意図", "他ページとの重複", "独自情報", "読者に不足していた内容", "GSCクリック", "GSC表示回数", "被リンク・内部リンク", "改善方針", "処遇", "表示HTMLの証拠", "変更後点", "変更後分類"];
const values = rows.map((row) => [row.url, row.beforeScore, row.beforeClass, row.intent, row.overlap, row.unique, row.gap, row.clicks, row.impressions, row.links, row.improvement, row.structural, row.evidence, row.afterScore, row.afterClass]);
await writeFile(outputPath, `\uFEFF${[headers, ...values].map((line) => line.map(csv).join(",")).join("\n")}\n`, "utf8");

const beforeCounts = Object.fromEntries(["A", "B", "C", "D", "E"].map((key) => [key, baseline.filter((row) => row["分類"] === key).length]));
const afterCounts = { ...beforeCounts };
for (const row of rows) {
  if (row.beforeClass !== row.afterClass) {
    afterCounts[row.beforeClass] -= 1;
    afterCounts[row.afterClass] += 1;
  }
}
const baselineTotal = baseline.reduce((sum, row) => sum + Number(row["品質点"]), 0);
const deltaTotal = rows.reduce((sum, row) => sum + row.afterScore - row.beforeScore, 0);
const summary = {
  pages: baseline.length,
  cdPages: rows.length,
  renderedImprovements: rows.filter((row) => row.evidence !== "今回の表示変更なし").length,
  unchangedCandidates: rows.filter((row) => row.evidence === "今回の表示変更なし").length,
  beforeCounts,
  afterCounts,
  beforeAverage: Math.round(baselineTotal / baseline.length),
  afterAverage: Math.round((baselineTotal + deltaTotal) / baseline.length),
  outputPath,
};
console.log(JSON.stringify(summary, null, 2));
