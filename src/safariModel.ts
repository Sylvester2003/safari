import type DrawData from '@/drawData'

export default class SafariModel {
  private readonly _map: Map

  constructor() {
    this._map = new Map()
  }

  public tick = () => {}

  public getAllDrawData = (): DrawData[] => {
    return this._map.getAllDrawData()
  }
}

class Map {
  public getAllDrawData = (): DrawData[] => {
    return []
  }
}
