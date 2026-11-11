# niconico-mylist-video-checker

ニコニコ動画のマイリストを取得し、新しい動画が追加されたら Discord に通知するツールです。

この README は [README.md](README.md) の日本語訳です。

## 特徴

- 監視対象マイリストの動画を全ページ分取得
- 新着動画ごとに Discord へ Embed（タイトル・動画長・投稿者）を送信（Bot トークンとチャンネル ID、または Webhook URL を使用）
- 通知済み動画を記録し、10 分ごとに再チェック
- 初回実行時は現在の動画を記録するだけで通知しない

## インストール手順

### 1. Docker Compose 構成ファイルを作成

以下の内容で `compose.yml` ファイルを作成します。

```yaml
services:
  app:
    image: book000/niconico-mylist-video-checker:latest
    volumes:
      - ./data:/data
    init: true
```

### 2. 設定ファイルを作成

`data` ディレクトリに以下のファイルを作成します。

`config.json` は Discord の設定です。`token` と `channelId`、または `webhookUrl` のどちらかを設定します。

```json
{
  "discord": {
    "token": "YOUR_DISCORD_TOKEN",
    "channelId": "YOUR_CHANNEL_ID"
  }
}
```

```json
{
  "discord": {
    "webhookUrl": "YOUR_DISCORD_WEBHOOK_URL"
  }
}
```

`watch-my-lists.json` は監視するマイリスト ID（`https://www.nicovideo.jp/mylist/<ID>` の数字）の JSON 配列です。このファイルが無いとエラーで終了します。

```json
[12345678, 23456789]
```

### 3. サービスを起動

```bash
docker compose up -d
```

コンテナは、チェックを実行して 10 分待機することを繰り返します。通知済み動画 ID は `data/mylist.json` に保存されます。削除すると最初からやり直しになります（次回実行では通知されません）。

## 設定

Docker イメージは次の環境変数を設定しています。

| 変数 | イメージでの既定値 | 説明 |
|---|---|---|
| `CONFIG_PATH` | `/data/config.json` | Discord 設定ファイルのパス |
| `WATCH_MY_LISTS_PATH` | `/data/watch-my-lists.json` | 監視対象マイリスト ID ファイルのパス |
| `MY_LIST_PATH` | `/data/mylist.json` | 通知済み動画の状態ファイルのパス |
| `LOG_DIR` | `/data/logs` | ログファイルのディレクトリ |

## 開発

```bash
pnpm install
pnpm start   # ./data/config.json、./watch-my-lists.json、./mylist.json を読み込む
pnpm lint
```

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。
