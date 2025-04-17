import Map from '@/map'
import { describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)

describe('check return values', () => {
  it.for([
    [0, 0],
    [1, 1],
    [15, 20],
    [198, 108],
  ])('should return the correct width and height for the map (width = %i, height = %i)', async ([w, h]) => {
    // Arrange
    const map = new Map(w, h)

    // Act
    await map.loadMap()
    const width = map.width
    const height = map.height

    // Assert
    expect(width).toBe(w)
    expect(height).toBe(h)
  })

  it.for([
    [0, 0],
    [1, 1],
    [15, 20],
    [198, 108],
  ])('should return all draw data for the map (width = %i, height = %i)', async ([w, h]) => {
    // Arrange
    const map = new Map(w, h)

    // Act
    await map.loadMap()
    const drawDatas = map.getAllDrawData(false)

    // Assert
    expect(drawDatas.length).toBe(w * h)
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
    const mockAct = vi.fn()
    const mockSprite = {
      viewDistance: 1,
      position: [2, 2],
      act: mockAct,
    } as any
    
    //Act
    await map.loadMap()
    map.addSprite(mockSprite)
    map.tick(0.5)

    // Assert
    expect(mockAct).toHaveBeenCalledTimes(1)
    expect(mockAct).toHaveBeenCalledWith(0.5, [], expect.any(Array))
    expect((mockAct.mock.calls[0][2] as any[]).length).toBe(9)
  })

  it('should pass visibleSprites to act when sprites are in view distance', async () => {
    // Arrange
    const map = new Map(5, 5)

    const mockAct1 = vi.fn()
    const mockAct2 = vi.fn()

    const sprite1 = {
      viewDistance: 1,
      position: [2, 2],
      act: mockAct1,
    } as any

    const sprite2 = {
      viewDistance: 1,
      position: [2, 3],
      act: mockAct2,
    } as any

    // Act
    await map.loadMap()
    map.addSprite(sprite1)
    map.addSprite(sprite2)
    map.tick(1)

    // Assert
    expect(mockAct1.mock.calls[0][1]).toContain(sprite2)
    expect(mockAct2.mock.calls[0][1]).toContain(sprite1)
  })

  it('should not include sprites outside of view distance in visibleSprites', async () => {
    // Arrange
    const map = new Map(5, 5)

    const mockAct1 = vi.fn()
    const mockAct2 = vi.fn()

    const sprite1 = {
      viewDistance: 1,
      position: [0, 0],
      act: mockAct1,
    } as any

    const sprite2 = {
      viewDistance: 1,
      position: [4, 4],
      act: mockAct2,
    } as any

    // Act
    await map.loadMap()
    map.addSprite(sprite1)
    map.addSprite(sprite2)
    map.tick(1)

    // Assert
    expect(mockAct1.mock.calls[0][1]).not.toContain(sprite2)
    expect(mockAct2.mock.calls[0][1]).not.toContain(sprite1)
  })

  it('should pass the correct visibleTiles to act for a sprite in the center', async () => {
    // Arrange
    const map = new Map(3, 3)
    
    const mockAct = vi.fn()
    const sprite = {
      viewDistance: 1,
      position: [1, 1],
      act: mockAct,
    } as any
    
    // Act
    await map.loadMap()
    map.addSprite(sprite)
    map.tick(1)

    // Assert
    const visibleTiles = mockAct.mock.calls[0][2]

    expect(visibleTiles.length).toBe(9)

    expect(visibleTiles).toContain(map.tiles[1][1])

    expect(visibleTiles).toContain(map.tiles[0][0])
    expect(visibleTiles).toContain(map.tiles[0][1])
    expect(visibleTiles).toContain(map.tiles[0][2])
    expect(visibleTiles).toContain(map.tiles[1][0])
    expect(visibleTiles).toContain(map.tiles[1][2])
    expect(visibleTiles).toContain(map.tiles[2][0])
    expect(visibleTiles).toContain(map.tiles[2][1])
    expect(visibleTiles).toContain(map.tiles[2][2])
  })

  it('should pass only in-bounds visibleTiles to act for a sprite at the edge', async () => {
    //Arrange
    const map = new Map(3, 3)

    const mockAct = vi.fn()
    const sprite = {
      viewDistance: 1,
      position: [0, 0],
      act: mockAct,
    } as any

    // Act
    await map.loadMap()
    map.addSprite(sprite)
    map.tick(1)

    // Assert
    const visibleTiles = mockAct.mock.calls[0][2]

    expect(visibleTiles.length).toBe(4)

    expect(visibleTiles).toContain(map.tiles[0][0])
    expect(visibleTiles).toContain(map.tiles[0][1])
    expect(visibleTiles).toContain(map.tiles[1][0])
    expect(visibleTiles).toContain(map.tiles[1][1])
  })
})
