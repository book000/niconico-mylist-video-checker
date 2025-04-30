# niconico-mylist-video-checker

A tool to fetch data from NicoNico video's MyList and send notifications to Discord about new videos.

## ✨ Features

- Easily fetch data from NicoNico video's MyList
- Supports Discord notifications

## 🚀 Installation

### 1. Create the Docker Compose configuration file

Create a `compose.yml` file with the following content:

```yaml
services:
  app:
    image: book000/niconico-mylist-video-checker:latest
    volumes:
      - ./data:/data
```

### 2. Create the configuration file

Create a `config.json` file in the `data` directory with the following structure:

```json
{
  "discord": {
    "token": "YOUR_DISCORD_TOKEN",
    "channelId": "YOUR_CHANNEL_ID"
  }
}
```

### 3. Start the services using Docker Compose

```bash
docker compose up --build
```

## 📑 License

This project is licensed under the [MIT License](LICENSE).
