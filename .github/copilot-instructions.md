# GitHub Copilot Instructions

## プロジェクト概要

- **目的**: ニコニコ動画のマイリストから新しい動画を取得し、Discord に通知する
- **主な機能**:
  - ニコニコ動画のマイリストデータ取得
  - Discord 通知対応
  - 新規動画の自動検出と通知
- **対象ユーザー**: 開発者、ニコニコ動画のマイリストを監視したいユーザー

## 共通ルール

- **会話言語**: 日本語で行う
- **コミット規約**: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う
  - 形式: `<type>(<scope>): <description>`
  - `<description>` は日本語で記載
  - 例: `feat: ユーザー認証機能を追加`
- **日本語と英数字の間**: 必ず半角スペースを挿入する

## 技術スタック

- **言語**: TypeScript
- **実行環境**: Node.js (tsx を使用)
- **パッケージマネージャー**: pnpm
- **主要ライブラリ**:
  - `@book000/node-utils`: Discord 通知、Logger 等のユーティリティ
  - `axios`: HTTP リクエスト

## コーディング規約

- **フォーマッター**: Prettier
  - 設定ファイル: `.prettierrc.yml`
  - セミコロン無し、シングルクォート使用
- **リンター**: ESLint
  - 設定: `@book000/eslint-config` を使用
- **コメント**: 日本語で記載
- **エラーメッセージ**: 英語で記載
- **TypeScript**:
  - strict モード有効
  - `skipLibCheck` での回避は禁止

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# アプリケーションの起動
pnpm start

# 開発モード（ファイル監視）
pnpm dev

# Lint 実行
pnpm lint
pnpm lint:prettier  # Prettier チェックのみ
pnpm lint:eslint    # ESLint チェックのみ
pnpm lint:tsc       # 型チェックのみ

# 自動修正
pnpm fix
pnpm fix:prettier   # Prettier 自動修正のみ
pnpm fix:eslint     # ESLint 自動修正のみ
```

## テスト方針

- 現在、テストフレームワークは設定されていません
- テストを追加する場合は、プロジェクトオーナーと相談してください

## セキュリティ / 機密情報

- **Discord トークン**: `data/config.json` で管理し、Git にコミットしない
- **API キー**: 環境変数または設定ファイルで管理し、リポジトリにコミットしない
- **ログ**: 認証情報や個人情報を出力しない

## ドキュメント更新

コードの変更時には、以下のドキュメントも更新してください：

- `README.md`: 機能追加や使い方の変更時
- `README-ja.md`: README.md と同じタイミングで更新

## リポジトリ固有

- **Docker 対応**: `Dockerfile` と `compose.yml` が用意されており、Docker で実行可能
- **設定ファイル**: `data/config.json` で Discord 設定を管理
- **マイリスト管理**: `watch-my-lists.json` で監視対象のマイリストを管理
- **状態管理**: `mylist.json` で通知済みの動画 ID を管理
- **環境変数**:
  - `WATCH_MY_LISTS_PATH`: 監視対象マイリストファイルのパス（デフォルト: `watch-my-lists.json`）
  - `MY_LIST_PATH`: 通知済み動画管理ファイルのパス（デフォルト: `mylist.json`）
- **絵文字の使用**: エラーメッセージやログメッセージには絵文字を使用している（❌、🆕、🎥 等）
- **Renovate**: 依存関係の自動更新に Renovate を使用
