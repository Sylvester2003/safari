import Zebra from '@/sprites/zebra'
import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vol.reset()

  // using Zebra as test sprite
  vol.fromJSON({
    '/data/zebra.json': JSON.stringify({
      buyPrice: 100,
      viewDistance: 10,
      speed: 10,
      size: 1,
    }),
  })
})

describe('animal act function', () => {
  it.for(
    [1, 2, 3, 4, 5],
  )('should increase age by dt=%p', async (dt) => {
    // Arrange
    const animal = new Zebra(0, 0, 1)
    const initialAge = animal.age
    await animal.load()

    // Act
    animal.act(dt)

    // Assert
    expect(animal.age).toBe(initialAge + dt / 1440)
  })

  it('should decrement restingTime and not move when restingTime > 0', async () => {
    // Arrange
    const animal = new Zebra(0, 0, 1);
    (animal as any)._restingTime = 2
    await animal.load()

    // Act
    animal.act(1)

    // Assert
    expect((animal as any)._restingTime).toBe(1)
    expect(animal.position).toEqual([0, 0])
  })
  // it('should set pathTo to a random visible tile when pathTo is not set', async () => {
  //   // Arrange
  //   const animal = new Zebra(0, 0, 1)
  //   const mockTile1 = new Sand(5, 5)
  //   const mockTile2 = new Sand(10, 10)

  //   await animal.load()
  //   await mockTile1.load()
  //   await mockTile2.load()

  //   const visibleTiles = [mockTile1, mockTile2]

  //   // Act
  //   animal.act(1)

  //   // Assert
  //   expect(visibleTiles.map(t => t.position)).toContainEqual(animal.pathTo)
  // })

  // it('should set pathTo to a random visible tile when animal reaches its pathTo', async () => {
  //   // Arrange
  //   const animal = new Zebra(0, 0, 1)
  //   const mockTile1 = new Sand(2, 2)
  //   const mockTile2 = new Sand(3, 3)

  //   await animal.load()
  //   await mockTile1.load()
  //   await mockTile2.load()

  //   const visibleTiles = [mockTile1, mockTile2]

  //   // Act
  //   animal.act(1)

  //   // Assert
  //   expect(visibleTiles.map(t => t.position)).toContainEqual(animal.pathTo)
  // })

  it('should set velocity towards pathTo based on speed and direction', async () => {
    // Arrange
    const animal = new Zebra(0, 0, 1)
    await animal.load()
    animal.pathTo = [10, 0]
    animal.position = [0, 0]

    // Act
    animal.act(1)

    // Assert
    expect(animal.velocity[0]).toBeCloseTo(10)
    expect(animal.velocity[1]).toBeCloseTo(0)
  })

  it('should move position towards pathTo according to velocity and dt', async () => {
    // Arrange
    const animal = new Zebra(9, 0, 1)
    await animal.load()
    animal.pathTo = [10, 0]

    // Act
    animal.act(1)

    // Assert
    expect(animal.position[0]).toBeCloseTo(10)
    expect(animal.position[1]).toBeCloseTo(0)
  })

  it('should snap to pathTo if moveX and moveY would overshoot', async () => {
    // Arrange
    const animal = new Zebra(0, 0, 1)
    await animal.load();
    (animal as any)._jsonData.speed = 100
    animal.pathTo = [5, 0]
    animal.position = [0, 0]

    // Act
    animal.act(1)

    // Assert
    expect(animal.position[0]).toBeCloseTo(5)
    expect(animal.position[1]).toBeCloseTo(0)
  })
})
