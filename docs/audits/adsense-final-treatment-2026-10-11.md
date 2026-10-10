# AdSense品質再構築：検索実績・被リンク・URL処遇の最終監査（2026-10-11）

## 調査範囲と制約

- sitemap掲載99 URLを、`content-quality-2026-10-11.csv`、最新production HTML、Git履歴、内部リンク監査と照合した。
- Search Consoleはドメインプロパティを読み取り専用で確認。www / non-wwwは分析時に同じパスへ正規化した。
- GSCの画面表示値は取得できたが、エクスポートURLはブラウザ拡張により`ERR_BLOCKED_BY_CLIENT`となった。このためダウンロード済み原票はなく、本資料には画面で確認した集計値と処遇判断に影響するURL値を記録する。
- 外部リンクレポートの28件はすべて`vercel.app`由来で、独立した第三者サイトからの被リンクは確認できなかった。
- URL削除、redirect、canonical、index/noindexは変更していない。

## GSC実測

| 期間 | クリック | 表示回数 | CTR | 平均順位 |
|---|---:|---:|---:|---:|
| 2026-09-09〜2026-10-06 | 65 | 2,808 | 2.3% | 12.1 |
| 2026-08-12〜2026-09-08 | 49 | 2,004 | 2.4% | 23.0 |
| 2026-07-07〜2026-10-06 | 162 | 6,750 | 2.4% | 21.7 |

最新28日URL表は96行。主な流入は`/compare/orukan-vs-nasdaq100`（17クリック／790表示）、`/compare/orukan-vs-schd`（13／295）、`/compare/orukan-vs-fangplus`（5／232）、`/compare/vt-vs-orukan`（5／99）で、比較ページが検索需要を担っている。記事側では`/articles/orukan-vs-nasdaq100`（3／178）、`/articles/schd-vs-sp500`（3／104）が表示されており、CompareとArticleは統合より役割分離を先に検証する。

今回改善した7ガイドの最新28日実績は次のとおり。

| URL | クリック | 表示回数 | 直前28日クリック | 直前28日表示 |
|---|---:|---:|---:|---:|
| `/guide/dollar-cost-averaging` | 0 | 0（URL表に出現なし） | 0 | 0（URL表に出現なし） |
| `/guide/nisa-tsumitate-ikura` | 0 | 6 | 0 | 4 |
| `/guide/tsumitate-nansnen-keizoku` | 0 | 20 | 0 | 22 |
| `/guide/tsumitate-vs-ikkatu` | 0 | 0 | 0 | 5 |
| `/guide/booraku-tsumitate-yameru` | 0 | 2 | 0 | 3 |
| `/guide/ikkatsu-vs-tsumitate-booraku` | 0 | 0（URL表に出現なし） | 0 | 0（URL表に出現なし） |
| `/guide/kodomo-nisa-hikidashi` | 1 | 39 | 0 | 8 |

低実績だけを削除理由にはしない。特に制度ガイドは公開時期が新しく、法務ページは検索流入獲得ではなく運営責任を示す役割がある。

## 被リンク・URL履歴

- GSC外部リンク：28件、リンク元サイトは`vercel.app`のみ。独立被リンクは未確認。
- 内部リンク総数：2,172。上位はトップ・Data Sources各112、利用規約91、主要比較・From・ガイド各90前後。
- Git履歴とsitemap履歴はテンプレート単位で確認。Landing、Fund、Compare、Article、From、Rankingは公開時期と共有実装が近く、履歴の長さだけでは独立価値を証明できない。
- インデックスレポート（最終更新2026-10-04）：登録81、未登録126。未登録理由にはredirect 34、適切なcanonicalを持つ代替21、noindex 19、検出済み未登録25等を含み、sitemap99件だけの内訳ではない。

## 99 URLの処遇方針

ページ単位の基礎点・種別・検索意図は`content-quality-2026-10-11.csv`、C/Dページの表示証拠は`cd-value-sprint-2026-10-11.csv`を参照する。処遇は次のルールで全99 URLへ適用した。

