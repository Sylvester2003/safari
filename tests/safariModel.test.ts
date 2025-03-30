import SafariModel from '@/safariModel'
import { describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)

describe('check valid returns', () => {
  it('should return a valid width and height', async () => {
  // Arrange
    const model = new SafariModel()

    // Act
    await model.loadMap()
    const width = model.width
    const height = model.height

    // Assert
    expect(width).not.toBeNull()
    expect(height).not.toBeNull()
  })

  it('should return valid draw data', async () => {
  // Arrange
    const model = new SafariModel()

    // Act
    await model.loadMap()
    const drawDatas = model.getAllDrawData()

    // Assert
    expect(drawDatas).not.toBeNull()
  })
})
