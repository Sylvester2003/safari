export const tileRegistry = new Map<string, new () => Tile>()
export const herbivoreRegistry = new Map<string, new () => Herbivore>()
export const carnivoreRegistry = new Map<string, new () => Carnivore>()

/**
 * Registers a tile with the given id in the tileRegistry.
 *
 * @param  {string} id - The id of the tile
 * @returns {Function} - A decorator function that registers the tile
 */
export function tile(id: string) {
  return function <T extends new () => Tile>(constructor: T) {
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
  return function <T extends new () => Herbivore>(constructor: T) {
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
  return function <T extends new () => Carnivore>(constructor: T) {
    carnivoreRegistry.set(id, constructor)
  }
}

/**
 * Creates a tile of the specified type.
 *
 * @param {string} id - The id of the tile to create.
 * @returns {Tile | null} - An instance of the specified type, or null if not found.
 */
export function createTile(id: string): Tile | null {
  const TileClass = tileRegistry.get(id)
  return TileClass ? new TileClass() : null
}

/**
 * Creates a herbivore of the specified type.
 *
 * @param {string} id - The id of the herbivore to create.
 * @returns {Tile | null} - An instance of the specified type, or null if not found.
 */
export function createHerbivore(id: string): Herbivore | null {
  const HerbivoreClass = herbivoreRegistry.get(id)
  return HerbivoreClass ? new HerbivoreClass() : null
}

/**
 * Creates a carnivore of the specified type.
 *
 * @param {string} id - The id of the carnivore to create.
 * @returns {Tile | null} - An instance of the specified type, or null if not found.
 */
export function createCarnivore(id: string): Carnivore | null {
  const CarnivoreClass = carnivoreRegistry.get(id)
  return CarnivoreClass ? new CarnivoreClass() : null
}

class Tile {
  // Dummy, delete later
}

class Herbivore {
  // Dummy, delete later
}

class Carnivore {
  // Dummy, delete later
}
