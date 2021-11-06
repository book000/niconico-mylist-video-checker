import { NicoNicoMyListItem } from './NicoNicoMyListItem'

export class NicoNicoMyList {
  id: number
  name: string
  description: string
  items: NicoNicoMyListItem[]

  constructor(
    id: number,
    name: string,
    description: string,
    items: NicoNicoMyListItem[]
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.items = items
  }
}
