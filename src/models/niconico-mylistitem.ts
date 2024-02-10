export class NicoNicoMyListItem {
  watchId: string
  status: string
  title: string
  duration: number
  ownerName: string
  ownerId: string

  constructor(
    watchId: string,
    status: string,
    title: string,
    duration: number,
    ownerName: string,
    ownerId: string
  ) {
    this.watchId = watchId
    this.status = status
    this.title = title
    this.duration = duration
    this.ownerName = ownerName
    this.ownerId = ownerId
  }
}
