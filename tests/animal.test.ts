import Zebra from '@/sprites/zebra'
import { describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)
const TestAnimal = Zebra

describe('animal act function', () => {
it.for(
    [1, 2, 3, 4, 5]
)('should increase age by dt=%p', (dt) => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1)
    const initialAge = animal.age

    // Act
    animal.act(dt, [], [{ position: [1, 1] } as any])

    // Assert
    expect(animal.age).toBe(initialAge + dt)
})

it('should decrement restingTime and not move when restingTime > 0', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1);
    (animal as any)._restingTime = 2
    const initialAge = animal.age
    
    // Act
    animal.act(1, [], [{ position: [1, 1] } as any])
    
    // Assert
    expect(animal.age).toBe(initialAge + 1)
    expect((animal as any)._restingTime).toBe(1)
    expect(animal.position).toEqual([0, 0])
})
})
