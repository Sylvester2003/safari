import DrawData from './drawData'

/**
 * Draw data implementation for tiles.
 */
export default class SpriteDrawData extends DrawData {
  private _isChipped?: boolean = false
  private _isSelected?: boolean = false
  private _shootingAt?: [number, number]

  constructor(id: string, x: number, y: number, options: { isChipped?: boolean, isSelected?: boolean, shootingAt?: [x: number, y: number] } = {}) {
    super(id, x, y)
    this._isChipped = options.isChipped
    this._isSelected = options.isSelected
    this._shootingAt = options.shootingAt
  }

  public get isChipped(): boolean | undefined {
    return this._isChipped
  }

  public get isSelected(): boolean | undefined {
    return this._isSelected
  }

  public get shootingAt(): [number, number] | undefined {
    return this._shootingAt
  }

  public getScreenPosition = (unit: number): [x: number, y: number] => {
    const [x, y] = this.position
    const c = unit * (this.scale - 1) / 2
    return [unit * x - c, unit * y - c]
  }
}
