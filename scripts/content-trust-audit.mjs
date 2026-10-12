import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const guides = read("lib/guide-pages.ts");
const years = read("lib/year-pages.ts");
const shareCard = read("components/simulation/ShareCard.tsx");
const sharePage = read("app/share/page.tsx");
const shareUrl = read("lib/utils/shareUrl.ts");
const compares = read("lib/compare-pages.ts");
const article = read("content/articles/orukan-vs-sp500.tsx");
const returnArticle = read("content/articles/sp500-vs-nasdaq100.tsx");
const schdVymArticle = read("content/articles/schd-vs-vym.tsx");
const schdSp500Article = read("content/articles/schd-vs-sp500.tsx");
const fundSeo = read("lib/fund-seo.ts");
const fundSeoPages = read("lib/fund-seo-pages.ts");
const home = read("components/views/HomeView.tsx");
const simulation = read("lib/simulation.ts");
const simulatePage = read("app/simulate/[fund]/[year]/page.tsx");
const ogRoute = read("app/api/og/route.tsx");
const sitemap = read("app/sitemap.ts");
const monthly = read("lib/monthly-pages.ts");
const dataSourcesPage = read("app/about/data-sources/page.tsx");
const returnDataSources = read("lib/return-data-sources.ts");
const timeMachine = read("components/views/TimeMachineView.tsx");
const homePage = read("app/page.tsx");
const emotional = read("lib/emotional.ts");
const animatedNumber = read("components/simulation/AnimatedNumber.tsx");
const compareView = read("components/views/CompareView.tsx");
const winnerBanner = read("components/simulation/WinnerBanner.tsx");
const resultCard = read("components/simulation/ResultCard.tsx");
const compareClient = read("app/compare/[slug]/ComparePageClient.tsx");
const analytics = read("lib/analytics.ts");
const recentConditions = read("components/simulation/RecentConditions.tsx");

