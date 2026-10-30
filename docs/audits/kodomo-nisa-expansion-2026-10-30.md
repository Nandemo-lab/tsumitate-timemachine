# こどもNISA特集 検索意図・重複監査（2026-10-30）

## 調査条件

- Google Search Console: GSC Wizard の契約終了により取得不可。クリック・表示回数は推測しない。
- 検索結果: 2026-10-30 に主要検索語を確認。
- 一次情報: 金融庁、財務省、国税庁を優先。金融機関固有の受付日・必要書類は各社公式情報として扱う。

## 既存6記事の役割

| URL | 固有の問い | 判断 |
| --- | --- | --- |
| `/guide/kodomo-nisa` | 制度の全体像 | 維持 |
| `/guide/kodomo-nisa-tsumitate-ikura` | 月1万・3万・5万円の違い | 維持。月1万円の別記事は作らない |
| `/guide/kodomo-nisa-orukan-vs-sp500` | 2商品の投資対象・費用・過去実績 | 維持 |
| `/guide/kodomo-nisa-vs-gakushi-hoken` | 投資と保険の役割差 | 維持 |
| `/guide/kodomo-nisa-hikidashi` | 払出し年齢と手続 | 維持 |
| `/guide/kodomo-nisa-daigaku-shikin-deguchi` | 進学前の現金化 | 維持 |

## 追加記事の採否

### 採用

1. `/guide/kodomo-nisa-nansai-kara`
   - 既存記事で不足していた「現在年齢から18歳まで何回積み立てられるか」へ回答。
   - 0・5・10・15歳の月1万円について、将来利益ではなく積立回数と元本だけを計算。
2. `/guide/kodomo-nisa-oya-nisa-tsukaiwake`
   - 親名義と子名義、資金目的、払出し、贈与税の確認事項を分離。
   - 「どちらを先に使うべき」という助言は行わない。

### 不採用・保留

- 「月1万円なら18歳でいくら」: 既存月額記事と検索意図・計算が重複。
- 「口座開設方法」: 金融機関ごとの受付・必要書類・取扱商品が異なる。各社情報が動いているため、現時点では固定手順の記事を作らない。
- 「教育費800万円」「子ども2人・3人」: 金額・人数だけを変えた量産になりやすい。
- 「贈与税」単独記事: 個別事情が大きい。今回の記事では国税庁への確認導線に限定。

## 一次情報

- 金融庁「NISAを知る」: https://www.fsa.go.jp/policy/nisa2/know/index.html
- 財務省「令和8年度 税制改正（国税）等について」: https://www.mof.go.jp/public_relations/finance/202604/202604c.html
- 国税庁「No.4402 贈与税がかかる場合」: https://www.nta.go.jp/taxes/shiraberu/taxanswer/zoyo/4402.htm

## 独立読者レビュー

- NISAを知らない保護者: 制度概要の説明を補強。年齢別記事と親子口座記事に固有価値あり。
- 月1万円から始めたい保護者: 既存月額記事で金額の問いは充足。残るギャップは年齢別の残り月数。
- 損失が不安な保護者: 将来試算の近くに元本割れ注意を配置。年齢別記事では利益を示さず元本のみ比較。

## 公開方針

追加2記事はローカル検証・commitまでとし、既存6記事とは分ける。新規URLのpush・deploy・Search Console登録は本人承認後に行う。

## 検証結果

- lint: PASS
- TypeScript (`npx tsc --noEmit`): PASS
- Build: PASS（静的生成220ページ）
- 通常QA / live QA: 129ページ、ERROR 0、WARNING 0、SCORE 100
- system-check audit: 28制度ページ、WATCH 0、REWRITE CANDIDATE 0
- content trust audit: PASS
- 実画面: 375px・390px・1280pxで横スクロールなし、console error / warning なし
