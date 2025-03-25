import Sand from '@/tiles/sand'
import { expect, it } from 'vitest'

it('sand sucessfuly created', () => {
  // Arrange
  const sand = new Sand(0, 0)

  // Act
  const id = sand.toString()

  // Assert
  expect(id).toBe('safari:sand')
})
