// import type Poacher from '@/sprites/poacher'
import type Shooter from '@/sprites/shooter'
import type Tile from '@/tiles/tile'
import Sprite from '@/sprites/sprite'
import { EntityStatus } from '@/types/entityStatus'

/**
 * Abstract class representing an animal in the game.
 *
 * It extends the `Sprite` class and implements the `Shootable`, `Mortal`, `Buyable` and `Sellable` interfaces.
 */
export default abstract class Animal extends Sprite implements Shootable, Mortal, Buyable, Sellable {
  private _age: number
  private _isCaptured: boolean
  private _foodLevel: number
  private _hydrationLevel: number
  private _group: number
  private _status: EntityStatus
  private _hasChip: boolean
  private _buyPrice: number
  private _sellPrice: number
  /* private _restingTime: number
  private _seenFoodPositions: [x: number, y: number][]
  private _seenWaterPositions: [x: number, y: number][]
  private _following?: Poacher
  */

  /**
   * Creates an instance of Animal.
   *
   * @param x - The x grid position of the animal.
   * @param y - The y grid position of the animal.
   * @param group - The group ID of the animal.
   */
  constructor(x: number, y: number, group: number) {
    super(x, y)
    this._age = 0
    this._isCaptured = false
    this._foodLevel = 100
    this._hydrationLevel = 100
    this._group = group
    this._status = EntityStatus.Alive
    this._hasChip = false
    this._buyPrice = 0
    this._sellPrice = 0
  }

  /**
   * Gets the group of the animal.
   *
   * @returns The group number.
   */
  public get group(): number {
    return this._group
  }

  /**
   * Gets the status of the animal.
   *
   * @returns The animal's `EntityStatus`.
   */
  public get status(): EntityStatus {
    return this._status
  }

  /**
   * Indicates whether the animal has a tracking chip.
   *
   * @return `true` if chipped, `false` otherwise.
   */
  public get hasChip(): boolean {
    return this._hasChip
  }

  /**
   * Sets the animal's chip status.
   *
   * @param value - `true` if chipped, `false` otherwise.
   */
  public set hasChip(value: boolean) {
    this._hasChip = value
  }

  /**
   * Gets the animal's buy price.
   *
   * @returns The price to buy the animal.
   */
  public get buyPrice(): number {
    return this._buyPrice
  }

  /**
   * Gets the animal's sell price.
   *
   * @returns The price to sell the animal.
   */
  public get sellPrice(): number {
    return this._sellPrice
  }

  /**
   * Indicates whether the animal is hungry.
   *
   * @return `true` if hungry, `false` otherwise.
   */
  public get isHungry(): boolean {
    return this._foodLevel < 50
  }

  /**
   * Indicates whether the animal is thirsty.
   *
   * @return `true` if thirsty, `false` otherwise.
   */
  public get isThirsty(): boolean {
    return this._hydrationLevel < 50
  }

  /**
   * Indicates whether the animal is an adult.
   *
   * @return `true` if adult, `false` otherwise.
   */
  public get isAdult(): boolean {
    return this._age >= 18
  }

  /**
   * Indicates whether the animal is currently being captured.
   *
   * @return `true` if being captured, `false` otherwise.
   */
  public get isBeingCaptured(): boolean {
    return this._isCaptured
  }

  public act = (_dt: number, _visibleSprites: Sprite[], _visibleTiles: Tile[]): void => {

  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false
  }

  /**
   * Determines whether the animal is currently engaged in any interaction.
   *
   * @returns `true` if the animal is engaged, `false` otherwise.
   */
  public abstract isEnganged(): boolean

  /* public follow = (poacher: Poacher): void => {
    this._following = poacher
  } */
}
