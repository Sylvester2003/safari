import type Sprite from '@/sprites/sprite'
import type Tile from '@/tiles/tile'
// import type Herbivore from '@/sprites/herbivore'
import Animal from '@/sprites/animal'
import Herbivore from '@/sprites/herbivore'


/**
 * Abstract class representing a carnivore in the game.
 *
 * It extends the `Animal` class.
 */
export default abstract class Carnivore extends Animal {
  protected _herbis:  Map<number, [number, number]> = new Map()
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

  protected updateFoodMemory = (sprites: Sprite[]): void => {
    const nearEdiblePositions = new Set<string>()

    sprites.forEach((sprite) => {
      if (sprite instanceof Herbivore) {
        const key = sprite.position.toString()
        this._herbis.set(sprite.group, sprite.position)
        nearEdiblePositions.add(key)
      }
    })

    // Törlés a _seenFoodPositions-ből, ha már nem szerepel ehetőként
    for (const pos of this._seenFoodPositions) {
      const key = pos.toString()
      const isNear = sprites.some(sprite => sprite.position[0] === pos[0] && sprite.position[1] === pos[1])
      if (!nearEdiblePositions.has(key) && isNear) {
        this._seenFoodPositions.delete(pos)
      }
    }


  }

  protected fillFoodLevel = (_visibleTiles: Tile[]): void => {}
}
