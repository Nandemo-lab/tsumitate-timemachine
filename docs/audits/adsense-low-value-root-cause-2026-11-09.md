# AdSense「有用性の低いコンテンツ」根本原因監査

監査日: 2026-11-09
対象本番: `https://tsumitate-timemachine.com`（監査開始時 `4fa15edc98802b74527712b44cd19b9192232998`）

## 判定の前提

Googleから対象URLや単一原因は開示されていないため、以下は公式基準と本番実査を突き合わせた原因仮説である。QA、記事数、文字数、HTTP 200は、有用性の証明として扱わない。

公式基準では、独自で実質的な情報・分析、読者の疑問への十分な回答、明確な運営責任、使いやすいナビゲーションが重視される。固定の最低記事数・文字数・PV基準は確認できない。

## 公開面の棚卸し

本番sitemapは101エントリだったが、ユニークURLは98件だった。`/guide/tax`、`/guide/system`、`/guide/booraku` が2回ずつ掲載されていた。

| 公開面 | sitemap件数 | 監査判断 |
|---|---:|---|
| Guide（記事42＋重複を含むハブ） | 45 | 一律に薄い証拠なし。制度記事は一次資料・確認日あり。ただし共通部品の反復は要継続監視 |
| Compare | 15 | 保護。同条件計算、共通期間、元本割れ経路という固有価値あり |
| 比較コラム | 6 | 保護。Compareとは商品構造・費用・読み方に役割分離 |
| Fund詳細 | 7 | 正式商品・費用・品質・一次情報の役割を維持 |
| 商品Landing | 5 | Fund詳細と検索意図が近い。H1を条件変更型の過去積立検証へ明確化 |
| From | 6 | 保護。開始年ごとに回数、元本、順位、元本割れ経路が固有 |
| Ranking | 4 | 条件別の役割はあるが、派生ページ間の差が弱いものはP1継続課題 |
| 月額ページ | 1 | 検索流入実績のある例外のみindex。時点依存FAQを修正 |
| 法務・信頼・ハブ等 | 12 | 必要ページ。Aboutで実際の編集・監査工程を可視化 |

## 有力な原因仮説

### 1. 独自価値の偏在（確信度: 中〜高）

サイト固有の強みは、A品質9系列、同条件積立、月末元本割れ、共通終端、raw snapshot・SHA-256、G品質の数値除外にある。ただし、この価値はCompare・From・Data Sourcesで特に強く、商品Landingや一部一般ガイドの入口では一般説明の比率が高かった。

### 2. 近い役割のURLが複数ある（確信度: 中）

- 商品LandingとFund詳細は、本文で役割分離していてもH1が双方「商品とは？」だった。
- Rankingの総合・NISA・高リターンは同じ基準期間・月額を使い、対象集合の違いが主だった。
- 高配当ページはVYMのみA品質、SCHDはG品質で、数値ランキングではなく「検証済み実績と商品属性の分離」が本来の価値である。

URL統合・noindex・削除は、最新GSC Query×Pageと被リンクを確認せず実施しない。

### 3. 制作・検証責任が読者に伝わりにくい（確信度: 中）

Aboutは運営目的、A/G品質、非助言、データ方法を説明していた一方、記事制作・制度確認・月次系列監査の工程が各記事から確認しにくかった。資格・経歴は捏造せず、実施済みの検証工程を具体化する。

### 4. 更新負担の高い非SSOT記述（確信度: 高）

月額FAQに、2024年末の構成比、特定金融機関、最低積立額、商品別NISA対象区分の時点依存記述があった。これらは現在の公式情報との不一致を生みやすいため、公式確認先と確認項目を示す説明へ変更した。

## 今回の改善

1. sitemapの重複3URLを解消し、live QAへ重複検知を追加。
2. 商品LandingのH1を「商品とは？」から「過去積立を条件別に確認」へ変更し、Fund詳細との役割差を初期表示で明確化。
3. Guideの編集情報からAboutの編集・検証方針へ導線を追加。
4. Aboutに一次情報確認、共通データ照合、raw/SHA監査、訂正受付の工程を追加。2026年11月の更新履歴を追記。
5. 月額FAQの時点依存・金融機関固有・曖昧なNISA対象記述を、公式情報での確認手順へ変更。

## 変更しなかったもの

- Compare、From、Data Sources、A品質9系列、SCHD G品質境界。
- 既存URL、canonical、index/noindex方針。
- 比較コラムとCompareの統合。
- Ranking派生の統合/noindex。検索実績未確認のため保留。
- 42 Guideの一括削除・一括noindex。高い本文類似を示す証拠がなく、機械的処置は不適切。

## 残存リスクと次の判断材料

1. Ranking派生4ページは、最新Query×Pageを取得して検索意図の競合を確認する。競合があれば統合、なければ固有分析を追加する。
2. 一般Guideに置かれたシミュレーション導線は、記事の疑問と試算条件が結び付いているかを実利用データで確認する。
3. Aboutは実施工程を具体化したが、運営者の資格を示す変更ではない。存在しない専門資格や第三者レビューを追加しない。
4. Googleの審査結果は保証できない。再申請前に本番反映後の全URL状態とPolicy Centerの最新文言を再確認する。

## 公式資料

- Google AdSense, Publisher Policies: https://support.google.com/adsense/answer/10502938
- Google AdSense, Make sure your site's pages are ready for AdSense: https://support.google.com/adsense/answer/7299563
- Google AdSense, Build high-quality landing pages: https://support.google.com/adsense/answer/1348727
- Google Search Central, Creating helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google AdSense公式 Site Approvalsシリーズ: https://www.youtube.com/playlist?list=PLbAFD4oU9Ycr4j1pViNjkS82rhbF293H8