assert(!guides.includes("評価額は約162万円"), "再現不能なNISA評価額が再混入");
assert(guides.includes("nisaMonthly10kExample.finalValue"), "NISA実績例がsimulate結果を参照していない");
assert(!years.includes("年間リターンは約−18%"), "S&P500の旧固定リターンが再混入");
assert(!years.includes("2023年に約+26%の反発"), "S&P500の旧固定リターンが再混入");
assert(years.includes("formatAnnualReturn(config.fundId, year)"), "年次リターンが動的SSOT参照ではない");
assert(!years.includes("yearFaqs"), "未使用の旧年次FAQ定義が残っている");
assert(shareCard.includes("buildShareUrl") && !shareCard.includes('const url = "https://tsumitate-timemachine.com"'), "ShareCardが条件付きURLを保持していない");
assert(shareUrl.includes("fundB?: FundId") && shareUrl.includes("endYear: number") && shareUrl.includes("endMonth: number"), "共有URLが比較商品または終了年月を保持していない");
assert(sharePage.includes("同じ条件で結果を再現") && sharePage.includes("G品質の参考系列を含むため、商品の優劣は表示しません"), "共有先の条件再現またはG品質境界が不足");
assert(shareUrl.includes('RETURN_SERIES_REGISTRY[fund].quality !== "A"'), "G品質系列が共有URLで拒否されていない");
assert(shareCard.includes("G品質の参考系列を含む結果は、共有用の評価額・損益として公開しません"), "ShareCardがG品質の数値共有を停止していない");
assert(!shareCard.includes("#新NISA"), "共有文が口座条件を確認せず#新NISAを付与している");
assert(!compares.includes('a: "全世界へ地域分散",             b: "米国大型株へ集中"'), "S&P500/NASDAQ100比較の投資範囲が誤っている");
assert(!compares.includes('a: "米国株式市場全体",            b: "10銘柄を均等加重"'), "オルカン/FANG+比較の投資範囲が誤っている");
assert(!compares.includes('b: "全世界の大型・中型株"'), "S&P500を全世界株式とする誤記が残っている");
assert(!compares.includes("過去の実績ではインド株のほうが平均リターンで上回っています"), "India/Emerging比較に表示値と矛盾する優劣主張が残っている");
assert(!compares.includes("テック企業の成長力に賭けて高いリターンを狙いたい"), "VTI/NASDAQ100比較に将来成果を示唆する助言が残っている");
assert(!compares.includes("過去20年のデータではS&P500"), "商品設定前を含む比較主張が再混入");
assert(!article.includes("過去20年以上にわたり"), "記事に商品設定前を含む主張が再混入");
assert(home.includes("商品設定前の期間や欠損値は別系列で補いません"), "トップで独自の検証方針を説明していない");
assert(home.includes("実績期間：2026年8月まで"), "トップでデータ終端を開示していない");
assert(home.includes("条件を選んで積立実績を調べる"), "トップでシミュレーションを主行動として示していない");
assert(home.indexOf("条件を選んで積立実績を調べる") < home.indexOf("条件別の検証例"), "トップで検証例が主行動より先に表示される");
assert(compareClient.includes("tab=compare&fund=") && homePage.includes("parseComparePreset"), "静的Compareから同じ2商品の比較フォームへ条件を引き継いでいない");
assert(analytics.includes("trackShareSuccess") && !analytics.includes('track("compare_click", params);\n  track("compare_start", params);'), "共有成功または比較開始の計測定義がクリックと混在している");
assert(recentConditions.includes("ttm:last-seen-date:v1") && recentConditions.includes("previous < today"), "同日内の表示を再訪として計測する可能性がある");
assert(!timeMachine.includes("2025 + 5 / 12") && timeMachine.includes("getAvailableEndMonth"), "期間表示が旧終端2025年6月へ固定されている");
assert(timeMachine.includes("year: startYear, month: startMonth, amount: monthlyAmount") && homePage.includes("initialAmount={displayedComparePreset.amount}"), "単一結果から比較へ開始年月・月額を引き継いでいない");
assert(homePage.includes("useLayoutEffect") && homePage.includes("}, [displayedTab])") && !homePage.includes('behavior: "smooth"'), "SPA画面切替のスクロールが遷移後も中間位置へ残る可能性がある");
assert(emotional.includes("Math.trunc(profit / 10_000)"), "結果カードと説明文で損益の万円丸めが一致しない");
assert(animatedNumber.includes("useState(value)") && animatedNumber.includes("useRef(value)"), "画面外の結果カードが実値ではなく0円を初期表示する可能性がある");
assert(!compareView.includes("が勝った理由") && compareView.includes("比較する商品の確認事項"), "比較結果から未検証の勝因を断定している");
assert(compareView.includes("resultA.finalValue === resultB.finalValue") && compareView.includes("この条件では期間末評価額が同額です"), "比較UIが同額時に片側だけを優位表示する可能性がある");
assert(winnerBanner.includes("この条件で評価額が高い") && resultCard.includes("この条件で評価額が高い"), "比較UIの優位ラベルが条件限定であることを示していない");
assert(!winnerBanner.includes("🏆 WINNER") && !resultCard.includes(">WINNER<"), "比較UIに推奨と誤認されるWINNER表示が残っている");
assert(winnerBanner.includes('n >= 0 ? "+" : ""') && winnerBanner.includes('winner.returnRate >= 0 ? "+" : ""'), "比較UIが負の損益へ+記号を付ける可能性がある");
assert(winnerBanner.includes('winner.profit >= 0 ? "#10b981" : "#ef4444"'), "比較UIが負の損益を利益色で表示する可能性がある");
assert(dataSourcesPage.includes("現在の収録最終月は2026年8月です"), "Data SourcesがA品質系列の最新終端2026年8月を明示していない");
assert(dataSourcesPage.includes("9つのA系列"), "Data Sourcesが最新終端の対象をA品質9系列に限定していない");
assert(returnDataSources.includes('dataThrough: verified ? definition.endMonth : "原典検証待ち（公開計算の対象外）"'), "Data SourcesがG品質系列を検証済み終端として表示する可能性がある");
assert(returnDataSources.includes('granularity: verified ? `${definition.startMonth}〜${definition.endMonth}の月次データ` : "検証済み月次系列なし"'), "Data SourcesがG品質系列を検証済み月次系列として表示する可能性がある");
for (const phrase of ["配当・分配金を含む総合リターン", "ファンド内部の運用費用控除後", "欠損値を補間せず、別系列でも補わない"]) {
  assert(returnDataSources.includes(phrase), `Data Sourcesの技術用語に読者向け日本語がない: ${phrase}`);
}
assert(returnDataSources.includes("月次の配当込み基準価額リターン") && returnDataSources.includes("欠損時は補完せず、別系列でも補わず計算停止"), "Data Sourcesの使用系列または欠損処理に内部向け英語が残る");
for (const [source, text] of [
  ["年別ページ", years],
  ["比較ページ", compares],
  ["商品Landing", fundSeo],
  ["商品詳細", fundSeoPages],
]) {
  for (const phrase of ["今すぐ始めることが最善", "積み立てを続けること」が最善", "初心者にはおすすめしません"]) {
    assert(!text.includes(phrase), `${source}に未検証の投資行動・適性断定が再混入: ${phrase}`);
  }
}
assert(!guides.includes("損失になった事例はほぼゼロ"), "ガイドに条件不明の長期損失確率が再混入");
assert(!guides.includes("変えないことが成功の鍵"), "ガイドに未検証の成功断定が再混入");
assert(!returnArticle.includes("NASDAQ100の回復力が際立つ"), "暦年リターンを回復力として説明している");
assert(!schdVymArticle.includes('simulate({ fundId: "schd"'), "SCHDのG品質系列が記事の数値シミュレーションへ再混入");
assert(!schdSp500Article.includes('simulate({ fundId: "schd"'), "SCHDのG品質系列が記事の数値シミュレーションへ再混入");
assert(!compares.includes("★★★★★") && !compares.includes("★★★★") && !compares.includes("★★★"), "尺度のないリスク星が比較表へ再混入");
assert(!fundSeoPages.includes("過去40年以上の年平均リターンは約10%"), "商品ページに指数と商品の期間を混同する長期実績が再混入");
assert(!fundSeoPages.includes("10〜20年の長期保有を前提にすれば歴史的には回復"), "商品ページに根拠不明の回復主張が再混入");
assert(simulation.includes("MAX_MONTHLY_AMOUNT = 1_000_000") && simulation.includes("Number.isSafeInteger"), "積立額の共通上限検証がない");
assert(shareUrl.includes("parseStrictInteger") && simulatePage.includes("parseStrictInteger"), "共有・直接URLが部分一致の数値を受理する可能性がある");
assert(ogRoute.includes("isValidMonthlyAmount(monthlyAmount)"), "OGP APIに積立額の共通境界が適用されていない");
assert(!sitemap.includes("lastModified: new Date()"), "実更新日ではないデプロイ時刻がsitemap lastmodへ再混入");
assert(!monthly.includes("5年間の評価額") && !monthly.includes("5年でいくら"), "80か月の月額ページが5年間と表示されている");
for (const currentArticle of [article, returnArticle, schdVymArticle, schdSp500Article, read("content/articles/orukan-vs-nasdaq100.tsx"), read("content/articles/vti-vs-orukan.tsx")]) {
  assert(!currentArticle.includes("2020年1月〜2025年6月"), "比較記事に旧終端2025年6月が残っている");
}

