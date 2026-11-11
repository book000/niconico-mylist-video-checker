# niconico-mylist-video-checker

A tool that fetches NicoNico video MyLists and sends a Discord notification when new videos are added.

## Features

- Fetches the videos of the MyLists you watch (all pages)
- Sends a Discord embed (title, duration, uploader) for each new video, using a bot token and channel ID or a webhook URL
- Remembers notified videos and checks again every 10 minutes
- On the first run, it only records the current videos and does not notify

## Installation

### 1. Create the Docker Compose configuration file

Create a `compose.yml` file with the following content:

```yaml
services:
  app:
    image: book000/niconico-mylist-video-checker:latest
    volumes:
      - ./data:/data
    init: true
```

### 2. Create the configuration files

Create these files in the `data` directory.

`config.json` holds the Discord settings. Set either `token` and `channelId`, or `webhookUrl`:

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

`watch-my-lists.json` is a JSON array of the MyList IDs to watch (the number in `https://www.nicovideo.jp/mylist/<ID>`). The tool exits with an error if this file is missing:

```json
[12345678, 23456789]
```

### 3. Start the service

```bash
docker compose up -d
```

The container runs the check, waits 10 minutes, and repeats. The notified video IDs are stored in `data/mylist.json`; delete it to start over (the next run will not notify).

## Configuration

The Docker image sets these environment variables:

| Variable | Default in the image | Description |
|---|---|---|
| `CONFIG_PATH` | `/data/config.json` | Path of the Discord configuration file |
| `WATCH_MY_LISTS_PATH` | `/data/watch-my-lists.json` | Path of the watched MyList IDs file |
| `MY_LIST_PATH` | `/data/mylist.json` | Path of the notified video state file |
| `LOG_DIR` | `/data/logs` | Directory for log files |

## Development

```bash
pnpm install
pnpm start   # reads ./data/config.json, ./watch-my-lists.json and ./mylist.json
pnpm lint
```

## License

This project is licensed under the [MIT License](LICENSE).

The Japanese version of this README is [README-ja.md](README-ja.md).
