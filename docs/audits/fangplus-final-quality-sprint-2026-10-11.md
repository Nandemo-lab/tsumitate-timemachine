# FANG+統合準備・最終品質改善（2026-10-11）

## 1. 実施範囲

- 公開済み99 URLを、既存の品質台帳、2026-10-11取得のGSC原票、生成HTML、PC・375px・390pxの実画面で再確認した。
- `f65df03721bfae90a86f6f40ea7eb9f60708d2c1` は4比較記事の購入助言を商品構造・費用・重複・結果の読み方へ変更するcommitで、商品データ、計算、URL、canonical、robots、sitemap、AdSenseには変更がない。
- 構造変更は未実施。`/fang` のredirect、削除、canonical、noindexは承認待ちのまま維持した。

## 2. FANG+ 2 URLの最終判断

### 実測と履歴

|項目|`/fang`|`/fund/fangplus`|
|---|---|---|
|現在の役割|固定条件の結果とシミュレーターへの入口|正式商品、費用、設定日、データ品質、出典|
|GSC 最新28日|0クリック / 3表示（www/non-www合算）|行なし|
|GSC 直前28日|0クリック / 1表示|行なし|
|GSC 過去3か月|0クリック / 6表示|行なし|
|初出|2026-06-17 `1302923`|2026-06-24 `073011c`|
|canonical|自己参照 `/fang`|自己参照 `/fund/fangplus`|
|sitemap|掲載|掲載|
|第三者被リンク|未確認|未確認|

GSCリンクレポートで確認できた外部リンク28件は`vercel.app`由来で、独立した第三者被リンクは確認できない。GSCの標準エクスポートには匿名化・行数制限があり、Query × Pageの完全原票ではない。この限界を流入ゼロの断定には使わない。

### 判断

**MERGE CANDIDATE。残すURLは `/fund/fangplus`。** 2 URLはいずれも同じ商品名・固定条件の積立結果・FAQを持ち、検索実績も独立需要を裏付けていない。詳細ページへ操作導線を残せば、商品情報から再計算まで一つの検索意図として完結できる。

### 承認後の実装仕様

1. `/fund/fangplus` を唯一のindex対象として残す。
2. 同ページの「自分の条件でシミュレーション」を `/simulate/fangplus/2020` へ維持する。開始年月・月額変更、元本、評価額、利益、検証期間、A品質表示を失わない。
3. 固定の紹介結果は商品設定後の公式月次系列だけで計算する。設定前・欠損補完・別系列fallbackは禁止する。
4. `/fang` は `/fund/fangplus` へ恒久的な301 redirect。クエリを受け取る既存仕様はないため、捏造して移送しない。
5. `lib/fund-seo.ts` のFANG定義、`FUND_SEO_PAGES`、`generateStaticParams`、内部リンク、関連カード、sitemapから旧URL生成を外す。
6. `/fund/fangplus` のcanonical・OGP・Breadcrumb・FAQ JSON-LDは自己参照のまま維持する。
7. 旧URL、www/non-wwwを含むredirect、sitemap非掲載、内部リンク0件、404なしをQAへ追加する。
8. 公開後にGSCの旧URLクリック・表示、転送先、インデックス状態を読み取りで確認する。URL削除ツールは使用しない。

今回は1〜8を実装していない。

## 3. FANG+内容の安全な事前改善

URL変更なしで、`lib/fund-seo.ts` と `lib/fund-seo-pages.ts` が生成する導入・FAQを次へ整理した。

- 「ハイリスク・ハイリターン」「上級者」「攻め型」「コア／サテライト」の適性・優劣表現を削除。
- 10銘柄均等加重、定期見直し、銘柄集中、費用、他商品との重複という確認可能な属性へ限定。
- 固定の構成銘柄一覧を現在値として断定せず、指数提供元・運用会社の最新資料で確認する説明へ変更。
- 信託報酬は `formatExpenseRatio("fangplus")` を参照。
- A品質の公式月次実績、設定日、シミュレーション導線は維持。

一方、`/fund/fangplus` の基本情報欄には `lib/funds.ts` の既存説明用フィールドから「超高リスク」「15年以上（覚悟が必要）」等が表示される。これはURL統合とは別の共有定義であり、今回のSSOT・数値データ非変更条件では変更していない。統合実装時には、機械算出された指標か編集上の評価かを分け、根拠を再現できない推奨期間・適性表現を表示しない設計にする。

## 4. Compare / Article 6組