if (fs.existsSync(path.join(root, ".next/server/app/guide/nisa-tsumitate-ikura.html"))) {
  const built = read(".next/server/app/guide/nisa-tsumitate-ikura.html");
  const ledger = JSON.parse(read("data/verified/orcan-monthly.json"));
  const returns = new Map(ledger.observations.map(({ month, monthlyReturn }) => [month, monthlyReturn]));
  let expectedValue = 0;
  for (const [month, monthlyReturn] of returns) {
    if (month < "2020-01") continue;
    expectedValue = (expectedValue + 10_000) * (1 + monthlyReturn);
  }
  const expectedDisplay = `${Math.round(expectedValue).toLocaleString("ja-JP")}円`;
  assert(!built.includes("約162万円"), "生成HTMLに旧評価額が残存");
  assert(built.includes(expectedDisplay), `生成HTMLにSSOT評価額（${expectedDisplay}）が見つからない`);
}

if (fs.existsSync(path.join(root, ".next/server/app/about/data-sources.html"))) {
  const built = read(".next/server/app/about/data-sources.html");
  assert(built.includes("現在の収録最終月は2026年8月です"), "Data Sourcesの生成HTMLにA品質系列の最新終端がない");
  assert(built.includes("G：参考データ・原典未検証") && built.includes("原典未検証の年次参考系列"), "Data Sourcesの生成HTMLでSCHDのG品質境界が不明確");
  assert(built.includes("参考系列") && built.includes("原典検証待ち（公開計算の対象外）"), "Data Sourcesの生成HTMLがSCHDの参考期間と公開計算対象外を区別していない");
  for (const phrase of [
    "reinvested",
    "total-return",
    "net of fund expenses",
    "reflected in NAV",
    "converted with BOJ month-end USD/JPY",
    "product observations only; no pre-inception backfill",
  ]) {
    assert(!built.toLowerCase().includes(phrase.toLowerCase()), `Data Sourcesの生成HTMLに内部向け英語が残る: ${phrase}`);
  }
}

if (failures.length) {
  console.error(failures.map((message) => `ERROR: ${message}`).join("\n"));
  process.exit(1);
}
console.log("PASS: P0の数値整合、商品設定期間、データ終端と独自検証方針を確認");
