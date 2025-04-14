// import type Herbivore from '@/sprites/herbivore'
import type Tile from '@/tiles/tile'
import type Sprite from './sprite'
import Animal from '@/sprites/animal'

/**
 * Abstract class representing a carnivore in the game.
 *
 * It extends the `Animal` class.
 */
export default abstract class Carnivore extends Animal {
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

  public act(_dt: number, _visibleSprites: Sprite[], _visibleTiles: Tile[]): void {
    super.act(_dt, _visibleSprites, _visibleTiles)
  }

  /**
   * Determines whether the animal is currently chasing.
   *
   * @returns `true` if the animal is chasing, `false` otherwise.
   */
  public isEnganged = (): boolean => {
    return false
  }
}
