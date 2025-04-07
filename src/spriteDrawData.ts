import DrawData from './drawData'

/**
 * Draw data implementation for tiles.
 */
export default class SpriteDrawData extends DrawData {
  private _isChipped: boolean = false
  private _isSelected: boolean = false
  private _shootingAt?: [number, number]

  constructor(id: string, x: number, y: number, options: { isChipped?: boolean, isSelected?: boolean } = {}) {
    super(id, x, y)
  }

  public getScreenPosition = (unit: number): [x: number, y: number] => {
    const [x, y] = this.position
    const c = unit * (this.scale - 1) / 2
    return [unit * x - c, unit * y - c]
  }
}
