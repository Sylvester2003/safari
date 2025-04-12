import { loadJson } from '@/utils/load'

export default abstract class Goal {
  private _balance: number
  private _herbivores: number
  private _carnivores: number
  private _visitors: number
  private _forDays: number

  public get balance(): number {
    return this._balance
  }

  public get herbivores(): number {
    return this._herbivores
  }

  public get carnivores(): number {
    return this._carnivores
  }

  public get visitors(): number {
    return this._visitors
  }

  public get forDays(): number {
    return this._forDays
  }

  constructor() {
    this._balance = 0
    this._herbivores = 0
    this._carnivores = 0
    this._visitors = 0
    this._forDays = 0
  }

  public loadData = async (): Promise<void> => {
    const fileName = this.toString().split(':')[1]
    const jsonData = await loadJson(`data/${fileName}`)
    this._balance = jsonData.balance
    this._herbivores = jsonData.herbivores
    this._carnivores = jsonData.carnivores
    this._visitors = jsonData.visitors
    this._forDays = jsonData.forDays
  }

  public abstract toString(): string
}
