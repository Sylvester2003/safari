import SafariModel from '@/safariModel'
import { describe, expect, it } from 'vitest'

describe('check valid returns', () => {
  it('should return a valid width and height', () => {
  // Arrange
    const model = new SafariModel()

    // Act
    const width = model.width
    const height = model.height

    // Assert
    expect(width).not.toBeNull()
    expect(height).not.toBeNull()
  })

  it('should return valid draw data', () => {
  // Arrange
    const model = new SafariModel()

    // Act
    const drawDatas = model.getAllDrawData()

    // Assert
    expect(drawDatas).not.toBeNull()
  })
})
