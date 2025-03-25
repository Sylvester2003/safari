import type DrawData from '@/drawData'

export default class SafariModel {
  private readonly _map: Map

  constructor() {
    this._map = new Map()
  }

  get width(): number {
    return this._map.width
  }

  get height(): number {
    return this._map.height
  }

  public tick = () => {
    this._map.tick()
  }

  public getAllDrawData = (): DrawData[] => {
    return this._map.getAllDrawData()
  }
}

// Temporary Map class before implementing the actual map logic
class Map {
  get width(): number { return 160 }
  get height(): number { return 90 }
  public tick = () => {}
  public getAllDrawData = (): DrawData[] => {
    return []
  }
}
