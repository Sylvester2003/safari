// import type Poacher from '@/sprites/poacher'
import type Shooter from '@/sprites/shooter'
import type Tile from '@/tiles/tile'
import Sprite from '@/sprites/sprite'
import { EntityStatus } from '@/types/entityStatus'
import { animalDeadSignal } from '@/utils/signal'

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
  private _restingTime: number
  private _seenFoodPositions: Set<[x: number, y: number]>
  private _seenWaterPositions: Set<[x: number, y: number]>
  private _currentTargetType: string | null = null
  /*
  private _seenFoodPositions: [x: number, y: number][]
  private _seenWaterPositions: [x: number, y: number][]
  private _following?: Poacher
  */

  declare protected _jsonData: AnimalJson

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
    this._restingTime = 0
    this._seenFoodPositions = new Set()
    this._seenWaterPositions = new Set()
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
    return this._jsonData.buyPrice
  }

  /**
   * Gets the animal's sell price.
   *
   * @returns The price to sell the animal.
   */
  public get sellPrice(): number {
    return this._jsonData.buyPrice * 0.5
  }

  /**
   * Indicates whether the animal is hungry.
   *
   * @return `true` if hungry, `false` otherwise.
   */
  public get isHungry(): boolean {
    return this._foodLevel < 80
  }

  /**
   * Indicates whether the animal is thirsty.
   *
   * @return `true` if thirsty, `false` otherwise.
   */
  public get isThirsty(): boolean {
    return this._hydrationLevel < 98
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

  public act = (dt: number, _visibleSprites: Sprite[], visibleTiles: Tile[]) => {
    this._age += dt / 60
    this._foodLevel -= (this._age * 0.6 + Math.random() * 0.4) * dt / 5
    this._hydrationLevel -= (this._age * 0.6 + Math.random() * 0.4) * dt / 3

    if (this._foodLevel < 0) {
      this._foodLevel = 0
      this._status = EntityStatus.Dead
      animalDeadSignal.emit(this)
    }
    if (this._hydrationLevel < 0) {
      this._hydrationLevel = 0
      this._status = EntityStatus.Dead
      animalDeadSignal.emit(this)
    }

    visibleTiles.forEach((tile) => {
      if (tile.isEdible) {
        this._seenFoodPositions.add(tile.position)
      }
      else if (tile.isWater) {
        this._seenWaterPositions.add(tile.position)
      }
    })

    // console.log('Food positions:', this._seenFoodPositions)
    // console.log('Water positions:', this._seenWaterPositions)

    // Heverészés
    if (this._restingTime > 0) {
      if (this.isThirsty || this.isHungry) {
        this._restingTime = 0
        this.pathTo = undefined
        this._currentTargetType = null
      }
      else {
        this._restingTime -= dt
        if (this._restingTime < 0)
          this._restingTime = 0
        return
      }
    }

    // console.log(!this.pathTo)
    console.log('hyd', this._hydrationLevel, 'food', this._foodLevel)

    // Elérte a célpontját
    if (this.pathTo && (Math.abs(this.position[0] - this.pathTo[0]) < 0.01
      && Math.abs(this.position[1] - this.pathTo[1]) < 0.01)) {
      if (this.pathTo) {
        console.log('Reached target:', this.pathTo)
        this.position[0] = this.pathTo[0]
        this.position[1] = this.pathTo[1]

        // Ha evett vagy ivott, töltse vissza a szintet
        if (this._currentTargetType === 'water') {
          this._hydrationLevel = 100
        }
        else if (this._currentTargetType === 'food') {
          this._foodLevel = 100
        }
      }

      console.log('reset')

      this.velocity = [0, 0]
      this._restingTime = 1 + Math.random() * 5
      this.pathTo = undefined
      this._currentTargetType = null
      return
    }

    // console.log("dönt")

    // Döntés: prioritás szerint választ célt
    if (this.isThirsty && this._currentTargetType !== 'water' && this._currentTargetType !== 'water_random') {
      const waterPositions = Array.from(this._seenWaterPositions)
      console.log('Szomjas')
      if (waterPositions.length > 0) {
        const randomWater = waterPositions[Math.floor(Math.random() * waterPositions.length)]
        this.pathTo = randomWater
        this._currentTargetType = 'water'
      }
      else {
        const fallbackTile = visibleTiles[Math.floor(Math.random() * visibleTiles.length)]
        this.pathTo = fallbackTile.position
        this._currentTargetType = 'water_random'
      }
    }

    if (this._currentTargetType === 'water_random') {
      const waterPositions = Array.from(this._seenWaterPositions)
      if (waterPositions.length > 0) {
        const randomWater = waterPositions[Math.floor(Math.random() * waterPositions.length)]
        this.pathTo = randomWater
        this._currentTargetType = 'water'
      }
    }

    if (this.isHungry && this._currentTargetType !== 'food' && this._currentTargetType !== 'water' && this._currentTargetType !== 'food_random' && this._currentTargetType !== 'water_random') {
      console.log('Éhes')
      const foodPositions = Array.from(this._seenFoodPositions)
      if (foodPositions.length > 0) {
        const randomFood = foodPositions[Math.floor(Math.random() * foodPositions.length)]
        this.pathTo = randomFood
        this._currentTargetType = 'food'
      }
      else {
        const fallbackTile = visibleTiles[Math.floor(Math.random() * visibleTiles.length)]
        this.pathTo = fallbackTile.position
        this._currentTargetType = 'food_random'
      }
    }

    if (this._currentTargetType === 'food_random') {
      const foodPositions = Array.from(this._seenFoodPositions)
      if (foodPositions.length > 0) {
        const randomFood = foodPositions[Math.floor(Math.random() * foodPositions.length)]
        this.pathTo = randomFood
        this._currentTargetType = 'food'
      }
    }

    // Ha nincs célpont (már elérte az előzőt), válasszon véletlenszerűt
    if (!this.pathTo) {
      const randomTile = visibleTiles[Math.floor(Math.random() * visibleTiles.length)]
      this.pathTo = randomTile.position
      console.log('Random target:', this.pathTo)
      this._currentTargetType = 'random'
    }

    this.moveToPath(dt)
  }

  private setNewPathTo(tiles: Tile[] | [number, number][]) {
    if (this.pathTo) {
      this.position[0] = this.pathTo[0]
      this.position[1] = this.pathTo[1]
    }
    this.velocity = [0, 0]

    const randomTileIndex = Math.floor(Math.random() * tiles.length)
    return tiles[randomTileIndex]
  }

  private moveToPath = (dt: number) => {
    if (!this.pathTo)
      return
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
  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false
  }

  public abstract isEnganged(): boolean

  /* public follow = (poacher: Poacher) => {
    this._following = poacher
  } */
}
