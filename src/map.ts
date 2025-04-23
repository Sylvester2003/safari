import type DrawData from '@/drawData'
import type Animal from '@/sprites/animal'
import type Jeep from '@/sprites/jeep'
import type Sprite from '@/sprites/sprite'
import type Tile from '@/tiles/tile'
import type Visitor from '@/visitor'
import Sand from '@/tiles/sand'
import { animalDeadSignal } from '@/utils/signal'

/**
 * Represents the map of the safari.
 */
export default class Map {
  private _tiles: Tile[][]
  private _sprites: Sprite[]
  private _width: number
  private _height: number
  private _groups: number[]
  private _waitingJeeps: Jeep[]
  private _waitingVisitors: Visitor[]

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
   * Gets a list of the group ID-s of sprites on the map.
   *
   * @returns An array of groupID-s.
   */
  public get groups(): number[] {
    return this._groups
  }

  /**
   * Gets the number of jeeps waiting in the backlog.
   *
   * @returns The number of waiting jeeps.
   */
  public get waitingJeepCount(): number {
    return this._waitingJeeps.length
  }

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
    this._groups = []
    this._waitingJeeps = []
    this._waitingVisitors = []

    animalDeadSignal.connect((animal: Animal) => {
      this.removeSprite(animal)
    })
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
        await this._tiles[i][j].load()
      }
    }
  }

  /**
   * Adds a group ID to the list of groups.
   * @param group group ID to add.
   */
  public addGroup = (group: number) => {
    if (!this._groups.includes(group)) {
      this._groups.push(group)
    }
  }

  /**
   * Updates the state of all sprites on the map by one tick.
   *
   * @param dt - The time delta since the last update.
   */
  public tick = (dt: number) => {
    for (const sprite of this._sprites) {
      const visibleTiles = this.getVisibleTiles(sprite)
      const visibleSprites = this.getVisibleSprites(sprite)
      sprite.act(dt, visibleSprites, visibleTiles)
    }
  }

  /**
   * Gets the tiles that are visible to a given sprite.
   *
   * @param sprite - The sprite to check visibility for.
   * @returns An array of visible tiles.
   */
  private getVisibleTiles = (sprite: Sprite): Tile[] => {
    const viewdistance = sprite.viewDistance
    const [x, y] = sprite.position
    const tiles: Tile[] = []

    for (let dx = -viewdistance; dx <= viewdistance; dx++) {
      for (let dy = -viewdistance; dy <= viewdistance; dy++) {
        const tileX = Math.floor(x + dx)
        const tileY = Math.floor(y + dy)
        if (tileX >= 0 && tileX < this._width && tileY >= 0 && tileY < this._height) {
          tiles.push(this._tiles[tileX][tileY])
        }
      }
    }
    return tiles
  }

  /**
   * Gets the sprites that are visible to a given sprite.
   *
   * @param sprite - The sprite to check visibility for.
   * @returns An array of visible sprites.
   */
  public getVisibleSprites = (sprite: Sprite): Sprite[] => {
    const viewdistance = sprite.viewDistance
    const [x, y] = sprite.position
    return this._sprites.filter((otherSprite) => {
      if (otherSprite === sprite)
        return false
      const [otherX, otherY] = otherSprite.position
      return (
        otherX >= x - viewdistance
        && otherX <= x + viewdistance
        && otherY >= y - viewdistance
        && otherY <= y + viewdistance
      )
    })
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
        drawDatas.push(this._tiles[i][j].drawData)
      }
    }

    for (const sprite of this._sprites) {
      drawDatas.push(sprite.drawData)
    }

    return drawDatas
  }

  /**
   * Places a tile on the map at the correct position.
   *
   * @param tile - The tile to place on the map.
   */
  public placeTile = (tile: Tile) => {
    const [x, y] = tile.position
    this._tiles[x][y] = tile
  }

  /**
   * Adds a sprite to the map.
   * @param sprite - The sprite to add to the map.
   */
  public addSprite = (sprite: Sprite) => {
    this._sprites.push(sprite)
  }

  /**
   * Adds a jeep to the jeep backlog.
   *
   * @param jeep - The jeep to add.
   */
  public addNewJeep = (jeep: Jeep) => {
    this._waitingJeeps.push(jeep)
  }

  /**
   * Removes a sprite from the map.
   *
   * @param sprite - The sprite to remove from the map.
   */
  public removeSprite = (sprite: Sprite) => {
    this._sprites = this._sprites.filter(s => s !== sprite)
  }

  /**
   * Gets the tile at the specified coordinates.
   *
   * @param x The x coordinate of the tile.
   * @param y The y coordinate of the tile.
   * @returns The tile at the specified coordinates.
   */
  public getTileAt = (x: number, y: number) => {
    return this._tiles[x][y]
  }

  /**
   * Gets the sprite at the specified coordinates.
   *
   * @param x The x coordinate of the sprite.
   * @param y The y coordinate of the sprite.
   * @returns The tile at the specified coordinates.
   */
  public getSpritesAt = (x: number, y: number): Sprite[] => {
    return this._sprites.filter((sprite) => {
      const [spriteX, spriteY] = sprite.position
      const spriteSize = sprite.size / 100
      return (
        spriteX >= x - spriteSize
        && spriteX <= x
        && spriteY >= y - spriteSize
        && spriteY <= y
      )
    })
  }

  /**
   * Queues a visitor to the waiting list.
   *
   * @param visitor - The visitor to queue.
   */
  public queueVisitor = (visitor: Visitor) => {
    this._waitingVisitors.push(visitor)
  }
}
