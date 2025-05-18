import Shooter from './shooter'

export default class Ranger extends Shooter {
  protected static id = 'safari:ranger'
  private _chasing?: Shootable
  declare protected _jsonData: RangerJson

  constructor(x: number, y: number) {
    super(x, y)
  }

  public setChasing = (chasing: Shootable) => {
    this._chasing = chasing
  }

  public get buyPrice(): number {
    return this._jsonData.buyPrice
  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false
  }

  public act = (_dt: number) => {

  }
}
