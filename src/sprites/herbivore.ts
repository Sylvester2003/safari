import type Sprite from '@/sprites/sprite'
import type Tile from '@/tiles/tile'
import Animal from '@/sprites/animal'

/**
 * Abstract class representing a herbivore in the game.
 */
export default abstract class Herbivore extends Animal {
  // private _runningFrom?: Carnivore

  /**
   * Creates a new instance of `Herbivore`.
   *
   * @param x - The x grid position of the carnivore.
   * @param y - The y grid position of the carnivore.
   * @param group - The group ID the carnivore belongs to.
   */
  constructor(x: number, y: number, group: number) {
    super(x, y, group)
  }

  /**
   * Determines whether the animal is currently fleeing.
   *
   * @returns `true` if the animal is fleeing, `false` otherwise.
   */
  public isEnganged = (): boolean => {
    return false
  }

  protected updateMemory = (tiles: Tile[], _: Sprite[]): void => {
    this.updateWaterMemory(tiles)
    this.updateFoodMemory(tiles)
  }

  protected updateFoodMemory = (tiles: Tile[]): void => {
    const nearEdiblePositions = new Set<string>()

    tiles.forEach((tile) => {
      const key = tile.position.toString()

      if (tile.isEdible) {
        this._seenFoodPositions.add(tile.position)
        nearEdiblePositions.add(key)
      }
    })

    for (const pos of this._seenFoodPositions) {
      const key = pos.toString()
      const isNear = tiles.some(tile => tile.position[0] === pos[0] && tile.position[1] === pos[1])
      if (!nearEdiblePositions.has(key) && isNear) {
        this._seenFoodPositions.delete(pos)
      }
    }
  }

  protected fillFoodLevel = (visibleTiles: Tile[], _: Sprite[]): void => {
    const nearTiles = this.getNearTiles(visibleTiles)

    nearTiles?.forEach((tile) => {
      if (tile.isEdible) {
        this._foodLevel = 100
        // this._restingTime = 25 + Math.random() * 20
      }
    })
  }
}
