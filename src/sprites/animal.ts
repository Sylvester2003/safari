import type Poacher from '@/sprites/poacher'
import type Shooter from '@/sprites/shooter'
import type Tile from '@/tiles/tile'
import Sprite from '@/sprites/sprite'

export default abstract class Animal extends Sprite implements Shootable, Mortal {
  private _age: number
  private _isCaptured: boolean
  private _foodLevel: number
  private _hydrationLevel: number
  private _restingTime: number
  private _seenFoodPositions: [x: number, y: number][]
  private _seenWaterPositions: [x: number, y: number][]
  private _group: number
  private _status: EntityStatus
  private _hasChip: boolean
  private _buyPrice: number
  private _sellPrice: number
  private _following?: Poacher

  constructor(x: number, y: number, group: number) {
    super(x, y)
    this._age = 0
    this._isCaptured = false
    this._foodLevel = 100
    this._hydrationLevel = 100
    this._restingTime = 0
    this._seenFoodPositions = []
    this._seenWaterPositions = []
    this._group = group
    this._status = EntityStatus.Alive
    this._hasChip = false
    this._buyPrice = 0
    this._sellPrice = 0
  }

  public get group(): number {
    return this._group
  }

  public get status(): EntityStatus {
    return this._status
  }

  public get hasChip(): boolean {
    return this._hasChip
  }

  public get buyPrice(): number {
    return this._buyPrice
  }

  public get sellPrice(): number {
    return this._sellPrice
  }

  public isHungry(): boolean {
    return this._foodLevel < 50
  }

  public isThirsty(): boolean {
    return this._hydrationLevel < 50
  }

  public isAdult(): boolean {
    return this._age >= 18
  }

  public isBeingCaptured(): boolean {
    return this._isCaptured
  }

  public act(_dt: number, _visibleSprites: Sprite[], _visibleTiles: Tile[]): void {

  }

  public setChip(): void {
    this._hasChip = true
  }

  public getShotBy(_shooter: Shooter): boolean {
    return false
  }

  public follow(poacher: Poacher): void {
    this._following = poacher
  }

  public abstract isEnganged(): boolean
}
