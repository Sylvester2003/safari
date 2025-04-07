import type Tile from '@/tiles/tile'
import SpriteDrawData from '@/spriteDrawData'

export default abstract class Sprite {
  private _position: [number, number]
  private _pathTo?: [number, number]
  private _velocity: [number, number] = [0, 0]
  private _isDead: boolean = false
  private _drawData: SpriteDrawData

  constructor(x: number, y: number) {
    this._position = [x, y]
    this._drawData = new SpriteDrawData(this.toString(), ...this._position)
  }

  public get position(): [number, number] {
    return this._position
  }

  public get pathTo(): [number, number] | undefined {
    return this._pathTo
  }

  public get velocity(): [number, number] {
    return this._velocity
  }

  public get isDead(): boolean {
    return this._isDead
  }

  public set position(value: [number, number]) {
    this._position = value
  }

  public abstract act(dt: number, visibleSprites: Sprite[], visibleTiles: Tile[]): void

  public getDrawData = (): SpriteDrawData => {
    return this._drawData
  }

  public onCells = (): [number, number][] => {

  }

  public abstract toString(): string
}
