# AdSense 公開ページ価値監査（2026-11-09）

## 対象と前提

- sitemap: 98 URL（重複なし）
- sitemap 外で到達可能な noindex ツールを含む監査台帳: 131 URL
- URL 別台帳: `docs/audits/page-value-ledger-2026-11-09.csv`
- GSC Query × Page / 被リンク: **NOT MEASURED**。GSC Wizard は trial 終了で読み取り不能だったため、削除・301・noindex の判断材料には使用していない。
- 独立レビューは実在の Google 審査員・実ユーザーではなく、金融、初心者、UX、AdSense 公式基準の役割別仮説レビュー。

## Google 公式基準との対応

| 公式観点 | 本番で確認できる根拠 | 判定 |
| --- | --- | --- |
| 独自で実質的な価値 | Compare の同条件比較、From の開始年別9系列比較、検証済み月次データと元本割れ分析 | 強み |
| 完結した回答 | Guide の先出し結論・注意点・一次資料、記事から試算への条件付き導線 | 維持 |
| Who / How / Why と信頼性 | `/about` の編集・検証工程、`/about/data-sources` の raw・SHA・品質区分 | 強み |
| ナビゲーション | `/guide` の検索・カテゴリ、パンくず、ページ固有の「次に読む理由」 | 改善済み |
| 低価値・重複画面の抑制 | 固定年・固定月額の派生ツールは原則 noindex。sitemap 外の indexable URL は0件 | 維持 |

公式参照: AdSense Site Approvals（Quality Content / Navigation / Rejections and Next Steps）、AdSense Publisher Policies、Ready for AdSense、Google Search の people-first content guidance。

## Ranking 4ページ

| URL | 固有の役割 | 結論 |
| --- | --- | --- |
| `/ranking` | A品質系列を同じ期間・月額で横断比較 | 維持 |
| `/ranking/nisa` | NISA候補を公式制度条件と同条件実績に分けて確認 | 維持・観測 |
| `/ranking/high-return` | NASDAQ100・FANG+・S&P500の期間末結果だけでなく、元本割れ月数と最大月末評価損を比較 | 今回改善 |
| `/ranking/high-dividend` | A品質VYMの実績とG品質SCHDの商品属性を混ぜずに確認 | 維持。ただしURLの「ranking」と数値ランキングを行わない内容の語感差は残る |

今回、4ページ共通だった一般的な関連リンクをページ固有の学習導線へ置換し、根拠を表示していなかった「人気ページ」欄を削除した。検索資産が未測定のためURL統合・削除・noindexは行わない。

## Landing / Fund / From の役割分離

- Landing (`/orukan` 等): 商品を選び、開始月・月額を変えて過去積立を操作する画面。
- Fund (`/fund/orukan` 等): 正式名称、設定日、費用、NISA区分、一次資料、A/G品質を確認する参照画面。
- From (`/from/2020` 等): 開始年を固定し、A品質9系列を積立回数・元本・評価額・損益・元本割れ経路で横断比較する画面。

同じ銘柄名は登場するが、主操作・判断材料・読者の次行動が異なる。現時点では統合より役割表示の維持が安全。

## 残存リスク

1. Ranking root と NISA は対象集合が近く、GSC実測が得られるまでは検索意図の重なりを否定できない。
2. `high-dividend` は品質境界を守るため数値順位を出せず、URL名と内容に語感差がある。検索資産未測定のためURL変更は保留。
3. サイト全体の共通フッター・FAQ・関連記事が長いページではテンプレート感を生みうる。今回、Ranking の根拠不明な共通リンクは削減したが、全ページ一括削減は回遊・SEOへの影響が未測定なので行わない。
4. Google の個別不承認理由は公開情報から特定できず、改善後の承認は保証できない。

## 品質ゲート

- 131 URL価値台帳: 生成完了、sitemap外のindex可能URL 0
- sitemap: 98件 / 98 unique
- 375 / 390 / 768 / 1280px: 代表8画面で横スクロール、H1欠落、canonical欠落 0
- lint / TypeScript / build: PASS
- QA: 132ページ、ERROR 0、WARNING 0
- Verified Ledger / Return Series / G-quality boundary / Content Trust / System Check: PASS

## 再申請判断

**条件付きGO**。技術・金融・重複制御の必須問題は今回の範囲で確認されなかった。再申請前に必要な本人判断は、GSC実測なしでも現状の価値改善を根拠に申請するか、無料の公式Search Console画面でRanking 4ページのQuery × Pageを確認してから申請するか、の選択である。
