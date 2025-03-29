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
