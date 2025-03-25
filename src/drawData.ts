import { readFileSync } from 'node:fs'

export default abstract class DrawData {
  private readonly _id: string
  private readonly _position: [x: number, y: number]
  private readonly _jsonData: DrawDataJson

  constructor(id: string, x: number, y: number) {
    this._id = id
    this._position = [x, y]

    const fileName = this._id.split(':')[1]
    const fileContent = readFileSync(`./src/resources/${fileName}.json`, 'utf-8')
    this._jsonData = JSON.parse(fileContent)
  }

  get id(): string {
    return this._id
  }

  get position(): [x: number, y: number] {
    return this._position
  }

  abstract getScreenPosition(unit: number): [x: number, y: number]

  public getImage = (): string => {
    return this._jsonData.texture
  }

  public getSize = (unit: number): number => {
    return this._jsonData.scale * unit
  }

  public getZIndex = (): number => {
    return this._jsonData.zIndex
  }
}
