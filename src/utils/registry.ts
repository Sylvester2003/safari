export const tileRegistry = new Map<string, new () => Tile>()
export const herbivoreRegistry = new Map<string, new () => Herbivore>()
export const carnivoreRegistry = new Map<string, new () => Carnivore>()

/**
 *
 * @param  {string} type - The type of the tile
 * @returns {Function} - A decorator function that registers the tile type
 */
export function tile(id: string) {
  return function <T extends new () => Tile>(constructor: T) {
    tileRegistry.set(id, constructor)
  }
}

/**
 *
 * @param  {string} type - The type of the tile
 * @returns {Function} - A decorator function that registers the tile type
 */
export function herbivore(id: string) {
  return function <T extends new () => Herbivore>(constructor: T) {
    herbivoreRegistry.set(id, constructor)
  }
}

/**
 *
 * @param  {string} type - The type of the tile
 * @returns {Function} - A decorator function that registers the tile type
 */
export function carnivore(id: string) {
  return function <T extends new () => Carnivore>(constructor: T) {
    carnivoreRegistry.set(id, constructor)
  }
}

/**
 * Creates a tile of the specified type.
 * @param {string} tileType - The type of the tile to create.
 * @returns {Tile | null} - An instance of the specified tile type, or null if not found.
 */
export function createTile(tileType: string): Tile | null {
  const TileClass = tileRegistry.get(tileType)
  return TileClass ? new TileClass() : null
}

/**
 * Creates a tile of the specified type.
 * @param {string} tileType - The type of the tile to create.
 * @returns {Tile | null} - An instance of the specified tile type, or null if not found.
 */
export function createHerbivore(herbivoreType: string): Herbivore | null {
  const HerbivoreClass = herbivoreRegistry.get(herbivoreType)
  return HerbivoreClass ? new HerbivoreClass() : null
}

/**
 * Creates a tile of the specified type.
 * @param {string} tileType - The type of the tile to create.
 * @returns {Tile | null} - An instance of the specified tile type, or null if not found.
 */
export function createCarnivore(carnivoreType: string): Carnivore | null {
  const CarnivoreClass = carnivoreRegistry.get(carnivoreType)
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
