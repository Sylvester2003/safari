import Sprite from '@/sprites/sprite'

export default abstract class Shooter extends Sprite implements Shootable {
  protected _shootingAt: Shootable | null
  protected _bulletTimer: number

  constructor(x: number, y: number) {
    super(x, y)
    this._shootingAt = null
    this._bulletTimer = 1
  }

  public shootAt = (sprite: Shootable) => {
    this._shootingAt = sprite
  }

  public abstract getShotBy: (shooter: Shooter) => boolean
}
