// import type Carnivore from '@/sprites/carnivore'
import type Tile from '@/tiles/tile'
import type Sprite from './sprite'
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

  public act = (dt: number, visibleSprites: Sprite[], visibleTiles: Tile[]): void => {
    super.act(dt, visibleSprites, visibleTiles)
  }

  /**
   * Determines whether the animal is currently fleeing.
   *
   * @returns `true` if the animal is fleeing, `false` otherwise.
   */
  public isEnganged = (): boolean => {
    return false
  }
}
