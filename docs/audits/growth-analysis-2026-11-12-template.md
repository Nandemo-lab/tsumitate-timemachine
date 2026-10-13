# 2026-11-12 成長分析テンプレート

## 固定期間

- 評価期間: 2026-10-13〜2026-11-09
- GSC比較期間: 2026-09-13〜2026-10-10
- GA4比較上の注意: 旧期間には2026-10-12のQA混入疑いがあるため、率の単純比較は行わない
- 取得日: 未取得
- GSC最終更新日: 未取得

## GSC

| 指標 | 評価期間 | 比較期間 | 差 | 判定 |
|---|---:|---:|---:|---|
| Click | NOT MEASURED | 60 | - | - |
| Impression | NOT MEASURED | 2,848 | - | - |
| CTR | NOT MEASURED | 2.1% | - | - |
| 平均順位 | NOT MEASURED | 11.4 | - | - |

主要Compareと次の3候補について、Click、Impression、CTR、平均順位、Query×Pageを同じ期間で記録する。

- `/articles/orukan-vs-nasdaq100`
- `/compare/vti-vs-sp500`
- `/articles/schd-vs-sp500`

## GA4 セッションファネル

イベント総数ではなく、同一session内に各イベントが存在するsession数を集計する。

| ファネル | 分母session | 分子session | 率 | 状態 |
|---|---:|---:|---:|---|
| Organic Landing → Simulation Start | NOT MEASURED | NOT MEASURED | NOT MEASURED | 未取得 |
| Simulation Start → Complete | NOT MEASURED | NOT MEASURED | NOT MEASURED | 未取得 |
| Compare Start → Complete | NOT MEASURED | NOT MEASURED | NOT MEASURED | 未取得 |
| Complete → Share | NOT MEASURED | NOT MEASURED | NOT MEASURED | 未取得 |
| 保存条件を利用したReturn Visit | NOT MEASURED | NOT MEASURED | NOT MEASURED | 未取得 |

### 定義

- Organic Landing: Session default channel groupが`Organic Search`のsession
- Simulation Start: 同一sessionに`simulation_start`
- Simulation Complete: 同一sessionに`simulation_complete`
- Compare Start: 同一sessionに`compare_start`
- Compare Complete: 同一sessionに`compare_complete`
- Complete → Share: `simulation_complete`または`compare_complete`を含むsessionのうち`share`も含むsession
- Return Visit: 全sessionのうち`return_visit`を含むsession。レポートにイベントが出ない場合は0ではなくNOT MEASURED
- `share_click`、`compare_click`、`calculate`は互換用イベントであり、この表の分子・分母には使わない

## QA混入と解釈

- hostnameが`tsumitate-timemachine.com`以外のイベントは送信されない実装を維持する
- 本番ドメイン上で人手QAを行った日時と操作をここに追記する
- 低件数では率の改善・悪化を断定しない
- イベント実装前・計測開始前・レポート未出現はNOT MEASUREDとする

## 判断

- SEO変更対象: 未決定
- 本文・title・H1・canonical変更: 実測確認まで保留
- 次のアクション: Query×Pageとセッションファネルを根拠に最大3件へ限定
