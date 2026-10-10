# AdSense不承認後 品質再構築監査（2026-10-11）

## 結論

再申請判定は **NO-GO**。技術QAは合格しているが、データ終端が2025年6月のまま約15か月遅れていること、検索意図が重なるページ群、ナビゲーション中心の薄いハブが残る。Googleによる承認を保証するものではない。

## 公式基準と採点方法

- AdSense固有: 全ページに、十分で独自性・関連性のある完成したコンテンツと明確なナビゲーションが必要。自動生成された低独自性ページや、publisher-contentの乏しいナビゲーション画面への広告表示はリスク。
- 検索品質の診断補助: people-first、独自分析、十分な説明、出典・著者・編集責任の明示、大量生成で検索流入だけを狙わないこと。
- 両者は混同しない。Helpful Contentやspam policiesはAdSense合否条件ではなく、サイト価値を診断する補助基準として使用した。

全99 URLは、レンダリングHTMLを次の固定軸で採点した。検索意図20、独自性25、一次情報・検証可能性20、独自計算/グラフ15、他ページとの差別化10、鮮度10。A=80以上、B=65–79、C=55–64、D=40–54、E=39以下。HTTP 200、metadata、文字数だけでは加点しない。明細は `content-quality-2026-10-11.csv`。

## 監査範囲

- sitemap掲載99/99 URLを実HTTP取得し、本文、見出し、一次情報リンク、表、グラフ、データ時点、重複役割を記録。
- 内訳: home 1、運営/法務7、商品landing 7、fund detail 7、compare detail 15、from 6、monthly 1、guide detail 37、guide/税/制度/暴落index 4、compare/fund/articles index 3、articles 6、ranking 5。
- 375px、390px、PC相当1040pxを実ブラウザ確認。主要種別でページ全体overflow 0、console error/warning 0。
- 現時点のGSC全件エクスポートは取得不能。2026-09-13画面と2026-08-14 CSVで取得できた8 URLだけを台帳へ記録し、残りは「未取得」とした。

## 全99 URLの評価

|分類|件数|判断|
|---|---:|---|
|A|0|独自価値・根拠・鮮度が全て十分|
|B|48|価値はあるが改善が必要|
|C|31|役割または検索意図が重複|
|D|20|固有価値の大幅改善が必要|
|E|0|即時の統合/noindex候補（承認前変更なし）|

平均61点。これは「技術QA 100点」と別の編集品質評価である。URL別15項目と推奨対応はCSVを参照。

## 根本的な弱点 TOP 10

1. 全A系列の実績終端が2025-06で、現在日から約15か月遅い。
2. 商品landingと `/fund/*` の7組・14 URLが同一商品意図で重複。
3. compareとarticleの6組・12 URLが「どちらがよいか」で重複。
4. from 6、ranking 5、年別/月額が同じ計算結果の再包装に見えやすい。
5. `/compare`、`/fund`、`/articles`、`/guide`、`/guide/{tax,system,booraku}` はリンク集中心。
6. トップで独自データの境界より利益額・ランキングが先行していた。
7. 共通商品定義に「王道」「高リターン」「安定」「初心者向け」など適性・成果訴求が残っていた。
8. 商品設定前を含む「過去20年」やドル建て指数相当の固定値が一部に残っていた。
9. ページ単位の編集責任、訂正履歴、レビュー日時の提示が制度記事以外で弱い。
10. 共有・再訪理由が弱く、データ更新が止まって見える。

## 競合比較

|検索意図|競合の価値|当サイトの価値|不足|
|---|---|---|---|
|投信積立の過去実績|Fund Labは800本超、元本割れ月数・最大元本割れ率。SMBC日興は約600銘柄と年率定義|公式月次、円換算、設定前拒否、欠損fallbackなし|9系列と少なく、終端が古い|
|新NISAシミュレーション|NISA枠、課税口座差、目標逆算、複数想定利回り|仮定でなく実商品の過去月次実績|制度税計算や目標逆算は弱い|
|オルカン/S&P500比較|運用会社・証券は最新商品情報と長期指数説明|共通商品期間の円建て積立を同条件比較|article/compare二重化、古い終端|
|NISA初心者|金融庁の制度権威、証券会社の手続き|公式制度値と商品実績を同時確認|一般論の再要約ページが多い|

