import type Tile from '@/tiles/tile'

export const tileRegistry = new Map<
  string,
  new (x: number, y: number) => Tile
>()
export const herbivoreRegistry = new Map<
  string,
  new (x: number, y: number, group: number) => Herbivore
>()
export const carnivoreRegistry = new Map<
  string,
  new (x: number, y: number, group: number) => Carnivore
>()

/**
 * Registers a tile with the given id in the tileRegistry.
 *
 * @param  {string} id - The id of the tile
 * @returns {Function} - A decorator function that registers the tile
 */
export function tile(id: string) {
  return function <T extends new (x: number, y: number) => Tile>(constructor: T) {
    tileRegistry.set(id, constructor)
  }
}

/**
 * Registers a herbivore with the given id in the herbivoreRegistry.
 *
 * @param  {string} id - The id of the herbivore
 * @returns {Function} - A decorator function that registers the herbivore
 */
export function herbivore(id: string) {
  return function <T extends new (x: number, y: number, group: number) => Herbivore>(constructor: T) {
    herbivoreRegistry.set(id, constructor)
  }
}

/**
 * Registers a carnivore with the given id in the tileRegistry.
 *
 * @param  {string} id - The id of the carnivore
 * @returns {Function} - A decorator function that registers the carnivore
 */
export function carnivore(id: string) {
  return function <T extends new (x: number, y: number, group: number) => Carnivore>(constructor: T) {
    carnivoreRegistry.set(id, constructor)
  }
}

/**
 * Creates a tile of the specified id.
 *
 * @param {string} id - The id of the tile to create.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 * @returns {Tile | null} - An instance of the specified id, or null if not found.
 */
export function createTile(
  id: string,
  x: number = 0,
  y: number = 0,
): Tile | null {
  const TileClass = tileRegistry.get(id)
  return TileClass ? new TileClass(x, y) : null
}

/**
 * Creates a herbivore of the specified id.
 *
 * @param {string} id - The id of the herbivore to create.
 * @param {number} x - The x coordinate of the herbivore.
 * @param {number} y - The y coordinate of the herbivore.
 * @param {number} group - The group id of the herbivore.
 * @returns {Tile | null} - An instance of the specified id, or null if not found.
 */
export function createHerbivore(
  id: string,
  x: number = 0,
  y: number = 0,
  group: number = -1,
): Herbivore | null {
  const HerbivoreClass = herbivoreRegistry.get(id)
  return HerbivoreClass ? new HerbivoreClass(x, y, group) : null
}

/**
 * Creates a carnivore of the specified id.
 *
 * @param {string} id - The id of the carnivore to create.
 * @param {number} x - The x coordinate of the carnivore.
 * @param {number} y - The y coordinate of the carnivore.
 * @param {number} group - The group id of the carnivore.
 * @returns {Tile | null} - An instance of the specified id, or null if not found.
 */
export function createCarnivore(
  id: string,
  x: number = 0,
  y: number = 0,
  group: number = -1,
): Carnivore | null {
  const CarnivoreClass = carnivoreRegistry.get(id)
  return CarnivoreClass ? new CarnivoreClass(x, y, group) : null
}

class Herbivore {
  // Dummy, delete later
}

class Carnivore {
  // Dummy, delete later
}
