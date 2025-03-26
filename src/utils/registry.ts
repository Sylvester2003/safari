class Tile {
  // Dummy, delete later
}

class Herbivore {
  // Dummy, delete later
}

class Carnivore {
  // Dummy, delete later
}

const tileRegistry = new Map<string, new () => Tile>()
const herbivoreRegistry = new Map<string, new () => Herbivore>()
const carnivoreRegistry = new Map<string, new () => Carnivore>()

/**
 *
 * @param  {string} type - The type of the tile
 * @returns {Function} - A decorator function that registers the tile type
 */
function tile(type: string) {
  return function <T extends new () => Tile>(constructor: T) {
    tileRegistry.set(type, constructor)
  }
}

/**
 *
 * @param  {string} type - The type of the tile
 * @returns {Function} - A decorator function that registers the tile type
 */
function herbivore(type: string) {
  return function <T extends new () => Herbivore>(constructor: T) {
    herbivoreRegistry.set(type, constructor)
  }
}

/**
 *
 * @param  {string} type - The type of the tile
 * @returns {Function} - A decorator function that registers the tile type
 */
function carnivore(type: string) {
  return function <T extends new () => Carnivore>(constructor: T) {
    carnivoreRegistry.set(type, constructor)
  }
}

/**
 * Creates a tile of the specified type.
 * @param {string} tileType - The type of the tile to create.
 * @returns {Tile | null} - An instance of the specified tile type, or null if not found.
 */
function createTile(tileType: string): Tile | null {
  const TileClass = tileRegistry.get(tileType)
  return TileClass ? new TileClass() : null
}

/**
 * Creates a tile of the specified type.
 * @param {string} tileType - The type of the tile to create.
 * @returns {Tile | null} - An instance of the specified tile type, or null if not found.
 */
function createHerbivore(herbivoreType: string): Herbivore | null {
  const HerbivoreClass = herbivoreRegistry.get(herbivoreType)
  return HerbivoreClass ? new HerbivoreClass() : null
}

/**
 * Creates a tile of the specified type.
 * @param {string} tileType - The type of the tile to create.
 * @returns {Tile | null} - An instance of the specified tile type, or null if not found.
 */
function createCarnivore(carnivoreType: string): Carnivore | null {
  const CarnivoreClass = carnivoreRegistry.get(carnivoreType)
  return CarnivoreClass ? new CarnivoreClass() : null
}

export {
  carnivore,
  carnivoreRegistry,
  createCarnivore,
  createHerbivore,
  createTile,
  herbivore,
  herbivoreRegistry,
  tile,
  tileRegistry,
}
