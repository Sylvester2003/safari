import TileDrawData from '@/tileDrawData.js'

export default abstract class Tile {
  private _position: [number, number]
  private _buyPrice: number = 0
  private _drawData: TileDrawData

  constructor(x: number, y: number) {
    this._position = [x, y]
    this._drawData = new TileDrawData(this.toString(), ...this._position)
  }

  public loadDrawData = async (): Promise<TileDrawData> => {
    await this._drawData.loadJsonData()
    return this._drawData
  }

  public get position(): [number, number] {
    return this._position
  }

  public get buyPrice(): number {
    return this._buyPrice
  }

  public getDrawData = (): TileDrawData => {
    return this._drawData
  }

  public abstract toString(): string
}
