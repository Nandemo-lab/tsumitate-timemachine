# GSC実測連携・検索流入成長スプリント（2026-10-12）

## 実測期間

- GSC直近28日: 2026-09-12〜2026-10-09（最終更新は確認時点で56時間前）
- GSC前28日: 47クリック / 1,926表示 / CTR 2.44% / 平均掲載順位24.0
- GSC直近28日: 61クリック / 2,855表示 / CTR 2.14% / 平均掲載順位11.5
- GA4直近28日: 2026-09-14〜2026-10-11

## GSC実測

| 指標 | 前28日 | 直近28日 | 変化 |
|---|---:|---:|---:|
| クリック | 47 | 61 | +29.8% |
| 表示 | 1,926 | 2,855 | +48.2% |
| CTR | 2.44% | 2.14% | -0.30pt |
| 平均掲載順位 | 24.0 | 11.5 | 12.5改善 |

デバイス別はモバイル43クリック / 2,152表示、PC17 / 648、タブレット1 / 55。モバイルが表示の75.4%を占める。

### 改善対象（最大3URL）

| URL | クリック | 表示 | CTR | 平均順位 | 判断 |
|---|---:|---:|---:|---:|---|
| `/compare/orukan-vs-nasdaq100` | 18 | 841 | 2.1% | 7.0 | 最大の検索入口。比較対象と独自の月末経路分析を冒頭で直接回答する。 |
| `/compare/orukan-vs-schd` | 11 | 271 | 4.1% | 5.5 | 流入を保護しつつ、実績優劣を出せないG品質境界を冒頭で明確化する。 |
| `/compare/orukan-vs-fangplus` | 5 | 242 | 2.1% | 5.9 | 一般的なFANG+クエリ流入に対し、比較対象が国内投信iFreeNEXTであることを明示する。 |

Query×Pageで確認できた主要語は、オルカン/NASDAQ100の比較・どっち、SCHD/オルカンの比較・併用、FANG+・iFreeNEXT FANG+インデックス。匿名化されたクエリやUIに表示されない行は推測で補完しない。

## GA4実測と計測限界

- アクティブユーザー: 186
- セッション: 257
- 表示: 1,078
- 全イベント: 2,112
- 旧 `calculate`: 21イベント / 6ユーザー
- 旧 `share_click`: 5イベント / 2ユーザー
- 旧 `compare_click`: 1イベント / 1ユーザー
- 新 `simulation_start`, `simulation_complete`, `compare_start`, `compare_complete`, `share`, `source_view`, `return_visit`: **NOT MEASURED**

新ファネルは直近公開のため、28日レポートにまだ行がない。未計測を0件とは扱わない。旧イベントと新イベントは定義が異なるため接続して率を算出しない。

## 実装と評価計画

- title、H1、URL、canonical、index方針は変更しない。
- 上位3 Compareの冒頭に、検索意図へ直接答える固有の短い回答を追加する。
- A品質ページでは共通条件・月末元本割れ分析を、G品質ページでは数値比較を拒否する理由を明示する。
- 28日後にページ別 organic landing を母数として、simulation start/completion、compare completion、share、return visitを再集計する。
- 成果は公開前に断定せず、GSCとGA4の次回実測で判断する。

## KPI判定日

- 28日後: 2026-11-09前後。対象3URLのページ別クリック・表示・CTR・順位と、organic landingを母数にした新ファネルを初回評価する。計測開始前の訪問は母数へ混ぜない。
- 90日後: 2027-01-10前後。検索入口からシミュレーション完了までの実測が蓄積していることを条件に、改善継続・縮小・方向転換を判断する。
- 180日後: 2027-04-10前後。AdSense承認後の実RPMが取得できた場合だけ、月3万円に必要なPVとの距離を再計算する。未承認・未計測なら収益額を推定実績として扱わない。

## 比較差額とファネル定義（2026-10-12追加確認）

- 2020年1月〜2026年8月・月3万円では、オルカン対S&P500の本番表示は516万円対541万円、円単位の期間末評価額差を表示用に丸めて24万円。84万円はオルカン対NASDAQ100（516万円対600万円）の差額で、前回報告の比較対象記載が不足していた。
- Compare、条件変更フォーム、ShareCardはいずれも丸め前の`finalValue`差を使用する。表示済みの万円文字列同士を減算しない。
- Organic Landing → Simulation Start: GA4のOrganic Searchランディングセッションを分母、同じ対象期間の`simulation_start`発生セッションを分子とする。探索レポートでセッション単位に集計する。
- Simulation Start → Complete: `simulation_start`発生セッションを分母、`simulation_complete`発生セッションを分子とする。
- Compare Start → Complete: `compare_start`発生セッションを分母、`compare_complete`発生セッションを分子とする。
- Complete → Share: `simulation_complete`または`compare_complete`発生セッションを分母、コピー成功時の`share`発生セッションを分子とする。
- 保存条件を利用した再訪: 保存条件があり、前回確認日より後の日に表示した端末で送る`return_visit`を使用する。同日再読込は再訪に数えない。ユーザーIDを収集しないため、端末・ブラウザをまたぐ再訪率ではない。
- 新イベントの計測開始日は、`compare_start`分離修正の本番公開日とする（公開後にSHAと日時を追記）。公開前の欠損期間を0件として扱わない。

## 検証証拠

- lint 0 errors / 0 warnings、TypeScript 0 errors、Next.js 16.3.8 build成功（218 static generation units）。
- 通常QA・隔離production serverのlive QAはいずれも127ページ、SCORE 100/100、ERROR 0、WARNING 0。
- Verified Ledger、Return Series、VT、Compare、G-quality boundary、Simulation Insights、Content Trust、OGP Comparison、zero-page、system-checkはすべて成功。
- 375px相当、390px相当、PCで比較ページを確認。Windows headless Chromeの最小外寸をDPRで補正し、カード・比較表・CTAに恒常的な横スクロールがないことを確認した。
- 静的Compareから比較フォームへ、商品A/B・開始年2020・月額3万円が引き継がれ、比較完了後に同じ元本240万円、評価額、差額、グラフ、共有導線が表示された。
