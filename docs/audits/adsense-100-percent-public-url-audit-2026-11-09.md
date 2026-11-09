# AdSense再申請前 全公開URL実地監査

- 実施日: 2026-11-09
- 基準Production: `d0c8469cf1385d6157a2ff08f052fa3e0a995ab3`
- 対象: `https://tsumitate-timemachine.com`
- 注意: Google審査担当者・実ユーザーによるレビューではなく、公開HTML・Chrome・ソース・監査コードによる役割別仮説レビュー。

## 1. URL母集団

- sitemap/index対象: 98 URL
- sitemap外・noindex・機能画面・404: 34 URL
- 合計: 132 URL
- index対象のChrome観測: 98 URL × 4幅 = 392
- sitemap外等のChrome観測: 34 URL × 390px = 34
- 合計Chrome観測: 426
- 保存画像: 各観測につきファーストビューと全画面の2枚、合計852枚
- 監査失敗: 0

監査結果JSONと画像は `.artifacts/full-public-url-audit-d0c8469/` に保存。全件でHTTP、H1、canonical、robots、JSON-LD、画像読込、横はみ出し、パンくず、内部リンク数、出典、更新表示を収集した。

## 2. 全URL台帳

`docs/audits/page-value-ledger-2026-11-09.csv` に132 URLを一意に記録。index対象ではHTTP 200、H1、canonical、index設定、JSON-LD、画像表示、横はみ出しに失敗なし。sitemap外でindex可能なURLは0。

固定年20件、大半の固定月額、共有・直接シミュレーション等はnoindexで、検索結果向けの大量派生として扱っていない。`/orukan/monthly/30000` は既存検索資産を保護する例外。

## 3. 全48記事の精読台帳

`docs/audits/article-quality-ledger-2026-11-09.csv` に42 Guide + 6 Articleを記録。

全48件で確認できた項目:

- 固有H1と冒頭回答
- 元本割れ・損失・下落等のリスク説明
- 過去実績が将来を保証しない旨
- 更新日または制度確認日
- 関連記事
- シミュレーションまたは比較への導線

32制度確認記録は180日・365日の期限超過なし。機械抽出で長文候補となった4件は個別にHTML・390px全画面を確認した。比較表・目次・リンク列を静的HTML抽出が連結したもの、または補足details内の具体例であり、初期表示の結論・重要リスクが隠れる問題ではなかった。VTI比較記事で別途確認した助言的な費用・適性表現は今回中立化した。

## 4. 今回発見した問題

### P0

なし。未検証数値公開、A/G品質混同、計算fallback、重大な金融誤記、index障害は検出されなかった。

### P1

1. 商品LandingとFund詳細が「一次情報を確認するページ」と説明しているのに、初期表示内に原典URL・収録期間・原典確認日が直接表示されていなかった。
2. `/articles/vti-vs-orukan` に「業界最低水準」「使いやすい商品」「初心者にはどちら」といった、比較条件を示さず適性や費用を評価する表現が残っていた。

対応:

- 商品Landing 5件へ、Return Series SSOTから原典、収録開始・終了、確認日、非補完方針を表示
- Fund詳細7件へ、原典、月次系列範囲、確認日、A/G別の利用制約を表示
- VTI比較記事を注文方法、NISA枠、費用確認先という事実ベースへ変更
- NASDAQ100比較2記事のmeta titleを「どちらが向いているか」から「確認点」へ変更
- Content Trust監査へ根拠のない費用・適性表現の再発防止を追加

### P2

- `/ranking` と `/ranking/nisa` は分析目的を分けているが同じ台帳を使うため類似性がある
- `/ranking/high-dividend` はVYMの検証済み結果とSCHDのG品質属性を分離しており、URL名から複数商品の数値順位を期待される可能性がある
- 固定条件派生はnoindexで抑制済みだが、共通テンプレートの類似性自体は残る

GSC・被リンクを正式経路で取得できないため、URL削除、301、追加noindexは実施せず本人承認待ち候補とした。

### P3

title/description長のQA INFO。Query × Page・CTRの実測なしに全件変更すると検索資産を損なうため一括変更しない。

## 5. 重複・派生ページの処遇

- Landing: 条件変更と検証済み過去試算
- Fund: 正式商品・費用・設定日・NISA区分・一次資料
- Compare: 同期間・同元本の2商品比較と途中リスク
- From: 同じ開始時点の横断比較
- Ranking: 分析軸別の過去結果。将来推奨と分離
- 固定条件: 原則noindex・sitemap外

LandingとFundに同じ結果を重複掲載しない既存分離を維持し、今回Fund側の原典証拠を強化した。

## 6. 金融回帰

- A品質: 9系列
- データ終端: 2026-09
- 重複・欠損・不正値・lookahead・fallback: 0
- SCHD: G品質を維持し、評価額・利益・順位に不使用
- Verified Ledger: PASS
- Return Series: PASS
- Simulation Insights: A品質9系列PASS
- 商品設定日前の補完: なし

## 7. 公式基準

- Google Publisher Policies: 低コンテンツ・ナビゲーションだけの画面・自動生成で未レビューの画面を広告対象にしない
- AdSenseサイト準備ガイド: 独自性、関連性、明確なナビゲーション
- People-first content: 独自情報・分析、正確性、YMYLでの信頼性、検索流入だけを目的にした量産の回避
- Search Essentials: クロール可能性と技術要件。ただし適合は掲載・承認の保証ではない
- Site Approvals動画: プレイリストは確認。字幕・内容を取得できず、全動画を視聴済みとは扱わない

## 8. 検証

- lint: PASS
- TypeScript: PASS
- production build: PASS（223静的ページ）
- QA: 132ページ、ERROR 0、WARNING 0
- Content Trust: PASS
- 金融監査一式: PASS
- System Check: 32件、期限超過0

ローカルlive QAは、監査スクリプトがcanonicalの本番URLへ接続する仕様と実行環境のlocalhost分離により取得失敗した。本番公開後に本番URLを対象として再実行し、未検証のままPASSにはしない。

## 9. 残存リスク

- 実ユーザー調査は未実施
- 公式GSC Query × Pageと被リンクはNOT MEASURED
- Googleの非公開審査ロジックは確認不能
- Ranking類似ページの不可逆な統合判断には検索資産の証拠が必要

AdSense再申請、URL削除、301、追加noindex、課金、DNS・Vercelプラン変更は実施していない。
