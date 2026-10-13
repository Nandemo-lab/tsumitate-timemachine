# 成長実測・次期運用準備（2026-10-13）

## GSC実測

Search Consoleを読み取り専用で確認した。最新データ日は2026-10-10。

| 指標 | 2026-09-13〜10-10 | 前28日 | 差 |
|---|---:|---:|---:|
| Click | 60 | 46 | +14 |
| Impression | 2,848 | 1,898 | +950 |
| CTR | 2.1% | 2.4% | -0.3pt |
| 平均順位 | 11.4 | 23.2 | 11.8改善 |

公開直後のため3.0や9月データ更新の効果とは扱わない。主要ページでは `/compare/orukan-vs-nasdaq100` が17/843、`/compare/orukan-vs-schd` が12/264、`/compare/orukan-vs-fangplus` が5/244（Click/Impression）。勝ちCompareのURL、title、H1、canonicalは変更しない。

## 次のSEO候補（最大3 URL）

| URL | 最新28日 Click/Impression | CTR | 平均順位 | 判断 |
|---|---:|---:|---:|---|
| `/articles/orukan-vs-nasdaq100` | 2/176 | 1.1% | 8.7 | Compareと競合させず、組み合わせ・商品構造の検索意図を11月に再評価 |
| `/compare/vti-vs-sp500` | 2/111 | 1.8% | 5.3 | 表示増。既存title/H1を維持し、対象範囲差の回答を再評価 |
| `/articles/schd-vs-sp500` | 3/110 | 2.7% | 9.2 | G品質境界を守り、分配方針・比較可能範囲の回答を再評価 |

いずれも公開直後のため重大な誤りがない限り本文変更を保留し、2026-11-12以降の固定28日データで優先順位を確定する。

Query×Pageで確認した主な意図は、オルカン記事が商品比較と配分、VTI Compareが商品単体の意味・構成、SCHD記事がS&P500との比較・トータルリターン・チャート。VTI Compareは商品単体意図とのずれがあるため、11月時点でも同じ傾向が続くかを確認してから変更する。SCHD ArticleとCompareは検索語が重なるが、Articleは商品構造、Compareは同条件比較として役割を分ける。

## GA4実測と限界

対象期間は2026-09-15〜10-12。アクティブユーザー181、表示1,155、イベント2,328。カスタムイベントは `simulation_start` 4、`simulation_complete` 1、`compare_start` 3、`compare_complete` 5、`share` 1、`source_view` 1を受信。`return_visit` はレポートに未出現のため **NOT MEASURED** とする。

2026-10-12のChrome `page_view` 158件というQA混入疑いの異常値を含む。この期間のファネル率は自然利用者の確定値にしない。本番hostname制限後の2026-10-13〜11-09を次回の固定期間とし、同一session内で分母・分子を集計する。

## 11月12日以降の固定集計

- GSC: 2026-10-13〜11-09 と 2026-09-13〜10-10を比較。Click、Impression、CTR、平均順位、主要Compare、Query×Pageを保存。
- Organic Landing → Simulation Start: Organic Searchランディングsessionを分母、同一sessionの`simulation_start`を分子。
- Simulation Start → Complete: `simulation_start` sessionを分母、同一sessionの`simulation_complete`を分子。
- Compare Start → Complete: `compare_start` sessionを分母、同一sessionの`compare_complete`を分子。
- Complete → Share: complete sessionを分母、同一sessionの`share`を分子。
- Return Visit: 全sessionを分母、`return_visit` sessionを分子。レポートにない場合は0ではなくNOT MEASURED。

集計はsession ID相当のGA4セッション単位で行い、同一session内に分母イベントと分子イベントが存在するsession数を数える。イベント総数同士を割らない。Organic LandingはSession default channel groupが`Organic Search`のsessionだけを対象とする。`share_click`や`compare_click`は旧導線計測であり、上記ファネルの分子には使わない。

QA日時と操作を注記し、2026-10-12の既知のQA混入疑いをベースラインから除外できない場合は、その期間の率を参考値と明記する。2026-10-13以降は本番hostname制限によりlocalhost・Previewから送信されない。イベントがレポートへ出現しない場合や対象期間開始前に未実装だった場合は、0ではなくNOT MEASUREDとする。低件数では効果を断定しない。Search ConsoleとGA4の設定変更・書き込みは行っていない。
