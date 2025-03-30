import DrawData from './drawData'

export default class TileDrawData extends DrawData {
  public getScreenPosition = (unit: number): [x: number, y: number] => {
    const [x, y] = this.position
    const c = unit * (this.scale - 1) / 2
    return [unit * x - c, unit * y - c]
  }
}
