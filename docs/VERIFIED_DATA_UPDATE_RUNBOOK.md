# 公式月次データ更新手順

公開月を進めるのは、A品質9系列が同じ月までそろい、一次raw・SHA-256・独立計算・全回帰を確認できた場合だけとする。1系列でも未検証なら公開終端は変更しない。

## 1. 更新前

1. working treeがcleanであることを確認する。
2. `scripts/build-verified-return-ledgers.mjs` の `RETRIEVED_AT`、`LAST_MONTH`、取得件数を対象月へ更新する。
3. 対象月以前のledger observationsをSHA-256で保存する。新しい月の監査スクリプトはこのprefix hashを期待値にする。

## 2. 一次raw取得

```powershell
node scripts/build-verified-return-ledgers.mjs --fetch
```

- VT/VTI/VYM: Vanguard Monthly NAV Total Return
- EEM/INDA: iShares Growth of Hypothetical $10,000のNAV系列
- 国内投信4系列: 公式の分配金再投資基準価額
- USD ETF: 日銀月末USD/JPY

rawは `data/verified/raw/` に保存し、manifestのSHA-256と一致させる。fallback、欠損補完、設定前補完は行わない。

## 3. 公開可否ゲート

```powershell
npm run verified-data-release-audit
npm run verified-ledger-audit
npm run return-series-audit
npm run vt-data-audit
npm run compare-return-audit
npm run g-quality-boundary-audit
```

対象月固有の独立再計算auditも追加する。USD ETFは公式USD NAV Total Returnと日銀為替から再計算し、国内投信は前月末・当月末の公式再投資基準価額から再計算する。過去月prefix hashが変わった場合は公開しない。

## 4. 表示・回帰

共通終端を進める場合は、`lib/simulation.ts` をSSOTとして、Data Sources、Compare、Ranking、From、Share、OGPの期間・積立回数・元本を確認する。lint、TypeScript、Build、通常QA、live QA、全金融audit、375/390/768/1280pxを完了してからデータ専用commitとして公開する。

SCHDはG品質のままverified manifestへ追加せず、評価額・利益・優劣を公開しない。
