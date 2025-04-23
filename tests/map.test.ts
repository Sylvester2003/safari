import Map from '@/map'
import Zebra from '@/sprites/zebra'
import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)
// describe('check return values', () => {
//   it.for([
//     [0, 0],
//     [1, 1],
//     [15, 20],
//     [198, 108],
//   ])('should return the correct width and height for the map (width = %i, height = %i)', async ([w, h]) => {
//     // Arrange
//     const map = new Map(w, h)

//     // Act
//     await map.loadMap()
//     const width = map.width
//     const height = map.height

//     // Assert
//     expect(width).toBe(w)
//     expect(height).toBe(h)
//   })

//   it.for([
//     [0, 0],
//     [1, 1],
//     [15, 20],
//     [198, 108],
//   ])('should return all draw data for the map (width = %i, height = %i)', async ([w, h]) => {
//     // Arrange
//     const map = new Map(w, h)

//     // Act
//     await map.loadMap()
//     const drawDatas = map.getAllDrawData(false)

//     // Assert
//     expect(drawDatas.length).toBe(w * h)
//   })
// })

beforeEach(() => {
  vol.reset()

  // using Zebra as test sprite
  vol.fromJSON({
    '/data/zebra.json': JSON.stringify({
      buyPrice: 100,
      viewDistance: 1,
      speed: 1,
      size: 1,
    }),
  })
})

describe('check tick behaviour on map', () => {
  it('should not throw if there are no sprites', async () => {
    // Arrange
    const map = new Map(3, 3)

    // Act
    await map.loadMap()

    // Assert
    expect(() => map.tick(1)).not.toThrow()
  })

  it('should call act on a single sprite with correct arguments', async () => {
    // Arrange
    const map = new Map(5, 5)
    const sprite = new Zebra(2, 2, 1)
    const actSpy = vi.spyOn(sprite, 'act')

    // Act
    await map.loadMap()
    await sprite.load()
    map.addSprite(sprite)
    map.tick(0.5)

    // Assert
    expect(sprite.act).toHaveBeenCalledTimes(1)
    expect(sprite.act).toHaveBeenCalledWith(0.5, [], expect.any(Array))
    expect((actSpy.mock.calls[0][2] as any[]).length).toBe(9)
  })

  // it('should pass visibleSprites to act when sprites are in view distance', async () => {
  //   // Arrange
  //   const map = new Map(5, 5)
  //   const sprite1 = new Zebra(2, 2, 1)
  //   const sprite2 = new Zebra(2, 3, 1)
  //   const actSpy1 = vi.spyOn(sprite1, 'act')
  //   const actSpy2 = vi.spyOn(sprite2, 'act')

  //   // Act
  //   await map.loadMap()
  //   await sprite1.load()
  //   await sprite2.load()
  //   map.addSprite(sprite1)
  //   map.addSprite(sprite2)
  //   map.tick(1)

  //   // Assert
  //   expect(actSpy1.mock.calls[0][1]).toContain(sprite2)
  //   expect(actSpy2.mock.calls[0][1]).toContain(sprite1)
  // })

  it('should not include sprites outside of view distance in visibleSprites', async () => {
    // Arrange
    const map = new Map(5, 5)

    const sprite1 = new Zebra(0, 0, 1)
    const sprite2 = new Zebra(4, 4, 1)
    const actSpy1 = vi.spyOn(sprite1, 'act')
    const actSpy2 = vi.spyOn(sprite2, 'act')

    // Act
    await map.loadMap()
    await sprite1.load()
    await sprite2.load()
    map.addSprite(sprite1)
    map.addSprite(sprite2)
    map.tick(1)

    // Assert
    expect(actSpy1.mock.calls[0][1]).not.toContain(sprite2)
    expect(actSpy2.mock.calls[0][1]).not.toContain(sprite1)
  })

  // Commented out because of tile getter in map class. Will return to it at the next milestone

  // it('should pass the correct visibleTiles to act for a sprite in the center', async () => {
  //   // Arrange
  //   const map = new Map(3, 3)

  //   const mockAct = vi.fn()
  //   const sprite = {
  //     viewDistance: 1,
  //     position: [1, 1],
  //     act: mockAct,
  //   } as any

  //   // Act
  //   await map.loadMap()
  //   map.addSprite(sprite)
  //   map.tick(1)

  //   // Assert
  //   const visibleTiles = mockAct.mock.calls[0][2]

  //   expect(visibleTiles.length).toBe(9)

  //   expect(visibleTiles).toContain(map.tiles[1][1])

  //   expect(visibleTiles).toContain(map.tiles[0][0])
  //   expect(visibleTiles).toContain(map.tiles[0][1])
  //   expect(visibleTiles).toContain(map.tiles[0][2])
  //   expect(visibleTiles).toContain(map.tiles[1][0])
  //   expect(visibleTiles).toContain(map.tiles[1][2])
  //   expect(visibleTiles).toContain(map.tiles[2][0])
  //   expect(visibleTiles).toContain(map.tiles[2][1])
  //   expect(visibleTiles).toContain(map.tiles[2][2])
  // })

  // it('should pass only in-bounds visibleTiles to act for a sprite at the edge', async () => {
  //   // Arrange
  //   const map = new Map(3, 3)

  //   const mockAct = vi.fn()
  //   const sprite = {
  //     viewDistance: 1,
  //     position: [0, 0],
  //     act: mockAct,
  //   } as any

  //   // Act
  //   await map.loadMap()
  //   map.addSprite(sprite)
  //   map.tick(1)

  //   // Assert
  //   const visibleTiles = mockAct.mock.calls[0][2]

  //   expect(visibleTiles.length).toBe(4)

  //   expect(visibleTiles).toContain(map.tiles[0][0])
  //   expect(visibleTiles).toContain(map.tiles[0][1])
  //   expect(visibleTiles).toContain(map.tiles[1][0])
  //   expect(visibleTiles).toContain(map.tiles[1][1])
  // })
})
