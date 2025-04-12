import DrawData from './drawData'

/**
 * Represents the draw data for a sprite in the game.
 * It extends the `DrawData` class.
 */
export default class SpriteDrawData extends DrawData {
  private _isChipped?: boolean = false
  private _isSelected?: boolean = false
  private _shootingAt?: [number, number]

  /**
   * Creates an instance of `SpriteDrawData`.
   * @param id - The ID of the sprite, which is used to load the correct JSON file.
   * @param x - The x grid position of the sprite.
   * @param y - The y grid position of the sprite.
   * @param options - Optional parameters for additional properties.
   * @param options.isChipped - Indicates if the sprite has a tracking chip.
   * @param options.isSelected - Indicates if the sprite is currently selected.
   * @param options.shootingAt - The target position the sprite is shooting at.
   */
  constructor(id: string, x: number, y: number, options: { isChipped?: boolean, isSelected?: boolean, shootingAt?: [x: number, y: number] } = {}) {
    super(id, x, y)
    this._isChipped = options.isChipped
    this._isSelected = options.isSelected
    this._shootingAt = options.shootingAt
  }

  /**
   * Indicates whether the sprite is chipped.
   *
   * @returns `true` if chipped, `false` if not, or `undefined` if unset.
   */
  public get isChipped(): boolean | undefined {
    return this._isChipped
  }

  /**
   * Indicates whether the sprite is selected.
   *
   * @returns `true` if selected, `false` if not, or `undefined` if unset.
   */
  public get isSelected(): boolean | undefined {
    return this._isSelected
  }

  /**
   * Gets the current shooting target position of the sprite, if any.
   *
   * @returns A tuple `[x, y]` representing the target, or `undefined`.
   */
  public get shootingAt(): [number, number] | undefined {
    return this._shootingAt
  }

  public getScreenPosition = (unit: number): [x: number, y: number] => {
    const [x, y] = this.position
    const c = unit * (this.scale - 1) / 2
    return [unit * x - c, unit * y - c]
  }
}
