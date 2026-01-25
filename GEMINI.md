# Gemini CLI 作業方針

## 目的

このファイルは、Gemini CLI がこのプロジェクトで作業する際のコンテキストと作業方針を定義します。

## 出力スタイル

- **言語**: 日本語で回答する
- **トーン**: 明確で簡潔な技術的説明
- **形式**: Markdown 形式で構造化された出力

## 共通ルール

- **会話言語**: 日本語
- **コミット規約**: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う
  - 形式: `<type>(<scope>): <description>`
  - `<description>` は日本語で記載
  - 例: `feat: Discord 通知機能を追加`
- **日本語と英数字の間**: 新規追加・更新する日本語テキストでは、日本語と英数字の間に必ず半角スペースを挿入する（既存ドキュメントは原則そのまま・修正時に順次対応）

## プロジェクト概要

- **プロジェクト名**: niconico-mylist-video-checker
- **目的**: ニコニコ動画のマイリストから新しい動画を取得し、Discord に通知する
- **主な機能**:
  - ニコニコ動画マイリスト API からのデータ取得
  - 新規動画の自動検出（既通知動画との差分）
  - Discord への通知送信（Embed 形式）
  - 通知済み動画の状態管理

## コーディング規約

### フォーマット

- **フォーマッター**: Prettier（`.prettierrc.yml`）
  - セミコロン無し
  - シングルクォート使用
  - タブ幅: 2
  - 行末: LF

### 命名規則

- **変数・関数**: camelCase
- **クラス・型**: PascalCase
- **定数**: UPPER_SNAKE_CASE（必要に応じて）

### コメントとメッセージ

- **コード内コメント**: 日本語
- **エラーメッセージ**: 英語
- **ログメッセージ**:
  - ユーザー向け info: 日本語（絵文字を使用: ❌、🆕、🎥 等）
  - debug / error: 既存実装に合わせ英語も許容

### TypeScript

- **strict モード**: 有効
- **`skipLibCheck`**: 使用禁止
- **JSDoc**: 関数やインターフェースに日本語で記載

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# アプリケーションの起動
pnpm start

# 開発モード（ファイル監視）
pnpm dev

# Lint 実行（全て）
pnpm lint

# Lint 実行（個別）
pnpm lint:prettier  # Prettier チェック
pnpm lint:eslint    # ESLint チェック
pnpm lint:tsc       # TypeScript 型チェック

# 自動修正
pnpm fix            # Prettier + ESLint 自動修正
pnpm fix:prettier   # Prettier 自動修正
pnpm fix:eslint     # ESLint 自動修正
```

## 注意事項

### セキュリティ

- **Discord トークン**: `data/config.json` で管理し、Git にコミットしない
- **API キー**: 設定ファイルまたは環境変数で管理し、リポジトリにコミットしない
- **ログ出力**: 認証情報や個人情報を出力しない

### 既存ルールの優先

- プロジェクトの既存コーディングスタイルに従う
- Prettier と ESLint の設定を尊重する
- 既存のエラーメッセージやログメッセージのスタイル（絵文字等）を踏襲する

### 既知の制約

- **テストフレームワーク**: 現在未設定
- **初回実行モード**: `mylist.json` が存在しない場合、Discord 通知はスキップされる
- **ページネーション**: マイリストが 100 件を超える場合、再帰的に次ページを取得する

## リポジトリ固有

### アーキテクチャ

```
src/
├── main.ts                    # エントリーポイント
├── config.ts                  # 設定管理
└── models/
    ├── niconico-mylist.ts     # マイリストモデル
    ├── niconico-mylistitem.ts # マイリストアイテムモデル
    └── response.ts            # API レスポンス型定義
```

### 設定ファイル

- **`data/config.json`**: Discord 設定
  - `discord.token` と `discord.channelId`、または `discord.webhookUrl` が必要
- **`watch-my-lists.json`**: 監視対象のマイリスト ID リスト（JSON 配列）
- **`mylist.json`**: 通知済み動画 ID の状態管理

### 環境変数

- **`WATCH_MY_LISTS_PATH`**: 監視対象マイリストファイルのパス（デフォルト: `watch-my-lists.json`）
- **`MY_LIST_PATH`**: 通知済み動画管理ファイルのパス（デフォルト: `mylist.json`）

### 主要ライブラリ

- **`@book000/node-utils`**: Discord 通知、Logger 等のユーティリティ
- **`axios`**: HTTP リクエスト
- **`tsx`**: TypeScript 実行環境

### Docker 実行

- **Dockerfile**: イメージ定義
- **compose.yml**: Docker Compose 設定
- **実行環境**: 本番環境では Docker で実行される前提

### Renovate

- 依存関係の自動更新に Renovate を使用
- Renovate が作成した PR には変更を加えない

### ドキュメント

- **`README.md`**: 英語版ドキュメント
- **`README-ja.md`**: 日本語版ドキュメント
- 機能追加や使い方の変更時は両方を更新すること
