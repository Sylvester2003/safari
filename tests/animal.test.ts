import Zebra from '@/sprites/zebra'
import Sand from '@/tiles/sand'
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
    animal.act(dt, [], [[1,1] as any])

    // Assert
    expect(animal.age).toBe(initialAge + dt)
})

it('should decrement restingTime and not move when restingTime > 0', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1);
    (animal as any)._restingTime = 2
    const initialAge = animal.age
    
    // Act
    animal.act(1, [], [[1,1] as any])
    
    // Assert
    expect(animal.age).toBe(initialAge + 1)
    expect((animal as any)._restingTime).toBe(1)
    expect(animal.position).toEqual([0, 0])
})
it('should set pathTo to a random visible tile when pathTo is not set', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1)
    const mockTile1 = new Sand(5, 5)
    const mockTile2 = new Sand(10, 10)
    const visibleTiles = [mockTile1, mockTile2]

    // Act
    animal.act(1, [], visibleTiles as any)

    // Assert
    expect(visibleTiles.map(t => t.position)).toContainEqual(animal.pathTo)
})

it('should set pathTo to a random visible tile when animal reaches its pathTo', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1)
    const mockTile1 = new Sand(2, 2)
    const mockTile2 = new Sand(3, 3)
    const visibleTiles = [mockTile1, mockTile2]
    animal.pathTo = [0, 0]

    // Act
    animal.act(1, [], visibleTiles as any)

    // Assert
    expect(visibleTiles.map(t => t.position)).toContainEqual(animal.pathTo)
})

it('should set velocity towards pathTo based on speed and direction', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1)
    
    Object.defineProperty(animal, 'speed', { value: 10 })
    animal.pathTo = [10, 0]
    animal.position = [0, 0]
    const visibleTiles = [{ position: [10, 0] }] as any

    // Act
    animal.act(1, [], visibleTiles)

    // Assert
    expect(animal.velocity[0]).toBeCloseTo(10)
    expect(animal.velocity[1]).toBeCloseTo(0)
})

it('should move position towards pathTo according to velocity and dt', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1)
    Object.defineProperty(animal, 'speed', { value: 10 })
    animal.pathTo = [10, 0]
    animal.position = [0, 0]
    const visibleTiles = [{ position: [10, 0] }] as any

    // Act
    animal.act(1, [], visibleTiles)

    // Assert
    expect(animal.position[0]).toBeCloseTo(1)
    expect(animal.position[1]).toBeCloseTo(0)
})

it('should snap to pathTo if moveX and moveY would overshoot', () => {
    // Arrange
    const animal = new TestAnimal(0, 0, 1)
    Object.defineProperty(animal, 'speed', { value: 100 })
    animal.pathTo = [5, 0]
    animal.position = [0, 0]
    const visibleTiles = [{ position: [5, 0] }] as any

    // Act
    animal.act(1, [], visibleTiles)

    // Assert
    expect(animal.position[0]).toBeCloseTo(5)
    expect(animal.position[1]).toBeCloseTo(0)
})
})