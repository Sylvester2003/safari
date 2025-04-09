// import type Herbivore from '@/sprites/herbivore'
import type Tile from '@/tiles/tile'
import type Sprite from './sprite'
import Animal from '@/sprites/animal'

export default class Carnivore extends Animal {
  // private _chasing?: Herbivore

  constructor(x: number, y: number, group: number) {
    super(x, y, group)
  }

  public act = (_dt: number, _visibleSprites: Sprite[], _visibleTiles: Tile[]): void => {

  }

  public isEnganged = (): boolean => {
    return false
  }

  public toString() {
    return 'safari:carnivore'
  }
}
