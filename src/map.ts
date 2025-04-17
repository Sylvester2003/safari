import type DrawData from '@/drawData'
import type Sprite from '@/sprites/sprite'
import type Tile from '@/tiles/tile'
import Sand from '@/tiles/sand'

/**
 * Represents the map of the safari.
 */
export default class Map {
  private _tiles: Tile[][]
  private _sprites: Sprite[]
  private _width: number
  private _height: number

  /**
   * Creates an instance of the Map.
   *
   * @param width - The width of the map in tiles.
   * @param height - The height of the map in tiles.
   */
  constructor(width: number, height: number) {
    this._width = width
    this._height = height
    this._tiles = []
    this._sprites = []
  }

  /**
   * Loads the map by creating and loading draw data for each tile.
   *
   * @returns A promise that resolves when all tiles have been loaded.
   */
  public loadMap = async (): Promise<void> => {
    for (let i = 0; i < this._width; i++) {
      this._tiles[i] = []
      for (let j = 0; j < this._height; j++) {
        this._tiles[i][j] = new Sand(i, j)
        await this._tiles[i][j].loadDrawData()
      }
    }
  }

  /**
   * Gets the width of the map in tiles.
   *
   * @returns The width of the map.
   */
  public get width(): number {
    return this._width
  }

  /**
   * Gets the height of the map in tiles.
   *
   * @returns The height of the map.
   */
  public get height(): number {
    return this._height
  }

  /**
   * Gets the tiles on the map.
   *
   * @returns The tiles on the map.
   */
  public get tiles() {
    return this._tiles
  }

  public tick = (dt: number) => {
    for (const sprite of this._sprites) {
      const viewdistance = sprite.viewDistance
      const visibleTiles: Tile[] = []
      const visibleSprites: Sprite[] = []
      const [x, y] = sprite.position

      for (let dx = -viewdistance; dx <= viewdistance; dx++) {
        for (let dy = -viewdistance; dy <= viewdistance; dy++) {
          const tileX = Math.floor(x + dx)
          const tileY = Math.floor(y + dy)
          if (tileX >= 0 && tileX < this._width && tileY >= 0 && tileY < this._height) {
            visibleTiles.push(this._tiles[tileX][tileY])
          }
        }
      }

      for (const otherSprite of this._sprites) {
        if (otherSprite !== sprite) {
          const [otherX, otherY] = otherSprite.position
          if (
            otherX >= x - viewdistance
            && otherX <= x + viewdistance
            && otherY >= y - viewdistance
            && otherY <= y + viewdistance
          ) {
            visibleSprites.push(otherSprite)
          }
        }
      }

      sprite.act(dt, visibleSprites, visibleTiles)
    }
  }

  /**
   * Gets the draw data for all tiles on the map.
   *
   * @param _isNight - Indicates whether it is night or not. Currently unused.
   * @returns An array of draw data for all the tiles on the map.
   */
  public getAllDrawData = (_isNight: boolean): DrawData[] => {
    const drawDatas: DrawData[] = []

    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        drawDatas.push(this._tiles[i][j].getDrawData())
      }
    }

    for (const sprite of this._sprites) {
      drawDatas.push(sprite.getDrawData())
    }

    return drawDatas
  }

  /**
   * Places a tile on the map at the correct position.
   *
   * @param tile - The tile to place on the map.
   */
  public placeTile = (tile: Tile): void => {
    const [x, y] = tile.position
    this._tiles[x][y] = tile
  }

  /**
   * Adds a sprite to the map.
   * @param sprite - The sprite to add to the map.
   */
  public addSprite = (sprite: Sprite): void => {
    this._sprites.push(sprite)
  }
}
