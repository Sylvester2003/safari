export function calcGridPos(x: number, y: number, unit: number): [number, number] {
  return [Math.floor(x / unit), Math.floor(y / unit)]
}

export function calcCoords(x: number, y: number, unit: number): [number, number] {
  return [x / unit * 100, y / unit * 100]
}
