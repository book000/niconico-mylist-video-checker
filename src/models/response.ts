interface Owner {
  ownerType: string
  type: string
  visibility: string
  id: string
  name: string
  iconUrl: string
}

interface Thumbnail {
  url: string
  middleUrl: string
  largeUrl: string
  listingUrl: string
  nHdUrl: string
}

interface Count {
  view: number
  comment: number
  mylist: number
  like: number
}

interface Video {
  type: string
  id: string
  title: string
  registeredAt: string
  count: Count
  thumbnail: Thumbnail
  duration: number
  shortDescription: string
  latestCommentSummary: string
  isChannelVideo: boolean
  isPaymentRequired: boolean
  playbackPosition: any
  owner: Owner
  requireSensitiveMasking: boolean
  videoLive: any
  isMuted: boolean
  [key: string]: any
}

interface Item {
  itemId: number
  watchId: string
  description: string
  decoratedDescriptionHtml: string
  addedAt: string
  status: string
  video: Video
}

interface Mylist {
  id: number
  name: string
  description: string
  decoratedDescriptionHtml: string
  defaultSortKey: string
  defaultSortOrder: string
  items: Item[]
  totalItemCount: number
  hasNext: boolean
  isPublic: boolean
  owner: Owner
  hasInvisibleItems: boolean
  followerCount: number
  isFollowing: boolean
}

interface Data {
  mylist: Mylist
}

interface Meta {
  status: 200
}

export interface NicoNicoMyListResponse {
  meta: Meta
  data: Data
}
