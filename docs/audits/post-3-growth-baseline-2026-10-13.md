# 3.0公開後の成長ベースライン（2026-10-13）

## 公開基準

- 3.0公開commit: `16931b861e02569f87935d6c8b3fcfc74efb63a2`
- Production切替: 2026-10-13（JST）
- 28日評価基準日: 2026-11-10（Search Consoleの確定待ちを考慮し、実査は11月12日以降）
- 90日判断基準日: 2027-01-11

公開直後のため、以下のGSC値を3.0の効果とは扱わない。公開前後を同じ28日幅で比較するための基準値として保存する。

## GSC（2026-09-13〜2026-10-10）

Search Console画面を2026-10-13に読み取り専用で確認した。

| 指標 | 直近28日 | 前28日 | 差 |
|---|---:|---:|---:|
| クリック | 60 | 46 | +14 |
| 表示回数 | 2,848 | 1,898 | +950 |
| CTR | 2.1% | 2.4% | -0.3pt |
| 平均掲載順位 | 11.4 | 23.2 | 11.8改善 |

主要ページ（直近 / 前期間）:

- `/compare/orukan-vs-nasdaq100`: 17 / 2 clicks、843 / 84 impressions
- `/compare/orukan-vs-schd`: 12 / 18 clicks、264 / 451 impressions
- `/compare/orukan-vs-fangplus`: 5 / 0 clicks、244 / 50 impressions
- `/articles/schd-vs-sp500`: 3 / 0 clicks、110 / 40 impressions
- `/compare/vt-vs-orukan`: 3 / 6 clicks、84 / 82 impressions
- `/articles/orukan-vs-nasdaq100`: 2 / 2 clicks、176 / 112 impressions
- `/compare/vti-vs-sp500`: 2 / 0 clicks、111 / 7 impressions

### 今回指定のSEO候補

- `/articles/orukan-vs-nasdaq100`: 検索需要あり。ただし役割分離の本文改善直後で、3.0公開前後の観測を優先する。
- `/compare/vti-vs-sp500`: 表示増加と5位前後の過去実績がある。既存title/H1/canonicalを保護し、28日観測を優先する。
- `/articles/schd-vs-sp500`: 検索需要あり。G品質境界を担うため、未検証数値を増やさず現状観測とする。

明確な検索意図不一致や技術不具合を確認していないため、今回はこの3URLへ追加本文変更を行わない。

## GA4（2026-09-15〜2026-10-12）

GA4イベントレポートを2026-10-13に読み取り専用で確認した。

- active users: 181
- views (`page_view`): 1,155
- total events: 2,328
- sessions: 260
- `calculate`: 47 events / 9 users（旧定義）
- `compare_click`: 13 / 5 users（旧定義）
- `share_click`: 7 / 3 users（旧定義）
- `simulation_start`: 4 / 2 users
- `compare_start`: 3 / 2 users
- `compare_complete`: 5 / 3 users
- `simulation_complete`: 1 / 1 user
- `share`: 1 / 1 user
- `source_view`: 1 / 1 user
- `return_visit`: レポート行なし（NOT MEASURED。0件と確定しない）

2026-10-12にChrome由来`page_view`が予測11に対して158となる異常増加をGA4が検出した。ローカルproduction buildのQAでもGoogle tagを読み込む実装が原因となり得るため、2026-10-13に本番hostname以外ではタグ・カスタムイベントを送信しない修正を行った。修正前のGA4値は自然利用者だけの値として扱わない。

## ファネル定義

すべてGA4のsession単位で集計し、期間と分母を併記する。

1. Organic Landing → Simulation Start
   - 分母: `session_default_channel_group = Organic Search` のlanding sessions
   - 分子: 同一session内の`simulation_start`
2. Simulation Start → Complete
   - 分母: `simulation_start`を含むsessions
   - 分子: 同一session内の`simulation_complete`
3. Compare Start → Complete
   - 分母: `compare_start`を含むsessions
   - 分子: 同一session内の`compare_complete`
4. Complete → Share
   - 分母: `simulation_complete`または`compare_complete`を含むsessions
   - 分子: 同一session内の`share`
5. 保存条件を利用した再訪
   - 分母: active usersまたはsessions（報告時に明記）
   - 分子: `return_visit`を含むusersまたはsessions

イベント導入前・定義変更前の期間を0件として混ぜない。今回のhostname隔離修正のProduction公開日を、汚染を抑えた新しい計測開始日として記録する。

## 28日後の評価

- GSC: 同じ28日幅でclicks / impressions / CTR / positionと主要CompareのQuery×Pageを比較する。
- GA4: 上記ファネルをsession単位で算出し、QA異常値を除外できない場合は参考値に留める。
- UX: 375px・390pxでホーム→結果→比較→共有の完走可否を再確認する。
- 品質: A品質9系列、SCHD G品質境界、全URL QA、AdSenseコード・ads.txtを再確認する。

## 90日後の事業判断

- 継続: 検索流入が複数期間で増え、シミュレーション完了が実測でき、重大な品質問題がない。
- 改善継続: 露出は増えるがCTRまたは完了率が停滞し、改善対象をQuery×Page・ファネルで特定できる。
- 縮小・方向転換検討: 露出・完了・再訪のいずれも伸びず、既存ページ改善で検証可能な仮説が残らない。

月3万円の可否はAdSense承認後の実RPMと、QA混入を除いた実PVが揃ってから再計算する。未承認時点では収益到達を判定しない。
