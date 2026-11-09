# AdSense低価値コンテンツ対策 最終品質再構築監査

- 確認日: 2026-11-09
- 対象: `https://tsumitate-timemachine.com`
- 基準Production SHA: `ed1ca9d2f9cfa6bdb2ba9f6fbd290b079776dd5f`
- 評価方法: 公開HTML、ローカル生成物、URL価値台帳、Chrome実画面、既存の金融監査を突合
- 注意: Google審査担当者や実ユーザーによる評価ではない。金融専門家・初心者・UX・AdSense観点は役割別の反証レビューである。

## 1. Google公式基準とサイト上の証拠

| 公式資料 | 確認した観点 | サイト上の対応証拠 |
|---|---|---|
| Google Publisher Policies「Google-served ads on screens without publisher-content」 | コンテンツがない画面、低価値画面、誘導・ナビゲーションだけの画面に広告を置かない | index対象98 URLは固有目的・本文・機能を持つ。シミュレーション共有・固定年など22 URLはnoindex。価値台帳で目的・機能・固有分析をURL単位で記録 |
| AdSense「サイトのページが AdSense のご利用条件を満たしているか確認する」 | 独自性、関連性、明確なナビゲーション、利用者が戻る理由 | Verified Ledgerを使う試算、商品比較、途中リスク分析、記事検索・関連記事導線、About/Data Sources/Privacy/Contact/Disclaimer |
| Search Central「有用で信頼性の高い、ユーザー第一のコンテンツ」 | 独自情報・分析、正確性、YMYLでの信頼、検索流入だけを目的にした量産を避ける | A品質9系列、SCHD G品質境界、一次資料、制度確認日、計算条件、過去実績と将来予測の分離 |
| Search Essentials | クロール可能性、技術要件、スパム回避。ただし技術適合だけで掲載・承認を保証しない | sitemap 98 URL、index可能なsitemap外URL 0、canonical、robots、JSON-LD、パンくずを検査 |
| Site Approvals動画プレイリスト | 公式動画シリーズの存在と対象を確認 | YouTube側の本文・字幕を取得できず、動画内容を視聴済みとは扱っていない |

公式文書の確認日はいずれも2026-11-09。People-first文書の表示更新日は2026-10-07、Search Essentialsは2025-12-18。AdSenseヘルプページでは明確な更新日表示を確認できなかった。

## 2. URL母集団と価値台帳

- sitemap掲載・index対象: 98 URL
- 公開ページ監査: 132 URL（index/noindex、ツール画面、404検証を含む）
- sitemap外でindex可能なURL: 0
- 記事: Guide 42件 + Article 6件 = 48件
- 台帳: `docs/audits/page-value-ledger-2026-11-09.csv`

台帳はURLごとに、目的、想定読者、検索意図、固有情報、固有機能、固有分析、出典、更新表示、重複相手、低価値リスク、改善内容、実物証拠、読後の理解、最終処遇を記録した。GSC実測と被リンクは公式の読み取り接続を利用できないため `NOT MEASURED` とした。

最終処遇の集計:

- 維持: 91
- 改善済み・観測継続: 6
- noindexツールとして維持: 12
- 改善対象: 1
- noindex維持: 22

## 3. 問題分類と対応

### P0

確認されず。未検証の金融数値公開、A/G品質混同、計算のfallback、重大なindex障害は検出されなかった。

### P1（今回修正）

`/fund/orukan` などの商品図鑑で、「初心者向け」「信頼性」「超低コスト」「大きな急騰は期待しにくい」等、根拠が曖昧な評価語が残っていた。これは商品固有の事実より助言・宣伝に見え、金融YMYLと低価値判定の双方で不利になる。

対応:

- `lib/funds.ts` の商品説明を、投資対象、指数、銘柄範囲、注文通貨、税、為替、分配金の事実へ置換
- 高配当を「下落しにくい」「将来も分配される」と誤解させない注意を明示
- 再発防止を `scripts/content-trust-audit.mjs` に追加

### P2（残存観測）

- `/ranking` と `/ranking/nisa` は目的説明と分析軸を分けているが、同じVerified Ledgerを基礎とするため類似性が残る
- `/ranking/high-dividend` はURL名に対し、検証済みVYM数値とG品質SCHDの商品属性を分離して表示する構造。誤数値はないが、検索者が複数商品の数値順位を期待する可能性がある
- 固定年・固定月額の派生構造は低価値化しやすい。現状は20固定年ページと大半の固定月額をnoindexにし、唯一の検索資産例外を保護

検索資産を公式GSCで確認できないため、URL削除、301、追加noindexは実施していない。

