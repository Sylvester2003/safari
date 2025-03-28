export function calcCellCoords(x: number, y: number, unit: number): [number, number] {
  return [Math.floor(x / unit), Math.floor(y / unit)]
}

export function calcCoords(x: number, y: number, unit: number): [number, number] {
  const [cellX, cellY] = calcCellCoords(x, y, unit)
  return [cellX * unit, cellY * unit]
}