## 重複・量産監査

- C: `/orukan` ↔ `/fund/orukan` など7組。前者は操作導線、後者は正式属性・出典へ役割分離するか、統合を審議。
- C: `/compare/*` ↔ `/articles/*` の6組。compareは計算、articleは論点解説へ明確化するか統合。
- D: `/from/2019`〜`/from/2024`。年固有の説明と開始月の意味を強める。
- D: ranking 5。カテゴリを変えただけの同一結果にならない役割が必要。
- D: ナビゲーション中心7ハブ。固有の選び方・更新状況・代表分析を追加、または広告対象外/構造変更を審議。

削除、統合、noindex、redirectは未実施。GSC、被リンク、内部リンク、URL履歴を揃えて承認後に判断する。

## 維持すべきページ/資産

- `/about/data-sources`: 台帳、欠損処理、A/G境界を最も具体的に説明。
- `/`: 条件変更できる独自ツール。今回、検証境界をfirst view近くへ追加。
- `/compare/vt-vs-orukan`: A品質同士で、ETF/投信・全世界同士の比較価値が明瞭。
- `/compare/orukan-vs-schd`: 既知GSCで29クリック/603表示。ただしSCHDはG品質のため看板化しない。
- `/orukan/monthly/30000`: 具体的条件の検索意図と計算が一致。

## シミュレーター独自価値

評価69/100。強みはA品質9系列、同じ開始月・月額・終了月、円建て、商品設定前拒否、欠損fallbackなし、G品質境界、計算条件表示、比較チャート。弱みは2025-06終端、結果解釈の説明、再訪理由、重複ランディング。利益額だけの電卓ではなく、再現可能な過去実績比較として伸ばすべき。

## 金融情報監査と今回の修正

### 修正前

- `/guide/nisa-tsumitate-ikura`: 月1万円、2020-01〜2025-06、元本66万円に対し「約162万円」。
- S&P500年別ページ: 2022年約-18%、2023年約+26%、完全回復という米ドル指数相当の固定説明。
- `/compare/orukan-vs-sp500`: 商品共通期間を超える過去20年、下落耐性、人気割合。
- 複数の結果ページで2025-06終端を「現在」「最新」と表示。
- 共通商品定義に適性・安定性・将来成果を示唆する文言。

### 修正後

- NISA例を `simulate()` から生成: 66回、元本660,000円、期間末評価額1,100,108円。将来予測・開始時期の優劣ではないと明示。
- S&P500の2022/2023年を `formatAnnualReturn()` の円建て・分配金再投資込み商品暦年リターンへ統一し、元本回復/高値回復と区別。
- 比較は公式商品データの共通期間だけへ限定。日中最大下落や回復速度を月次系列から推定しない。
- 年別/月額/simulate結果を「2025年6月時点」「期間末評価額」へ変更。
- トップで一次情報、設定前拒否、A9/G1、収録終端、非予測を明示。利益ランキングはA品質だけに限定。
- VT/S&P500/VYM/NASDAQ100/FANG+の共通表示を商品属性中心に中立化。

## データ鮮度

全A系列は2025-06終端。2026-10時点で約15か月遅れ、Data Sourcesの半期更新方針とも不整合。Vanguard、iShares、国内運用会社、日銀の一次情報から少なくとも2026-08まで更新可能と調査した。値は今回追加していない。raw取得、SHA更新、月末抽出、ETF NAV total return、日銀FX換算、missing=0、独立検算を別commitで行う必要がある。

## 5専門家の独立評価

