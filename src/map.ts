import type DrawData from '@/drawData'
import type Tile from '@/tiles/tile'
import Sand from '@/tiles/sand'

export default class Map {
  private _tiles: Tile[][]
  private _width: number
  private _height: number

  constructor(width: number, height: number) {
    this._width = width
    this._height = height
    this._tiles = []

    for (let i = 0; i < width; i++) {
      this._tiles[i] = []
      for (let j = 0; j < height; j++) {
        this._tiles[i][j] = new Sand(i, j)
      }
    }
  }

  get width(): number {
    return this._width
  }

  get height(): number {
    return this._height
  }

  public getAllDrawData(_: boolean): DrawData[] {
    const drawDatas: DrawData[] = []

    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        drawDatas.push(this._tiles[i][j].getDrawData())
      }
    }

    return drawDatas
  }
}
