# AdSense品質改善ブロッカー

更新日: 2026-10-11

## 公開を妨げるブロッカー

ローカルrelease candidate `df58f47` の検証範囲ではなし。公開後のSource SHA一致と本番実測を完了条件とする。

## 別途対応候補

- Search ConsoleはPage/Query別CSVを取得済み（最新28日66クリック/2,862表示、直前28日49/2,050、3か月164/6,890）だが、Query×Page完全原票は未取得。構造変更判断前に取得できる場合は再照合する。
- Landing/Fund 4組とCompare/Article 4組は役割分離を確認して維持。統合は実測で意図競合が確認された場合のみ承認候補とする。
- QAのtitle/description文字数はINFO 174件。機械的な文字数合わせは行わない。

## 承認が必要な操作

- URL削除・ページ統合
- redirect、canonical、index/noindex変更
- AdSense再申請
- Search Consoleへの書き込み

## 今回解消したブロッカー

- G品質SCHDの直接URL、比較、共有、OGP、選択UIから未検証の評価額・利益・リターン・推移を除外。
- `simulate()`、高度シミュレーション、月次リターン取得の共通層で非A品質を拒否。
- 不正共有条件は既定値へ置換せず、200/noindex/follow/canonicalなしの停止画面へ統一。
