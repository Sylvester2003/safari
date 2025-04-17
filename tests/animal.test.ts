import Zebra from '@/sprites/zebra'
import { describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)
const TestAnimal = Zebra

describe('animal act function', () => {
  it('should increase age by dt', () => {
    const animal = new TestAnimal(0, 0, 1)
    const initialAge = (animal as any)._age
    animal.act(5, [], [{ position: [1, 1] } as any])
    expect((animal as any)._age).toBe(initialAge + 5)
  })
})
