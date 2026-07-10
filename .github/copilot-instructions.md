# GitHub Copilot コードレビュー指示

このファイルは GitHub Copilot のコードレビュー機能向けのレビュー基準を定義する。
開発作業手順は `CLAUDE.md` を参照。

## プロジェクト概要

ニコニコ動画のマイリストから新着動画を検出し、Discord に通知する TypeScript / Node.js (tsx) 製のツール。パッケージマネージャは pnpm。

## レビューコメントの言語

- 日本語で記載する。

## lint/formatter で機械的に強制済みの規約（重複指摘しない）

以下は Prettier (`.prettierrc.yml`) / ESLint (`@book000/eslint-config`) / `tsc` により CI 上で強制される。スタイル差分としてレビューで指摘しない：

- セミコロン無し、シングルクォート、`tabWidth: 2`、`trailingComma: es5`、行末 LF（Prettier）
- TypeScript strict モード、`noUnusedLocals` / `noUnusedParameters` / `noImplicitReturns` 等（`tsconfig.json`）

## 重点的に確認する点

- **機密情報**: Discord トークン・`webhookUrl`・API キーがコードやログにハードコードされていないか。設定は `data/config.json`（Git 管理外）または環境変数から読む前提。
- **エラーハンドリング**: 外部 API (`nvapi.nicovideo.jp`) 呼び出しやファイル I/O の失敗が握りつぶされていないか。`fetch` のレスポンスは `response.ok` を確認しているか。
- **状態管理の正当性**: 通知済み動画 ID (`mylist.json`) の読み書きで、新規動画の重複通知や通知漏れが発生しないか。初回実行（`mylist.json` 不在）時は通知をスキップする挙動が保たれているか。
- **ページネーション**: マイリストが 100 件を超える場合の `hasNext` による次ページ再帰取得が正しいか。
- **JSDoc**: 公開関数・インターフェースに日本語 JSDoc が付いているか。
- **コミットメッセージ**: Conventional Commits 形式で、`<description>` が日本語か。

## 誤検知しやすい既知パターン（フラグ不要）

- ログ・エラーメッセージ先頭の絵文字（❌ 🆕 🎥 等）は意図的な仕様。
- `src/main.ts` の `process.exit(1)`（`// eslint-disable-next-line unicorn/no-process-exit` 付き）は意図的。
- コード内コメントが日本語、`throw new Error(...)` 等のエラーメッセージが英語なのは規約通り。
- `data/config.json` / `watch-my-lists.json` / `mylist.json` がリポジトリに存在しないのは正常（実行時に読み書きされ Git 管理外）。
- HTTP リクエストにライブラリ（axios 等）ではなくネイティブ `fetch` を使うのは意図的。
