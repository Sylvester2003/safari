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
  }

  public loadMap = async (): Promise<void> => {
    for (let i = 0; i < this._width; i++) {
      this._tiles[i] = []
      for (let j = 0; j < this._height; j++) {
        this._tiles[i][j] = new Sand(i, j)
        await this._tiles[i][j].loadDrawData()
      }
    }
  }

  get width(): number {
    return this._width
  }

  get height(): number {
    return this._height
  }

  public tick = () => {}

  public getAllDrawData = (_isNight: boolean): DrawData[] => {
    const drawDatas: DrawData[] = []

    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        drawDatas.push(this._tiles[i][j].getDrawData())
      }
    }

    return drawDatas
  }

  public placeTile = (tile: Tile): void => {
    const [x, y] = tile.position
    this._tiles[x][y] = tile
  }
}
