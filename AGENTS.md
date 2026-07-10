<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 積立タイムマシン 運営ルール

このプロジェクトは「積立投資のデータを整理・比較するサイト」というブランドを維持しながら、
記事を継続的に追加していくフェーズにある。以下のルールは新しいチャットセッションでも
必ず引き継ぐこと。

## Single Source of Truth

- **`lib/funds.ts` を唯一の正とする。** 年間リターン・最大下落率・銘柄数・信託報酬は
  ハードコードせず、必ず以下を使うこと。
  - `formatAnnualReturn(fundId, year)` — 暦年リターンの表示用文字列
  - `formatExpenseRatio(fundId)` — 信託報酬・経費率の表示用文字列
  - `FUNDS[fundId].shareCount` — 構成銘柄数
- 記事・比較ページ・ガイドで同じ数値を扱う場合、既存の比較ページ（`lib/compare-pages.ts`）
  や既存記事（`content/articles/*.tsx`）の数値と必ず突合してから執筆する。
- **`lib/nisa.ts` を新NISA制度数値（年間投資枠・生涯非課税保有限度額）の唯一の正とする。**
  つみたて投資枠・成長投資枠の金額を本文中に直接書かず、`NISA_LIMITS` と
  `formatManEn()` を使うこと。制度改正があった場合、このファイルの値を
  更新するだけで参照している全ページに反映される。

## 制度記事（NISA・税制・金融庁基準など）の運営ルール

制度は法改正・税制改正により変更される可能性があるため、比較記事・行動系ガイドより
一段階慎重に扱う。

- 制度に関する数値・ルールを扱う記事には、本文中に必ず
  `lib/nisa.ts` の `NISA_SYSTEM_DISCLAIMER`
  （「制度は将来変更される可能性があります。最新情報は金融庁・お取引の証券会社等の
  公式情報をご確認ください。」）を含めること。
- 制度上の数値（年間投資枠・生涯投資枠など）は `lib/nisa.ts` の `NISA_LIMITS` を
  参照し、直接数値を書かない。
- 出典（金融庁等の公式情報へのリンク）を `sourceLinks` に明記すること。
- **制度・税制・公式基準に基づく数値を扱う記事には、必ず `GuidePage.systemCheck`
  を設定する。** 何を（`topic`）・いつ（`lastConfirmed`, ISO日付）・どこで
  （`source` / `sourceUrl`）確認したかを記録する。この情報は
  `app/guide/[slug]/page.tsx` が記事内に表示すると同時に、
  `data-system-check-date` 属性としてHTMLに出力する。
  ```ts
  systemCheck: [
    {
      topic: "つみたて投資枠・成長投資枠の年間投資枠",
      lastConfirmed: "2026-07-06",
      source: "金融庁 NISA特設ウェブサイト",
      sourceUrl: "https://www.fsa.go.jp/policy/nisa2/index.html",
    },
  ],
  ```

## 既存記事のリライト管理（SEO運用の一部）

新規記事の追加だけでなく、既存記事の改善もSEO戦略の一部として運営する。

- Search Consoleで表示回数・クリックが増えてきた記事は、**公開から3〜6ヶ月**を
  目安にリライト候補として扱う。ユーザーから「この記事をリライトしたい」と
  依頼があった場合、または定期レビューのタイミングで、以下を確認する。
  - 検索クエリと記事内容がずれていないか（実際に検索されているキーワードに
    タイトル・見出しが対応しているか）
  - `lib/funds.ts` の実データが更新されている場合、記事内の数値が追随しているか
  - 内部リンク切れ・関連記事の追加漏れがないか（`npm run qa` で機械的に確認）
  - 制度記事の場合、`lib/nisa.ts` の制度数値・注意書きが最新かどうか
- 制度・税制記事については、`npm run system-check-audit`（ビルド後に実行）で
  `systemCheck.lastConfirmed` から**365日以上経過した記事を機械的に抽出**できる。
  180日以上経過はWATCH、365日以上経過はREWRITE CANDIDATEとして報告される。
  定期レビュー時はこのコマンドの結果を確認し、対象記事があれば公式情報源と
  再照合した上で `lastConfirmed` を更新すること。
- リライトの際も、通常の記事追加と同じ手順（build → qa → PC/スマホ確認 →
  Search Console確認）を実施してから完了とする。

## 文章ルール

- 事実ベースで書く。「〜べき」「おすすめ」「一択」「絶対」などの助言的・断定的表現は使わない。
- 将来予測を書かない。「過去実績では」「〜という考え方が一般的です」のような表現を使う。
- 迷ったら新機能追加より既存の品質・信頼性・保守性の維持を優先する。

## 記事テンプレート