| 対象 | 件数 | 処遇 | 根拠 |
|---|---:|---|---|
| トップ・Data Sources | 2 | KEEP | 独自ツール入口と検証方法の中核 |
| 運営者情報 | 1 | KEEP | 編集責任と検証工程を示す |
| 法務・ポリシー | 5 | KEEP（検索評価とは別軸） | 利用者保護に必要。低流入を理由に削除しない |
| 商品Landing | 6 | ROLE SEPARATION | 条件変更・積立結果の入口に限定 |
| `/fang` | 1 | MERGE CANDIDATE | `/fund/fangplus`と名称・意図が近い。実施前に履歴と流入を再確認 |
| Fund詳細 | 7 | ROLE SEPARATION | 正式商品、費用、設定日、品質、出典を担当 |
| Compare | 15 | KEEP | 同条件の計算・共通期間・グラフが独自価値。主要流入を保護 |
| From | 6 | IMPROVE | 年固有の回数・元本・対象商品数を追加済み。検索実績を継続観測 |
| 月額 | 1 | IMPROVE | 金額固有の元本・期間末評価額と条件差を強化済み |
| Guide | 37 | KEEP 30 / IMPROVE 7 | 制度・判断材料の固有意図を保護。今回7件を個別改善 |
| Hub | 7 | IMPROVE | 問い別ナビゲーションへ変更済み。単なるリンク一覧から脱却 |
| Article | 6 | ROLE SEPARATION | 商品構造・比較結果の読み方を担当し、数値比較はCompareへ |
| Ranking | 5 | IMPROVE | 対象期間・条件・A/G品質・除外理由を前面化済み |

処遇件数：KEEP 53、IMPROVE 26、ROLE SEPARATION 19、MERGE CANDIDATE 1、NOINDEX CANDIDATE 0。法務ページを一般記事と同じSEO点だけでNOINDEX候補にしない方針へ修正した。

## 重複群の判断

- 商品Landing / Fund：6組はROLE SEPARATION。`/vt`にFund詳細がなく、`/fund/vym`にLandingがない非対称は新URL量産では解消しない。
- `/fang` / `/fund/fangplus`：唯一のMERGE CANDIDATE。redirect等は未実施。
- Compare / Article 6組：Compareの検索表示・クリックが強いため保護。Articleは構造・判断材料へ分離し、検索実績が蓄積するまで統合しない。
- From 6件：年ごとの積立回数・共通元本・計算可能なA品質商品数が異なるためIMPROVE後に維持。
- Ranking 5件：算出条件が異なるためIMPROVE後に維持。ただしG品質依存のhigh-dividendは品質注記と順位外扱いを継続監査する。
- Hub 7件：問い別の入口へ改善済み。検索流入の少なさだけでは統合しない。

## 7ガイドの固有価値

1. ドルコスト平均法：購入口数の仕組み、比較条件、利益保証でないこと。
2. NISA月額：家計、使用時期、制度上限、同一期間の過去実績を順に確認。
3. 積立年数：商品設定後の検証可能期間と使用時期から年数を決める手順。
4. 積立対一括：同元本・期間・買付時点と制度上実行可能な条件を明示。
5. 暴落時の積立停止：停止・保有・売却を分離し、NISA枠再利用時点も確認。
6. 暴落時の一括対積立：未投資資金と投資済み金額の差だけを説明し、未計算の優劣を撤回。
7. こどもNISA払出し：年齢、使途、書面、申出、入金日、払出し後を確認する実務チェック。

## 判定

比較ページという勝ち筋と、検証済み月次データを使う独自ツールは確認できる。一方、独立被リンクがなく、役割分離・Hub・From・Rankingの改善が検索上どう評価されるかは公開後データが必要である。URL構造変更前に、今回の7ガイドを含む改善を公開し、28日以上のQuery×Page推移を再確認する。
