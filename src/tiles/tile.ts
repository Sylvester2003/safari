import TileDrawData from '@/tileDrawData.js'

export default abstract class Tile {
  private _position: [number, number]
  private _buyPrice: number = 0
  private _drawData: TileDrawData

  constructor(x: number = 0, y: number = 0) {
    this._position = [x, y]
    this._drawData = new TileDrawData(this.toString(), ...this._position)
  }

  public async loadJsonData(): Promise<void> {
    await this._drawData.loadJsonData()
  }

  get position(): [number, number] {
    return this._position
  }

  get buyPrice(): number {
    return this._buyPrice
  }

  public getDrawData = (): TileDrawData => {
    return this._drawData
  }

  public abstract toString(): string
}
