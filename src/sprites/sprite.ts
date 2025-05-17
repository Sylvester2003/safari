import type Tile from '@/tiles/tile'
import SpriteDrawData from '@/spriteDrawData'
import { loadJson } from '@/utils/load'
import { updateVisiblesSignal } from '@/utils/signal'

/**
 * Abstract class representing a sprite in the game.
 */
export default abstract class Sprite {
  protected static id: string

  private _position: [number, number]
  private _pathTo?: [number, number]
  private _velocity: [number, number] = [0, 0]
  private _isDead: boolean = false
  private _isOnHill: boolean = false
  private _regNumber: number
  private static uuid: number = 0

  protected _drawData: SpriteDrawData
  protected _jsonData!: SpriteJson
  protected _visibleTiles: Tile[]
  protected _visibleSprites: Sprite[]

  /**
   * Gets the current grid position of the sprite.
   *
   * @returns A tuple representing the `[x, y]` position.
   */
  public get position(): [number, number] {
    return this._position
  }

  /**
   * Sets the position of the sprite.
   *
   * @param value - A tuple `[x, y]` representing the new position.
   */
  public set position(value: [number, number]) {
    this._position = value
  }

  /**
   * Gets the size of the sprite.
   *
   * @returns the size of the sprite
   */
  public get size(): number {
    return this._jsonData.size
  }

  /**
   * Gets the path to which the sprite is moving.
   *
   * @returns A tuple representing the `[x, y]` position of the path, or `undefined` if not set.
   */
  public get pathTo(): [number, number] | undefined {
    return this._pathTo
  }

  /**
   * Sets the path to which the sprite is moving.
   *
   * @param value - A tuple `[x, y]` representing the new path position, or `undefined` if not set.
   */
  public set pathTo(value: [number, number] | undefined) {
    this._pathTo = value
  }

  /**
   * Gets the velocity vector of the sprite.
   *
   * @returns A tuple `[vx, vy]` representing velocity in x and y directions.
   */
  public get velocity(): [number, number] {
    return this._velocity
  }

  /**
   * Sets the velocity vector of the sprite.
   *
   * @param value - A tuple `[vx, vy]` representing velocity in x and y directions.
   */
  public set velocity(value: [number, number]) {
    this._velocity = value
  }

  /**
   * Gets the speed of the sprite
   *
   * @returns the speed of the sprite
   */
  public get speed(): number {
    return this._jsonData.speed
  }

  /**
   * Indicates whether the sprite is marked as dead.
   *
   * @returns `true` if dead, `false` otherwise.
   */
  public get isDead(): boolean {
    return this._isDead
  }

  /**
   * Gets the buy price of the sprite.
   *
   * @returns the price to buy the animal
   */
  public get buyPrice(): number {
    return this._jsonData.buyPrice
  }

  /**
   * Gets the view distance of the sprite.
   *
   * @returns the view distance in number format
   */
  public get viewDistance(): number {
    const baseViewDistance = this._jsonData.viewDistance
    return this._isOnHill ? baseViewDistance * 1.5 : baseViewDistance
  }

  /**
   * Gets the `SpriteDrawData` object containing drawing and rendering information.
   *
   * @returns The sprite's draw data.
   */
  public get drawData(): SpriteDrawData {
    this._drawData.position = this.position
    return this._drawData
  }

  /**
   * Gets the sprite's registration number.
   *
   * @return The registration number of the sprite.
   */
  public get regNumber(): number {
    return this._regNumber
  }

  /**
   * Creates an instance of Sprite.
   * @param x - The initial x position on the grid.
   * @param y - The initial y position on the grid.
   */
  constructor(x: number, y: number) {
    this._position = [x, y]
    this._drawData = new SpriteDrawData(this.toString(), ...this._position)
    this._visibleTiles = []
    this._visibleSprites = []
    this._regNumber = Sprite.uuid++
  }

  /**
   * Updates the sprite's visibile tiles and sprites.
   *
   * @param visibleTiles The tiles that are visible to the sprite.
   * @param visibleSprites The sprites that are visible to the sprite.
   */
  public updateVisibles = (visibleTiles: Tile[], visibleSprites: Sprite[]) => {
    this._visibleTiles = visibleTiles
    this._visibleSprites = visibleSprites
  }

  /**
   * Called every game tick to determine the sprite's behavior.
   *
   * @param dt - Delta time since last update.
   */
  public abstract act: (dt: number) => void

  /**
   * Updates the sprite's state based on the tiles it can see.
   * This should be called at the start of the act method in derived classes.
   */
  protected updateState = () => {
    const [x, y] = this.position
    const tileX = Math.floor(x)
    const tileY = Math.floor(y)

    this._isOnHill = this._visibleTiles.some(tile =>
      tile.position[0] === tileX
      && tile.position[1] === tileY
      && tile.toString() === 'safari:hill',
    )
  }

  /**
   * Returns the grid cells occupied by the sprite.
   *
   * @returns An array of `[x, y]` tuples representing occupied grid cells.
   */
  public onCells = (): [number, number][] => {
    return [[0, 0]]
  }

  /**
   * Loads external JSON data into the sprite's draw data.
   *
   * @returns A promise that resolves with the loaded `SpriteDrawData`.
   */
  private loadDrawData = async (): Promise<SpriteDrawData> => {
    await this._drawData.loadJsonData()
    return this._drawData
  }

  /**
   * Loads the JSON data for the sprite.
   *
   * @returns A promise that resolves when the JSON data has been loaded.
   */
  private loadJsonData = async (): Promise<void> => {
    const fileName = this.toString().split(':')[1]
    const jsonData = await loadJson(`data/${fileName}`)
    this._jsonData = jsonData
  }

  public load = async (): Promise<void> => {
    await Promise.all([
      this.loadDrawData(),
      this.loadJsonData(),
    ])
    updateVisiblesSignal.emit(this)
  }

  /**
   * Gets the ID of the sprite.
   *
   * @returns The ID of the sprite.
   */
  public toString = (): string => {
    return (this.constructor as typeof Sprite).id
  }
}
