# GEMINI.md

## 目的
- Gemini CLI 向けのコンテキストと作業方針を定義する。

## 出力スタイル
- 言語: 日本語
- トーン: 簡潔で事実ベース
- 形式: Markdown

## 共通ルール
- 会話は日本語で行う。
- PR とコミットは Conventional Commits に従う。
- PR タイトルとコミット本文の言語: PR タイトルは Conventional Commits 形式（英語推奨）。PR 本文は日本語。コミットは Conventional Commits 形式（description は日本語）。
- 日本語と英数字の間には半角スペースを入れる。

## プロジェクト概要
Monitors NicoNico video mylist and sends Discord notifications for new videos.

### 技術スタック
- **言語**: TypeScript
- **フレームワーク**: Node.js
- **パッケージマネージャー**: pnpm@10.28.1
- **主要な依存関係**:
  - axios@1.13.2
  - @book000/node-utils@1.24.32
  - @book000/eslint-config@1.12.40

## コーディング規約
- フォーマット: 既存設定（ESLint / Prettier / formatter）に従う。
- 命名規則: 既存のコード規約に従う。
- コメント言語: 日本語
- エラーメッセージ: 英語

### 開発コマンド
```bash
# install
pnpm install

# dev
tsx watch ./src/main.ts

# build
None - runs as script

# test
None

# lint
run-z lint:prettier,lint:eslint,lint:tsc

# fix
run-z fix:prettier,fix:eslint

```

## 注意事項
- 認証情報やトークンはコミットしない。
- ログに機密情報を出力しない。
- 既存のプロジェクトルールがある場合はそれを優先する。

## リポジトリ固有
- **runtime**: Node.js (tsx for development)
- **docker_support**: True
**api_integrations:**
  - NicoNico API
  - Discord API
- **config_format**: JSON (data/ directory)