import TileDrawData from '@/tileDrawData.js'

export default abstract class Tile {
  private _position: [number, number]
  private _buyPrice: number = 0

  constructor(x: number, y: number) {
    this._position = [x, y]
  }

  get position(): [number, number] {
    return this._position
  }

  get buyPrice(): number {
    return this._buyPrice
  }

  public getDrawData(): TileDrawData {
    return new TileDrawData(this.toString(), ...this._position)
  }

  public abstract toString(): string
}
