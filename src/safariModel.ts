import type DrawData from '@/drawData'
import Map from '@/map'

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
}
