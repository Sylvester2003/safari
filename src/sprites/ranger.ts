import Shooter from './shooter'

export default class Ranger extends Shooter {
  private _chasing: Shootable | null
  declare protected _jsonData: RangerJson

  constructor(x: number, y: number) {
    super(x, y)
    this._chasing = null
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
