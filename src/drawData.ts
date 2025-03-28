import { loadJson } from '@/utils/load'

export default abstract class DrawData {
  private readonly _id: string
  private readonly _position: [x: number, y: number]
  private _jsonData!: DrawDataJson

  constructor(id: string, x: number, y: number) {
    this._id = id
    this._position = [x, y]
  }

  public loadJsonData = async (): Promise<void> => {
    const fileName = this._id.split(':')[1]
    const jsonData = await loadJson(`resources/${fileName}`)
    this._jsonData = jsonData
  }

  get id(): string {
    return this._id
  }

  get position(): [x: number, y: number] {
    return this._position
  }

  get image(): string {
    return `/src/resources/textures/${this._jsonData.texture}`
  }

  get zIndex(): number {
    return this._jsonData.zIndex
  }

  public getSize = (unit: number): number => {
    return this._jsonData.scale * unit
  }

  public abstract getScreenPosition(unit: number): [x: number, y: number]
}