### P3

QAのtitle/description長のINFO。技術エラーではなく、検索意図やCTR実測なしに一括変更すると検索資産を毀損するため保留。

## 4. ページ群ごとの存在理由

- Home/Landing: 条件を入力し、検証済み月次データで実際に試算する
- Fund: 商品の指数、費用、設定日、一次資料、品質境界を確認する
- Compare: 同じ期間・同じ元本で2商品を比較し、期間末差と途中リスクを読む
- Ranking: 過去の同条件結果を分析軸別に読む。将来推奨とは分離
- From: 開始時点を固定し、同じ開始条件で商品差を見る。index対象とnoindex派生を分離
- Guide/Article: 初心者の疑問を解説し、具体的な試算・比較へ接続する
- Data Sources/About/法務: データ、更新、運営、訂正受付、免責の透明性を提供する

LandingとFundで同じ結果カードを二重掲載する構造は解消済み。Landingは試算、Fundは一次資料と商品情報へ役割分離した。

## 5. 48記事の編集結果

42 Guideと6 Articleを台帳・HTMLで確認した。記事固有の検索意図、冒頭回答、注意点、関連記事、試算または比較への導線を確認。制度・税制を扱う32件は `systemCheck` を持ち、180日・365日の期限超過なし。

今回、固有の欠陥を確認できない記事へ一般論を追記することは、AI的な水増しと重複を増やすため行っていない。記事の追加も行っていない。

## 6. 実ブラウザ証拠

Chrome/CDPで次の14ページを375 / 390 / 768 / 1280pxで確認（56観測）。

`/`, `/about`, `/about/data-sources`, `/orukan`, `/fund/orukan`, `/ranking`, `/ranking/nisa`, `/ranking/high-return`, `/ranking/high-dividend`, `/from/2020`, `/compare/orukan-vs-sp500`, `/guide`, `/guide/kodomo-nisa`, `/articles/orukan-vs-sp500`

全観測でH1・canonicalを確認し、横方向の恒常的なはみ出しは0、ページ準備失敗は0。証拠画像は `.artifacts/adsense-final-production-{width}/` に保存。

## 7. 金融・技術回帰

- lint: PASS
- TypeScript: PASS
- Next.js production build（webpack）: PASS、223静的ページ
- QA: 132ページ、ERROR 0、WARNING 0
- Content Trust: PASS
- Verified Ledger: A品質9系列 PASS（欠損・重複・lookahead・fallback 0）
- Return Series: PASS
- SCHD G-quality boundary: PASS
- Simulation Insights: A品質9系列 PASS
- System Check: 32件、期限超過0
- Live QA: 132ページ PASS
- Breadcrumb E2E: 89ページ / 168リンク PASS

これらは金融・技術回帰の証拠であり、AdSense承認や読者価値そのものの証明とは扱わない。

## 8. 反証レビュー

1. 低価値と判断され得るページ: Ranking派生、固定条件派生。前者は分析目的を分離、後者はnoindex中心で抑制。
2. テンプレート使い回しに見えるページ: 商品Landing、Fund、From。試算・一次資料・開始条件分析へ役割を分けたが、共通UIは残る。
3. 独自価値が説明文だけのページ: 法務・Aboutは説明が主だが、運営・訂正・データ透明性というサイト必須機能を持つ。
4. 別URLの必要性が弱いページ: `/ranking` と `/ranking/nisa`、固定条件派生。削除等はGSC証拠不足のため保留。
5. 初心者に難しい語: 最大月末評価損、品質区分A/G。画面上で意味と制約を併記しているが実ユーザーテストは未実施。
6. 古い金融情報: 監査日時点で検出なし。制度記事はsystemCheckで継続監視。
7. SEO派生過剰: 固定条件派生をnoindex化済み。唯一のindex例外は検索資産保護。
8. 新規重複: 記事・URL追加なし。
9. 不自然な信頼表現: 今回、根拠のない初心者向け・信頼性・推奨的表現を削除。
10. 再申請延期理由: 公開後の最終HTML確認でP1修正が反映し、回帰がなければ、具体的な技術・コンテンツ必須障害は確認されない。ただしGoogle承認は保証できない。

## 9. 最終判断

今回確認した範囲では、AdSense再申請を妨げる具体的なP0/P1問題は修正後に残っていない。本人は再申請判断へ進める状態。ただし、GSC・被リンク・実ユーザー行動は未測定であり、Googleの非公開審査ロジックによる不承認リスクは残る。

AdSense再申請、URL削除、301、追加noindex、Vercelプラン変更、DNS変更は実施していない。
