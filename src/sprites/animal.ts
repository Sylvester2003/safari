import type Herbivore from '@/sprites/herbivore'
// import type Poacher from '@/sprites/poacher'
import type Shooter from '@/sprites/shooter'
import type Tile from '@/tiles/tile'
import Sprite from '@/sprites/sprite'
import { animalDeadSignal } from '@/utils/signal'

/**
 * Abstract class representing an animal in the game.
 *
 * It extends the `Sprite` class and implements the `Shootable`, `Mortal`, `Buyable` and `Sellable` interfaces.
 */
export default abstract class Animal extends Sprite implements Shootable, Buyable, Sellable {
  private _age: number
  private _isCaptured: boolean
  private _group: number
  private _hasChip: boolean
  private _restingTime: number
  private _isWandering: boolean
  private _targetNeed: 'food' | 'drink' | 'none'
  protected _foodLevel: number
  protected _hydrationLevel: number
  protected _seenFoodPositions: Set<[number, number]>
  protected _seenWaterPositions: Set<[number, number]>
  declare protected _jsonData: AnimalJson
  // private _following?: Poacher

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
    this._hasChip = false
    this._restingTime = 0
    this._isWandering = false
    this._seenFoodPositions = new Set()
    this._seenWaterPositions = new Set()
    this._targetNeed = 'none'
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
   * Sets the group of the animal.
   *
   * @param value - The new group number.
   */
  public set group(value: number) {
    this._group = value
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
    return this._foodLevel < 85
  }