1. AdSense品質: 78/100、NO-GO。強い中核はあるがナビゲーション中心7ハブと広告適用範囲が課題。
2. SEO/検索意図: 52/100、NO-GO。意図重複とC/D群が独自ツールの価値を希釈。
3. 金融データ/制度: 57/100、NO-GO。P0は今回修正、鮮度と共有助言表現が残課題。
4. モバイルUI/UX: 66/100、単独CONDITIONAL。375/390で崩れなしだが、独自価値が遅く長文ページが長い。
5. Web事業/ユーザー価値: 58/100、NO-GO。差別化78に対し再訪39、鮮度31、量産感43。

統合判断はNO-GO。全担当が同じ点数を使わず、それぞれ別の評価軸・実行コンテキストで判定した。

## UI/UX

PC 1040px、375px、390pxでトップ、比較、記事、fund、年別、月額、ranking、Data Sourcesを確認。ページ全体overflow 0、重大な重なり/文字欠けなし、console error/warning 0。改善後トップで独自性と終端をCTA前に読める。一方、長文比較記事は390pxで約7,900px、品質注記の小さい文字、横カルーセルの手掛かりはP2。

## 優先度残件

- P0: 0（今回確認した重大な事実誤認/計算誤りは修正）。
- P1: データを2026-08まで更新、7ハブの固有価値/広告適用方針、14商品URLと12比較URLの役割整理、残る助言表現横断監査。
- P2: 長文記事の役割分離、ページ単位レビュー/訂正履歴、重要注記の視認性、共有再現性。
- P3: 横カルーセルの操作手掛かり、軽微な見出し/注記整理。

## 検証

- lint: 0 error / 0 warning。
- TypeScript: Build内でPASS。
- Next.js build: 231 pages、PASS。
- QA: 131 pages、SCORE 100/100、ERROR 0、WARNING 0（品質点とは別）。
- live QA: 131 pages、100/100、ERROR 0、WARNING 0。Metadata/JSON-LD/Internal Links/Canonical/OGP PASS。
- sitemap: 99 URL、品質監査で99/99取得。
- verified ledger、return series、VT、compare CAGR 9件、OGP comparison、zero-page、system-check、content-trust audit: PASS。
- AdSenseコード/ads.txt、canonical、robots、設定前simulate方針は既存QAで維持。

## Google公式・比較先

- AdSense不承認時の確認: https://support.google.com/adsense/answer/81904?hl=ja
- Publisher content: https://support.google.com/publisherpolicies/answer/11112688
- Helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ja
- Spam policies: https://developers.google.com/search/docs/essentials/spam-policies?hl=ja
- 金融庁NISA: https://www.fsa.go.jp/policy/nisa2/index.html
- Fund Lab: https://fundlab.jp/tsumitate
- SMBC日興比較: https://fund2.smbcnikko.co.jp/smbc_nikko_hp/fund/sim/docs/simulation/comparesimulation.html
- 野村積立シミュレーション: https://www.nomura.co.jp/solution/financial-assets/fund/tsumitate/

## A/B/C 最終整理

### A. 今回の不承認を説明し得る有力な原因仮説

独自ツール自体ではなく、99 URL全体で見ると、古いデータ、同一意図の重複、ナビゲーション/テンプレート中心ページ、利益・おすすめ訴求が混在し、「独自の検証ツール」より「量産金融SEOサイト」に見えること。

### B. 仮説への修正と証拠

P0数値2系統をSSOT化し、比較期間を商品共通期間へ限定し、現在/最新表示を終端表示へ変更。トップに検証方法・品質・終端を提示し、共有商品文言を中立化。証拠は99 URL CSV、content-trust audit、ledger/return/CAGR audits、実ブラウザ結果。ただし鮮度更新と構造整理は未完了。

### C. AdSense再申請判定

**NO-GO**。未解決P0は0だが、データ鮮度とC/D 51 URLの重複/固有価値対策、7ハブのpublisher-content/広告適用方針が未完了。次回はデータ更新を別commitで完了し、URL統合/noindex/広告除外候補をGSC・被リンク込みで承認審議する。
