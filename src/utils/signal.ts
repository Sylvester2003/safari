import type Animal from '@/sprites/animal'
import type Jeep from '@/sprites/jeep'
import type Tile from '@/tiles/tile'

export type SignalCallback<T = any> = (data: T) => void

/**
 * A simple signal class for event handling.
 */
export class Signal<T = any> {
  private listeners: SignalCallback<T>[] = []

  /**
   * Connects a callback function to the signal.
   *
   * @param callback - The callback function to be called when the signal is emitted.
   */
  public connect(callback: SignalCallback<T>): void {
    this.listeners.push(callback)
  }

  /**
   * Emits the signal, calling all connected callback functions with the provided data.
   *
   * @param data - The data to be passed to the callback functions.
   */
  public emit(data: T): void {
    for (const listener of this.listeners) {
      listener(data)
    }
  }
}

export const animalDeadSignal = new Signal<Animal>()
export const goalMetSignal = new Signal<void>()
export const losingSignal = new Signal<void>()
export const tourStartSignal = new Signal<void>()
export const tourFinishedSignal = new Signal<Jeep>()
export const tourRatingsSignal = new Signal<number[]>()
export const tileEatenSignal = new Signal<Tile>()
