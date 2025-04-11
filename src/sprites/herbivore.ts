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

  public act = (_dt: number, _visibleSprites: Sprite[], _visibleTiles: Tile[]): void => {

  }

  public isEnganged = (): boolean => {
    return false
  }

  public toString() {
    return 'safari:herbivore'
  }
}
