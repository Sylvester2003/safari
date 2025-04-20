import type Animal from '@/sprites/animal'

export type SignalCallback<T = any> = (data: T) => void

export class Signal<T = any> {
  private listeners: SignalCallback<T>[] = []

  public connect(callback: SignalCallback<T>): void {
    this.listeners.push(callback)
  }

  public emit(data: T): void {
    for (const listener of this.listeners) {
      listener(data)
    }
  }
}

export const animalDeadSignal = new Signal<Animal>()
