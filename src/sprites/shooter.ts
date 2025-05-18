import Sprite from '@/sprites/sprite'

/**
 * Abstract class representing a shooter in the game.
 *
 * It extends the `Sprite` class and implements the `Shootable` interface.
 */
export default abstract class Shooter extends Sprite implements Shootable {
  protected _shootingAt: Shootable | null
  protected _bulletTimer: number

  /**
   * Creates a new instance of `Shooter`.
   * @param x - The x grid position of the shooter.
   * @param y - The y grid position of the shooter.
   */
  constructor(x: number, y: number) {
    super(x, y)
    this._shootingAt = null
    this._bulletTimer = 1
  }

  /**
   * Sets the shooting target for the shooter.
   * @param sprite - The target sprite to shoot at.
   */
  public shootAt = (sprite: Shootable) => {
    this._shootingAt = sprite
  }

  public abstract getShotBy: (shooter: Shooter) => boolean
}
