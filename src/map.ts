import type DrawData from '@/drawData'
import type TileDrawData from '@/tileDrawData'
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

  public getAllDrawData(isNight: boolean): DrawData[] {
    const drawData: DrawData[] = []

    this._tiles.forEach((row) => {
      row.forEach((tile) => {
        drawData.push(tile.getDrawData())
      })
    })

    return drawData
  }
}
