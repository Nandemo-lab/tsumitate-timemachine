# AdSense再申請前・最終リリース候補レポート

更新日: 2026-10-11

このファイルは10工程の証拠を集約する。本番 `54d01e7` と未公開ローカル差分を明確に分ける。

## Phase結果

| Phase | 状態 | 証拠 | 結果 |
|---|---|---|---|
| 1 | 完了 | GitHub Actions #83、Vercel Production | `54d01e7` 公開成功 |
| 2 | 完了（本番問題発見） | `/share` 実表示 | A比較は一致、G数値共有をP0認定 |
| 3 | 完了 | 96URL台帳、独立監査 | 比較5ページ・老後ガイド等をローカル修正 |
| 4 | 完了（承認候補あり） | 既存台帳・本文比較 | 役割分離を維持、無断構造変更なし |
| 5 | 完了 | 375/390/1280px実測 | 横溢れ・console error/warningなし |
| 6 | 完了（GSC制約あり） | QA/GSC CSV | 技術SEO合格、Query×Page完全原票なし |
| 7 | 完了 | 実画面導線 | Compare→Article/Simulator、Share→再試算を確認 |
| 8 | 完了 | 3独立コンテキスト・5領域 | AdSense/SEO/金融/UI/事業の独立指摘を統合 |
| 9 | 完了 | 差分と全再監査 | P0/P1修正、全検証成功 |
| 10 | 完了（公開待ち） | 本レポート | ローカルrelease candidate作成、再申請はNO-GO |

## 本番反映

- 公開commit: `54d01e78dcb0b839c453d2912e0a53733227df38`
- GitHub Actions: `https://github.com/Nandemo-lab/tsumitate-timemachine/actions/runs/38134184887` Success
- Vercel Production: `https://tsumitate-timemachine-afor9vn0a-nandemo-labs-projects.vercel.app`
- ローカル修正commit: `7b21b84f9f81865bcd3bf2c08bebaf1487879b4d`（未push）

## 発見・修正した主要問題

- G品質SCHDの共有数値: 共有パラメータ、共有ページ、OGPでA品質以外を拒否。G関連ArticleのOGPは静的画像へ切替。
- 比較ページ: S&P500/オルカンの商品属性3件、India/Emergingの結論不一致、VTI/NASDAQ100の未検証優劣を訂正。
- 生活成果表現: 利益額を学費・旅行・スマートフォン等へ換算する表現を削除し、元本と期間末評価額の差だけを表示。
- 老後資金ガイド: 年率7%の到達額、一律の積立額・制度優先順位・取り崩し助言を削除。モデルケースと個人必要額を分離。
- ShareCard: 終了年月、税金・手数料・為替コストの範囲を明記し、無条件の新NISAハッシュタグを削除。

## 検証

- lint: 0 error / 0 warning
- TypeScript: PASS
- Build: PASS、228 pages
- 通常QA: 128 pages、100/100、ERROR 0、WARNING 0
- live QA: 128 pages、100/100、ERROR 0、WARNING 0、SEO/Metadata/JSON-LD/Internal Links/Canonical/OGP PASS
- zero-page/system-check/content-trust/Verified Ledger/Return Series/VT/Compare/OGP comparison: PASS
- A系列: 9、共通終端2026-08。SCHDはGのまま。
- 実画面: 390px比較SVG 354×240、PC 480×288。375/390/1280pxでページ横溢れなし、console error/warning 0。

## 5専門領域の結論

- AdSense品質: 本番にG数値共有と誤認表現が残るため再申請停止。
- SEO: 技術SEOは合格。Landing/Fund、Compare/Articleは機能と回答を分離して維持。
- 金融データ: A系列の計算・台帳は合格。G系列は共有・優劣から除外。
- UI/UX: 主要操作とレスポンシブ表示は合格。重要注記の意味をローカルで改善。
- 事業・読者価値: 検証可能な条件再現は独自価値。生活成果への換算は信頼性を損なうため撤去。

## GSC・96URL

- 既存台帳: `docs/audits/final-96-production-audit-2026-10-11.csv`、`final-96-local-residual-audit-2026-10-11.csv`
- 96/96を台帳で確認。KEEP 84、ROLE SEPARATION 11、IMPROVE 1を起点に今回の専門監査を反映。
- GSC: 最新28日 66クリック/2,862表示、直前28日 49/2,050、3か月 164/6,890。Query×Page完全原票は未取得。

## 最終判定

**NO-GO。** ローカルrelease candidateでは修正可能なP0/P1を解消したが、本番は `54d01e7` のままでG品質数値共有と今回訂正した表現を含む。新規commitの公開と公開後実地確認までは再申請しない。Googleの承認は保証しない。

## 2026-10-11 G品質境界release candidate

- 実装commit: `df58f47` (`fix: enforce verified simulation boundaries`)
- 共通境界: `simulate()`、高度シミュレーション、月次リターン取得はA品質だけを受理。
- SCHD直接URL: HTTP 200、`noindex, follow`、canonicalなし。商品属性・品質・出典だけを表示。
- 比較/選択/図鑑: SCHD数値・グラフ・シミュレーションリンクを出さず、商品属性へ誘導。
- 共有/OGP: G品質・不正商品・不正年月・不正金額を既定値へ置換せず拒否。拒否共有ページもnoindex/canonicalなし。
- A品質検算: 9系列、欠損0、look-ahead 0、fallback 0。終端は2026-08。
- QA: lint、TypeScript、Build 219 pages、通常/ライブQA 128 pages・100/100・ERROR 0・WARNING 0、全関連audit PASS。
- 実画面: PC/375/390pxで横溢れなし。比較SVGはPC 480×288、375px 339×240、390px 354×240。切替ボタン44px。

公開後のSource SHA、本番直接URL、共有、OGP再確認を終えるまでは最終GOとしない。
