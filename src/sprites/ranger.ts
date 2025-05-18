import { updateVisiblesSignal } from '@/utils/signal'
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

  public get salary(): number {
    return this._jsonData.salary
  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false
  }

  public act = (dt: number) => {
    updateVisiblesSignal.emit(this)
    this.updateState()

    // If we're at our destination or don't have one, choose a new random target
    if (this.isAtDestination() || !this.pathTo) {
      const bounds = this.computeBounds(this._visibleTiles)
      const nonObstacleTiles = this._visibleTiles.filter(tile => !tile.isObstacle)

      if (nonObstacleTiles.length > 0) {
        const randomTileIndex = Math.floor(Math.random() * nonObstacleTiles.length)
        const randomTile = nonObstacleTiles[randomTileIndex]
        this.pathTo = [
          Math.max(bounds.minX, Math.min(bounds.maxX, randomTile.position[0])),
          Math.max(bounds.minY, Math.min(bounds.maxY, randomTile.position[1])),
        ]
      }
    }

    // Move towards the target
    const bounds = this.computeBounds(this._visibleTiles)
    this.move(dt, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
  }
}
