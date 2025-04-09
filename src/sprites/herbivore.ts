// import type Carnivore from '@/sprites/carnivore'
import type Tile from '@/tiles/tile'
import type Sprite from './sprite'
import Animal from '@/sprites/animal'

export default class Herbivore extends Animal {
  // private _runningFrom?: Carnivore

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
