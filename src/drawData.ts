export default abstract class drawData {
  private readonly _id: string
  private readonly _position: [x: number, y: number]

  constructor(id: string, x: number, y: number) {
    this._id = id
    this._position = [x, y]
  }

  get id(): string {
    return this._id
  }

  get position(): [x: number, y: number] {
    return this._position
  }

  abstract getScreenPosition(unit: number): [x: number, y: number]
}
