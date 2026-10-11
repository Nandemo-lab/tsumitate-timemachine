# AdSense再申請前・残存コンテンツ完全整理（2026-10-11）

## 監査範囲と判定

- 対象: 現行sitemap 96 URL（ローカル改善後のproduction build）
- 個別台帳: `docs/audits/final-96-content-audit-2026-10-11.csv`
- HTTP: 96/96が200
- 機械分類: KEEP 84、ROLE SEPARATION 11、IMPROVE 1
- 最終判定: **NO-GO**

NO-GOは機械点ではなく、Landing/Fund 5組とCompare/Article 6組について、本番での役割分離効果をまだ確認できず、構造変更候補のGSC Query × Page原票と独立被リンクを取得できていないためである。今回のP0（未出典の長期実績、尺度不明のリスク星、G品質SCHDの精密な数値比較）とP1モバイル操作問題はローカルで解消したが、未公開である。

## 今回実装した改善

1. `/fund/orukan` と `/fund/sp500`
   - 商品実績を指数の40年平均・回復史として説明する文を削除。
   - 商品設定後の円建て・分配金再投資基準価額に限定する説明へ変更。
2. `/articles/schd-vs-vym` と `/articles/schd-vs-sp500`
   - G品質SCHDの評価額・利益カードを削除。
   - A品質のVYMまたはS&P500だけを再現可能な数値として表示し、SCHDは公式商品属性だけを比較。
3. Compare 15ページ
   - 尺度・算出根拠のないリスク星を、投資範囲・集中度という確認可能な属性へ置換。
   - `/compare/orukan-vs-vym` の適性結論を、地域・分配・費用・税務の確認事項へ変更。
4. 商品Landing共有定義
   - S&P500、NASDAQ100、VTI、VTの「トップクラス」「攻め」「究極」「信頼」等の評価を、対象・費用・商品形態の説明へ変更。
5. ガイド
   - `/guide/index-investing` の「最強」「続ければ回復」表現を、定額積立の限界を含む説明へ変更。
   - `/guide/orukan-yameta-houga-ii` の適性・将来成果断定を確認項目へ変更。
   - `/guide/shinnisa-schd-kaeru` は米国ETF SCHDと楽天SCHDを明確に分け、取扱金融機関・将来の制度対象化を推測しない説明へ変更。
6. モバイルUI
   - 開始月ボタン44×44px、カテゴリボタン高さ44px、`aria-pressed`を付与。
   - 品質ラベルを12px・高さ32px、出典導線と詳細設定導線を高さ44pxへ拡大。
   - 商品選択カードの尺度不明なリスク点を「選択中」表示へ置換。

## 重複・独立価値

### Landing / Fund（承認待ち候補）

| Landing | Fund | 現状 | 判断 |
|---|---|---|---|
| `/orukan` | `/fund/orukan` | Landingは条件変更、Fundは正式商品・費用・出典。ただし本文類似度が高い | ROLE SEPARATIONを継続検証。改善不能ならFundへ統合候補 |
| `/sp500` | `/fund/sp500` | 同上 | 同上 |
| `/nasdaq100` | `/fund/nasdaq100` | 同上 | 同上 |
| `/vti` | `/fund/vti` | LandingはETF積立体験、Fundは商品属性 | 同上 |
| `/vt` | Fund対応なし | 独立した条件変更ページ | KEEP |

構造変更案を採用する場合はFundを残し、Landingから301、canonical自己参照、sitemap・内部リンク更新、旧URLへの即時復旧可能な単独commitとする。今回は実施していない。

### Compare / Article 6組

Compareは共通期間・同条件の数値比較、Articleは商品構造・費用・指数・読み方へ分離済み。ただし検索意図の重なりが残るため、次の4記事はQuery × Page取得後の統合候補: `/articles/orukan-vs-sp500`、`/articles/orukan-vs-nasdaq100`、`/articles/sp500-vs-nasdaq100`、`/articles/vti-vs-orukan`。SCHD記事2本はG品質境界と商品設計の説明を担うが、今回数値比較を除去した後の利用価値を本番で再確認する。

