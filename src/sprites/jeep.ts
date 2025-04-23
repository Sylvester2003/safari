import type Tile from '@/tiles/tile'
import type Visitor from '@/visitor'
import Sprite from '@/sprites/sprite'

export default class Jeep extends Sprite implements Buyable {
  protected static id = 'safari:jeep'

  // @ts-expect-error temporary
  private _passengers: Visitor[]

  declare protected _jsonData: JeepJson

  public get buyPrice(): number {
    return this._jsonData.buyPrice
  }

  constructor() {
    super(0, 0)
    this._passengers = []
  }

  public act = (_dt: number, _visibleSprites: Sprite[], _visibleTiles: Tile[]) => {

  }
}
