import Map from '@/map'
import { describe, expect, it } from 'vitest'

describe('check return values', () => {
  it.for([
    [0, 0],
    [1, 1],
    [15, 20],
    [198, 108],
    [1500, 2500],
  ])('should return the correct width and height for the map (width = %i, height = %i)', ([w, h]) => {
    // Arrange
    const map = new Map(w, h)

    // Act
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
  ])('should return all draw data for the map (width = %i, height = %i)', ([w, h]) => {
    // Arrange
    const map = new Map(w, h)

    // Act
    const drawData = map.getAllDrawData(false)

    // Assert
    expect(drawData.length).toBe(w * h)
  })
})
