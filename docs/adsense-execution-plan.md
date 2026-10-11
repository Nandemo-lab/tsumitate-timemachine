# AdSense完全品質改善・10工程実行計画

更新日: 2026-10-11

| Phase | 目的 | 完了条件 | 公開可否 |
|---|---|---|---|
| 1 | ShareCard既存commit公開 | 差分確認、CI、Vercel Production、対象SHA一致 | 既存 `54d01e7` のみ許可 |
| 2 | ShareCard本番E2E | 単一・A比較・G比較・不正条件・OGP実体確認 | 読み取りのみ |
| 3 | 全96URL・金融情報監査 | 本番HTML、画面、一次情報、SSOTとの照合 | 新規修正はローカルのみ |
| 4 | 低価値・重複整理 | 96URL台帳更新、独立価値と構造候補を明示 | 構造変更は承認待ち |
| 5 | スマホUI/UX | 375/390/1280px、主要操作と表示確認 | 軽微修正はローカルのみ |
| 6 | SEO・GSC | sitemap/robots/canonical/JSON-LD/HTTP/GSC読取 | Search Console書込禁止 |
| 7 | 独自価値・回遊 | Compare/Guide/Fund/Shareの行動導線確認 | 安全修正はローカルのみ |
| 8 | 5専門家レビュー | 独立コンテキストを含む5視点評価 | 読み取りのみ |
| 9 | 修正・再監査 | P0/P1修正、回帰検査、最大3回 | 新規commitはpush禁止 |
| 10 | 最終リリース候補 | 全証拠整理、再申請判定 | 再申請禁止 |

## 判定原則

- QA点数とコンテンツ品質を分離する。
- 未確認をPASSや0件として扱わない。
- 金融数値は `lib/funds.ts`、制度数値は `lib/nisa.ts` を正とする。
- URL統合、redirect、canonical、index/noindex変更は承認候補として止める。
- 新規commitはローカル保存までとし、既存 `54d01e7` 以外は公開しない。
