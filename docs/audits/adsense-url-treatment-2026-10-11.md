# AdSense品質再構築：URL処遇と独自価値の再評価（2026-10-11）

## 判定の前提

- 対象は sitemap の99 URL。最新ローカルproduction HTMLを再取得した。
- 品質スコアは技術QAと別物で、独自情報20、検索意図充足20、検証可能性20、実質情報量15、重複の少なさ10、鮮度5、モバイル可読性5、読者の次行動5の100点。
- 再採点結果は B 48 / C 31 / D 20（平均61）。データ終端更新だけではC/D 51ページの固有価値不足は解消しない。
- GSC実測があるのは8 URLだけ。その他の流入・被リンク・URL履歴は未取得であり、MERGE/NOINDEXの実施前に必ず補う。

## C/D 51ページの再評価

| 群 | 件数 | 処遇 | 根拠と次の改善 |
|---|---:|---|---|
| 商品landing | 6 | ROLE SEPARATION | 条件変更できる入口・結果解釈に限定し、`/fund/*`の属性解説と役割を明示する |
| fund詳細 | 7 | IMPROVE | 設定日、利用可能期間、一次情報、同条件の再検証導線を商品固有に補強する |
| compareに対応するarticles | 6 | ROLE SEPARATION | compareは同条件計算、articleは「差が生じる理由・選択時の確認事項」に限定する |
| from | 6 | IMPROVE | 年ごとの局面、元本、月数、対象期間全体を計算できる商品数を固有情報として前面化する |
| ranking詳細 | 4 | IMPROVE | 順位より先に条件・対象外理由・品質境界を示す。high-dividendはG系列依存を再審議する |
| リンク一覧中心のhub | 7 | IMPROVE | 読者の問いから選べる編集導線と各群の違いを加える。単なるカード一覧から脱する |
| 信頼・ポリシー | 6 | KEEP / NOINDEX CANDIDATE | 運営上は必要。検索価値は弱いため、GSC/被リンク確認後に5ポリシーURLのindex方針を承認審議する |
| ガイド | 7 | IMPROVE | 一般論ではなく検証済み商品実績、条件、一次資料、条件変更導線を問いごとに追加する |
| 月額 | 1 | IMPROVE | 金額固有の元本・期間末評価額・条件差を明示し、他金額ページとの役割を示す |
| FANG landing | 1 | ROLE SEPARATION | `/fund/fangplus`との名称・役割を統一し、旧導線の履歴と流入を確認する |

## 7組の商品重複

| landing | detail | 提案 |
|---|---|---|
| `/orukan` | `/fund/orukan` | ROLE SEPARATION |
| `/sp500` | `/fund/sp500` | ROLE SEPARATION |
| `/nasdaq100` | `/fund/nasdaq100` | ROLE SEPARATION |
| `/vti` | `/fund/vti` | ROLE SEPARATION |
| `/schd` | `/fund/schd` | ROLE SEPARATION（G品質境界を双方で維持） |
| `/vt` | `/fund/vym`ではなくVT固有detail不在 | IMPROVE（情報設計の非対称を解消） |
| `/fang` | `/fund/fangplus` | MERGE CANDIDATE（旧URL履歴・流入確認後） |

`/vt`は現状の実装上、対応する`/fund/vt`がないため「7組」として機械的に統合しない。VYMは逆にdetailのみでlandingがない。この非対称は新規URL追加ではなく、既存ページの役割表で説明する。

## 6組のcompare / article

`orukan-vs-sp500`、`orukan-vs-nasdaq100`、`sp500-vs-nasdaq100`、`schd-vs-vym`、`schd-vs-sp500`、`vti-vs-orukan`はすべてROLE SEPARATION。compareは「同一開始月・同額・共通終端の計算」と条件変更、articleは商品属性・差が出る構造・確認事項に限定する。統合はGSCと被リンク取得後に再判定する。

## from / ranking / hub

- from 6件：KEEPではなくIMPROVE。年固有の開始時点と積立経過を主要価値にする。
- ranking 5件：IMPROVE。A品質・対象期間・件数を主表示にし、順位だけの検索意図を避ける。
- hub 7件：IMPROVE。`/guide`、`/guide/tax`、`/guide/system`、`/guide/booraku`、`/compare`、`/fund`、`/articles`を問い別ナビゲーションにする。

## 承認が必要な候補

1. `/fang` → `/fund/fangplus` の統合またはredirect。
2. `/terms`、`/privacy`、`/disclaimer`、`/ad-policy`、`/contact` のNOINDEX候補。
3. high-dividendランキングをG系列の参考表示としてindex維持するかの再審議。
4. compare/article 6組で、役割分離後も検索意図が重なるURLの統合。

いずれも現時点ではURL、canonical、redirect、index/noindexを変更していない。

## 独自価値を先に強化するページ

1. `/`：更新月・検証済み系列・欠損拒否をファーストビューで理解できるようにする。
2. `/about/data-sources`：raw snapshot、SHA-256、計算式、更新履歴を公開する（今回更新）。
3. 流入のある `/compare/orukan-vs-schd`、`/compare/vt-vs-orukan`、`/orukan/monthly/30000`：条件・品質差・再検証導線を優先。
4. from 6件：年固有の積立経過と元本差を強化。
5. 7 hub：検索結果ページではなく、読者が次の検証へ進める編集導線にする。

## 結論

データ鮮度は改善したが、C/D 51ページの実質改善は未完了。構造変更前にGSC全URLエクスポート、被リンク、URL履歴を取得し、まずROLE SEPARATIONとIMPROVEを実装・再評価する。AdSense再申請はNO-GOを維持する。
