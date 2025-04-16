import type DrawData from '@/drawData'
import type Goal from '@/goals/goal'
import Map from '@/map'
import { createCarnivore, createGoal, createHerbivore, createTile } from './utils/registry'

/**
 * Overarching model class for managing the game state and logic.
 */
export default class SafariModel {
  private readonly _map: Map
  private readonly _goal: Goal | null

  private _balance: number

  /**
   * Gets the goal of the game.
   *
   * @returns The goal object or null if not set.
   */
  public get goal(): Goal | null {
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
   * Creates an instance of the SafariModel class.
   */
  constructor(difficulty: string = 'safari:difficulty/normal') {
    this._map = new Map(48, 27)
    this._goal = createGoal(difficulty)
    this._balance = 1000
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
   */
  public tick = () => {
    this._map.tick()
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
    if (tile && this.buy(tile)) {
      await tile.loadDrawData()
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
    if (animal && this.buy(animal)) {
      await animal.loadDrawData()
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
    if (animal && this.buy(animal)) {
      await animal.loadDrawData()
      this._map.addSprite(animal)
    }
  }

  private buy = (item: Buyable): boolean => {
    if (item.buyPrice > this._balance) {
      return false
    }
    this._balance -= item.buyPrice
    return true
  }
}
