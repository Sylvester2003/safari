import type Sprite from '@/sprites/sprite'
import type Tile from '@/tiles/tile'
import Animal from '@/sprites/animal'
import Herbivore from '@/sprites/herbivore'
import { animalDeadSignal } from '@/utils/signal'

/**
 * Abstract class representing a carnivore in the game.
 *
 * It extends the `Animal` class.
 */
export default abstract class Carnivore extends Animal {
  protected _herbis: Map<number, [number, number]> = new Map()
  // private _chasing?: Herbivore

  /**
   * Creates a new instance of `Carnivore`.
   *
   * @param x - The x grid position of the carnivore.
   * @param y - The y grid position of the carnivore.
   * @param group - The group ID the carnivore belongs to.
   */
  constructor(x: number, y: number, group: number) {
    super(x, y, group)
  }

  /**
   * Determines whether the animal is currently chasing.
   *
   * @returns `true` if the animal is chasing, `false` otherwise.
   */
  public isEnganged = (): boolean => {
    return false
  }

  protected updateMemory = (tiles: Tile[], sprites: Sprite[]): void => {
    this.updateWaterMemory(tiles)
    this.updateFoodMemory(sprites)
  }

  protected updateFoodMemory = (sprites: Sprite[]): void => {
    sprites.forEach((sprite) => {
      if (sprite instanceof Herbivore) {
        this._herbis.set(sprite.regNumber, sprite.position)
      }
    })

    this._herbis.forEach((position, id) => {
      if (this.isInViewDistance(position) && !sprites.some(s => s.position[0] === position[0] && s.position[1] === position[1])) {
        this._herbis.delete(id)
      }
    })

    this._seenFoodPositions = new Set()
    this._herbis.forEach((position) => {
      this._seenFoodPositions.add(position)
    })

    console.log(this._seenFoodPositions)
  }

  protected fillFoodLevel = (_: Tile[], visibleSprites: Sprite[]): void => {
    visibleSprites.forEach((sprite) => {
      if (sprite instanceof Herbivore && Math.abs(sprite.position[0] - this.position[0]) <= 0.5 && Math.abs(sprite.position[1] - this.position[1]) <= 0.5) {
        this._foodLevel = 100
        animalDeadSignal.emit(sprite)
      }
    })
  }

  /**
   * Determines whether the given position is within the view distance of the animal.
   * @param position - The position to check.
   * @returns `true` if the position is within view distance, `false` otherwise.
   */
  private isInViewDistance = (position: [number, number]): boolean => {
    const dx = Math.abs(this.position[0] - position[0])
    const dy = Math.abs(this.position[1] - position[1])
    return dx <= this.viewDistance && dy <= this.viewDistance
  }
}
