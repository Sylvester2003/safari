import { loadJson } from '@/utils/load'
import { vol } from 'memfs'
import { beforeEach, expect, it, vi } from 'vitest'
import mockFetch from './mocks/fetch'

vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vol.reset()
  vi.resetModules()
})

it('loads correct json data', async () => {
  // Arrange
  const file = 'resources/test'
  vol.fromJSON({
    [`/src/${file}.json`]: JSON.stringify({
      texture: 'test.webp',
      scale: 1,
      zIndex: 0,
    }),
  })

  // Act
  const data = await loadJson(file)

  // Assert
  expect(data).toEqual({
    texture: 'test.webp',
    scale: 1,
    zIndex: 0,
  })
})
