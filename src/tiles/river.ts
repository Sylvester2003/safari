import Tile from '@/tiles/tile'

export default class River extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:river'
  }
}
