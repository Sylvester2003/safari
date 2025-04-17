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
  private _restingTime: number
  /*
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
    this._restingTime = 0
  }

  /**
   * Gets the current age of the animal.
   *
   * @returns The current age
   */
  public get age(): number {
    return this._age
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

  public act(dt: number, visibleSprites: Sprite[], visibleTiles: Tile[]): void {
    this._age += dt

    if (this._restingTime > 0) {
      this._restingTime -= dt
      if (this._restingTime < 0)
        this._restingTime = 0
      return
    }

    if (!this.pathTo || (Math.abs(this.position[0] - this.pathTo[0]) < 0.01
      && Math.abs(this.position[1] - this.pathTo[1]) < 0.01)) {
      if (this.pathTo) {
        this.position[0] = this.pathTo[0]
        this.position[1] = this.pathTo[1]
      }
      this.velocity = [0, 0]
      this._restingTime = 1 + Math.random() * 4

      const randomTileIndex = Math.floor(Math.random() * visibleTiles.length)
      const randomTile = visibleTiles[randomTileIndex]
      this.pathTo = randomTile.position
      return
    }

    const dx = this.pathTo[0] - this.position[0]
    const dy = this.pathTo[1] - this.position[1]
    const dist = Math.sqrt(dx * dx + dy * dy)
    const speed = this.speed

    if (dist > 0) {
      this.velocity = [dx / dist * speed, dy / dist * speed]
      const moveX = this.velocity[0] * dt / 10
      const moveY = this.velocity[1] * dt / 10
      if (Math.abs(moveX) >= Math.abs(dx) && Math.abs(moveY) >= Math.abs(dy)) {
        this.position[0] = this.pathTo[0]
        this.position[1] = this.pathTo[1]
      }
      else {
        this.position[0] += moveX
        this.position[1] += moveY
      }
    }

    this.getDrawData().position = this.position
  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false
  }

  public abstract isEnganged(): boolean

  /* public follow = (poacher: Poacher): void => {
    this._following = poacher
  } */
}
