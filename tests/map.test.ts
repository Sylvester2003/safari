import Map from '@/map'
import { expect, it } from 'vitest'

it('should return the correct width and height for the map', () => {
  // Arrange
  const map = new Map(198, 108)

  // Act
  const width = map.width
  const height = map.height

  // Assert
  expect(width).toBe(198)
  expect(height).toBe(108)
})

it('should return all draw data for the map', () => {
  // Arrange
  const map = new Map(2, 2)

  // Act
  const drawData = map.getAllDrawData(false)

  // Assert
  expect(drawData.length).toBe(4)
})