### From / Ranking / Hub

- From 6 URL: 開始年ごとの元本・積立回数・元本割れ月数・月末最大乖離が異なるため現時点はKEEP。検索実績は小さく、単一UI統合は承認候補に留める。
- Ranking 4 URL: root、NISA制度条件、A品質の過去実績、高配当の商品属性で役割分離済み。rootとの利用実績差を蓄積する。
- Hub 4 URL: 独自記事ではなく問い別ナビゲーションとしてKEEP。低流入だけでnoindexにしない。
- 法務5 URL: メディア記事ではなく説明責任・利用条件としてKEEP。

## GSC・被リンク

- 保存済み公式エクスポートを利用。QueryとPageは別表であり、Query × Page原票は未取得。
- 最新28日上位: `/compare/orukan-vs-nasdaq100` 17クリック/790表示、`/compare/orukan-vs-schd` 13/295、`/compare/orukan-vs-fangplus` 5/232、`/compare/vt-vs-orukan` 5/99。
- 過去3か月上位: `/compare/orukan-vs-schd` 40/867、`/compare/orukan-vs-nasdaq100` 20/908、`/compare/vt-vs-orukan` 17/287、`/compare/vti-vs-nasdaq100` 8/90。
- 検索流入のあるCompareは保護対象。
- 保存済みGSCリンク資料で確認できた外部リンクはVercel由来で、独立第三者被リンクは確認できなかった。被リンク不足だけをnoindex理由にはしない。

## 5専門家の独立評価

評価は3つの独立実行コンテキストで、5役を分担した。

1. AdSense品質: 本番58/100、NO-GO。商品/指数混同、尺度不明評価、重複意図を指摘。前二者はローカル修正済み。
2. SEO・検索意図: 本番64/100、NO-GO。勝ちCompare保護、Landing/FundとCompare/Articleの役割検証を要求。
3. 金融データ: 本番73/100、NO-GO。G品質SCHD数値比較、楽天SCHD混同、期間末値の表現を指摘。前二者はローカル修正済み。
4. モバイルUI/UX: 本番NO-GO。月・カテゴリ・品質・出典導線のタップ/可読性不足を指摘。ローカルで実測解消。
5. Web事業・読者価値: 本番61/100、NO-GO。独自ツールは強いが周辺テンプレートの役割重複と再現可能性の訴求不足を指摘。

## 実画面QA（ローカル改善後）

- 375px: viewport 375、document幅371。開始月44×44、カテゴリ主要4件高さ44、詳細設定高さ44。
- 390px: document幅386。SCHD/VYM記事にSCHD数値カード0、A品質VYM限定説明あり、JSON-LD 5件、console error/warning 0。
- 1280px: document幅1276。`/fund/sp500`、`/fund/orukan`、`/compare/orukan-vs-nasdaq100`、`/guide/index-investing`、`/guide/shinnisa-schd-kaeru`で横溢れなし、旧主張なし、canonical・JSON-LDあり、console error/warning 0。

## 再申請前の残件

### 公開を妨げるもの

1. 今回のローカル改善が未公開で、本番実物で未確認。
2. Landing/Fund 5組とCompare/Article 6組の役割分離について、公開後のQuery × Page・回遊実績による確認が未完了。
3. sitemap外だが内部リンクから到達する年別ページの未使用旧定義に助言的文が残る。現在の生成HTMLは汎用の中立FAQだけを使用するが、死んだ定義の整理を別commitで行うべき。

### 別途対応候補

- Data Sourcesの銘柄別アンカー（390pxで長文）。
- 長文記事の「このページの答え」と条件変更導線の優先度調整。
- ShareCardが現在条件を確実に復元するかを専用仕様として再監査（新機能追加とは分離）。
- Query × Page公式原票と独立被リンクの取得。

## 変更していないもの

URL、redirect、canonical、index/noindex、sitemap、商品データ、月次系列、台帳、品質区分、計算式、AdSense、ads.txt、依存関係は変更していない。
