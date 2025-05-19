import type Carnivore from './carnivore'
import type Poacher from './poacher'
import { updateVisiblesSignal } from '@/utils/signal'
import Shooter from './shooter'

export default class Ranger extends Shooter implements Buyable {
  protected static id = 'safari:ranger'
  private _chasing?: Carnivore | Poacher
  declare protected _jsonData: RangerJson

  constructor(x: number, y: number) {
    super(x, y)
  }

  public get chasing(): Shootable | undefined {
    return this._chasing
  }

  public set chasing(value: Carnivore | Poacher) {
    this._chasing = value
    this.pathTo = value.position
  }

  public get buyPrice(): number {
    return this._jsonData.buyPrice
  }

  public get salary(): number {
    return this._jsonData.salary
  }

  public getShotBy = (_shooter: Shooter): boolean => {
    return false // temporary
  }

  public act = (dt: number) => {
    updateVisiblesSignal.emit(this)

    if (this._chasing) {
      const dx = this._chasing.position[0] - this.position[0]
      const dy = this._chasing.position[1] - this.position[1]
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist <= 2) {
        this._bulletTimer -= dt
        if (this._bulletTimer <= 0) {
          this._bulletTimer = 1
          if (this._chasing.getShotBy(this)) {
            this._chasing = undefined
            this.pathTo = undefined
          }
        }
      }
      else {
        this.pathTo = this._chasing.position
      }
    }

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

    const bounds = this.computeBounds(this._visibleTiles)
    this.move(dt, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
  }
}