Compareは同じ開始月・月額・終了月の数値、グラフ、条件変更を担当し、Articleは商品構造、費用、保有銘柄の重複、結果の読み方を担当する。

|ペア|過去3か月 Compare|過去3か月 Article|判断|
|---|---:|---:|---|
|オルカン / NASDAQ100|20クリック / 908表示|5クリック / 340表示（www合算）|KEEP BOTH。両URLに実需要。Articleの助言を属性確認へ変更|
|SCHD / S&P500|7 / 118（www合算）|3 / 166|KEEP BOTH。G品質境界を保った役割分離済み|
|S&P500 / NASDAQ100|2 / 174（www合算）|0 / 52（www合算）|ROLE SEPARATION。Articleのコア／サテライト・適性を削除|
|SCHD / VYM|3 / 45|0 / 21|ROLE SEPARATION。公式商品属性とG品質実績を分離済み|
|VTI / オルカン|3 / 68|0 / 9|ROLE SEPARATION。ETFと国内投信の売買方法・地域重複へ限定|
|オルカン / S&P500|0 / 119（www合算）|行なし|ROLE SEPARATION。CompareのURL・title・H1・canonicalを保護しArticleの助言を削除済み|

最新28日の主な結果も同傾向で、Compare `/compare/orukan-vs-nasdaq100` は17クリック / 790表示、Articleは3 / 178だった。GSCの通常エクスポートはqueryとpageを別表にするため、6組すべての完全なQuery × Page結合は取得できない。検索語が同じだけで統合せず、表示内容とURL別実測を合わせて判断した。

## 5. ハブ・From・Ranking

- 7ハブ（`/guide`、`/compare`、`/fund`、`/articles`、`/guide/tax`、`/guide/system`、`/guide/booraku`）は質問・確認目的別の入口を表示し、単なる全リンク列挙ではない。独自計算ではなく、迷わず該当ページを選べる情報設計を役割とする。
- From 6ページは各開始年について、積立回数、元本、期間末評価額、元本割れ月数、月末の最大乖離を検証済み系列から個別計算して表示する。6 URLすべてで表示を確認した。
- Ranking 5ページは集計条件、対象期間、月額、A品質限定、欠損非補完、G品質の順位外表示、円単位評価額による順位を明示する。目的別説明は異なるが数値計算は同じ監査可能な関数を使う。

## 6. 99 URLの処遇

- KEEP / IMPROVE / ROLE SEPARATIONの安全な改善は実装済み。法律・ポリシーページは一般記事と同じ検索評価で削除候補にしない。
- 承認が必要な構造候補は `/fang` の1件。今回の確認範囲では、ほかに新しいMERGE / NOINDEX候補を増やしていない。
- From、Ranking、ハブは固有計算またはナビゲーション上の独立役割を確認したため維持する。
- 99 URLの品質台帳は `docs/audits/content-quality-2026-10-11.csv`、変更履歴は各AdSense監査文書を正とする。本監査は機械点をAdSense合否と同一視しない。

## 7. 再申請判断

技術・事実・計算の重大問題ではなく、URL重複の最終構造判断が残っている。`/fang` 統合を承認・公開し、公開後の実URLと内部リンクを再監査するまではAdSense再申請を **NO-GO** とする。Googleの審査結果を保証するものではない。

## 8. 検証結果

- lint: 0 errors / 0 warnings
- TypeScript: `npx tsc --noEmit` 成功
- Build: Next.js 16.3.5、231ページ生成、成功
- 通常QA: 131ページ、SCORE 100/100、ERROR 0、WARNING 0
- ライブQA: 131ページ、SCORE 100/100、ERROR 0、WARNING 0。Metadata / JSON-LD / Internal Links / Canonical / OGP はすべてPASS
- content trust / zero-page / system-check / verified ledger / return series / compare return / OGP comparison audit: すべてPASS
- content value audit: sitemap 99 URL、C/D基準51ページを検査。表示改善45、未変更候補6。機械再評価は B 57 / C 32 / D 10、平均64点。これはAdSense合否判定には使用しない
- PC 1040px、375px、390pxで変更3記事とFANG+ 2 URLを実画面確認。ページ全体の横スクロール、ブラウザerror/warningなし。390pxの比較表は353px内に収まった
- 本番では7ハブ、From 6、Ranking 5を390pxで全URL確認し、代表4URLをPCで確認。From固有指標、Ranking条件、ハブの質問別導線を確認した
