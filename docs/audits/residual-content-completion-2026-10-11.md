# AdSense再申請前・残件完全解消スプリント（2026-10-11）

## 公開済み変更

- commit: `c9f0da68ee72b0035e8d67f41035fa61ac33325a`
- GitHub Actions: QA Check #82 Success（1分23秒）
- Vercel: Production / Active / Deployed
- production deployment: `https://tsumitate-timemachine-9286oajxr-nandemo-labs-projects.vercel.app`
- 本番96 URL: HTTP 200 = 96/96

## 未使用年次定義

`lib/year-pages.ts` の `yearFaqs` は型・設定オブジェクト以外から参照されておらず、生成される `YEAR_PAGES` は共通の中立FAQだけを使用していた。4商品分の未使用FAQを削除し、年次リターンの `formatAnnualReturn(config.fundId, year)`、シミュレーション条件、関連リンクは維持した。

## Landing / Fund 4組

| Landing | Fund | 結論 | 独立価値 | 今後の条件 |
|---|---|---|---|---|
| `/orukan` | `/fund/orukan` | KEEP BOTH | Landingは積立額・開始年の条件変更、Fundは正式商品、設定日、費用、データ品質、出典 | Query × Pageで意図分離が否定された場合のみFund残しの統合を再検討 |
| `/sp500` | `/fund/sp500` | KEEP BOTH | 同上 | 同上 |
| `/nasdaq100` | `/fund/nasdaq100` | KEEP BOTH | 同上。集中度の確認情報はFund側 | 同上 |
| `/vti` | `/fund/vti` | KEEP BOTH | Landingは米国ETFの積立体験、FundはETF属性・費用・銘柄数・出典 | 同上 |

本文テンプレートの類似は残るが、主要機能、H1、検索意図、次の行動が異なる。現時点では統合を実施しない。統合する場合の仕様はFundを残し、Landingから単段301、Fund自己canonical、sitemapと内部リンク更新、独立commitのrevertでrollbackとする。

## Compare / Article 4組

| ペア | Compareの答え | Articleの答え | 結論 |
|---|---|---|---|
| オルカン / S&P500 | 共通94か月の積立額・評価額・グラフ | 地域構成、費用、重複、数値の読み方 | KEEP BOTH / ROLE SEPARATION |
| オルカン / NASDAQ100 | 共通期間の同条件結果 | 全世界分散と米国非金融大型株集中の構造差 | KEEP BOTH / ROLE SEPARATION |
| S&P500 / NASDAQ100 | 共通期間の同条件結果 | 指数採用範囲、重複、集中度、費用 | KEEP BOTH / ROLE SEPARATION |
| VTI / オルカン | 共通期間の同条件結果 | 米国市場全体と全世界の地域分散、ETF/投信の違い | KEEP BOTH / ROLE SEPARATION |

共通する商品概要とFAQはあるが、Compareの主成果物は再計算可能な数値とグラフ、Articleの主成果物は構造・費用・結果解釈である。検索流入のあるCompareは保護する。Article側の役割は前回commitまでに整理済みで、今回はURL・title・H1・canonicalを変更していない。Query × Page原票で同一クエリの競合が確認された場合はArticle統合候補として再評価する。

## ShareCard監査と改善

### 修正前

- コピー・X投稿URLが常にトップページで、商品・開始月・月額を復元できなかった。
- `/share` はトップへ条件付きredirectしたが、トップ画面がパラメータを利用していなかった。
- 比較商品、終了年月、品質区分を共有URLが保持しなかった。

### 修正後

- URLへ `fund`、`fundB`、開始年月、終了年月、月額を保存。
- `/share` で同じ条件を再計算し、元本、期間末評価額、損益、積立回数、A/G品質を表示。
- 不正商品・設定前・範囲外は既定値へ置換せず、再計算停止を表示。
- G品質を含む共有結果では優劣ラベルを表示しない。
- OGP APIにも終了年月を渡し、本文と画像の計算期間を一致させた。

独立再計算例（2020-02〜2026-08、月3万円、79回）:

- オルカン: 元本2,370,000円、期間末評価額5,067,353円、損益2,697,353円
- S&P500: 元本2,370,000円、期間末評価額5,297,065円、損益2,927,065円

ローカル共有画面の表示値は万円丸めで上記と一致した。

## UI改善

- Data Sourcesの公式リンクへ `max-width`、折返し、左寄せを追加。
- 375px: viewport 375 / document 371、長いリンクの要素幅とscroll幅が一致。
- 共有結果375px: document幅375、カード幅343.2px、横溢れなし。
- G品質共有結果390px: document幅390、優劣表示なし、横溢れなし。
- ブラウザconsole error / warning: 0。

## 96 URL監査

- 本番台帳: `docs/audits/final-96-production-audit-2026-10-11.csv`
- ローカル台帳: `docs/audits/final-96-local-residual-audit-2026-10-11.csv`
- 本番・ローカルとも96/96 HTTP 200。
- 分類: KEEP 84、ROLE SEPARATION 11、IMPROVE 1。
- 高類似は商品Landingテンプレート間で、Landing/Fund間の自動的な統合根拠とはしない。

## 未完了事項

1. 今回のShareCard・旧定義・Data Sources改善はローカルのみで、本番未確認。
2. Search ConsoleのQuery × Page原票は未取得。保存済みPage/Query別エクスポートだけではカニバリを確定できない。
3. AdSense再申請は本番反映後の実地確認と最終レビューまで実行しない。

