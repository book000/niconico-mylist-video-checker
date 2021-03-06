import axios from 'axios'
import config from 'config'
import fs from 'fs'
import { NicoNicoMyList } from './models/NicoNicoMyList'
import { NicoNicoMyListItem } from './models/NicoNicoMyListItem'

async function getMylist(listId: number, page = 1): Promise<NicoNicoMyList> {
  const response = await axios.get(
    `https://nvapi.nicovideo.jp/v2/mylists/${listId}?pageSize=100&page=${page}`,
    {
      headers: {
        'X-Frontend-Id': '6',
        'X-Frontend-Version': '0',
        'X-Niconico-Language': 'ja-jp',
      },
    }
  )
  if (response.status !== 200) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  const result = response.data.data.mylist
  const mylist = new NicoNicoMyList(
    result.id,
    result.name,
    result.description,
    result.items.map(
      (item: {
        watchId: string
        status: string
        video: {
          title: string
          duration: number
          owner: { name: string; id: string }
        }
      }) => {
        return new NicoNicoMyListItem(
          item.watchId,
          item.status,
          item.video.title,
          item.video.duration,
          item.video.owner.name,
          item.video.owner.id
        )
      }
    )
  )
  if (result.hasNext) {
    const nextPage = await getMylist(listId, page + 1)
    mylist.items = mylist.items.concat(nextPage.items)
  }
  return mylist
}

async function sendMessageForDiscord(
  content: string,
  embed: { [key: string]: any }
) {
  const channelId = config.get('discordChannelId') as string
  const token = config.get('discordToken') as string
  await axios.post(
    `https://discord.com/api/channels/${channelId}/messages`,
    {
      content,
      embed,
    },
    {
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

;(async () => {
  const watchMyLists = JSON.parse(
    fs.readFileSync('watch-my-lists.json', 'utf8')
  )
  let notified: { [key: number]: string[] } = {}
  const initMode = !fs.existsSync('mylist.json')
  if (fs.existsSync('mylist.json')) {
    notified = JSON.parse(fs.readFileSync('mylist.json', 'utf8'))
  }
  for (const listId of watchMyLists) {
    const mylist = await getMylist(listId)
    const newItems = mylist.items.filter(
      (item: NicoNicoMyListItem) => !notified[mylist.id]?.includes(item.watchId)
    )
    if (newItems.length > 0) {
      console.log(
        `${mylist.name}???${newItems.length}?????????????????????????????????????????????`
      )
      if (!notified[mylist.id]) {
        notified[mylist.id] = []
      }
      for (const item of newItems) {
        console.log(`${item.title} (${item.duration}???)`)
        if (!initMode) {
          sendMessageForDiscord('', {
            title: `${item.title} (${item.duration}???)`,
            url: `https://www.nicovideo.jp/watch/${item.watchId}`,
            color: 0x00ff00,
            fields: [
              {
                name: '????????????',
                value: item.title,
                inline: true,
              },
              {
                name: '?????????',
                value: `${item.duration}???`,
                inline: true,
              },
              {
                name: '?????????',
                value: item.ownerName,
                inline: true,
              },
            ],
          })
        }
        notified[mylist.id].push(item.watchId)
      }
    }
  }
  fs.writeFileSync('mylist.json', JSON.stringify(notified))
})()
