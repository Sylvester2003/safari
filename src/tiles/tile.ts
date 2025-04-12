import TileDrawData from '@/tileDrawData.js'

/**
 * Abstract class representing a tile in the game.
 */
export default abstract class Tile implements Buyable {
  private _position: [number, number]
  private _buyPrice: number = 0
  private _drawData: TileDrawData

  /**
   * Creates an instance of Tile.
   *
   * @param x - The x grid position of the tile.
   * @param y - The y grid position of the tile.
   */
  constructor(x: number, y: number) {
    this._position = [x, y]
    this._drawData = new TileDrawData(this.toString(), ...this._position)
  }

  /**
   * Loads the draw data for the tile.
   *
   * @returns A promise that resolves to the loaded draw data for the tile.
   */
  public loadDrawData = async (): Promise<TileDrawData> => {
    await this._drawData.loadJsonData()
    return this._drawData
  }

  /**
   * Gets the x and y position of the tile.
   *
   * @returns A tuple containing the x and y position of the tile.
   */
  public get position(): [number, number] {
    return this._position
  }

  /**
   * Gets the price of the tile the player has to pay to buy it.
   *
   * @returns The price of the tile.
   */
  public get buyPrice(): number {
    return this._buyPrice
  }

  /**
   * Gets the draw data for the tile.
   *
   * @returns The draw data for the tile.
   */
  public getDrawData = (): TileDrawData => {
    return this._drawData
  }

  /**
   * Gets the ID of the tile.
   *
   * @returns The ID of the tile.
   */
  public abstract toString(): string
}
