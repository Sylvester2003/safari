import type Carnivore from '@/sprites/carnivore'
import Poacher from '@/sprites/poacher'
import Shooter from '@/sprites/shooter'
import { shooterDeadSignal, updateVisiblesSignal } from '@/utils/signal'

export default class Ranger extends Shooter implements Buyable {
  protected static id = 'safari:ranger'
  private _chasing?: Carnivore | Poacher
  declare protected _jsonData: RangerJson

  constructor(x: number, y: number) {
    super(x, y)
  }

  public get chasing(): Carnivore | Poacher | undefined {
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
    const chance = Math.random()
    if (chance < 0.5) {
      shooterDeadSignal.emit(this)
      return true
    }
    return false
  }

  public act = (dt: number) => {
    updateVisiblesSignal.emit(this)

    this.movement(dt)

    if (!this._shootingAt && !this._chasing) {
      this._shootingAt = this.closePoachers()[Math.floor(Math.random() * this.closePoachers().length)]
    }

    if (this._shootingAt) {
      this._bulletTimer -= dt

      if (this._bulletTimer <= 0) {
        this._bulletTimer = 1

        if (this._shootingAt.getShotBy(this)) {
          this._shootingAt = undefined
          this.pathTo = undefined
          updateVisiblesSignal.emit(this, true)
        }
      }
    }
  }

  private closePoachers = (): Poacher[] => {
    return this._visibleSprites.filter(sprite => sprite instanceof Poacher) as Poacher[]
  }

  private movement = (dt: number) => {
    const bounds = this.computeBounds(this._visibleTiles)
    if (!this.pathTo && !this._shootingAt) {
      this.pathTo = this.chooseRandomTarget(bounds)
    }

    if (this.chasing) {
      if (this.isAtDestination(this.viewDistance)) {
        this.handleArrival()
      }
    }
    else {
      if (this.isAtDestination()) {
        this.handleArrival()
      }
    }

    this.move(dt, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
  }

  private handleArrival = () => {
    if (!this.pathTo)
      return

    this.velocity = [0, 0]
    this.pathTo = undefined

    if (this._chasing) {
      updateVisiblesSignal.emit(this, true)
      this._shootingAt = this._chasing
      if (this._shootingAt) {
        this.pathTo = this._chasing.position
      }
      this._chasing = undefined
    }

    this._restingTime = 5 + Math.random() * 4
  }
}