- 新規記事は `components/articles/ArticleBlocks.tsx` の `SectionHeading` / `SpecCard` /
  `SimCard` を必ず再利用する。記事ファイル内で同名コンポーネントを再定義しない。
- `content/articles/index.ts` の `ARTICLE_REGISTRY` に登録すること。
- スキャフォールドを自動生成する場合は以下を使う（`content/articles/<slug>.tsx` の
  ひな形を生成し、次にやることを画面に表示する）。
  ```
  node scripts/new-article.mjs --slug <slug> --fundA <fundId> --fundB <fundId> \
    --title "..." --description "..."
  ```
  生成後は本文・比較表・FAQを既存記事（`content/articles/schd-vs-vym.tsx` 等）を
  参考に事実ベースで肉付けすること。metaTitleにサイト名サフィックスを直書きしない
  （root layoutのtemplateが自動付与するため二重表示になる）。

## 記事・比較ページ・ガイド追加時の必須手順

新しいコンテンツを追加する際は、**実装前**に以下を確認する。

1. 既存記事・比較ページ・ガイドとの重複確認
2. 検索需要・競合性の確認
3. 内部リンク設計（関連記事・関連比較ページ・シミュレーション導線）
4. **テーマ選定理由の表現は根拠に忠実にすること。** 「Search Consoleで伸びそう」
   「表示回数が増えている」といった表現は、実際にSearch Consoleのデータを
   確認・参照した場合のみ使う。データを見ていない場合は「一般的な検索需要」
   「既存コンテンツとの重複状況」「サイト全体の構成バランス」など、実際に
   判断根拠とした情報のみを書くこと。
5. **記事完成後、必ず「SEOクラスタの何記事目か」を明記する。** そのテーマが
   属するクラスタ名と、クラスタ内の記事一覧（既存＋今回＋未着手）を優先順位
   付きで示す。例:
   ```
   税金クラスタ
   ① 新NISAと課税口座（特定口座）の違い ←今回
   ② 非課税枠を使い切ったら（課税口座への切り替え）
   ③ 分配金と税金（普通分配金・特別分配金）
   ④ NISA口座の損益通算不可ルール
   ⑤ 外国税額控除
   ```
   これにより記事単体の効果だけでなく、クラスタ全体の設計を継続的に管理する。
4. `lib/funds.ts` を参照した事実確認（Single Source of Truthの通りハードコード禁止）

**実装後は、以下を上から順に必ず実行してから「完了」と報告すること。**

```
1. npm run build            （ビルドが通ることを確認）
2. npm run qa                （自動QA。ERROR 0件を確認。QA SCOREを報告に含める）
3. PC確認                    （ブラウザで実際に開き、title/OGP/JSON-LDをDevToolsで確認）
4. スマホ確認                （モバイル viewport で表示崩れがないか確認）
5. Search Console登録        （sitemap反映・URL検査でインデックス登録をリクエスト）
6. X投稿文の作成
```

`npm run qa`（内部で `node scripts/qa-check.mjs` を実行）が1件でもERRORを出している状態、
または実機確認前の状態で「完了しました」と報告してはならない。ローカルにサーバーを
起動できる場合は `npm run qa:live` でcanonical/OGP画像/sitemap掲載URLの実HTTPステータス
まで検証すること。GitHub Actions（`.github/workflows/qa.yml`）でもpush・PR時に同じ
チェックが自動実行され、ERRORがあればCIが失敗する。

QA結果は ERROR（必ず修正）/ WARNING（要確認）/ INFO（参考情報、title・description文字数の
目安逸脱など）の3段階に分かれる。ブロックすべきはERRORのみで、WARNING/INFOは記事の質を
高めるための参考情報として扱う。

## 回帰チェック（Regression Test）

過去に発生したバグと同じ種類の問題が再発していないか、記事追加のたびに横断確認する。

- title二重サフィックス（`| 積立タイムマシン | 積立タイムマシン`）
- `lib/funds.ts` の実データと矛盾する数値のハードコード
- 存在しないページへの内部リンク（例: 特定の銘柄にしか存在しない `/monthly/[amount]` を
  全銘柄向けに無条件生成してしまう等）
- OGP画像・JSON-LDの欠落

`scripts/qa-check.mjs` はこれらを自動検出するために書かれている。スクリプトが検出できない
新しいパターンのバグを見つけた場合は、都度スクリプトにチェック項目を追加すること。

## 成長提案（記事追加後）

記事追加のたびに、以下の観点に限定した改善提案を最大3件行う。新機能の提案は行わない。

- 品質維持 / SEO強化 / UX改善 / 回遊率向上 / E-E-A-T向上

各提案には「期待できる効果」「優先度（S/A/B）」「実装コスト」を簡潔に記載する。