  /**
   * Indicates whether the animal is thirsty.
   *
   * @return `true` if thirsty, `false` otherwise.
   */
  public get isThirsty(): boolean {
    return this._hydrationLevel < 80
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

  /**
   * Defines animals behaviour in each frame.
   *
   * @param dt - The delta time since the last frame.
   * @param visibleSprites - The sprites currently visible to the animal.
   * @param visibleTiles - The tiles currently visible to the animal.
   */
  public act = (dt: number, visibleSprites: Sprite[], visibleTiles: Tile[]) => {
    this._age += dt / 60
    this.updateHungerAndThirst(dt)

    // console.log(this._age)

    if (this._foodLevel <= 0 || this._hydrationLevel <= 0) {
      animalDeadSignal.emit(this)
      return
    }

    this.updateMemory(visibleTiles)

    if (this.isHungry || this.isThirsty)
      this._restingTime = 0

    if (!this.isResting(dt)) {
      this.decideAction(dt, visibleSprites, visibleTiles)
    }

    console.log(this.pathTo, this._restingTime, 'age: ', this._age, 'food:', this._foodLevel, 'hyd:', this._hydrationLevel)
    console.log('hungry:', this.isHungry, 'thirsty:', this.isThirsty)
    console.log('act:', this._targetNeed, 'isWandering:', this._isWandering)
  }

  /**
   * Updates the animal's memory of food and water positions.
   * @param tiles - The tiles currently visible to the animal.
   */
  private updateMemory = (tiles: Tile[]): void => {
    this.updateWaterMemory(tiles)
    this.updateFoodMemory(tiles)
  }

  /**
   * Updates the animal's memory of water positions.
   * @param tiles - The tiles currently visible to the animal.
   */
  private updateWaterMemory = (tiles: Tile[]): void => {
    const nearWaterPositions = new Set<string>()

    tiles.forEach((tile) => {
      const key = tile.position.toString()

      if (tile.isWater) {
        this._seenWaterPositions.add(tile.position)
        nearWaterPositions.add(key)
      }
    })

    for (const pos of this._seenWaterPositions) {
      const key = pos.toString()
      const isNear = tiles.some(tile => tile.position[0] === pos[0] && tile.position[1] === pos[1])
      if (!nearWaterPositions.has(key) && isNear) {
        this._seenWaterPositions.delete(pos)
      }
    }
  }

  /**
   * Decides the animal's action based on its needs and surroundings.
   * @param dt - The delta time since the last frame.
   * @param visibleSprites - The sprites currently visible to the animal.
   * @param visibleTiles - The tiles currently visible to the animal.
   */
  private decideAction = (dt: number, visibleSprites: Sprite[], visibleTiles: Tile[]) => {
    const bounds = this.computeBounds(visibleTiles)
    const target = this.chooseNeedTarget()

    if (this.isHungry || this.isThirsty) {
      if (target) {
        this.pathTo = target
        this._isWandering = false
        // console.log('go to target food')
      }
      else if (!this._isWandering) {
        this.pathTo = this.chooseRandomTarget(visibleSprites, visibleTiles, bounds)
        this._isWandering = true
        this._targetNeed = 'none'
        // console.log('wander start')
      }
      else {
        this._targetNeed = 'none'
        // console.log('wandering')
      }
    }
    else if (!this.pathTo) {
      this.pathTo = this.chooseRandomTarget(visibleSprites, visibleTiles, bounds)
      // console.log('choosed a random tile')
    }
    else {
      // console.log('go somewhere')
    }

    if (this.pathTo && this.isAtDestination()) {
      this.handleArrival(visibleTiles)
    }
    else {
      // console.log('move to path')
      this.move(dt, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
    }
  }

  /**
   * Determines whether the animal has reached its destination.
   * @returns `true` if at destination, `false` otherwise.
   */
  private isAtDestination = (): boolean | undefined => {
    return this.pathTo
      && Math.abs(this.position[0] - this.pathTo[0]) < 0.01
      && Math.abs(this.position[1] - this.pathTo[1]) < 0.01
  }

  /**
   * Handles the animal's arrival at its destination.
   * @param visibleTiles - The tiles currently visible to the animal.
   */
  private handleArrival = (visibleTiles: Tile[]) => {
    if (!this.pathTo)
      return

    this.position[0] = this.pathTo[0]
    this.position[1] = this.pathTo[1]
    this.velocity = [0, 0]
    this.pathTo = undefined
    this._isWandering = false
    this._targetNeed = 'none'

    // console.log('arrived to path')

    this._restingTime = 5 + Math.random() * 4

    const currentTile = this.getTileByPosition(visibleTiles, this.position[0], this.position[1])

    if (currentTile?.isWater) {
      this._hydrationLevel = 100
    }

    this.fillFoodLevel(visibleTiles)
  }

  /**
   * Gets the tile at a specific position from the visible tiles.
   * @param visibleTiles - The tiles currently visible to the animal.
   * @param x - The x coordinate of the tile.
   * @param y - The y coordinate of the tile.
   * @returns The tile at the specified position, or `undefined` if not found.
   */
  protected getTileByPosition = (visibleTiles: Tile[], x: number, y: number): Tile | undefined => {
    return visibleTiles.find(t => t.position[0] === x && t.position[1] === y)
  }

  /**
   * Chooses the target need for the animal based on its hunger and thirst levels.
   * @returns The position of the target need, or `undefined` if none found.
   */
  private chooseNeedTarget = () => {
    let needPosition

    if (this.isThirsty && this._targetNeed !== 'food') {
      this._targetNeed = 'drink'
      // console.log('drink checked')
      needPosition = this.findClosest(this._seenWaterPositions)
    }
    if ((this.isHungry && this._targetNeed !== 'drink') || (this.isHungry && !needPosition)) {
      this._targetNeed = 'food'
      // console.log('eat checked')
      needPosition = this.findClosest(this._seenFoodPositions)
    }
    // console.log('nothing checked')
    return needPosition
  }

  /**
   * Chooses a random target position for the animal to wander to.
   * @param visibleSprites - The sprites currently visible to the animal.
   * @param visibleTiles - The tiles currently visible to the animal.
   * @param bounds - The bounds of the area to wander in.
   * @param bounds.minX - The minimum x coordinate of the area.
   * @param bounds.minY - The minimum y coordinate of the area.
   * @param bounds.maxX - The maximum x coordinate of the area.
   * @param bounds.maxY - The maximum y coordinate of the area.
   * @returns The position of the random target, or `undefined` if none found.
   */
  private chooseRandomTarget = (visibleSprites: Sprite[], visibleTiles: Tile[], bounds: { minX: number, minY: number, maxX: number, maxY: number }): [number, number] | undefined => {
    let pathTo: [number, number] | undefined

    const groupmates = visibleSprites.filter(
      sprite => sprite instanceof Animal && sprite.group === this.group,
    )

    if (groupmates.length === 0) {
      const randomTileIndex = Math.floor(Math.random() * visibleTiles.length)
      const randomTile = visibleTiles[randomTileIndex]
      pathTo = [
        Math.max(bounds.minX, Math.min(bounds.maxX, randomTile.position[0])),
        Math.max(bounds.minY, Math.min(bounds.maxY, randomTile.position[1])),
      ]
    }
    else {
      const sum = groupmates.reduce(
        (acc, mate) => {
          acc[0] += mate.position[0]
          acc[1] += mate.position[1]
          return acc
        },
        [0, 0],
      )
      const avg: [number, number] = [sum[0] / groupmates.length, sum[1] / groupmates.length]

      const radius = 1 + Math.random() * 2.5
      const angle = Math.random() * 2 * Math.PI
      const offset: [number, number] = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
      ]
      pathTo = [
        Math.max(bounds.minX, Math.min(bounds.maxX, avg[0] + offset[0])),
        Math.max(bounds.minY, Math.min(bounds.maxY, avg[1] + offset[1])),
      ]
    }

    return pathTo
  }

  /**
   * Updates the animal's hunger and thirst levels based on its age and random factors.
   * @param dt - The delta time since the last frame.
   */
  private updateHungerAndThirst = (dt: number) => {
    const normalizedAge = Math.min(this._age / 30, 1)

    const hydrationMinDuration = 30
    const hydrationMaxDuration = 180

    const hydrationDuration = this.interpolateRange(
      hydrationMaxDuration,
      hydrationMinDuration,
      normalizedAge,
    )

    const hydrationRandomFactor = 0.85 + Math.random() * 0.3
    const hydrationFinalDuration = hydrationDuration * hydrationRandomFactor

    const hydrationDecayAmount = 20
    const hydrationRate = hydrationDecayAmount / hydrationFinalDuration

    this._hydrationLevel = Math.max(0, this._hydrationLevel - hydrationRate * dt)

    const foodMinDuration = 60
    const foodMaxDuration = 200

    const foodDuration = this.interpolateRange(
      foodMaxDuration,
      foodMinDuration,
      normalizedAge * 0.7,
    )

    const foodRandomFactor = 0.9 + Math.random() * 0.2
    const foodFinalDuration = foodDuration * foodRandomFactor

    const foodDecayAmount = 25
    const foodRate = foodDecayAmount / foodFinalDuration

    this._foodLevel = Math.max(0, this._foodLevel - foodRate * dt)
  }

  private interpolateRange = (from: number, to: number, t: number): number => {
    return from + (to - from) * t
  }

  /**
   * Finds the closest position from a set of positions to the animal's current position.
   * @param positions - The set of positions to search.
   * @returns The closest position, or `undefined` if none found.
   */
  private findClosest = (positions: Set<[number, number]>): [number, number] | undefined => {
    let best
    let bestDist = Infinity
    positions.forEach((pos) => {
      const dx = pos[0] - this.position[0]
      const dy = pos[1] - this.position[1]
      const d = dx * dx + dy * dy
      if (d < bestDist) {
        bestDist = d
        best = pos
      }
    })
    return best
  }

  /**
   * Computes the bounds of a set of tiles.
   * @param tiles - The tiles to compute bounds for.
   * @returns The bounds of the tiles, including min and max x and y coordinates.
   */
  private computeBounds = (tiles: Tile[]) => {
    const xs = tiles.map(t => t.position[0])
    const ys = tiles.map(t => t.position[1])
    return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) }
  }

  /**
   * Checks if the animal is currently resting.
   * @param dt - The delta time since the last frame.
   * @returns `true` if resting, `false` otherwise.
   */
  private isResting = (dt: number): boolean => {
    if (this._restingTime > 0) {
      this._restingTime = Math.max(0, this._restingTime - dt)
      return true
    }
    return false
  }

  /**
   * Moves the animal towards its target position.
   * @param dt - The delta time since the last frame.
   * @param minX - The minimum x coordinate of the area.
   * @param minY - The minimum y coordinate of the area.
   * @param maxX - The maximum x coordinate of the area.
   * @param maxY - The maximum y coordinate of the area.
   */
  private move = (dt: number, minX: number, minY: number, maxX: number, maxY: number): void => {
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
        const nextX = this.position[0] + moveX
        const nextY = this.position[1] + moveY
        this.position[0] = Math.max(minX, Math.min(maxX, nextX))
        this.position[1] = Math.max(minY, Math.min(maxY, nextY))
      }
    }
  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false
  }

  /**
   * Updates the animal's memory of food positions.
   * @param food - The food positions to update.
   */
  protected abstract updateFoodMemory(food: Tile[] | Herbivore[]): void

  /**
   * Fills the animal's food level based on its surroundings.
   * @param visibleTiles - The tiles currently visible to the animal.
   */
  protected abstract fillFoodLevel(visibleTiles: Tile[]): void

  public abstract isEnganged(): boolean

  /* public follow = (poacher: Poacher) => {
    this._following = poacher
  } */
}
