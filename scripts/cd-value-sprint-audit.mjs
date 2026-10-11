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
    evidence: ["元本割れ月数", "月末の最大乖離", "日中の最大下落率や将来の回復期間ではありません"],
    delta: 8,
    overlap: "開始年だけが異なる共通テンプレート",
    gap: "最終順位だけでは、その年から始めた途中経過や元本割れ期間を把握できなかった",
    improvement: "検証済み月次系列から年・商品ごとの元本割れ月数、観測期間、最大月末差額を再計算し、日中下落率と区別",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/ranking" || path.startsWith("/ranking/"),
    evidence: ["数値順位の計算方法", "期間末評価額の高い順", "順位外の参考情報として分けます"],
    delta: 8,
    overlap: "同じ商品集合を別条件で並べる共通テンプレート",
    gap: "静的な編集順位と実績順位が混在し、対象期間、算出条件、除外理由を再現しにくかった",
    improvement: "simulateの円単位評価額から動的に順位を生成し、開始月・終了月・月額・A品質限定・欠損時非補完・順位外参考を明示",
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
    match: (path) => path === "/guide/dollar-cost-averaging",
    evidence: ["平均購入単価の低下や利益を保証する手法ではありません", "同じ積立でも結果が変わる3つの条件"],
    delta: 5,
    overlap: "積立継続・暴落ガイドと判断材料が重なっていた",
    gap: "購入口数が増える仕組みと、利益保証ではない点の区別が弱かった",
    improvement: "定額購入の仕組み、比較条件、停止と売却の違いを分けて説明",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/guide/nisa-tsumitate-ikura",
    evidence: ["家計から積立額を決める確認手順", "年間枠は目標額ではなく上限"],
    delta: 5,
    overlap: "制度入門と月額シミュレーションの説明が重なっていた",
    gap: "金融機関固有の最低額・ポイントと制度上限が混在していた",
    improvement: "家計、使用時期、制度上限、過去実績を順に確認できる構成へ変更",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/guide/tsumitate-nansnen-keizoku",
    evidence: ["元本割れをなくす固定年数はない", "積立年数を決めるための確認順序"],
    delta: 5,
    overlap: "老後資金・出口戦略ガイドと長期積立の一般論が重なっていた",
    gap: "商品設定後の実績範囲と資金の使用時期を結び付ける手順が弱かった",
    improvement: "検証可能期間、元本、評価額、使用時期を同じページで再現可能に整理",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/guide/tsumitate-vs-ikkatu",
    evidence: ["比較は同じ元本・期間・買付時点で行う", "制度上実行できない条件を実績比較に使わない"],
    delta: 5,
    overlap: "暴落時の一括・積立ガイドと結論が重なっていた",
    gap: "一括優位という一般論と、当サイトの積立実績が混同されやすかった",
    improvement: "比較条件とNISA制度上の買付条件を明示し、優劣の断定を削除",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/guide/booraku-tsumitate-yameru",
    evidence: ["積立停止・保有継続・売却は別々に判断する", "価格が下がり続ければ評価損は拡大します"],
    delta: 5,
    overlap: "暴落対処・積立継続ガイドと助言が重なっていた",
    gap: "継続すれば有利という断定と制度上の売却時点が混在していた",
    improvement: "停止・保有・売却を分離し、家計と使用時期で確認する手順へ変更",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/guide/ikkatsu-vs-tsumitate-booraku",
    evidence: ["同額を初日に一括投資した結果は表示していない", "未投資資金が残る"],
    delta: 5,
    overlap: "一括対積立ガイドと同じ優劣説明になっていた",
    gap: "積立実績だけから一括投資との下落耐性を結論づけていた",
    improvement: "投資済み金額の差だけを説明し、未計算の一括結果との優劣を撤回",
    action: "IMPROVE",
  },
  {
    match: (path) => path === "/guide/kodomo-nisa-hikidashi",
    evidence: ["払出し前に金融機関へ確認するチェックリスト", "制度の骨格と金融機関の受付実務は別"],
    delta: 5,
    overlap: "こどもNISA制度概要と払出し条件が重なっていた",
    gap: "年齢条件だけでなく実際の申出・入金までに確認する項目が不足していた",
    improvement: "年齢、使途、書面、申出、入金日、払出し後の扱いを実務チェックに整理",
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
