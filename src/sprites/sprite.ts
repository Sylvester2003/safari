import type Tile from '@/tiles/tile'
import SpriteDrawData from '@/spriteDrawData'
import { loadJson } from '@/utils/load'

/**
 * Abstract class representing a sprite in the game.
 */
export default abstract class Sprite {
  private _position: [number, number]
  private _pathTo?: [number, number]
  private _velocity: [number, number] = [0, 0]
  private _isDead: boolean = false
  private _drawData: SpriteDrawData
  private _jsonData!: SpriteJson;

  /**
   * Creates an instance of Sprite.
   * @param x - The initial x position on the grid.
   * @param y - The initial y position on the grid.
   */
  constructor(x: number, y: number) {
    this._position = [x, y]
    this._drawData = new SpriteDrawData(this.toString(), ...this._position)
  }

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
    return this._jsonData.viewDistance
  }

  /**
   * Called every game tick to determine the sprite's behavior.
   *
   * @param _dt - Delta time since last update.
   * @param _visibleSprites - Sprites currently visible to the animal.
   * @param _visibleTiles - Tiles currently visible to the animal.
   */
  public abstract act(dt: number, visibleSprites: Sprite[], visibleTiles: Tile[]): void

  /**
   * Returns the `SpriteDrawData` object containing drawing and rendering information.
   *
   * @returns The sprite's draw data.
   */
  public getDrawData = (): SpriteDrawData => {
    return this._drawData
  }

  /**
   * 
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
  public loadDrawData = async (): Promise<SpriteDrawData> => {
    await this._drawData.loadJsonData()
    return this._drawData
  }

  /**
  * Loads the JSON data for the sprite.
  *
  * @returns A promise that resolves when the JSON data has been loaded.
  */
  public loadJsonData = async (): Promise<void> => {
    const fileName = this.toString().split(':')[1]
    const jsonData = await loadJson(`data/${fileName}`)
    this._jsonData = jsonData
  }

  public load = async (): Promise<void> => {
    await this.loadJsonData()
    await this.loadDrawData()
  }

  /**
   * Gets the ID of the sprite.
   *
   * @returns The ID of the sprite.
   */
  public abstract toString(): string
}
