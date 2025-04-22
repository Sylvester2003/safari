import type DrawData from '@/drawData'
import type Goal from '@/goals/goal'
import type Sprite from '@/sprites/sprite'
import Normal from '@/goals/normal'
import Map from '@/map'
import Animal from '@/sprites/animal'
import { createCarnivore, createGoal, createHerbivore, createTile } from './utils/registry'

/**
 * Overarching model class for managing the game state and logic.
 */
export default class SafariModel {
  private readonly _map: Map
  private readonly _goal: Goal
  private _speed: number
  private _balance: number

  /**
   * Gets the goal of the game.
   *
   * @returns The goal object.
   */
  public get goal(): Goal {
    return this._goal
  }

  /**
   * Gets the width of the map.
   *
   * @returns The width of the map.
   */
  public get width(): number {
    return this._map.width
  }

  /**
   * Gets the height of the map.
   *
   * @returns The height of the map.
   */
  public get height(): number {
    return this._map.height
  }

  /**
   * Gets the balance of the player.
   *
   * @returns The current balance of the player.
   */
  public get balance(): number {
    return this._balance
  }

  /**
   * Sets the balance of the player.
   *
   * @param value - The new balance value.
   */
  public set balance(value: number) {
    this._balance = value
  }

  /**
   * Gets the speed of the game
   *
   * @returns The speed value
   */
  public get speed(): number {
    return this._speed
  }

  /**
   * Sets the speed of the game.
   *
   * @param value - The new speed value.
   */
  public set speed(value: number) {
    this._speed = value
  }

  /**
   * Creates an instance of the SafariModel class.
   */
  constructor(difficulty: string = 'safari:difficulty/normal') {
    this._map = new Map(48, 27)
    this._goal = createGoal(difficulty) ?? new Normal()
    this._balance = 10000
    this._speed = 1
  }

  /**
   * Loads the game.
   *
   * @returns A promise that resolves when the game is loaded.
   */
  public loadGame = async (): Promise<void> => {
    await this._goal?.loadData()
    await this._map.loadMap()
  }

  /**
   * Updates the game state by one tick.
   *
   * @param dt - The time delta since the last update.
   */
  public tick = (dt: number) => {
    for (let i = 0; i < this._speed; i++) {
      this._map.tick(dt)
    }
  }

  /**
   * Gets the draw data for all the tiles on the map.
   *
   * @returns An array of draw data for all the tiles on the map.
   */
  public getAllDrawData = (): DrawData[] => {
    return this._map.getAllDrawData(false) // TODO: isNight
  }

  /**
   * Places a tile on the map at the specified coordinates.
   *
   * WIP: Implementation for updating the balance of the player and checking if the tile can be placed.
   *
   * @param tileId - The ID of the tile to be placed.
   * @param x - The x grid position where the tile should be placed.
   * @param y - The y grid position where the tile should be placed.
   * @returns A promise that resolves when the tile is placed.
   */
  public buyTile = async (
    tileId: string,
    x: number,
    y: number,
  ): Promise<void> => {
    const tile = createTile(tileId, x, y)
    if (!tile)
      return

    const oldTile = this._map.getTileAt(x, y)
    await tile.load()
    if (oldTile.toString() !== tile.toString() && this.buy(tile)) {
      this._map.placeTile(tile)
    }
  }

  /**
   * Buys a carnivore on the map at the specified coordinates.
   *
   * @param id - The ID of the carnivore to be bought.
   * @param x - The x grid position where the carnivore should be placed.
   * @param y - The y grid position where the carnivore should be placed.
   * @returns A promise that resolves when the carnivore is placed.
   */
  public buyCarnivore = async (
    id: string,
    x: number,
    y: number,
  ): Promise<void> => {
    const animal = createCarnivore(id, x, y)
    if (!animal)
      return
    await animal.load()

    if (this.buy(animal)) {
      const visibleSprites = this._map.getVisibleSprites(animal)
      const sameIdSprite = visibleSprites.find(s => s instanceof Animal && s.toString() === animal.toString()) as Animal | undefined

      let groupID: number
      if (sameIdSprite) {
        groupID = sameIdSprite.group
      }
      else {
        do {
          groupID = Math.floor(Math.random() * 1000000)
        } while (this._map.groups.includes(groupID))
      }
      animal.group = groupID
      this._map.groups.push(groupID)

      this._map.addSprite(animal)
    }
  }

  /**
   * Buys a herbivore on the map at the specified coordinates.
   * @param id - The ID of the herbivore to be bought.
   * @param x - The x grid position where the herbivore should be placed.
   * @param y - The y grid position where the herbivore should be placed.
   * @returns A promise that resolves when the herbivore is placed.
   */
  public buyHerbivore = async (
    id: string,
    x: number,
    y: number,
  ): Promise<void> => {
    const animal = createHerbivore(id, x, y)
    if (!animal)
      return
    await animal.load()

    if (this.buy(animal)) {
      const visibleSprites = this._map.getVisibleSprites(animal)
      const sameIdSprite = visibleSprites.find(s => s instanceof Animal && s.toString() === animal.toString()) as Animal | undefined

      let groupID: number
      if (sameIdSprite) {
        groupID = sameIdSprite.group
      }
      else {
        do {
          groupID = Math.floor(Math.random() * 1000000)
        } while (this._map.groups.includes(groupID))
      }
      animal.group = groupID
      this._map.groups.push(groupID)

      this._map.addSprite(animal)
    }
  }

  public sellAnimalAt = (x: number, y: number) => {
    const animal = this.getTopAnimal(this._map.getSpritesAt(x, y))
    if (!animal)
      return

    this.sell(animal)
    this._map.removeSprite(animal)
  }

  public chipAnimalAt = (x: number, y: number) => {
    const animal = this.getTopAnimal(this._map.getSpritesAt(x, y))
    if (!animal || animal.chipPrice > this._balance)
      return

    this._balance -= animal.chipPrice
    animal.hasChip = true
  }

  private getTopAnimal = (sprites: Sprite[]): Animal | null => {
    if (sprites.length === 0)
      return null
    return sprites.filter(s => s instanceof Animal)[sprites.length - 1]
  }

  /**
   * This method updates the balance for buying the specified item.
   *
   * @param item - The item to be bought.
   * @returns True if the item was successfully bought, false otherwise.
   */
  private buy = (item: Buyable): boolean => {
    if (item.buyPrice > this._balance)
      return false

    this._balance -= item.buyPrice
    return true
  }

  private sell = (item: Sellable) => {
    this._balance += item.sellPrice
  }
}
