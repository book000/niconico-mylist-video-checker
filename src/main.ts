import axios from 'axios'
import fs from 'node:fs'
import { Discord, Logger } from '@book000/node-utils'
import { NicoNicoMyList } from './models/niconico-mylist'
import { NicoNicoMyListItem } from './models/niconico-mylistitem'
import { NMVCConfiguration } from './config'

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
    mylist.items = [...mylist.items, ...nextPage.items]
  }
  return mylist
}

async function main() {
  const logger = Logger.configure('main')

  const watchMyListsPath =
    process.env.WATCH_MY_LISTS_PATH || 'watch-my-lists.json'
  const mylistPath = process.env.MY_LIST_PATH || 'mylist.json'
  logger.debug(`watchMyListsPath: ${watchMyListsPath}`)
  logger.debug(`mylistPath: ${mylistPath}`)

  const config = new NMVCConfiguration('./data/config.json')
  config.load()
  if (!config.validate()) {
    logger.error('❌ Config is invalid')
    for (const failure of config.getValidateFailures()) {
      logger.error('- ' + failure)
    }
    return
  }

  const discord = new Discord(config.get('discord'))

  if (!fs.existsSync(watchMyListsPath)) {
    logger.error(`❌ watchMyListsPath (${watchMyListsPath}) file not found`)
    process.exitCode = 1
    return
  }

  const watchMyLists = JSON.parse(fs.readFileSync(watchMyListsPath, 'utf8'))
  let notified: { [key: number]: string[] } = {}
  const initMode = !fs.existsSync(mylistPath)
  if (fs.existsSync(mylistPath)) {
    notified = JSON.parse(fs.readFileSync(mylistPath, 'utf8'))
  }

  for (const listId of watchMyLists) {
    const mylist = await getMylist(listId)
    const newItems = mylist.items.filter(
      (item: NicoNicoMyListItem) => !notified[mylist.id]?.includes(item.watchId)
    )
    if (newItems.length > 0) {
      logger.info(
        `🆕 ${mylist.name} に ${newItems.length} 件の新しい動画が追加されました`
      )
      if (!notified[mylist.id]) {
        notified[mylist.id] = []
      }

      for (const item of newItems) {
        logger.info(`🎥 ${item.title} (${item.duration}秒)`)
        if (!initMode) {
          await discord.sendMessage({
            embeds: [
              {
                title: `${item.title} (${item.duration}秒)`,
                url: `https://www.nicovideo.jp/watch/${item.watchId}`,
                color: 0x00_ff_00,
                fields: [
                  {
                    name: 'タイトル',
                    value: item.title,
                    inline: true,
                  },
                  {
                    name: '動画長',
                    value: `${item.duration}秒`,
                    inline: true,
                  },
                  {
                    name: '投稿者',
                    value: item.ownerName,
                    inline: true,
                  },
                ],
              },
            ],
          })
        }
        notified[mylist.id].push(item.watchId)
      }
    }
  }
  fs.writeFileSync(mylistPath, JSON.stringify(notified))
}

;(async () => {
  const logger = Logger.configure('main')
  await main().catch((error) => {
    logger.error('Error', error as Error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  })
})()
