# niconico-mylist-video-checker

ニコニコ動画のマイリストデータを取得し、新しい動画についてDiscordに通知を送信するツールです。

## ✨ 特徴

- ニコニコ動画のマイリストデータを簡単に取得
- Discord通知機能をサポート

## 🚀 インストール手順

### 1. Docker Compose構成ファイルを作成

以下の内容で `compose.yml` ファイルを作成します。

```yaml
services:
  app:
    image: book000/niconico-mylist-video-checker:latest
    volumes:
      - ./data:/data
```

### 2. 設定ファイルを作成

`data` ディレクトリに以下の内容で `config.json` ファイルを作成します。

```json
{
  "discord": {
    "token": "YOUR_DISCORD_TOKEN",
    "channelId": "YOUR_CHANNEL_ID"
  }
}
```

### 3. Docker Composeを使用してサービスを起動

```bash
docker compose up --build
```

## 📑 ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。
