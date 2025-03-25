import DrawData from '@/drawData'
import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  vol.reset()
})

class TestDrawData extends DrawData {
  getScreenPosition(_: number): [number, number] {
    return [0, 0]
  }
}

describe('loading draw data from json', () => {
  it('returns the correct texture file location', () => {
    // Arrange
    const path = './src/resources/test.json'
    vol.fromJSON({
      [path]: JSON.stringify({
        texture: 'test.webp',
        scale: 1,
        zIndex: 0,
      }),
    })
    const instance = new TestDrawData('safari:test', 0, 0)

    // Act
    const image = instance.getImage()

    // Assert
    expect(image).toBe('test.webp')
  })

  it.for([
    0.5,
    1,
    2,
    2.5,
  ])('calculates size correctly using scale (scale = %d)', (scale: number) => {
    // Arrange
    const path = './src/resources/test.json'
    vol.fromJSON({
      [path]: JSON.stringify({
        texture: 'test.webp',
        scale,
        zIndex: 0,
      }),
    })
    const unit = 10
    const instance = new TestDrawData('safari:test', 0, 0)

    // Act
    const size = instance.getSize(unit)

    // Assert
    expect(size).toBe(scale * unit)
  })

  it.for([
    0,
    1,
    10,
    999,
  ])('gives back the correct zIndex (zIndex = %d)', (zIndex: number) => {
    // Arrange
    const path = './src/resources/test.json'
    vol.fromJSON({
      [path]: JSON.stringify({
        texture: 'test.webp',
        scale: 1,
        zIndex,
      }),
    })
    const instance = new TestDrawData('safari:test', 0, 0)

    // Act
    const value = instance.getZIndex()

    // Assert
    expect(value).toBe(zIndex)
  })
})
