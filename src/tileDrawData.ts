import DrawData from './drawData'

export default class TileDrawData extends DrawData {
  public getScreenPosition = (unit: number): [x: number, y: number] => {
    const [x, y] = this.position
    return [unit * x, unit * y]
  }
}
