# 低価値ページ構造再編・最終改善スプリント

確認日: 2026-10-11

## 公開結果

- `a9283b53901c48cadc93cb8a902a335adcb9ce35` をmainへ通常push。
- GitHub Actions: Run #79、成功、1分23秒。
- Vercel: Production / Deployed、`https://tsumitate-timemachine-n9fjv76a6-nandemo-labs-projects.vercel.app`。
- 本番sitemapは98 URL、HTTP 200。
- 手動デプロイ、重複デプロイ、Search Console書き込みは行っていない。

## C/D/E 40 URLの原因別分類

### From 6（C: 固有データあり、KEEP）

`/from/2019`〜`/from/2024`。検索意図は各年から開始した場合の積立経路。各URLで積立回数、元本、期間末評価額、元本割れ月数、月末最大乖離が異なり、A品質のみを順位へ使用する。テンプレートは共有するが回答はデータ依存で異なるため、現時点では統合しない。内部リンクは年の変更とシミュレーターへの再検証導線。個別GSC・被リンクは取得できず、流入を理由にした構造変更は行わない。

### 比較記事 4（C: ROLE SEPARATION）

- `/articles/orukan-vs-sp500`
- `/articles/orukan-vs-nasdaq100`
- `/articles/sp500-vs-nasdaq100`
- `/articles/vti-vs-orukan`

Compareは同条件の数値・グラフ・条件変更、Articleは商品構造・費用・重複・数値の読み方を担当する。対応Compareへ直接リンクし、記事側で同じランキング表を再掲しない。主要Compareには検索表示実績があるため保護する。統合はGSC Query×Pageと被リンク原票を取得できるまで保留。

### ハブ 7（C: KEEP / IMPROVE）

- `/guide`: 制度、税金、初心者、運用、出口という疑問別入口。
- `/guide/tax`: 課税口座、分配金、損益通算、申告の分岐。
- `/guide/system`: 投資枠、積立額、旧制度、金融機関変更の分岐。
- `/guide/booraku`: 下落局面、指標定義、積立継続判断の分岐。
- `/compare`: 地域、ハイテク、配当方針から比較ページを選ぶ。
- `/fund`: 商品形式、設定日、費用、データ品質から詳細を選ぶ。
- `/articles`: 数値比較ではなく商品構造・結果の読み方を選ぶ。

単なるリンク一覧ではなく質問別ルーティングを持つためKEEP。ただし単独検索価値より内部ナビゲーション価値が中心で、noindexは承認候補にせず、今後の行動データで再評価する。

### 商品Landing 6（D: ROLE SEPARATION、5組を個別評価）

- `/orukan` ↔ `/fund/orukan`: Landingは条件変更シミュレーション、Fundは正式商品・費用・設定日・品質・出典。KEEP BOTH候補。
- `/sp500` ↔ `/fund/sp500`: 同上。KEEP BOTH候補。
- `/nasdaq100` ↔ `/fund/nasdaq100`: 同上。KEEP BOTH候補。
- `/vti` ↔ `/fund/vti`: Landingの条件変更とFundの商品台帳を分離。KEEP BOTH候補。
- `/schd` ↔ `/fund/schd`: G品質のためLandingでも数値評価を出さず、商品属性とシミュレーション限界を説明。役割差が薄く、MERGE CANDIDATE。
- `/vt`: 対応Fund詳細がなく、条件変更ツール入口として独立。KEEP。

統合を実施する場合の案は `/schd` → `/fund/schd`。301を1段、canonicalは新URL自己参照、sitemapから旧URL削除、内部リンク更新、旧Landingの品質説明・公式属性・導線を新URLへ移植する。rollbackはredirectと内部リンク差分をrevertし旧ページをsitemapへ戻す。GSC Query×Page・被リンクが未取得のため今回は実施しない。

### 汎用ガイド 12（D: IMPROVE中心）

- `/guide/nisa-beginner`: 商品適性ではなく投資対象・費用・設定日・制度区分の確認へ変更。今回追加修正。
- `/guide/index-investing`: 指数と商品の違い、実データ期間、費用の読み方へ接続。
- `/guide/how-to-start`: 手続き順ではなく積立条件と設定前拒否を確認。
- `/guide/index-shippai-pattern`: 失敗断定ではなく条件・費用・売買判断の確認項目。
- `/guide/dollar-cost-averaging`: 同額積立の計算条件と一括比較の限界。
- `/guide/orukan-ippon-de-ii`: 集中・地域・費用を同条件データで確認。
- `/guide/tsumitate-nansnen-keizoku`: 設定後の実績例と期間差を区別。
- `/guide/tsumitate-vs-ikkatu`: 元本と投入時期が違う比較の読み方。
- `/guide/orukan-yameta-houga-ii`: 円建て公式系列と為替リスクを区別。
- `/guide/retirement-investing`: 取崩し時期と価格変動を制度・予測と分離。
- `/guide/booraku-tsumitate-yameru`: 回復保証を避け、資金使用時期と月次経路を確認。
- `/guide/ikkatsu-vs-tsumitate-booraku`: 歴史的指数下落と商品積立結果を区別。

独自計算または一次情報への接続が既にあるページはKEEPして改善。一般説明しか残らないページはArticle/Guide統合候補だが、勝ちページの全面リライト・統合は行わない。

### Ranking 5（E: MERGE CANDIDATE）

- `/ranking`
- `/ranking/nisa`
- `/ranking/beginner`
- `/ranking/high-return`
- `/ranking/high-dividend`

ローカル・本番では、未丸め期間末評価額、A品質、同開始月・同月額・同終了月に統一し、星・初心者向け度・適性を除去済み。`high-dividend` はVYMだけを数値順位、SCHDは順位外属性表示とする。

構造案: `/ranking` に目的・開始月・月額を選ぶUIを集約し、4カテゴリを `/ranking` の状態へ301する。canonicalは `/ranking` 自己参照、sitemapは4旧URLを除外、内部リンクはクエリまたはアンカーへ更新。rollbackは4ルートとsitemap/internal linksのrevert。検索意図差とGSCデータが未確認のため今回は承認待ち。

## 今回の追加ローカル改善

`/guide/nisa-beginner` のdescriptionと導入を「おすすめ銘柄・向いている人」から、投資対象・費用・設定日・制度区分・資金使用時期を比較する説明へ変更した。「こんな人におすすめ」見出しも「このページで確認すること」へ変更し、既存URL、title、H1、canonical、index方針は維持した。

## 残る承認事項

1. `/schd` を `/fund/schd` へ統合するか。
2. Ranking 4カテゴリを `/ranking` へ統合するか。
3. Compare/ArticleはGSC Query×Pageと被リンク原票取得後に統合可否を再判断する。

## 判定

**CONDITIONAL GO**。公開済みP0修正は正常だが、今回の追加Guide改善は未公開であり、SCHDとRankingの構造判断が承認待ち。AdSense再申請はまだ行わない。
