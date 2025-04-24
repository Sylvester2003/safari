import type Tile from '@/tiles/tile'
import type Visitor from '@/visitor'
import Animal from '@/sprites/animal'
import Sprite from '@/sprites/sprite'
import { tourFinishedSignal } from '@/utils/signal'

export default class Jeep extends Sprite implements Buyable {
  protected static id = 'safari:jeep'

  private _passengers: Visitor[]
  private _path: Tile[]

  declare protected _jsonData: JeepJson

  public get buyPrice(): number {
    return this._jsonData.buyPrice
  }

  public get pathTo(): [number, number] | undefined {
    return this._path.length > 0
      ? this._path[0].position
      : undefined
  }

  constructor() {
    super(0, 0)
    this._passengers = []
    this._path = []
  }

  public addPassenger(passenger: Visitor) {
    this._passengers.push(passenger)
  }

  public choosePath(paths: Tile[][]) {
    const n = paths.length
    const r = Math.floor(Math.random() * n)
    this._path = paths[r]
  }

  public act = (dt: number, visibleSprites: Sprite[], _: Tile[]) => {
    if (this.pathTo) {
      const dx = this.pathTo[0] - this.position[0]
      const dy = this.pathTo[1] - this.position[1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 0) {
        this.velocity = [dx / dist * this.speed, dy / dist * this.speed]
        const moveX = this.velocity[0] * dt / 10
        const moveY = this.velocity[1] * dt / 10
        if (Math.abs(moveX) >= Math.abs(dx) && Math.abs(moveY) >= Math.abs(dy)) {
          this.position = this.pathTo
          this._path.shift()
        }
        else {
          this.position[0] += moveX
          this.position[1] += moveY
        }
      }
      else {
        this._path.shift()
      }
    }
    else {
      this._passengers = []
      this.position = [0, 0]
      this.velocity = [0, 0]
      tourFinishedSignal.emit(this)
    }

    const animals = visibleSprites.filter(s => s instanceof Animal)
    for (const passenger of this._passengers)
      passenger.lookAt(animals)
  }
}
