import SafariModel from '@/safariModel'
import { loadJson } from '@/utils/load'
import { createGoal } from '@/utils/registry'
import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'
import '@/goals'

vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vol.reset()
  vi.resetModules()
})

describe('check valid returns', () => {
  it('should return a valid width and height', async () => {
  // Arrange
    const model = new SafariModel('safari:difficulty/easy')

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
    const model = new SafariModel('safari:difficulty/easy')

    // Act
    await model.loadMap()
    const drawDatas = model.getAllDrawData()

    // Assert
    expect(drawDatas).not.toBeNull()
  })

  it('should return the correct goal datas', async () => {
  // Arrange
    const file = 'data/difficulty/normal'
    vol.fromJSON({
      [`/${file}.json`]: JSON.stringify({
        balance: 1,
        herbivores: 10,
        carnivores: 5,
        visitors: 50,
        forDays: 2,
      }),
    })
    const model = new SafariModel('safari:difficulty/normal')

    // Act
    await model.loadMap()

    // Assert
    expect(model.goal?.balance).toEqual(1)
    expect(model.goal?.herbivores).toEqual(10)
    expect(model.goal?.carnivores).toEqual(5)
    expect(model.goal?.visitors).toEqual(50)
    expect(model.goal?.forDays).toEqual(2)
  })
})
