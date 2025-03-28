import type DrawData from '@/drawData'
import Map from '@/map'
import { createTile } from './utils/registry'

export default class SafariModel {
  private readonly _map: Map

  constructor() {
    this._map = new Map(48, 27)
  }

  public loadMap = async (): Promise<void> => {
    await this._map.loadMap()
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
    return this._map.getAllDrawData(false) // TODO: isNight
  }

  public buyTile = async (tileId: string, x: number, y: number) => {
    const tile = createTile(tileId, x, y)
    if (tile) {
      await tile.loadDrawData()
      this._map.placeTile(tile)
    }
  }
}
